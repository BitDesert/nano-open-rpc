var portscanner = require('portscanner');
const axios = require('axios');

const regex_ip = /\[::ffff:([0-9.]+)\]:[0-9]+/

async function getRPC() {
    var peers = await axios.post('https://mynano.ninja/api/node', { action: 'peers' })

    for (const peer in peers.data.peers) {
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
    var rpc = await axios.post("http://" + ip + ":7076", { "action": "version" })
    console.log(ip, rpc.data.node_vendor)
}

getRPC()