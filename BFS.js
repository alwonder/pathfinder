/* eslint no-await-in-loop: 0 */
const GridOutput = require('./GridLine');

/**
 * BFS pathfind through 2D-tile grid and return path from destination to source
 * @param {MapGrid} grid Grid with set bounds
 * @param {{x: number, y: number }} start Start point
 * @param {{x: number, y: number }} destination Destination point
 * @param {boolean} [out=false] Draw grid in terminal during search
 * @returns {Promise<Array<{x: number, y: number }>>} Path from destination to source
 */
async function findPathBFS(grid, start, destination, out = false) {
    const output = new GridOutput(grid);
    // Count overall iterations while passing through graph
    let count = 0;

    const startPoint = grid.getNode(start.x, start.y);
    if (start === undefined) return null;

    if (out) {
        grid.setTileType('source', startPoint);
        grid.setTileType('destination', destination);
        await output.draw(300);
    }

    // Make an array with frontier nodes
    const frontier = [];
    frontier.push(startPoint);

    // This map contains passed nodes with neibours where the were reached from
    // It's used further to calculate the shortest path from destination to source
    const directionsMap = new Map();

    // Source node doesn't goes first, so it doesn't have related neighbours
    directionsMap.set(startPoint, null);

    // Exit from the loop when the alrogithm found destination node
    let foundNode = false;

    // Iterating while we have unattended nodes and not found destination node
    while (frontier.length > 0 && !foundNode) {
        const current = frontier.shift();
        for (const neighbour of grid.getNeighbours(current)) {
            if (!directionsMap.has(neighbour)) {
                count++;
                frontier.push(neighbour);
                directionsMap.set(neighbour, current);
                if (neighbour.x === destination.x && neighbour.y === destination.y) {
                    foundNode = true;
                }
                if (out) {
                    grid.setTileType('search', neighbour);
                    await output.draw(60);
                }
            }
        }
    }
    console.log(`Iterations: ${count}`);

    const destinationPoint = grid.getNode(destination.x, destination.y);
    if (destinationPoint === undefined) return null;

    const path = [];
    path.push(destinationPoint);

    let nbr = directionsMap.get(destinationPoint);

    // Iterating through passed nodes in reversed direction until we find
    // the source node (which has null value)
    while (directionsMap.get(nbr) !== null) {
        path.push(nbr);
        nbr = directionsMap.get(nbr);

        if (out) {
            grid.setTileType('path', nbr);
            await output.draw(60);
        }
    }
    return path;
}

module.exports = findPathBFS;
