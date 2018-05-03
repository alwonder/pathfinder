// @ts-check
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
        this._grid.forEach((tile) => { this.addNeighbors(tile); })
    }

    addNeighbors(tile) {
        const nodeUp = this.getNode(tile.x, tile.y - 1);
        if (nodeUp) tile.neighbors.add(nodeUp);
        const nodeDown = this.getNode(tile.x, tile.y + 1);
        if (nodeDown) tile.neighbors.add(nodeDown);
        const nodeLeft = this.getNode(tile.x - 1, tile.y);
        if (nodeLeft) tile.neighbors.add(nodeLeft);
        const nodeRight = this.getNode(tile.x + 1, tile.y);
        if (nodeRight) tile.neighbors.add(nodeRight);
    }

    getNode(x, y) {
        return Array.from(this._grid).find(tile => tile.x === x && tile.y === y);
    }

    addNode(x, y) {
        const node = {
            x,
            y,
            neighbors: new Set(),
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
        node.neighbors.forEach((neighborNode) => {
            neighborNode.neighbors.delete(node);
        });
        this._grid.delete(node);
    }
}

const grid = new MapGrid(3, 4, [
    { x: 1, y: 0 }
]);
