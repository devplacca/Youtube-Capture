function createElementFromString (string) {
	const parser = new DOMParser();
	const parsedHtml = parser.parseFromString(string, 'text/html');
	return parsedHtml.body.firstElementChild;
}

function downloadMedia(url, filename) {
	const anchor = document.createElement('a');
	anchor.download = filename;
	anchor.href = url;
	anchor.click();
	delete anchor;
}

function drawImageOnCanvas(media, width, height, breakHeight) {
	if (breakHeight && height < breakHeight) {
		// scale image up if it's too small
		const factor = Math.max(width, height) / Math.min(width, height);
		height = breakHeight;
		width = Math.floor(height * factor);
	}

	const context = canvas.getContext('2d');

	canvas.width = width;
	canvas.height = height;
	context.drawImage(media, 0, 0, width, height);
	return canvas.toDataURL();
}
