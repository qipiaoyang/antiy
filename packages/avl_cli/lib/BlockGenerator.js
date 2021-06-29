const Generator = require('yeoman-generator');
const glob = require('glob');


class BlockGenerator extends Generator {
    constructor(opts) {
        super(opts);
        this.type = opts.env.options.type;
    }

    writing() {
        const cwd = process.cwd();
        glob.sync("**/*", {
            cwd: `${cwd}/node_modules/@types/${this.type}`,
            dot: true,
        }).forEach(file => {
            const filePath = `${cwd}/node_modules/@types/${this.type}/${file}`;
            this.fs.copyTpl(
                this.templatePath(filePath),
                `${cwd}/${this.type}/${file.replace(/^_/, '.')}`
            );
        });
    }
}

module.exports = BlockGenerator;
