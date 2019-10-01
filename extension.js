'use strict'

const vscode = require('vscode');
const child_process = require('child_process');

/**
 * @param {vscode.ExtensionContext} context
 */
const activate = (context) => {

  let disposable = vscode.commands.registerCommand('extension.luaFormatter', function () {
    formatFile();
  });

  context.subscriptions.push(disposable);
}
exports.activate = activate;

const deactivate = () => { };

const formatFile = () => {
  const editor = vscode.window.activeTextEditor;
  if(editor && editor.document.languageId != 'lua') {
    vscode.window.showInformationMessage('No lua file found.');
    return;
  }

  editor.document.save();
  const constants = {
    currentlyOpenFileInEditor: editor.document.fileName,
    luaFormatterScriptDir: __dirname + '/luacode',
    luaFormatterScript: __dirname + '/luacode/formatter.lua',
    luaPath: vscode.workspace.getConfiguration('vscode-metalua-formatter').get('luaPath'),
    indentSize: vscode.workspace.getConfiguration('vscode-metalua-formatter').get('indentSize')

  };

  if(!constants.luaPath) {
    vscode.window.showInformationMessage('Lua path has not been specified in the configurations. Make sure to fill the \'luaPath\' field in the extensions settings.');
    return;
  }

  const params = [constants.luaFormatterScript, '--file', constants.currentlyOpenFileInEditor, '--ts', constants.indentSize];
  const proc = child_process.spawn(constants.luaPath, params, {
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
