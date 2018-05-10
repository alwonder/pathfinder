// @ts-check
const GridLine = require('./grid-log');
/**
 * @class MapGrid
 */
class MapGrid {
    constructor(area, barriers) {
        this.createGrid(area);
        this.createBarriers(barriers);
        // this.drawGraph();
    }

    createGrid({
        x, y, w, h,
    }) {
        this._grid = new Set();
        this._w = w;
        this._h = h;
        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                this.addNode(i + x, j + y);
            }
        }
        this._grid.forEach((tile) => { this.addNeighbours(tile); });
    }

    addNeighbours(tile) {
        for (const thatTile of this._grid.values()) {
            if (
                thatTile.x === tile.x && thatTile.y === tile.y - 1
                || thatTile.x === tile.x && thatTile.y === tile.y + 1
                || thatTile.x === tile.x - 1 && thatTile.y === tile.y
                || thatTile.x === tile.x + 1 && thatTile.y === tile.y
            ) tile.neighbours.add(thatTile);
            if (tile.neighbours.size === 4) return;
        }
    }

    getNeighbours(tile) {
        const node = this.getNode(tile.x, tile.y);
        if (node === undefined) return [];
        return Array.from(node.neighbours);
    }

    getNode(x, y) {
        for (const tile of this._grid.values()) {
            if (tile.x === x && tile.y === y) return tile;
        }
        return null;
    }

    addNode(x, y) {
        const node = {
            x,
            y,
            neighbours: new Set(),
        };
        this._grid.add(node);
    }

    createBarriers(barriers) {
        barriers.forEach((barrier) => {
            if (barrier.x === undefined || barrier.y === undefined) return;
            this.deleteNode(barrier.x, barrier.y);
        });
    }

    deleteNode(x, y) {
        const node = this.getNode(x, y);
        if (!node) return;
        node.neighbours.forEach((neighbourNode) => {
            neighbourNode.neighbours.delete(node);
        });
        this._grid.delete(node);
    }

    drawGraph() {
        const firstLine = new GridLine();
        firstLine.addEmptyCell();
        for (let i = 0; i < this._w; i++) {
            firstLine.addRowNumeration(i);
        }
        firstLine.out();

        for (let i = 0; i < this._w; i++) {
            const row = new GridLine();
            row.addRowNumeration(i);
            for (let j = 0; j < this._h; j++) {
                const node = this.getNode(j, i);
                row.addNodeSymbol(node);
            }
            row.out();
        }
    }
}

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


function findPathBFS(grid, startPoint, destination) {
    const frontier = [];
    let count = 0;
    frontier.push(startPoint);

    const directionsMap = new Map();
    directionsMap.set(startPoint, null);
    let foundNode = false;

    while (frontier.length > 0 && !foundNode) {
        const current = frontier.shift();
        /* eslint no-loop-func: 0 */
        grid.getNeighbours(current).forEach((neighbour) => {
            if (!directionsMap.has(neighbour)) {
                count++;
                frontier.push(neighbour);
                directionsMap.set(neighbour, current);
                if (neighbour.x === destination.x && neighbour.y === destination.y) {
                    foundNode = true;
                }
            }
        });
    }
    console.log(`Iterations: ${count}`);

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

const createTime = Date.now();
const grid = new MapGrid({
    x: 0, y: 0, w: 100, h: 100,
}, [
    { x: 1, y: 3 },
    { x: 2, y: 3 },
    { x: 2, y: 2 },
    { x: 2, y: 1 },
    { x: 3, y: 1 },
    { x: 4, y: 1 },
    { x: 5, y: 1 },
    { x: 6, y: 1 },
    { x: 2, y: 4 },
    { x: 3, y: 4 },
    { x: 4, y: 4 },
    { x: 5, y: 4 },
    { x: 6, y: 4 },
]);

console.log(`Time for grid create: ${(Date.now() - createTime) / 1000}`);

// const cameFromMap = passWithSource(grid, { x: 0, y: 0 });
// const path2 = getPathToSource(cameFromMap, { x: 54, y: 35 });

// passThroughGraph(grid, { x: 0, y: 0});
const pathfindTime = Date.now();
const path = findPathBFS(grid, { x: 0, y: 0 }, { x: 4, y: 5 });
console.log(`Time to find a path: ${(Date.now() - pathfindTime) / 1000}`);
// debugger
