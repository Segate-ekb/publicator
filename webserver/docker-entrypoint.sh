#!/bin/sh

echo "starting crserver"
exec gosu usr1cv8 /opt/1cv8/current/crserver -port 1542 -d /opt/app/repo -daemon &

echo "starting winow"

cd /opt/app/winow/
oscript main.os
