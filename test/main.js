#!/usr/bin/env node

var program = require('commander');

function range(val) {
    return val.split('..').map(Number);
}

function list(val) {
    return val.split(',');
}

program
    .version('0.0.1')
    .usage('test')
    .option('-C, --chdir [value]', '设置服务器节点','/home/conan/server')
    .option('-c, --config [value]', '设置配置文件','./deploy.conf')
    .option('-m, --max ', '最大连接数')
    .option('-s, --seed ', '出始种子')
    .option('-r,--range <a>..<b>', '阈值区间')
    .option('-l, --list ', 'IP列表')

program
    .command('deploy ')
    .description('部署一个服务节点')
    .action(function(name){
        console.log('Deploying "%s"', name);
    });

program.parse(process.argv);

console.log(' chdir - %s ', program.chdir);
console.log(' config - %s ', program.config);
console.log(' max: %j', program.max);
console.log(' seed: %j', program.seed);
program.range = program.range || [];
console.log(' range: %j..%j', program.range[0], program.range[1]);
console.log(' list: %j', program.list);