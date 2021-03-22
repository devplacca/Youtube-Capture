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
