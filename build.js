var program = require('commander');
var compile = require('./compile');
program.on('--help', () => {
    console.log('  Usage:');
    console.log('        compile  compile project');
    console.log('        unpkg    unpkg project');
});
program
    .version('0.1.0')
    .action((options, destination) => {
        const command = destination[0];
        if (command === 'compile') {
            compile()
        }
    })
    .parse(process.argv);
