function ScrollView() {
	this.slider = new View();
	this.slider.backgroundColor = 'rgba(100,100,100,1)';
	this.slider.frame.width = 30;
	this.slider.frame.height = 55;
	this.slider.onMouseDown = function(x, y) {
		this.mouseDownY = y;
	};

	this.yOffset = 0;

	var scrollView = this;
	this.slider.onMouseMove = function(x, y) {
		var scrollSpace = scrollView.frame.height - this.frame.height;

		var yDiff = y - this.mouseDownY;
		this.frame.y += yDiff;
		this.frame.y = Math.max(0, this.frame.y);
		this.frame.y = Math.min(this.frame.y, scrollSpace);

		scrollView.yOffset = (scrollView.scrollHeight - scrollView.frame.height) * (this.frame.y / scrollSpace) * -1;
	};
	this.addSubview(this.slider);
};
ScrollView.prototype = new View();
ScrollView.prototype.layout = function() {
	this.slider.frame.x = this.frame.width - this.slider.frame.width - 5;
}
ScrollView.prototype.drawAtPosition = function(ctx, x, y) {
	ctx.save();
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x + this.frame.width, y);
	ctx.lineTo(x + this.frame.width, y + this.frame.height);
	ctx.lineTo(x, y + this.frame.height);
	ctx.lineTo(x, y);
	ctx.clip();

	this.slider.hidden = true;
	View.prototype.drawAtPosition.call(this, ctx, x, y + this.yOffset);
	this.slider.hidden = false;

	ctx.restore();

	if (this.scrollHeight > this.frame.height) {
		this.slider.drawAtPosition(ctx, x + this.slider.frame.x, y + this.slider.frame.y);
	} else {
		this.slider.interactionDisabled = true;
	}
}