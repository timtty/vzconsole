var tty = require('./lib/tty.js/lib/tty.js')
var servers = []

for (var i = 0; i < 1000; i++) { servers[i] = {port: 9089 + i, ct_id: null, ct_ip: null, server: null} }

var serverExists = function(container_id) {
	var port_key = {key: null, port: 0}
	servers.some(function(value, key) {
		if (value.ct_id == container_id) {
			port_key.port = value.port
			port_key.key = key
			return true
		}
	})
	return port_key
}

var availablePort = function() {
	var port_key
	servers.some(function(value, key) {
		if (value.server == null) {
			port_key = key
			return true
		} else {
			return false
		}
	})
	return port_key
}

var createConsole = function(container_id, container_ip) {
	var port_key = serverExists(container_id)
	if (port_key.port == 0) {
		// no existing server
		var new_port_key = availablePort()
		servers[new_port_key].ct_id = container_id
		servers[new_port_key].ct_ip = container_ip
		servers[new_port_key].server = tty.createServer({
			shell: 'vzctl',
			shellArgs: ["console", container_id],
			port: servers[new_port_key].port
		})

		servers[new_port_key].server.listen()

		servers[new_port_key].server.on('close', function() {
		})

		return servers[new_port_key].port
	} else {
		// server exists, return the port/key and reboot the terminal
		console.log('debug: ' + port_key)
		servers[port_key.key].ct_id = container_id
		servers[port_key.key].ct_ip = container_ip
		servers[port_key.key].server = tty.createServer({
			shell: 'vzctl',
			shellArgs: ['console', container_id],
			port: servers[port_key.key].port
		})
		return port_key.port
	}
}

module.exports = {
	createConsole: createConsole,
	getPortKey: serverExists
}