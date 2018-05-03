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

const grid = new MapGrid(3, 4, [
    { x: 1, y: 0 }
]);

passThroughGraph(grid, { x: 2, y: 2});
