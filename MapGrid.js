class GridNode {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.neighbours = new Set();
    }

    connect(node) {
        this.neighbours.add(node);
        node.neighbours.add(this);
    }

    disconnect(node) {
        this.neighbours.delete(node);
        node.neighbours.delete(this);
    }

    hasNeighbour(x, y) {
        for (const nbr of this.neighbours.values()) {
            if (x === nbr.x && y === nbr.y) return true;
        }
        return false;
    }
}

/**
 * @class MapGrid
 */
class MapGrid {
    constructor(area, connectNodes, barriers) {
        this.createGrid(area, connectNodes);
        this.createBarriers(barriers);
    }

    get startX() {
        return this._initX;
    }

    get startY() {
        return this._initY;
    }

    get endX() {
        return this._w + this._initX;
    }

    get endY() {
        return this._h + this._initY;
    }

    createGrid({
        x, y, w, h,
    }, connectNodes) {
        this._grid = [];
        this._initX = x || 0;
        this._initY = y || 0;
        this._w = w;
        this._h = h;
        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                this.addNode(j + x, i + y);
            }
        }
        if (connectNodes) this._grid.forEach((tile) => { this.addNeighbours(tile); });
    }

    addNeighbours(tile) {
        const nodeUp = this.getNode(tile.x, tile.y - 1);
        if (nodeUp) nodeUp.connect(tile);

        const nodeDown = this.getNode(tile.x, tile.y + 1);
        if (nodeDown) nodeDown.connect(tile);

        const nodeLeft = this.getNode(tile.x - 1, tile.y);
        if (nodeLeft) nodeLeft.connect(tile);

        const nodeRight = this.getNode(tile.x + 1, tile.y);
        if (nodeRight) nodeRight.connect(tile);
    }

    getNode(x, y) {
        if (x < this.startX || x >= this.endX) return null;
        if (y < this.startY || y >= this.endY) return null;
        const index = (x - this.startX) + ((y - this.startY) * this._w);
        return this._grid[index] || null;
    }

    getAdjacentTiles(node) {
        const adjacents = [];
        const nodeUp = this.getNode(node.x, node.y - 1);
        if (nodeUp) adjacents.push(nodeUp);

        const nodeDown = this.getNode(node.x, node.y + 1);
        if (nodeDown) adjacents.push(nodeDown);

        const nodeLeft = this.getNode(node.x - 1, node.y);
        if (nodeLeft) adjacents.push(nodeLeft);

        const nodeRight = this.getNode(node.x + 1, node.y);
        if (nodeRight) adjacents.push(nodeRight);

        return adjacents;
    }

    addNode(x, y) {
        this._grid.push(new GridNode(x, y));
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
            node.disconnect(neighbourNode);
        });
        node.type = 'bound';
    }

    setTileType(type, tile) {
        const node = this.getNode(tile.x, tile.y);
        if (node) node.type = type;
    }
}

module.exports = MapGrid;
