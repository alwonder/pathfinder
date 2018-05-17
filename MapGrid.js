class GridNode {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.neighbours = new Set();
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

    createGrid({
        x, y, w, h,
    }, connectNodes) {
        this._grid = new Set();
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

    getNode(x, y) {
        for (const tile of this._grid.values()) {
            if (tile.x === x && tile.y === y) return tile;
        }
        return null;
    }

    addNode(x, y) {
        this._grid.add(new GridNode(x, y));
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
