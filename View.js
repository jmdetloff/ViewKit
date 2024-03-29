function View () {
	this.keysDown = {};
};

View.prototype = {
	get subviews() {
		if (this._subviews) {
			return this._subviews;
		} else {
			var subviews = new Array();
			this._subviews = subviews;
			return subviews;
		}
	},

	get frame() {
		if (!this._frame) {
			this.frame = {x: 0, y: 0, width: 0, height: 0};
		} 
		return this._frame;
	},

	set frame(frame) {
		this._frame = frame;
		this.layout();
	},

	layout: function() {
	},

	addSubview: function(subview) {
		this.subviews.push(subview);
	},

	insertSubview: function(subview) {
		this.subviews.splice(0, 0, subview);
	},

	removeSubview: function(subview) {
		var index = this.subviews.indexOf(subview);
		if (index >= 0) {
			this.subviews.splice(index, 1);
		}
	},

	removeAllSubviews: function() {
		this.subviews.splice(0, this.subviews.length);
	},

	bringSubviewToFront: function(subview) {
		this.removeSubview(subview);
		this.addSubview(subview);
	},

	renderHierarchy: function(ctx, x, y) {
		if (this.hidden) {
			return;
		}

		ctx.save();

		if (this.scale) {
			ctx.imageSmoothingEnabled = false;
			ctx.scale(this.scale, this.scale);
			x = x / this.scale;
			y = y / this.scale;
		}

		this.drawAtPosition(ctx, x, y);

		for (var i = 0; i < this.subviews.length; i++) {
			var subview = this.subviews[i];
			var absX = x + subview.frame.x;
			var absY = y + subview.frame.y;
			subview.renderHierarchy(ctx, absX, absY);
		}

		ctx.restore();
	},

	drawAtPosition: function(ctx, x, y) {
		if (this.backgroundColor) {
			ctx.save();
			ctx.fillStyle = this.backgroundColor;
			ctx.fillRect(x, y, this.frame.width, this.frame.height);
			ctx.restore();
		}
	},

	checkForClick: function(x, y) {
		if (this.interactionDisabled) {
			return false;
		}

		if (this.scale) {
			x = x / this.scale;
			y = y / this.scale;
		}

		if (this.hitCheck(x, y)) {
			var subviewClicked = false;

			x -= this.frame.x;
			y -= this.frame.y;

			for (var i = this.subviews.length - 1; i >= 0; i--) {
				var subview = this.subviews[i];
				if (subview.checkForClick(x, y)) {
					subviewClicked = true;
					break;
				}
			}

			if (!subviewClicked && this.onClick) {
				this.onClick(x, y);
			}

			return true;
		}

		return false;
	},

	mouseDown: function(x, y) {
		if (!this.hitCheck(x, y) || this.interactionDisabled) {
			return false;
		}

		if (this.scale) {
			x = x / this.scale;
			y = y / this.scale;
		}

		var subviewHit = false;

		x -= this.frame.x;
		y -= this.frame.y;

		for (var i = this.subviews.length - 1; i >= 0; i--) {
			var subview = this.subviews[i];
			if (subview.mouseDown(x, y)) {
				subviewHit = true;
				break;
			}
		}

		if (!subviewHit) {
			this.ownsMouse = true;

			if (this.onMouseDown) {
				this.onMouseDown(x, y);
			}
		}

		return true;
	},

	mouseUp: function(x, y) {
		if (!this.hitCheck(x, y) || this.interactionDisabled) {
			this.disownMouse();
			return false;
		}

		if (this.scale) {
			x = x / this.scale;
			y = y / this.scale;
		}

		var subviewHit = false;

		x -= this.frame.x;
		y -= this.frame.y;

		for (var i = this.subviews.length - 1; i >= 0; i--) {
			var subview = this.subviews[i];
			if (subview.mouseUp(x, y)) {
				subviewHit = true;
				break;
			}
		}

		if (!subviewHit && this.ownsMouse) {
			this.ownsMouse = false;
			if (this.onMouseUp) {
				this.onMouseUp(x, y);
			}

			return true;
		}

		this.ownsMouse = false;

		return subviewHit;
	},

	mouseMove: function(x, y) {
		if (this.interactionDisabled) {
			return false;
		}

		if (this.scale) {
			x = x / this.scale;
			y = y / this.scale;
		}

		var subviewHit = false;
		var hit = this.hitCheck(x, y);

		x -= this.frame.x;
		y -= this.frame.y;

		for (var i = this.subviews.length - 1; i >= 0; i--) {
			var subview = this.subviews[i];
			if (subview.mouseMove(x, y)) {
				subviewHit = true;
				break;
			}
		}

		if (this.ownsMouse) {
			if (this.onMouseMove) {
				this.onMouseMove(x, y);
			}
			return true;
		} else if (this.onMouseMoveHover) {
			if (hit) {
				this.onMouseMoveHover(x, y);
			} else if (this.onMouseMoveOffHover) {
				this.onMouseMoveOffHover(x, y);
			}
		}

		return subviewHit;
	},

	mouseWheel: function(x, y, deltaY) {
		if (this.interactionDisabled) {
			return false;
		}

		if (this.scale) {
			x = x / this.scale;
			y = y / this.scale;
		}

		var subviewHit = false;
		var hit = this.hitCheck(x, y);

		if (!hit) {
			return false;;
		}

		x -= this.frame.x;
		y -= this.frame.y;

		for (var i = this.subviews.length - 1; i >= 0; i--) {
			var subview = this.subviews[i];
			if (subview.mouseWheel(x, y, deltaY)) {
				subviewHit = true;
				break;
			}
		}

		if (this.onMouseWheel) {
			this.onMouseWheel(x, y, deltaY);
			return true;
		} else {
			return false;
		}
	},

	mouseCancel: function(x, y) {
		if (this.interactionDisabled) {
			this.disownMouse();
			return false;
		}

		if (this.scale) {
			x = x / this.scale;
			y = y / this.scale;
		}

		var hit = this.hitCheck(x, y);

		var subviewHit = false;

		x -= this.frame.x;
		y -= this.frame.y;

		for (var i = this.subviews.length - 1; i >= 0; i--) {
			var subview = this.subviews[i];
			if (subview.mouseCancel(x, y)) {
				subviewHit = true;
				break;
			}
		}

		if (this.ownsMouse) {
			this.ownsMouse = false;
			if (this.onMouseCancel) {
				this.onMouseCancel();
			}
			return true;
		}

		this.ownsMouse = false;

		return subviewHit;
	},

	keysUpdated: function(keysDown, event) {
		this.keysDown = keysDown;
	},

	hitCheck: function(x, y) {
		return x >= this.frame.x && x < this.frame.x + this.frame.width && y >= this.frame.y && y < this.frame.y + this.frame.height;
	},

	disownMouse: function() {
		this.ownsMouse = false;
		for (var i = this.subviews.length - 1; i >= 0; i--) {
			var subview = this.subviews[i];
			subview.disownMouse();
		}
	},
}
