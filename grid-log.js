class GridLine {
    constructor() {
        this.lines = ['', '', ''];
    }

    addRowNumeration(index) {
        this.lines[0] += '   ';
        this.lines[1] += String(index).padEnd(3);
        this.lines[2] += '   ';
    }

    addNodeSymbol(node) {
        if (!node) {
            this.addEmptyCell();
            return;
        }
        const neighbours = Array.from(node.neighbours);
        if (neighbours.some(nbr => nbr.x === node.x && nbr.y === node.y - 1)) {
            this.lines[0] += ' |¬';
        } else this.lines[0] += '  ¬';

        if (neighbours.some(nbr => nbr.x === node.x - 1 && nbr.y === node.y)) {
            this.lines[1] += '-';
        } else this.lines[1] += ' ';
        this.lines[1] += '#';

        if (neighbours.some(nbr => nbr.x === node.x + 1 && nbr.y === node.y)) {
            this.lines[1] += '-';
        } else this.lines[1] += ' ';

        if (neighbours.some(nbr => nbr.x === node.x && nbr.y === node.y + 1)) {
            this.lines[2] += ' | ';
        } else this.lines[2] += '   ';
    }

    addEmptyCell() {
        this.lines[0] += '   ';
        this.lines[1] += '   ';
        this.lines[2] += '   ';
    }

    out() {
        console.log(this.lines[0]);
        console.log(this.lines[1]);
        console.log(this.lines[2]);
    }
}

module.exports = GridLine;
