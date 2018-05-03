// @ts-check
/**
 * @class MapGrid
 */
class MapGrid {
    constructor(w, h, barriers) {
        this.createGrid(w, h);
        this.createBarriers(barriers);
    }

    createGrid(w, h) {
        this._grid = new Set();
        this._w = w;
        this._h = h;
        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                this.addNode(i, j);
            }
        }
        this._grid.forEach((tile) => { this.addNeighbours(tile); })
    }

    addNeighbours(tile) {
        const nodeUp = this.getNode(tile.x, tile.y - 1);
        if (nodeUp) tile.neighbours.add(nodeUp);
        const nodeDown = this.getNode(tile.x, tile.y + 1);
        if (nodeDown) tile.neighbours.add(nodeDown);
        const nodeLeft = this.getNode(tile.x - 1, tile.y);
        if (nodeLeft) tile.neighbours.add(nodeLeft);
        const nodeRight = this.getNode(tile.x + 1, tile.y);
        if (nodeRight) tile.neighbours.add(nodeRight);
    }

    getNeighbours(tile) {
        const node = this.getNode(tile.x, tile.y);
        if (node === undefined) return [];
        return Array.from(node.neighbours);
    }

    getNode(x, y) {
        return Array.from(this._grid).find(tile => tile.x === x && tile.y === y);
    }

    addNode(x, y) {
        const node = {
            x,
            y,
            neighbours: new Set(),
        }
        this._grid.add(node);
    }

    createBarriers(barriers) {
        barriers.forEach((barrier) => {
            if (barrier.x === undefined || barrier.y === undefined) return;
            this.deleteNode(barrier.x, barrier.y);
        })
    }

    deleteNode(x, y) {
        const node = this.getNode(x, y);
        if (!node) return;
        node.neighbours.forEach((neighbourNode) => {
            neighbourNode.neighbours.delete(node);
        });
        this._grid.delete(node);
    }
}

/**
 * 
 * @param {MapGrid} grid Map grid
 * @param {any} startPoint 
 */
function passThroughGraph(grid, startPoint) {
    const frontier = []
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
        })
    }
}

function passWithSource(grid, startPoint) {
    const frontier = []
    frontier.push(startPoint);

    const cameFrom = new Map();
    cameFrom.set(startPoint, null);

    while (frontier.length > 0) {
        const current = frontier.pop();
        grid.getNeighbours(current).forEach((neighbour) => {
            if (!cameFrom.has(neighbour)) {
                frontier.push(neighbour);
                cameFrom.set(neighbour, current);
            }
        })
    }
    return cameFrom;
}

function getPathToSource(directionsMap, destination) {
    let destinationPoint;

    directionsMap.forEach((cameFrom, node) => {
        if (node.x === destination.x && node.y === destination.y) {
            destinationPoint = node;
        }
    })

    const path = [];
    path.push(destinationPoint);

    let nbr = directionsMap.get(destinationPoint)
    while (directionsMap.get(nbr) !== null) {
        path.push(nbr);
        nbr = directionsMap.get(nbr);
    }
    return path;
}

const grid = new MapGrid(7, 6, [
    { x: 0, y: 3 },
    { x: 1, y: 3 },
    { x: 2, y: 3 },
    { x: 2, y: 2 },
    { x: 2, y: 1 },
    { x: 3, y: 1 },
    { x: 4, y: 1 },
    { x: 5, y: 1 },
]);

passThroughGraph(grid, { x: 4, y: 2});

const cameFromMap = passWithSource(grid, { x: 4, y: 2});
const path = getPathToSource(cameFromMap, {x: 1, y: 1});
