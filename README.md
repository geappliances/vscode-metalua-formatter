# vscode-metalua-formatter 

Metalua formatter for vscode. Based on [Format Lua](https://github.com/denglf/FormatLua).

## Instructions and Keyboard Shortcut
Open the command pallet and type `>Lua Format` to run the formatter.
  #### Windows: `shift+alt+f`     Mac: `shift+option+f` Linux: `ctrl+shift+i`  

## Requirements

Formatter only works with Lua version 5.1. From version 5.2 onwards the formatter will not work. In addition, the complete path to Lua must be specified in the configs such as:
```
Mac
vscode-metalua-formatter.luaPath = '/Users/<user>/.lenv/lua/5.1.5/bin/lua'

Linux
vscode-metalua-formatter.luaPath = '/home/<user>/.lenv/lua/5.1.5/bin/lua'
```

## Extension Settings

This extension contributes the following settings:

* `vscode-metalua-formatter.luaPath`: path to lua 5.1 location
* `vscode-metalua-formatter.indentSize`: indentation value used to format the file

## Known Issues
[Report them here](https://github.com/geappliances/vscode-metalua-formatter/issues)


