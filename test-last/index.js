const path = require('path');
const fs = require('fs');

// ! IMPORTANT -- MOCHA e JEST com nomes de pastas diferentes
// NOTE:: Em *JEST* a pasta tem o nome 'tests'
const specs = path.join(__dirname, '..', 'tests');

const files = [];

const rec = dir => {

    fs.readdirSync(dir, { withFileTypes: true }).forEach(file => {

        const fullPath = path.join(dir, file.name);

        const isDir = fs.lstatSync(fullPath).isDirectory();
        const isFile = fs.lstatSync(fullPath).isFile();

        const stats = fs.statSync(fullPath);

        if (isFile) {

            files.push({ fullPath, updated: stats.mtime });
        }

        if (isDir) rec(fullPath);
    });
};

rec(specs);

files.sort((a, b) => a.updated - b.updated);

const last = files.pop();

const parcialPath = last.fullPath.slice(specs.length).replace(/\\/g, '/');

console.log({ parcialPath });
console.log();

// ./node_modules/mocha/bin/_mocha --require module-alias/register ./specs/scripts/eases/-pokerhand.spec.js

// #region sendkeys-js

// const sendkeys = require('sendkeys-js');

// const command = './node_modules/mocha/bin/_mocha --require module-alias/register ./specs' + parcialPath;

// sendkeys.send(command + '{enter}');

// //#endregion


// ? Funciona mas não tem cor no termimal
// #region child_process

/* const { exec } = require("child_process");

exec('mocha --require module-alias/register ' + last.fullPath, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});
 */
//#endregion


const spawn = require('child_process').spawn;

// const command = 'mocha --require module-alias/register ' + last.fullPath;

// const command = 'mocha -r jsdom-global/register ' + last.fullPath;

// NOTE:: É usado no riropo porque é client side

// O file test-config.js permite usar images com import sem dar erro no mocha
// const command = 'mocha ./test-last/test-config.js -r jsdom-global/register ' + last.fullPath;

// `--exit` força a saida mesmo que haja async code
// const command = 'mocha ' + last.fullPath + ' --exit';

// mocha-tests-with-extra-options-or-parameters
// https://stackoverflow.com/questions/16144455/mocha-tests-with-extra-options-or-parameters
// const command = 'env TEST=MOCHA mocha ' + last.fullPath + ' --exit';

// NOTE:: Funciona porque em "scripts" tem o test. Nem precisava de todo o "partial path"
// ex: `npm run test fns` - sem "tests/unit/.../xxx.spec.js;"
const command = `npm run test ${parcialPath}`;

// const cmd = spawn('cmd', ['/s', '/c', command], { customFds: [0, 1, 2] });
// (node:12604) [DEP0006] DeprecationWarning: child_process: options.customFds option is deprecated. Use options.stdio instead.
// https://nodejs.org/api/child_process.html#child_process_options_stdio

const cmd = spawn('cmd', ['/s', '/c', command], { stdio: 'inherit' });

cmd.on('exit', function (code) { });

