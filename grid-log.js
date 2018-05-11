class GridLine {
    constructor() {
        this.line = '';
    }

    addRowNumeration(index) {
        this.line += String(index).padEnd(1);
    }

    addNodeSymbol(node) {
        if (!node) {
            this.addEmptyCell();
            return;
        }
        this.line += GridLine.getTileSymbol(node.type);
    }

    static getTileSymbol(type) {
        switch (type) {
        case 'bound': return '  ';
        case 'source': return '▪▪';
        case 'destination': return 'ds';
        case 'path': return '▢▢';
        case 'search': return '▨▨';
        default: return '██';
        }
    }

    addEmptyCell() {
        this.line += '  ';
    }

    out() {
        console.log(this.line);
    }
}

module.exports = GridLine;
