# Discourse

A transcript-based media editor.

## Installation

You will need NodeJS version 0.12 or above. To install this in Ubuntu, please
see [this blog
post](https://nodesource.com/blog/nodejs-v012-iojs-and-the-nodesource-linux-repositories).
During installation, set the Semantic UI path to `public/semantic/`.

    sudo apt-get install mediainfo mongodb
    sudo npm install -g gulp bower
    npm install
    bower install
    cd public/semantic
    gulp build

You also need to install [html5-video-compositor](https://github.com/bbc/html5-video-compositor):

    cd public/js
    git clone git@github.com:bbc/html5-video-compositor.git
    cd html5-video-compositor
    npm install
    npm run build

## Proxy setup

These instructions redirect everything on port 389 through socks-gw. Firstly,
install iptables-persistent and redsocks:

    sudo apt-get install iptables-persistent redsocks

Add the following to /etc/iptables/rules.v4 then reboot.

    *nat
    :PREROUTING ACCEPT [0:0]
    :INPUT ACCEPT [0:0]
    :OUTPUT ACCEPT [0:0]
    :POSTROUTING ACCEPT [0:0]
    -A OUTPUT -d 127.0.0.0/8 -j RETURN
    -A OUTPUT -d 172.28.0.0/15 -j RETURN
    -A OUTPUT -d 132.185.128.0/22 -j RETURN
    -A OUTPUT -o eth0 -p tcp -m tcp --dport 389 -j DNAT --to-destination 127.0.0.1:5123
    COMMIT
