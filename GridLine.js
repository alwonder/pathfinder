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
    bound() { return '  '; },
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
        const iterator = this.grid._grid.values();
        for (let i = 0; i < this.grid._h; i++) {
            for (let j = 0; j < this.grid._w; j++) {
                process.stdout.write(GridOutput.getTileSymbol(iterator.next().value));
            }
            process.stdout.write('\n');
        }

        if (delay > 0) await pause(delay);
    }

    static getTileSymbol(tile) {
        return (tileTypes[tile.type] || tileTypes.default)();
    }
}

module.exports = GridOutput;
