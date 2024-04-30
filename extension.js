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
        const indentSize = vscode.workspace.getConfiguration('vscode-metalua-formatter').get('indentSize');
        const platform = os.platform();
        const arch = os.arch();
        let builtInLuaPath;

        if(platform === "darwin") {
          if(arch === "x64") {
            builtInLuaPath = path.join(__dirname, 'lua', 'macos', 'lua51');
          }
          else if(arch === "arm64") {
            builtInLuaPath = path.join(__dirname, 'lua', 'macos-arm64', 'lua51');
          }
        }
        else if(platform === "linux") {
          if(arch === "x64") {
            builtInLuaPath = path.join(__dirname, 'lua', 'linux', 'lua51');
          }
          else if(arch === "arm64") {
            builtInLuaPath = path.join(__dirname, 'lua', 'linux-arm64', 'lua51');
          }
        }
        else if(platform === "win32") {
          builtInLuaPath = path.join(__dirname, 'lua', 'windows', 'lua51.exe');
        }
        else {
          vscode.window.showErrorMessage(`Platform '${platform}' is not supported.`);
          reject();
        }

        const luaPath = vscode.workspace.getConfiguration('vscode-metalua-formatter').get('customLuaPath') || builtInLuaPath;

        if(!fs.existsSync(luaPath)) {
          vscode.window.showErrorMessage('The specified lua path \'' + luaPath + '\' does not exist.');
          reject();
        }

        const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'vscode-metalua-formatter-'));
        const tmpFile = path.join(tmp, 'tmp.lua')

        fs.writeFile(tmpFile, document.getText(), () => {
          const params = [luaFormatterScript, '--file', tmpFile, '--ts', indentSize, '--platform', platform];
          const format = child_process.spawn(luaPath, params, {
            cwd: luaFormatterScriptDir
          });

          format.stderr.on('data', (data) => {
            console.log('err', data.asciiSlice());
          });

          format.on('close', (code) => {
            if(code === 0) {
              fs.readFile(tmpFile, (err, data) => {
                if(err) {
                  reject();
                }
                resolve([vscode.TextEdit.replace(new vscode.Range(0, 0, document.lineCount, 0), data.toString())]);
              });
            }
            else {
              vscode.window.showErrorMessage('Cannot run formatter. The file contains syntax errors.');
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
