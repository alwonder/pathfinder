// @ts-check
/* eslint no-await-in-loop: 0 */

const input = require('./input.json');
const MapGrid = require('./MapGrid');
const findPathBFS = require('./BFS');

const createTime = Date.now();
const grid = new MapGrid(input, input.borders);
console.log(`Time for grid create: ${(Date.now() - createTime) / 1000}`);

const pathfindTime = Date.now();
findPathBFS(grid, { x: 10, y: 6 }, { x: 14, y: 25 }, true)
    .then((path) => {
        console.log(`Elapsed time to find a path: ${(Date.now() - pathfindTime) / 1000}`);
    });
