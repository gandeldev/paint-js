let drawingImage = null;
const canvas = document.getElementById('board');
const context = canvas.getContext('2d');
let isDrawing = false;
let isErasing = false;
let currentMode = null;

const pencilButton = document.getElementById('pencil-button');
const eraserButton = document.getElementById('eraser-button');
const eraserAllButton = document.getElementById('eraser-all-button');

window.addEventListener('DOMContentLoaded', () => {
    function resizeWindow() {
        const previousImage = drawingImage;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 60;

        if (previousImage) {
            context.drawImage(previousImage, 0, 0);
        }
    }

    function getMouseCoordinates(event) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    function startDrawing(event) {
        const coordinates = getMouseCoordinates(event);
        draw(coordinates);
    }

    function stopDrawing() {
        if (isDrawing || isErasing) {
            context.beginPath();
            saveDrawing();
        }
        isDrawing = false;
        isErasing = false;
    }

    function draw(coordinates) {
        if (!currentMode) return;

        if (isDrawing) {
            context.lineTo(coordinates.x, coordinates.y);
            context.stroke();
            context.beginPath();
            context.moveTo(coordinates.x, coordinates.y);
        }
    }

    function erase(event) {
        if (!isErasing) return;
        const coordinates = getMouseCoordinates(event);
        const lineWidth = 20; 
        context.clearRect(coordinates.x - lineWidth / 2, coordinates.y - lineWidth / 2, lineWidth, lineWidth);
    }

    function saveDrawing() {
        drawingImage = new Image();
        drawingImage.src = canvas.toDataURL();
    }

    function toggleMode(mode) {
        if (currentMode === mode) return;

        if (mode === 'pencil') {
            isDrawing = true;
            isErasing = false;
        }
        if (mode === 'eraser') {
            isDrawing = false;
            isErasing = true;
        }
    }

    function clearAll() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    pencilButton.addEventListener('click', function () {
        toggleMode('pencil');
    });

    eraserButton.addEventListener('click', function () {
        toggleMode('eraser');
    });

    eraserAllButton.addEventListener('click', clearAll);

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', function (event) {
        const coordinates = getMouseCoordinates(event);
        draw(coordinates);
    });
    canvas.addEventListener('mouseup', stopDrawing);

    window.addEventListener('resize', resizeWindow);
    resizeWindow();
});