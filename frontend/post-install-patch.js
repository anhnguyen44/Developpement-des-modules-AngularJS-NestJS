/*
Monkey Patch for issue: https://github.com/angular/angular/issues/22524

Error message:
ERROR in Error: Debug Failure. False expression: Host should not return a redirect source file from `getSourceFile`
*/

const { readFileSync, writeFileSync, existsSync } = require('fs');
const fileName = './node_modules/@angular/compiler-cli/src/transformers/program.js';
const patchIdentifier = '//-patched';
const sourceCode = 'if (_this.hostAdapter.isSourceFile(sf.fileName)) {'; // enlever le _ si ça marche plus après un update angular
const patchCode = "if (sf['redirectInfo']) { sf = sf['redirectInfo'].redirectTarget; } " + patchIdentifier; //eslint-disable-line quotes

// No file, nothing to patch
if (!existsSync(fileName)) {
    process.exit(0);
}

const contents = readFileSync(fileName).toString().split('\n');
// Check if code has been patched already
const hasBeenPatched = contents.find(line => line.indexOf(patchIdentifier) !== -1); // eslint-disable-line strict

if (!hasBeenPatched) {
    const lineNumber = contents.findIndex(line => line.indexOf(sourceCode) !== -1); // eslint-disable-line quotes, strict
    if (lineNumber <= 0) {
        console.error('Could not find source code. Please check ' + fileName + ' and update the patch accordingly'); // eslint-disable-line no-console
        process.exit(1);
    }
    // Add the patched line after the source code line
    contents.splice(lineNumber + 1, 0, patchCode);
    const updatedContents = contents.join('\n');

    writeFileSync(fileName, updatedContents);

    console.log('Angular Compiler CLI has been Monkey patched'); // eslint-disable-line no-console
} else {
    console.log('Angular Compiler CLI has already been patched'); // eslint-disable-line no-console
}

process.exit(0);