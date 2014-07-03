window.onload = function() {
	//console.log(this.tty);
	setTimeout(function() {
		var w = new tty.Window;
		w.resize(120, 32);
		w.on('close', function() { window.close(); });
	}, 200);
}
