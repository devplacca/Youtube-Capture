let shadow;
let downloadBtn

window.addEventListener('load', () => {
	window['contents'].addEventListener('mousemove', async ({target}) => {
		if (target.classList.contains('yt-img-shadow')) {

			if (downloadBtn && shadow !== target) {
				removeThumbnailDownloadBtn()
			}

			if (!shadow || (shadow && shadow !== target)) {
				const { parentNode } = target.offsetParent.parentNode;

				if (!downloadBtn) {
					insertThumbnailDownloadBtn(parentNode);
				}
				// remember current target element
				shadow = target;
			}
		}
	})
});

function insertThumbnailDownloadBtn (parent) {
	const btn = createElementFromString(`
		<span
			class='yt-thumb-download'
			aria-label='Download thumbnail'
			title='Download thumbnail'
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				x="0px"
				y="0px"
				width="24"
				height="24"
				viewBox="0 0 172 172"
				style="fill:#000000;"
			>
				<g
					fill-rule="nonzero"
					style="mix-blend-mode: normal"
				>
					<path d="M0,172v-172h172v172z"></path>
					<g fill="#ffffff">
						<path d="M85.91601,21.42301c-2.96578,0.04633 -5.33356,2.48615 -5.29101,5.45199v76.60775l-12.32471,-12.32471c-1.01222,-1.0424 -2.4033,-1.63064 -3.85628,-1.6307c-2.18814,0.00053 -4.1576,1.32735 -4.98006,3.35504c-0.82245,2.0277 -0.33375,4.35156 1.23575,5.87624l21.5,21.5c2.0991,2.09823 5.50149,2.09823 7.60059,0l21.5,-21.5c1.40412,-1.34815 1.96971,-3.35005 1.47866,-5.23364c-0.49105,-1.88359 -1.96202,-3.35456 -3.84561,-3.84561c-1.88359,-0.49105 -3.88549,0.07455 -5.23364,1.47866l-12.32471,12.32471v-76.60775c0.02085,-1.45347 -0.54782,-2.85342 -1.57634,-3.88062c-1.02852,-1.0272 -2.4292,-1.59408 -3.88264,-1.57136zM41.20833,60.91667c-10.82086,0 -19.70833,8.88748 -19.70833,19.70833v50.16667c0,10.82086 8.88748,19.70833 19.70833,19.70833h89.58333c10.82086,0 19.70833,-8.88748 19.70833,-19.70833v-50.16667c0,-10.82086 -8.88748,-19.70833 -19.70833,-19.70833h-21.5c-1.93842,-0.02741 -3.74144,0.99102 -4.71865,2.66532c-0.97721,1.6743 -0.97721,3.74507 0,5.41937c0.97721,1.6743 2.78023,2.69273 4.71865,2.66532h21.5c5.01031,0 8.95833,3.94802 8.95833,8.95833v50.16667c0,5.01031 -3.94802,8.95833 -8.95833,8.95833h-89.58333c-5.01031,0 -8.95833,-3.94802 -8.95833,-8.95833v-50.16667c0,-5.01031 3.94802,-8.95833 8.95833,-8.95833h21.5c1.93842,0.02741 3.74144,-0.99102 4.71865,-2.66532c0.97721,-1.6743 0.97721,-3.74507 0,-5.41937c-0.97721,-1.6743 -2.78023,-2.69273 -4.71865,-2.66532z"></path>
					</g>
				</g>
			</svg>
		</span>
	`)
	btn.addEventListener('click', downloadThumbnail)
	parent.appendChild(btn)
	downloadBtn = btn;
}

function removeThumbnailDownloadBtn () {
	downloadBtn.parentNode.removeChild(downloadBtn);
	downloadBtn = undefined;
}

async function getThumbnailData (src) {
	const data = await fetch(src);
	const blob = await data.blob();
	const [type, extension] = blob.type.split('/');
	return {
		type,
		extension,
		file: window.webkitURL.createObjectURL(blob),
		size: blob.size,
	}
}

async function downloadThumbnail () {
	const { file, extension, ...rest } = await getThumbnailData(shadow.src);
	const filename = `${file.match(/(?<=\/)[\w-]+$/gi)}.${extension}`

	const anchor = document.createElement('a');
	anchor.download = filename;
	anchor.href = file;
	anchor.click();
	delete anchor;
}
