// @ts-check
/* eslint no-await-in-loop: 0 */

const input = require('./input.json');
const MapGrid = require('./MapGrid');
const findPathBFS = require('./BFS');

const createTime = Date.now();
const grid = new MapGrid(input, true, input.borders);
console.log(`Time for grid create: ${(Date.now() - createTime) / 1000}`);

const pathfindTime = Date.now();
findPathBFS(grid, { x: 7, y: 6 }, { x: 120, y: 120 }, false)
    .then((path) => {
        if (path === null) {
            console.log(`Couldn't find a path to the tile. Elapsed time: ${(Date.now() - pathfindTime) / 1000}`);
        } else {
            console.log(`Found path to the tile. Elapsed time: ${(Date.now() - pathfindTime) / 1000}`);
        }
    });
