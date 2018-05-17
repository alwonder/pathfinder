const pause = require('./pause');

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

const tileTypes = {
    bound() { return colorize.black('██'); },
    source() { return colorize.red('██'); },
    destination() { return colorize.blue('██'); },
    path() { return colorize.green('██'); },
    search() { return colorize.cyan('██'); },
    default() { return '██'; },
};

class GridOutput {
    constructor(grid) {
        this.grid = grid;
    }

    async draw(delay = 0) {
        console.clear();
        for (let i = 0; i < this.grid._h; i++) {
            let line = '';
            for (let j = 0; j < this.grid._w; j++) {
                line += GridOutput.getTileSymbol(this.grid.getNode(j, i));
            }
            console.log(line);
        }

        if (delay > 0) await pause(delay);
    }

    async drawWithConnectivity(delay = 0) {
        let grid = '';
        for (let i = 0; i < this.grid._h; i++) {
            let line1 = '';
            let line2 = '';
            for (let j = 0; j < this.grid._w; j++) {
                const nodeTile = GridOutput.getNodeTile(this.grid.getNode(j, i));
                line1 += nodeTile[0];
                line2 += nodeTile[1];
            }
            grid += `${line1}\n${line2}\n`;
        }
        console.clear();
        console.log(grid);

        if (delay > 0) await pause(delay);
    }

    static getTileSymbol(tile) {
        return (tileTypes[tile.type] || tileTypes.default)();
    }

    static getNodeTile(node) {
        const tileSymbol = GridOutput.getTileSymbol(node);
        const neighbourRight = node.hasNeighbour(node.x + 1, node.y);
        const neighbourDown = node.hasNeighbour(node.x, node.y + 1);

        if (neighbourRight) {
            return [
                `${tileSymbol}${tileSymbol}`,
                neighbourDown ? `${tileSymbol}${tileSymbol}` : '    ',
            ];
        }

        return [
            `${tileSymbol}  `,
            neighbourDown ? `${tileSymbol}  ` : '    ',
        ];
    }
}

module.exports = GridOutput;
