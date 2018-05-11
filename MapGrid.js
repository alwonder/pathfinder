const GridLine = require('./GridLine');
const pause = require('./pause');
/**
 * @class MapGrid
 */

class MapGrid {
    constructor(area, barriers) {
        this.createGrid(area);
        this.createBarriers(barriers);
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

    async markTile(tile, type, duration) {
        this.setTileType(type, tile);
        this.draw();
        await pause(duration);
    }

    setTileType(type, tile) {
        const node = this.getNode(tile.x, tile.y);
        if (node) node.type = type;
    }

    draw() {
        process.stdout.write('\x1B[2J\x1B[0f');
        for (let i = 0; i < this._w; i++) {
            const row = new GridLine();
            // row.addRowNumeration(i);
            for (let j = 0; j < this._h; j++) {
                const node = this.getNode(j, i);
                row.addNodeSymbol(node);
            }
            row.out();
        }
    }
}

module.exports = MapGrid;
