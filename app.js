// @ts-check
/* eslint no-await-in-loop: 0 */

const input = require('./input.json');
const MapGrid = require('./MapGrid');
const findPathBFS = require('./BFS');
const RecursiveBacktracker = require('./RecursiveBacktracker');

const createTime = Date.now();
const grid = new MapGrid(input, false, input.borders);
console.log(`Time for grid create: ${(Date.now() - createTime) / 1000}`);

const RBMazeTime = Date.now();
RecursiveBacktracker.generateMaze(grid, { x: 0, y: 0 }, true)
    .then(() => {
        console.log(`Maze generating complete. Elapsed time: ${(Date.now() - RBMazeTime) / 1000}`);

        const pathfindTime = Date.now();
        findPathBFS(grid, { x: 0, y: 0 }, { x: 19, y: 19 }, true)
            .then((path) => {
                if (path === null) {
                    console.log(`Couldn't find a path to the tile. Elapsed time: ${(Date.now() - pathfindTime) / 1000}`);
                } else {
                    console.log(`Found path to the tile. Elapsed time: ${(Date.now() - pathfindTime) / 1000}`);
                }
            });
    });

// const pathfindTime = Date.now();
// findPathBFS(grid, { x: 0, y: 0 }, { x: 29, y: 29 }, true)
//     .then((path) => {
//         if (path === null) {
//             console.log(`Couldn't find a path to the tile. Elapsed time: ${(Date.now() - pathfindTime) / 1000}`);
//         } else {
//             console.log(`Found path to the tile. Elapsed time: ${(Date.now() - pathfindTime) / 1000}`);
//         }
//     });
