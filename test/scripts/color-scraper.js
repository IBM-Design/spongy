/**
 * This script can scrape the IBM Design Color website to create a clean layout of all of the brand colors.
 */
const COLOR_HEIGHT = 50;
const colorBoxes = document.querySelectorAll('.resources-color');

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.style.position = 'absolute';
canvas.style.top = 0;
canvas.style.left = 0;
canvas.width = 100;
canvas.height = colorBoxes.length * COLOR_HEIGHT;


colorBoxes.forEach((box, boxIndex) => {
  ctx.fillStyle = box.style.backgroundColor;
  ctx.fillRect(0, (boxIndex * COLOR_HEIGHT), 100, COLOR_HEIGHT);
});

document.body.appendChild(canvas);
