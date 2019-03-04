function TimerView (length) {
	this.length = length;
	this.percent = 1;

	var timerView = this;

	var time = 0;
	this.timer = setInterval( function() {
		time += 50;

		var timeSeconds = time / 1000;

		timerView.percent = 1 - (timeSeconds / length);

		if (timeSeconds >= length) {
			clearInterval(timerView.timer);
			if (timerView.onComplete) {
				timerView.onComplete();
			}
		}
	}, 50);
}

TimerView.prototype = new View();

TimerView.prototype.cancel = function() {
	clearInterval(this.timer);
}

TimerView.prototype.drawAtPosition = function(ctx, x, y) {
	ctx.fillStyle = 'rgba(0, 0, 0, 1)';
	ctx.fillRect(x, y, this.frame.width, this.frame.height);

	ctx.fillStyle = 'rgba(0, 225, 0, 1)';
	ctx.fillRect(x, y, this.frame.width * this.percent, this.frame.height);

	View.prototype.drawAtPosition.call(this, ctx, x, y);
};