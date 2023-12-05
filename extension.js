'use strict'

const vscode = require('vscode');
const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const activate = () => {
  vscode.languages.registerDocumentFormattingEditProvider('lua', {
    provideDocumentFormattingEdits(document) {
      return new Promise((resolve, reject) => {
        const luaFormatterScriptDir = __dirname + '/luacode';
        const luaFormatterScript = __dirname + '/luacode/formatter.lua';
        const luaPath = vscode.workspace.getConfiguration('vscode-metalua-formatter').get('luaPath');
        const indentSize = vscode.workspace.getConfiguration('vscode-metalua-formatter').get('indentSize');

        if(!luaPath) {
          vscode.window.showErrorMessage('Lua 5.1 path has not been specified in the configurations. Make sure to fill the \'luaPath\' field in the extensions settings.');
          reject();
        }
        else if(!fs.existsSync(luaPath)) {
          vscode.window.showErrorMessage('The specified lua path \'' + luaPath + '\' does not exist.');
          reject();
        }

        const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'vscode-metalua-formatter-'));

        fs.writeFile(path.join(tmp, 'tmp.lua'), document.getText(), () => {
          const params = [luaFormatterScript, '--file', path.join(tmp, 'tmp.lua'), '--ts', indentSize];
          const proc = child_process.spawn(luaPath, params, {
            cwd: luaFormatterScriptDir
          });

          proc.stderr.on('data', (data) => {
            console.log('err', data.asciiSlice());
          });

          proc.on('close', (code) => {
            if(code === 0) {
              fs.readFile(path.join(tmp, 'tmp.lua'), (err, data) => {
                if(err) {
                  reject();
                }
                resolve([vscode.TextEdit.replace(new vscode.Range(0, 0, document.lineCount, 0), data.toString())]);
              });
            }
            else {
              reject();
            }
          });
        });
      });
    }
  });
};

module.exports = {
  activate
}
