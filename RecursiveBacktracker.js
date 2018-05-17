/* eslint no-await-in-loop: 0 */
const GridOutput = require('./GridOutput');

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function generateMaze(grid, start, out = false) {
    const output = new GridOutput(grid);
    const startPoint = grid.getNode(start.x, start.y);
    if (startPoint === null || startPoint === undefined) return;

    const attended = new Set();
    attended.add(startPoint);
    const stack = [startPoint];

    while (stack.length > 0) {
        const currentNode = stack[stack.length - 1];
        attended.add(currentNode);
        const availableNeighbours = [];
        for (const neighbour of grid.getAdjacentTiles(currentNode)) {
            if (!attended.has(neighbour)) availableNeighbours.push(neighbour);
        }
        if (availableNeighbours.length === 0) {
            stack.pop();
            continue;
        }
        const randomNeighbour = getRandomElement(availableNeighbours);
        currentNode.connect(randomNeighbour);
        stack.push(randomNeighbour);
        if (out) {
            await output.drawWithConnectivity(80);
        }
    }
}

module.exports = { generateMaze };
