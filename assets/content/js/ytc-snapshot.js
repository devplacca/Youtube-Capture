/*
	This script handles taking snapshots of frames of currently viewing Youtube videos
*/
let player;
let canvas;
let prevLocation;

window.addEventListener('load', () => {
	const observer = new MutationObserver(mutations => {
		const currentLocation = window.location.href;

		if (!player || prevLocation !== currentLocation) {
			for (mutation of mutations) {
				const playerNodes = window["player"];
				let found = false

				// iterate over playerNodes if it is a collection of nodes instead of a single DOM node
				if (playerNodes && HTMLCollection.prototype.isPrototypeOf(playerNodes)) {
					for (let el of playerNodes) {
						if (el.classList.contains('ytd-watch-flexy')) {
							player = el;
							found = true;
							break
						}
					}
				} else {
					player = playerNodes;
					found = true;
				}

				if (found) {
					if (!document.querySelector('ytc-button-renderer') && player) {
						const sibling = player.parentNode.querySelector('#info');
						// create and insert a button for taking/capturing video snapshots
						insertSnapshotButton(sibling.querySelector('#top-level-buttons'));
						insertSnapshotCanvas();
						prevLocation = currentLocation;
					}
					break;
				}
			}
		}
	});
	// listen for changes/updates in the body element
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});


// create and insert canvas for frame capturing into the DOM
function insertSnapshotCanvas() {
	const el = createElementFromString(`
		<ytc-canvas>
			<canvas></canvas>
		</ytc-canvas>
	`);
	canvas = el.firstElementChild;
	document.body.appendChild(canvas)
}


function insertSnapshotButton(parentNode) {
	const snapshotBtn = createElementFromString(`
		<ytc-button-renderer>
			<button>
				<span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 172 172"
					>
						<g
							fill="none"
							fill-rule="nonzero"
							style="mix-blend-mode: normal"
						>
							<path d="M0,172v-172h172v172z" fill="none"></path>
							<g fill="#909090">
								<path d="M73.36035,17.91667c-5.71542,0 -11.04999,3.06526 -13.92741,7.99951l-7.87354,13.50049h-13.93441c-12.84267,0 -23.29167,10.449 -23.29167,23.29167v68.08333c0,12.84267 10.449,23.29167 23.29167,23.29167h96.75c12.84267,0 23.29167,-10.449 23.29167,-23.29167v-68.08333c0,-12.84267 -10.449,-23.29167 -23.29167,-23.29167h-13.93441l-7.87354,-13.50049c-2.87741,-4.93425 -8.21199,-7.99951 -13.92741,-7.99951zM86,60.91667c17.7805,0 32.25,14.46592 32.25,32.25c0,17.78408 -14.4695,32.25 -32.25,32.25c-17.7805,0 -32.25,-14.46592 -32.25,-32.25c0,-17.78408 14.4695,-32.25 32.25,-32.25zM86,71.66667c-11.87412,0 -21.5,9.62588 -21.5,21.5c0,11.87412 9.62588,21.5 21.5,21.5c11.87412,0 21.5,-9.62588 21.5,-21.5c0,-11.87412 -9.62588,-21.5 -21.5,-21.5z"></path>
							</g>
						</g>
					</svg>
				</span>
				<span>Snapshot</span>
			</button>
			<ytc-tooltip>Take snapshot</ytc-tooltip>
		</ytc-button-renderer>
	`)
	// bind download action to snapshot button
	snapshotBtn.addEventListener('click', takeAndDownloadSnapshot);
	// insert button into the appropriate node in the DOM
	parentNode.insertBefore(snapshotBtn, parentNode.lastElementChild)
}


function takeAndDownloadSnapshot() {
	const snapshot = generateSnapshot();
	downloadMedia(snapshot.data, snapshot.filename);
}

function generateSnapshot() {
	const video = player.querySelector('video');
	const context = canvas.getContext('2d');
	const {
		clientWidth: cw,
		clientHeight: ch,
		currentTime,
		src
	} = video;

	canvas.width = cw;
	canvas.height = ch;
	context.drawImage(video, 0, 0, cw, ch);
	const data = canvas.toDataURL();
	const extension = data.split(',').shift().match(/(?<=\/).+(?=;)/g);
	return {
		data,
		filename: `${src.split('/').pop()}-${currentTime}s.${extension}`
	}
}
