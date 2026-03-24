const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('.');
let filesModified = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const regex = / \?\? "http:\/\/localhost:\d+"/g;
    if (regex.test(content)) {
        // We replace it with an exclamation mark to assert it's defined (TypeScript Non-Null Assertion)
        // because process.env returns string | undefined
        const newContent = content.replace(regex, '!');
        fs.writeFileSync(file, newContent, 'utf8');
        filesModified++;
    }
});

console.log(`Replaced hardcoded environment fallbacks in ${filesModified} files.`);
