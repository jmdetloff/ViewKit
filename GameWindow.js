function GameWindow (canvas, rootView) {
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d");
	this.rootView = rootView;
	this.rootView.frame = {x: 0, y:0, width: canvas.width, height: canvas.height};
	this.keysDown = {};
	this.registerEvents();
}

GameWindow.prototype = {
	render: function() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.rootView.drawAtPosition(this.ctx, 0, 0);
	},

	registerEvents: function() {
        var gameWindow = this;

    	addEventListener("keydown", function(event) {
        	gameWindow.keysDown[event.keyCode] = true;
        	gameWindow.rootView.keysUpdated(gameWindow.keysDown, event);
    	}, false);

    	addEventListener("keyup", function(event) {
        	delete gameWindow.keysDown[event.keyCode];
        	gameWindow.rootView.keysUpdated(gameWindow.keysDown, event);
    	}, false);

    	addEventListener('click', function(event) {
        	var x = event.pageX - gameWindow.canvas.offsetLeft;
        	var y = event.pageY - gameWindow.canvas.offsetTop;
        	gameWindow.rootView.checkForClick(x, y);
    	}, false);

    	addEventListener('mousedown', function(event) {
        	var x = event.pageX - gameWindow.canvas.offsetLeft;
        	var y = event.pageY - gameWindow.canvas.offsetTop;
        	gameWindow.rootView.mouseDown(x, y);
    	}, false);

    	addEventListener('mouseup', function(event) {
        	var x = event.pageX - gameWindow.canvas.offsetLeft;
        	var y = event.pageY - gameWindow.canvas.offsetTop;
        	gameWindow.rootView.mouseUp(x, y);
    	}, false);

    	addEventListener('mouseout', function(event) {
        	var x = event.pageX - gameWindow.canvas.offsetLeft;
        	var y = event.pageY - gameWindow.canvas.offsetTop;
        	gameWindow.rootView.mouseCancel(x, y);
    	}, false);

    	addEventListener('mousemove', function(event) {
        	var x = event.pageX - gameWindow.canvas.offsetLeft;
        	var y = event.pageY - gameWindow.canvas.offsetTop;
        	gameWindow.rootView.mouseMove(x, y);
    	}, false);

    	addEventListener('dblclick', function(event){ 
    	});
	}
}