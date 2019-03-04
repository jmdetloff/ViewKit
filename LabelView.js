function LabelView () {
	this.font = "20px Helvetica";
};

LabelView.prototype = new View();
LabelView.prototype.drawAtPosition = function(ctx, x, y) {
	View.prototype.drawAtPosition.call(this, ctx, x, y);

	if (this.hidden) {
		return;
	}

	y += 20;

	if (this.text) {
		ctx.font = this.font;
		ctx.fillStyle = this.textColor ? this.textColor : 'rgba(0, 0, 0, 1)';

		if (this.lineWrap && this.frame.width > 0 && this.lineHeight) {
			var newlineChunks = this.text.split('\n');
			for (var x = 0; x < newlineChunks.length; x++) {
				var paragraph = newlineChunks[x];
				if (paragraph === "") {
					y += this.lineHeight;
	        		if (this.maxTextHeight && y > this.maxTextHeight) {
	        			return;
	        		}
					continue;
				}

				var chunks = paragraph.split(' ');
	        	var currentLine = '';

		        for(var i = 0; i < chunks.length; i++) {
	    	      	var testLine = currentLine + chunks[i] + ' ';
	          		var metrics = ctx.measureText(testLine);
	          		var testWidth = metrics.width;
	          		if (testWidth > this.frame.width && i > 0) {
	            		ctx.fillText(currentLine, x, y);
	            		currentLine = chunks[i] + ' ';
	            		y += this.lineHeight;
	            		if (this.maxTextHeight && y > this.maxTextHeight) {
	            			return;
	            		}
	          		} else {
	      				currentLine = testLine;
	      				if (currentLine === "  " || currentLine === " ") {
	      					currentLine = "";
	      				}
	          		}
	        	}
	        	ctx.fillText(currentLine, x, y);
	        	y += this.lineHeight;
        		if (this.maxTextHeight && y > this.maxTextHeight) {
        			return;
        		}
			}			

		} else {
			if (!this.centerHorizontally) {
				ctx.fillText(this.text, x, y);
			} else {
				var xPos = x + (this.frame.width - ctx.measureText(this.text).width) / 2;
				ctx.fillText(this.text, xPos, y);
			}
		}
	}
}
LabelView.prototype.height = function() {
	return this.lineHeight * this.numberOfLines();
}
LabelView.prototype.width = function() {
	globalCtx.font = this.font;
	return globalCtx.measureText(this.text).width;
}
LabelView.prototype.numberOfLines = function() {
	if (!this.lineWrap) {
		return this.lineHeight;
	}

	var numLines = 0;

	var newlineChunks = this.text.split('\n');
	for (var x = 0; x < newlineChunks.length; x++) {
		var paragraph = newlineChunks[x];
		if (paragraph === "") {
			numLines++;
			continue;
		}

		var chunks = paragraph.split(' ');
    	var currentLine = '';

        for(var i = 0; i < chunks.length; i++) {
	      	var testLine = currentLine + chunks[i] + ' ';
      		var metrics = globalCtx.measureText(testLine);
      		var testWidth = metrics.width;
      		if (testWidth > this.frame.width && i > 0) {
        		currentLine = chunks[i] + ' ';
        		numLines++;
      		} else {
  				currentLine = testLine;
  				if (currentLine === "  " || currentLine === " ") {
  					currentLine = "";
  				}
      		}
    	}
    	numLines++;
	}	

	return numLines;
}