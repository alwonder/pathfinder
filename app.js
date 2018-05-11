// @ts-check
const input = require('./input.json');
const MapGrid = require('./MapGrid');
/**
 *
 * @param {MapGrid} grid Map grid
 * @param {any} startPoint
 */
function passThroughGraph(grid, startPoint) {
    const frontier = [];
    frontier.push(startPoint);

    const visited = new Set();
    visited.add(startPoint);

    while (frontier.length > 0) {
        const current = frontier.pop();
        grid.getNeighbours(current).forEach((neighbour) => {
            if (!visited.has(neighbour)) {
                frontier.push(neighbour);
                visited.add(neighbour);
            }
        });
    }
}

function passWithSource(grid, startPoint) {
    const frontier = [];
    let count = 0;
    frontier.push(startPoint);

    const cameFrom = new Map();
    cameFrom.set(startPoint, null);

    while (frontier.length > 0) {
        const current = frontier.shift();
        grid.getNeighbours(current).forEach((neighbour) => {
            if (!cameFrom.has(neighbour)) {
                count++;
                frontier.push(neighbour);
                cameFrom.set(neighbour, current);
            }
        });
    }
    return cameFrom;
}

function getPathToSource(directionsMap, destination) {
    let destinationPoint;

    directionsMap.forEach((cameFrom, node) => {
        if (node.x === destination.x && node.y === destination.y) {
            destinationPoint = node;
        }
    });
    if (destinationPoint === undefined) return null;

    const path = [];
    path.push(destinationPoint);

    let nbr = directionsMap.get(destinationPoint);
    while (directionsMap.get(nbr) !== null) {
        path.push(nbr);
        nbr = directionsMap.get(nbr);
    }
    return path;
}


async function findPathBFS(grid, start, destination, out = false) {
    const startPoint = grid.getNode(start.x, start.y);
    if (start === undefined) return null;
    if (out) {
        grid.markTile(startPoint, 'source');
        await grid.markTile(destination, 'destination', 300);
    }
    const frontier = [];
    let count = 0;
    frontier.push(startPoint);

    const directionsMap = new Map();
    directionsMap.set(startPoint, null);
    let foundNode = false;

    while (frontier.length > 0 && !foundNode) {
        const current = frontier.shift();
        /* eslint no-await-in-loop: 0 */
        for (const neighbour of grid.getNeighbours(current)) {
            if (!directionsMap.has(neighbour)) {
                count++;
                frontier.push(neighbour);
                directionsMap.set(neighbour, current);
                if (neighbour.x === destination.x && neighbour.y === destination.y) {
                    foundNode = true;
                }
                if (out) await grid.markTile(neighbour, 'search', 60);
            }
        }
    }
    console.log(`Iterations: ${count}`);

    const destinationPoint = grid.getNode(destination.x, destination.y);
    if (destinationPoint === undefined) return null;

    const path = [];
    path.push(destinationPoint);

    let nbr = directionsMap.get(destinationPoint);
    while (directionsMap.get(nbr) !== null) {
        path.push(nbr);
        nbr = directionsMap.get(nbr);
        if (out) await grid.markTile(nbr, 'path', 60);
    }
    return path;
}

const createTime = Date.now();
const grid = new MapGrid(input, input.borders);

console.log(`Time for grid create: ${(Date.now() - createTime) / 1000}`);

const pathfindTime = Date.now();
findPathBFS(grid, { x: 10, y: 6 }, { x: 14, y: 25 }, true)
    .then((path) => {
        console.log(`Elapsed time to find a path: ${(Date.now() - pathfindTime) / 1000}`);
    });
