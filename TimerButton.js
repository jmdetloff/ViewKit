function TimerButton(onComplete, length) {
    this.length = length;
    this.percent = 1;
    this.onComplete = onComplete;
    this.textColor = 'rgba(225, 225, 225, 1)';

    var timerButton = this;

    this.onClick = function() {
        timerButton.interactionDisabled = true;
        var time = 0;
        timerButton.timer = setInterval( function() {
            time += 50;

            var timeSeconds = time / 1000;

            timerButton.percent = 1 - (timeSeconds / length);

            if (timeSeconds >= length) {
                timerButton.percent = 1;
                clearInterval(timerButton.timer);
                if (timerButton.onComplete) {
                    timerButton.onComplete();
                }
            }
        }, 50);
    };
};

TimerButton.prototype = new LabelView();

TimerButton.prototype.drawAtPosition = function(ctx, x, y) {
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(x, y, this.frame.width, this.frame.height);

    ctx.fillStyle = 'rgba(0, 0, 225, 1)';
    ctx.fillRect(x, y, this.frame.width * this.percent, this.frame.height);

    LabelView.prototype.drawAtPosition.call(this, ctx, x, y);
};