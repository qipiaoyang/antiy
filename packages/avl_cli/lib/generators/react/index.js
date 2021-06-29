const BasicGenerator = require('../../BasicGenerator');
class Generator extends BasicGenerator {
    prompting() {
        if (
            this.opts.args &&
            'projectName' in this.opts.args &&
            'gitRepo' in this.opts.args &&
            'gitPath' in this.opts.args &&
            'harbor' in this.opts.args &&
            'deployCluster' in this.opts.args &&
            'deployNamespace' in this.opts.args
        ) {
            this.prompts = {
                projectName: this.opts.args.projectName,
                gitRepo: this.opts.args.gitRepo,
                gitPath: this.opts.args.gitPath,
                harbor: this.opts.args.harbor,
                deployCluster: this.opts.args.deployCluster,
                deployNamespace: this.opts.args.deployNamespace,
            };
        } else {
            const prompts = [
                {
                    name: 'projectName',
                    type: 'input',
                    message: '请输入项目名称！',
                },
                {
                    name: 'gitRepo',
                    type: 'input',
                    message: '请输入项目GIT地址！',
                },
                {
                    name: 'gitPath',
                    type: 'input',
                    message: '项目所在git仓库组名及项目名！',
                },
                {
                    name: 'harbor',
                    type: 'input',
                    message: '请输入项目镜像名称！',
                },
                {
                    name: 'deployCluster',
                    type: 'checkbox',
                    message: '请输入要部署到的K8S集群名！',
                    choices: [
                        {name: '武汉-花山集群', value: 'wuhan-huashan-vm'},
                        {name: '武汉-迈异集群', value: 'wuhan-mye-pm'},
                    ]
                },
                {
                    name: 'deployNamespace',
                    type: 'input',
                    message: '请输入要部署到的K8S集群命名空间！',
                },
            ];
            return this.prompt(prompts).then(props => {
                this.prompts = props;
            });
        }
    }
    writing() {
        this.writeFiles({
            context: {
                name: this.name,
                ...this.prompts,
            },
        });
    }
}

module.exports = Generator;
