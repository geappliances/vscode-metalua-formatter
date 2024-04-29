SCRIPTPATH=$( cd $(dirname $0) ; pwd -P )

PLATFORM=$(uname)
ARCH=$(uname -m)

if [ $PLATFORM = "Darwin" ]; then
  if [ $ARCH = "x86_64" ]; then
    exec $SCRIPTPATH/macos/lua53 $@
  elif [ "$(uname -m)" = "arm64" ]; then
    exec $SCRIPTPATH/macos-arm64/lua53 $@
  fi
elif [ $PLATFORM = "Linux" ]; then
  if [ $ARCH = "x86_64" ]; then
    exec $SCRIPTPATH/linux/lua53 $@
  elif [ $ARCH = "aarch64" ]; then
    exec $SCRIPTPATH/linux-arm64/lua53 $@
  elif [ $ARCH = "armv7l" ]; then
    exec $SCRIPTPATH/armv7l/lua53 $@
  fi
else
  exec $SCRIPTPATH/windows/lua53.exe $@
fi
