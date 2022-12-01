var imageCache = {};

function ImageView () {
};

ImageView.prototype = new View();
ImageView.prototype.drawAtPosition = function(ctx, x, y) {
	if (this.image && this.loaded) {

		if (this.rotation) {
			ctx.save();
			ctx.translate(x + this.frame.width / 2, y + this.frame.height / 2);
			ctx.rotate(this.rotation);
			x = - this.frame.width / 2;
			y = - this.frame.height / 2;
		}

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

		if (this.rotation) {
			ctx.restore();
		}
		
	}

	View.prototype.drawAtPosition.call(this, ctx, x, y);
};

Object.defineProperty(ImageView.prototype, 'imageSource', {
	set : function(imageSource) {
		this.stopAnimating();
		this._imageSource = imageSource;
		var cachedImage = imageCache[imageSource];
		if (cachedImage) {
			this._image = cachedImage;
			this.loaded = true;
			if (!this.spriteWidth) {
				this.frame.width = cachedImage.width;
				this.frame.height = cachedImage.height;
			}
		} else {
			this._image = new Image();
			var imageView = this;
			this._image.onload = function () {
				imageCache[imageSource] = imageView.image;
				imageView.loaded = true;
				if (!imageView.spriteWidth) {
					imageView.frame.width = this.width;
					imageView.frame.height = this.height;
				}
			};
			this.image.src = imageSource;
		}
	},
	get : function() {
		return this._imageSource;
	}
});

Object.defineProperty(ImageView.prototype, 'image', {
	set : function(image) {
		this.stopAnimating();
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

ImageView.prototype.animateAsSpritesheet = function(timing, width, height, repeatCount, callback) {
	this.spriteWidth = width;
	this.spriteHeight = height;
	this.currentFrame = 0;
	this.frame.width = width;
	this.frame.height = height;
	this.repeatCount = repeatCount == 0 ? -1 : repeatCount;

	var imageView = this;
	this.animationInterval = setInterval(function() {
		imageView.currentFrame++;

		var numRows = imageView.image.height / height;
		var numCols = imageView.image.width / width;
		var numFrames = numRows * numCols;

		if (imageView.currentFrame >= numFrames) {
			imageView.currentFrame = 0;
			if (imageView.repeatCount > 0) {
				imageView.repeatCount--;
			}
			if (imageView.repeatCount == 0) {
				imageView.stopAnimating();
				callback();
			}
		}
	}, timing);
}

ImageView.prototype.stopAnimating = function() {
	this.spriteWidth = undefined;
	this.spriteHeight = undefined;
	this.currentFrame = undefined;
	clearInterval(this.animationInterval);
}