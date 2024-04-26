SCRIPTPATH=$( cd $(dirname $0) ; pwd -P )

if [ "$(uname)" = "Darwin" ]; then
  if [ "$(uname -m)" = "x86_64" ]; then
    exec $SCRIPTPATH/osx/lua53 $@
  elif [ "$(uname -m)" = "arm64" ]; then
    exec $SCRIPTPATH/macos-arm64/lua $@
  fi
else
  if [ "$(uname -m)" = "x86_64" ]; then
    exec $SCRIPTPATH/linux/lua53 $@
  elif [ "$(uname -m)" = "aarch64" ]; then
    exec $SCRIPTPATH/linux-arm64/lua53 $@
  elif [ "$(uname -m)" = "armv7l" ]; then
    exec $SCRIPTPATH/armv7l/lua $@
  fi
fi
