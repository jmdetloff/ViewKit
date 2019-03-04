function ImageView () {
};

ImageView.prototype = new View();
ImageView.prototype.drawAtPosition = function(ctx, x, y) {
	if (this.image && this.loaded) {
		if (this.spriteHeight) {
			var numCols = this.image.width / this.frame.width;
 			var numRows = this.image.height / this.frame.height;
 			var numFrames = numCols * numRows;
 			var row = Math.floor(this.currentFrame / numCols);
 			var col = this.currentFrame % numCols;
			ctx.drawImage(this.image, this.frame.width * col, this.frame.height * row, this.frame.width, this.frame.height, x, y, this.frame.width, this.frame.height);
		} else {
			ctx.drawImage(this.image, x, y, this.frame.width, this.frame.height);
		}
		
	}

	View.prototype.drawAtPosition.call(this, ctx, x, y);
};
Object.defineProperty(ImageView.prototype, 'imageSource', {
	set : function(imageSource) {
		this._image = new Image();
		var imageView = this;
		this._image.onload = function () {
			imageView.loaded = true;
			if (!imageView.spriteWidth) {
				imageView.frame.width = this.width;
				imageView.frame.height = this.height;
			}
		};
		this.image.src = imageSource;
	}
});
Object.defineProperty(ImageView.prototype, 'image', {
	set : function(image) {
		this.loaded = true;
		if (!this.spriteWidth) {
			this.frame.width = image.width;
			this.frame.height = image.height;
		}
		this._image = image;
	},
	get : function() {
		return this._image;
	}
});

ImageView.prototype.animateAsSpritesheet = function(timing, width, height) {
	this.spriteWidth = width;
	this.spriteHeight = height;
	this.currentFrame = 0;
	this.frame.width = width;
	this.frame.height = height;

	var imageView = this;
	this.animationInterval = setInterval(function() {
		var numRows = imageView.image.height / height;
		var numCols = imageView.image.width / width;
		var numFrames = numRows * numCols;
		imageView.currentFrame++;
		imageView.currentFrame = imageView.currentFrame % numFrames;
	}, timing);
}

ImageView.prototype.stopAnimating = function() {
	this.spriteWidth = undefined;
	this.spriteHeight = undefined;
	clearInterval(this.animationInterval);
}