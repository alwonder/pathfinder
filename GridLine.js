const colorize = {
    black(text) { return `\x1b[30m${text}\x1b[0m`; },
    red(text) { return `\x1b[31m${text}\x1b[0m`; },
    green(text) { return `\x1b[32m${text}\x1b[0m`; },
    yellow(text) { return `\x1b[33m${text}\x1b[0m`; },
    blue(text) { return `\x1b[34m${text}\x1b[0m`; },
    magenta(text) { return `\x1b[35m${text}\x1b[0m`; },
    cyan(text) { return `\x1b[36m${text}\x1b[0m`; },
    white(text) { return `\x1b[37m${text}\x1b[0m`; },
};

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
        case 'source': return colorize.red('██');
        case 'destination': return colorize.blue('██');
        case 'path': return colorize.green('██');
        case 'search': return colorize.cyan('██');
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
