const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const mkdirp = require('mkdirp');
const yeoman = require('yeoman-environment');
const clipboardy = require('clipboardy');

const generators = fs
    .readdirSync(`${__dirname}/generators`)
    .filter(f => !f.startsWith('.'))
    .map(f => {
        return {
            name: `${f.padEnd(15)} - ${chalk.gray(require(`./generators/${f}/meta.json`).description)}`,
            value: f,
            short: f,
        };
    });


const runGenerator = async (generatorPath, {action = '', type = "", args = {}}) => {
    return new Promise(resolve => {
        cwd = process.cwd();
        if (action) {
            mkdirp.sync(type);
            cwd = path.join(cwd, type);
        }
        console.log(cwd)
        const Generator = require(generatorPath);
        const env = yeoman.createEnv([], {
            cwd,
        });

        const generator = new Generator({
            type,
            env,
            resolved: require.resolve(generatorPath),
            args,
        });

        return generator.run(() => {
            resolve(true);
        });
    });
};

const run = async config => {
    process.send && process.send({type: 'prompt'});
    process.emit('message', {type: 'prompt'});
    let {type, action} = config;
    if (action === 'block') {
        const cwd = process.cwd();
        const Generator = require(`./BlockGenerator`);
        const env = yeoman.createEnv([], {
            cwd,
            type
        });
        const generator = new Generator({
            env
        });
        const blocks = fs
            .readdirSync(`${cwd}/node_modules/@types`)
            .map(f => {
                return f
            });
        if(blocks.indexOf(type) > -1) {
            mkdirp.sync(type);
            return generator.run(() => {
                console.log('✨ 文件生成成功！');
                resolve(true);
            });
        } else {
            console.error(chalk.red(`> 模块不存在 ~`));
        }
    } else {
        if (!type) {
            const answers = await inquirer.prompt([
                {
                    name: 'type',
                    message: '请选择你的类型',
                    type: 'list',
                    choices: generators
                }
            ]);
            type = answers.type;
        }

        try {
            return runGenerator(`./generators/${type}`, config);
        } catch (e) {
            console.error(chalk.red(`> Generate failed`), e);
            process.exit(1);
        }

    }


}


module.exports = run;
