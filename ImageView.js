function ImageView () {
};

ImageView.prototype = new View();
ImageView.prototype.drawAtPosition = function(ctx, x, y) {
	if (this.image && this.loaded) {
		ctx.drawImage(this.image, x, y, this.frame.width, this.frame.height);
	}

	View.prototype.drawAtPosition.call(this, ctx, x, y);
};
Object.defineProperty(ImageView.prototype, 'imageSource', {
	set : function(imageSource) {
		this._image = new Image();
		var imageView = this;
		this._image.onload = function () {
			imageView.loaded = true;
			imageView.frame.width = this.width;
			imageView.frame.height = this.height;
		};
		this.image.src = imageSource;
	}
});
Object.defineProperty(ImageView.prototype, 'image', {
	set : function(image) {
		this.loaded = true;
		this.frame.width = image.width;
		this.frame.height = image.height;
		this._image = image;
	},
	get : function() {
		return this._image;
	}
});