var rp = require('request-promise');
var portscanner = require('portscanner');

const regex_ip = /\[::ffff:([0-9.]+)\]:7075/

async function getRPC() {
    var peers = await rp('https://api.nanocrawler.cc/peers', { json: true });

    for (const peer in peers.peers) {
        var match = regex_ip.exec(peer)
        if (match) {
            checkRPC(match[1])
        }

    }
}

async function checkRPC(ip) {
    portscanner.checkPortStatus(7076, ip, function (error, status) {
        // Status is 'open' if currently in use or 'closed' if available
        if (status === 'open') {
            getVersion(ip)
        }
    })
}

async function getVersion(ip){
    var rpc = await rp({
        method: 'POST',
        uri: "http://" + ip + ":7076",
        body: {
            "action": "version" 
        },
        json: true
    })
    console.log(ip, rpc.node_vendor)

}

getRPC()