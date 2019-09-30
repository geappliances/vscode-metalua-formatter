'use strict'

const vscode = require('vscode');
const child_process = require('child_process');

/**
 * @param {vscode.ExtensionContext} context
 */
const activate = (context) => {

  let disposable = vscode.commands.registerCommand('extension.luaFormatter', function () {
    formatFile();
    // vscode.window.showInformationMessage('formatter runned');
  });

  context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() { }

const formatFile = () => {
  const editor = vscode.window.activeTextEditor;
  if (editor && editor.document.languageId != 'lua') {
    vscode.window.showInformationMessage('No lua file found.');
    return;
  }

  editor.document.save();
  const constants = {
    currentlyOpenFileInEditor: editor.document.fileName,
    luaFormatterScriptDir: __dirname + '/luacode',
    luaFormatterScript: __dirname + '/luacode/formatter.lua'
  };
  const configurations = vscode.workspace.getConfiguration('vscode-metalua-formatter');
  // console.log(vscode.workspace.getConfiguration());
  let luaPath = configurations.get('vscode-metalua-formatter.luaPath');
  let indentSize = configurations.get('vscode-metalua-formatter.indentSize');
  // console.log(luaPath);

  if (!luaPath) {
    vscode.window.showInformationMessage('No lua path has been specified in the configurations. Using default settings');
    luaPath = '/usr/local/bin/lua';
  }
  if(!indentSize){
    indentSize = 2;
  }

  const params = [constants.luaFormatterScript, '--file', constants.currentlyOpenFileInEditor, '--ts', indentSize];
  const proc = child_process.spawn(luaPath, params, {
    cwd: constants.luaFormatterScriptDir
  });

  proc.stderr.on('data', (data) => {
    console.log('err', data.asciiSlice());
  });
};

module.exports = {
  activate,
  deactivate
}
