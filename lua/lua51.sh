SCRIPTPATH=$( cd $(dirname $0) ; pwd -P )

PLATFORM=$(uname)
ARCH=$(uname -m)

if [ $PLATFORM = "Darwin" ]; then
  if [ $ARCH = "x86_64" ]; then
    exec $SCRIPTPATH/macos/lua51 $@
  elif [ "$(uname -m)" = "arm64" ]; then
    exec $SCRIPTPATH/macos-arm64/lua51 $@
  fi
else
  if [ $ARCH = "x86_64" ]; then
    exec $SCRIPTPATH/linux/lua51 $@
  elif [ $ARCH = "aarch64" ]; then
    exec $SCRIPTPATH/linux-arm64/lua51 $@
  fi
fi
