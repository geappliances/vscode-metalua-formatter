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
        let lua53Path;

        if(platform === "darwin") {
          if(arch === "x64") {
            builtInLuaPath = path.join(__dirname, 'lua', 'macos', 'lua51');
            lua53Path = path.join(__dirname, 'lua', 'macos', 'lua53');
          }
          else if(arch === "arm64") {
            builtInLuaPath = path.join(__dirname, 'lua', 'macos-arm64', 'lua51');
            lua53Path = path.join(__dirname, 'lua', 'macos-arm64', 'lua53');
          }
        }
        else if(platform === "linux") {
          if(arch === "x64") {
            builtInLuaPath = path.join(__dirname, 'lua', 'linux', 'lua51');
            lua53Path = path.join(__dirname, 'lua', 'linux', 'lua53');
          }
          else if(arch === "arm64") {
            builtInLuaPath = path.join(__dirname, 'lua', 'linux-arm64', 'lua51');
            lua53Path = path.join(__dirname, 'lua', 'linux-arm64', 'lua53');
          }
        }
        else if(platform === "win32") {
          builtInLuaPath = path.join(__dirname, 'lua', 'windows', 'lua51.exe');
          lua53Path = path.join(__dirname, 'lua', 'windows', 'lua53.exe');
        }
        else {
          vscode.window.showErrorMessage(`Platform '${platform}' is not supported.`);
          reject();
        }

        const lua51Path = vscode.workspace.getConfiguration('vscode-metalua-formatter').get('customLuaPath') || builtInLuaPath;

        if(!fs.existsSync(lua53Path)) {
          vscode.window.showErrorMessage('The specified lua path \'' + luaPath + '\' does not exist.');
          reject();
        }

        const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'vscode-metalua-formatter-'));
        const tmpFile = path.join(tmp, 'tmp.lua')

        fs.writeFile(tmpFile, document.getText(), () => {
          const validate = child_process.spawn(lua53Path, [tmpFile], {
            cwd: luaFormatterScriptDir
          });

          validate.stderr.on('data', (data) => {
            console.log('err', data.asciiSlice());
          });

          validate.on('close', (code) => {
            if(code !== 0) {
              vscode.window.showErrorMessage('The file contains syntax errors.');
              reject();
            }
            else {
              const params = [luaFormatterScript, '--file', tmpFile, '--ts', indentSize, '--platform', platform];
              const format = child_process.spawn(lua51Path, params, {
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
                  reject();
                }
              });
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
