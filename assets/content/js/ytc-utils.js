function createElementFromString (string) {
	const parser = new DOMParser();
	const parsedHtml = parser.parseFromString(string, 'text/html');
	return parsedHtml.body.firstElementChild;
}

