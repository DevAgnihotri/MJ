"use strict";

// Background music handling
document.addEventListener("DOMContentLoaded", () => {
	const bgMusic = document.getElementById("bgMusic");
	const toggleButton = document.getElementById("toggleMusic");
	let isMusicPlaying = false;
	
	// Check if user has interacted with the page before
	const hasInteracted = sessionStorage.getItem("mjPageInteracted") === "true";
	
	// Skip to 1:26 (86 seconds) in the song
	bgMusic.currentTime = 86;
	
	if (hasInteracted) {
		// Auto-play if they've interacted before in this session
		bgMusic.volume = 0.4;
		bgMusic.play().then(() => {
			isMusicPlaying = true;
			toggleButton.textContent = "🔊";
		}).catch(() => {
			// If auto-play fails, wait for user interaction
		});
	}

	// Play music on first user interaction (to comply with autoplay policies)
	document.addEventListener("click", function initAudio() {
		if (!isMusicPlaying) {
			bgMusic.currentTime = 86; // Skip to 1:26 in the song
			bgMusic.volume = 0.4; // Set volume to 40%
			bgMusic.play().then(() => {
				isMusicPlaying = true;
				toggleButton.textContent = "🔊";
				sessionStorage.setItem("mjPageInteracted", "true");
			}).catch(error => {
				console.error("Audio playback failed:", error);
			});
		}
		document.removeEventListener("click", initAudio);
	}, { once: true });

	// Toggle music button
	toggleButton.addEventListener("click", (e) => {
		e.stopPropagation(); // Prevent triggering canvas click events
		if (isMusicPlaying) {
			bgMusic.pause();
			toggleButton.textContent = "🔇";
		} else {
			// Reset to 1:26 when restarting music
			bgMusic.currentTime = 86;
			bgMusic.play();
			toggleButton.textContent = "🔊";
		}
		isMusicPlaying = !isMusicPlaying;
	});
});

///////////////// worker thread code ///////////////////
const theLastExperience = noWorkers => {
	"use strict";
	// ---- robot structure ----
	const struct = {
		points: [
			{
				x: 0,
				y: -4,
				f(s, d) {
					this.y -= 0.01 * s * ts;
				}
			},
			{
				x: 0,
				y: -16,
				f(s, d) {
					this.y -= 0.02 * s * d * ts;
				}
			},
			{
				x: 0,
				y: 12,
				f(s, d) {
					this.y += 0.02 * s * d * ts;
				}
			},
			{ x: -12, y: 0 },
			{ x: 12, y: 0 },
			{
				x: -3,
				y: 34,
				f(s, d) {
					if (d > 0) {
						this.x += 0.01 * s * ts;
						this.y -= 0.015 * s * ts;
					} else {
						this.y += 0.02 * s * ts;
					}
				}
			},
			{
				x: 3,
				y: 34,
				f(s, d) {
					if (d > 0) {
						this.y += 0.02 * s * ts;
					} else {
						this.x -= 0.01 * s * ts;
						this.y -= 0.015 * s * ts;
					}
				}
			},
			{
				x: -28,
				y: 0,
				f(s, d) {
					this.x += this.vx * 0.025 * ts;
					this.y -= 0.001 * s * ts;
				}
			},
			{
				x: 28,
				y: 0,
				f(s, d) {
					this.x += this.vx * 0.025 * ts;
					this.y -= 0.001 * s * ts;
				}
			},
			{
				x: -3,
				y: 64,
				f(s, d) {
					this.y += 0.015 * s * ts;
					if (d > 0) {
						this.y -= 0.01 * s * ts;
					} else {
						this.y += 0.05 * s * ts;
					}
				}
			},
			{
				x: 3,
				y: 64,
				f(s, d) {
					this.y += 0.015 * s * ts;
					if (d > 0) {
						this.y += 0.05 * s * ts;
					} else {
						this.y -= 0.01 * s * ts;
					}
				}
			}
		],
		links: [
			{ p0: 3, p1: 7, size: 12, lum: 0.5 },
			{ p0: 1, p1: 3, size: 24, lum: 0.5 },
			{ p0: 1, p1: 0, size: 60, lum: 0.5, disk: 1 },
			{ p0: 5, p1: 9, size: 16, lum: 0.5 },
			{ p0: 2, p1: 5, size: 32, lum: 0.5 },
			{ p0: 1, p1: 2, size: 50, lum: 1 },
			{ p0: 6, p1: 10, size: 16, lum: 1.5 },
			{ p0: 2, p1: 6, size: 32, lum: 1.5 },
			{ p0: 4, p1: 8, size: 12, lum: 1.5 },
			{ p0: 1, p1: 4, size: 24, lum: 1.5 }
		]
	};
	class Robot {
		constructor(color, light, size, x, y, struct) {
			this.x = x;
			this.points = [];
			this.links = [];
			this.frame = 0;
			this.dir = 1;
			this.size = size;
			this.color = Math.round(color);
			this.light = light;
			// ---- create points ----
			for (const p of struct.points) {
				this.points.push(new Robot.Point(size * p.x + x, size * p.y + y, p.f));
			}
			// ---- create links ----
			for (const link of struct.links) {
				const p0 = this.points[link.p0];
				const p1 = this.points[link.p1];
				const dx = p0.x - p1.x;
				const dy = p0.y - p1.y;
				this.links.push(
					new Robot.Link(
						this,
						p0,
						p1,
						Math.sqrt(dx * dx + dy * dy),
						link.size * size / 3,
						link.lum,
						link.force,
						link.disk
					)
				);
			}
		}
		update() {
			if (++this.frame % Math.round(20 / ts) === 0) this.dir = -this.dir;
			if (this === pointer.dancerDrag && this.size < 16 && this.frame > 600) {
				pointer.dancerDrag = null;
				dancers.push(
					new Robot(
						this.color + 90,
						this.light * 1.25,
						this.size * 2,
						pointer.x,
						pointer.y - 100 * this.size * 2,
						struct
					)
				);
				dancers.sort(function(d0, d1) {
					return d0.size - d1.size;
				});
			}
			// ---- update links ----
			for (const link of this.links) link.update();
			// ---- update points ----
			for (const point of this.points) point.update(this);
			// ---- ground ----
			for (const link of this.links) {
				const p1 = link.p1;
				if (p1.y > canvas.height * ground - link.size * 0.5) {
					p1.y = canvas.height * ground - link.size * 0.5;
					p1.x -= p1.vx;
					p1.vx = 0;
					p1.vy = 0;
				}
			}
			// ---- center position ----
			this.points[3].x += (this.x - this.points[3].x) * 0.001;
		}
		draw() {
			for (const link of this.links) {
				if (link.size) {
					const dx = link.p1.x - link.p0.x;
					const dy = link.p1.y - link.p0.y;
					const a = Math.atan2(dy, dx);
					// ---- shadow ----
					ctx.save();
					ctx.translate(link.p0.x + link.size * 0.25, link.p0.y + link.size * 0.25);
					ctx.rotate(a);
					ctx.drawImage(
						link.shadow,
						-link.size * 0.5,
						-link.size * 0.5
					);
					ctx.restore();
					// ---- stroke ----
					ctx.save();
					ctx.translate(link.p0.x, link.p0.y);
					ctx.rotate(a);
					ctx.drawImage(
						link.image,
						-link.size * 0.5,
						-link.size * 0.5
					);
					ctx.restore();
				}
			}
		}
	}
	Robot.Link = class Link {
		constructor(parent, p0, p1, dist, size, light, force, disk) {
			this.p0 = p0;
			this.p1 = p1;
			this.distance = dist;
			this.size = size;
			this.light = light || 1.0;
			this.force = force || 0.5;
			// MJ theme: black coat with white highlights or red for the center MJ figure
			let color;
			if (parent.color === 0) {
				// This is MJ - red "Thriller" jacket
				color = "hsl(0, 80%, " + parent.light * this.light + "%)";
			} else if (this.size < 20) {
				// White "shirt" parts for dancers
				color = "hsl(0, 0%, 95%)";
			} else {
				// Black "suits" for dancers
				color = "hsl(240, 10%, " + parent.light * this.light * 0.3 + "%)";
			}
			
			this.image = this.stroke(
				color,
				true, disk, dist, size
			);
			this.shadow = this.stroke("rgba(0,0,0,0.5)", false, disk, dist, size);
		}
		update() {
			const p0 = this.p0;
			const p1 = this.p1;
			const dx = p1.x - p0.x;
			const dy = p1.y - p0.y;
			const dist = Math.sqrt(dx * dx + dy * dy);
			if (dist > 0.0) {
				const tw = p0.w + p1.w;
				const r1 = p1.w / tw;
				const r0 = p0.w / tw;
				const dz = (this.distance - dist) * this.force;
				const sx = dx / dist * dz;
				const sy = dy / dist * dz;
				p1.x += sx * r0;
				p1.y += sy * r0;
				p0.x -= sx * r1;
				p0.y -= sy * r1;
			}
		}
		stroke(color, axis, disk, dist, size) {
			let image;
			if (noWorkers) {
				image = document.createElement("canvas");
				image.width = dist + size;
				image.height = size;
			} else {
				image = new OffscreenCanvas(dist + size, size);
			}
			const ict = image.getContext("2d");
			ict.beginPath();
			ict.lineCap = "round";
			ict.lineWidth = size;
			ict.strokeStyle = color;
			if (disk) {
				ict.arc(size * 0.5 + dist, size * 0.5, size * 0.5, 0, 2 * Math.PI);
				ict.fillStyle = color;
				ict.fill();
			} else {
				ict.moveTo(size * 0.5, size * 0.5);
				ict.lineTo(size * 0.5 + dist, size * 0.5);
				ict.stroke();
			}
			if (axis) {
				const s = size / 10;
				ict.fillStyle = "#000";
				ict.fillRect(size * 0.5 - s, size * 0.5 - s, s * 2, s * 2);
				ict.fillRect(size * 0.5 - s + dist, size * 0.5 - s, s * 2, s * 2);
			}
			return image;
		}
	};
	Robot.Point = class Point {
		constructor(x, y, fn, w) {
			this.x = x;
			this.y = y;
			this.w = w || 0.5;
			this.fn = fn || null;
			this.px = x;
			this.py = y;
			this.vx = 0.0;
			this.vy = 0.0;
		}
		update(robot) {
			// ---- dragging ----
			if (robot === pointer.dancerDrag && this === pointer.pointDrag) {
				this.x += (pointer.x - this.x) * 0.1;
				this.y += (pointer.y - this.y) * 0.1;
			}
			// ---- dance ----
			if (robot !== pointer.dancerDrag) {
				this.fn && this.fn(16 * Math.sqrt(robot.size), robot.dir);
			}
			// ---- verlet integration ----
			this.vx = this.x - this.px;
			this.vy = this.y - this.py;
			this.px = this.x;
			this.py = this.y;
			this.vx *= 0.995;
			this.vy *= 0.995;
			this.x += this.vx;
			this.y += this.vy + 0.01 * ts;
		}
	};
	// ---- init ----
	const dancers = [];
	let ground = 1.0;
	let canvas = { width: 0, height: 0, resize: true };
	let ctx = null;
	let pointer = { x: 0, y: 0, dancerDrag: null, pointDrag: null };
	let ts = 1;
	let lastTime = 0;
	// ---- messages from the main thread ----
	const message = e => {
		switch (e.data.msg) {
			case "start":
				canvas.elem = e.data.elem;
				canvas.width = canvas.elem.width;
				canvas.height = canvas.elem.height;
				ctx = canvas.elem.getContext("2d");
				initRobots();
				requestAnimationFrame(run);
				break;
			case "resize":
				canvas.width = e.data.width;
				canvas.height = e.data.height;
				canvas.resize = true;
				break;
			case "pointerMove":
				pointer.x = e.data.x;
				pointer.y = e.data.y;
				break;
			case "pointerDown":
				pointer.x = e.data.x;
				pointer.y = e.data.y;
				for (const dancer of dancers) {
					for (const point of dancer.points) {
						const dx = pointer.x - point.x;
						const dy = pointer.y - point.y;
						const d = Math.sqrt(dx * dx + dy * dy);
						if (d < 60) {
							pointer.dancerDrag = dancer;
							pointer.pointDrag = point;
							dancer.frame = 0;
						}
					}
				}
				break;
			case "pointerUp":
				pointer.dancerDrag = null;
				break;
		}
	};
	// ---- resize screen ----
	const resize = () => {
		canvas.elem.width = canvas.width;
		canvas.elem.height = canvas.height;
		canvas.resize = false;
		ground = canvas.height > 500 ? 0.85 : 1.0;
		for (let i = 0; i < dancers.length; i++) {
			dancers[i].x = (i + 2) * canvas.width / 9;
		}
	}
	// ---- main loop ----
	const run = (time) => {
		requestAnimationFrame(run);
		if (canvas.resize === true) resize();
		// ---- adjust speed to screen freq ----
		if (lastTime !== 0) {
			const t = (time - lastTime) / 16;
			ts += (t - ts) * 0.1;
			if (ts > 1) ts = 1;
		}
		lastTime = time;
		// ---- clear screen ----
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fillRect(0, 0, canvas.width, canvas.height * 0.15);
		ctx.fillRect(0, canvas.height * 0.85, canvas.width, canvas.height * 0.15);
		
		// Add MJ-themed 404 text
		ctx.fillStyle = "#FFFFFF";
		ctx.font = "bold " + Math.min(canvas.width / 15, 48) + "px Arial";
		ctx.textAlign = "center";
		ctx.fillText("404 - Smooth Criminal", canvas.width / 2, canvas.height * 0.1);
		// ---- animate robots ----
		for (const dancer of dancers) {
			dancer.update();
			dancer.draw();
		}
	};
	const initRobots = () => {
		// ---- instanciate robots ----
		ground = canvas.height > 500 ? 0.85 : 1.0;
		
		// MJ-themed robots - black suits with one central MJ character
		for (let i = 0; i < 6; i++) {
			// Middle robot (index 2 or 3) is MJ with different styling
			const isMJ = (i === 2);
			dancers.push(
				new Robot(
					// Black color for suits, with MJ in a special color (red for the Thriller jacket)
					isMJ ? 0 : 220,  
					// Brighter light for MJ
					isMJ ? 100 : 50,  
					// MJ is slightly larger
					Math.sqrt(Math.min(canvas.width, canvas.height)) / (isMJ ? 5.5 : 6),
					(i + 2) * canvas.width / 9,
					// MJ is positioned slightly forward
					canvas.height * 0.5 - (isMJ ? 120 : 100),
					struct
				)
			);
		}
	};
	// ---- main thread vs. worker
	if (noWorkers) {
		// ---- emulate postMessage interface ----
		return {
			postMessage(data) {
				message({ data: data });
			}
		};
	} else {
		// ---- worker messaging ----
		onmessage = message;
	}
};
///////////////// main thread code ///////////////////
let worker = null;
const createWorker = fn => {
	const URL = window.URL || window.webkitURL;
	return new Worker(URL.createObjectURL(new Blob(["(" + fn + ")()"])));
};
// ---- init canvas ----
const canvas = document.querySelector("canvas");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
// ---- instanciate worker ----
if (window.Worker && window.OffscreenCanvas) {
	// instanciating background worker from a function
	worker = createWorker(theLastExperience);
	// cloning OffscreenCanvas
	const offscreen = canvas.transferControlToOffscreen();
	// sending data to worker
	worker.postMessage({ msg: "start", elem: offscreen }, [offscreen]);
} else {
	// falling back execution to the main thread
	worker = theLastExperience(true);
	worker.postMessage({ msg: "start", elem: canvas });
}
// ---- resize event ----
window.addEventListener(
	"resize",
	() => {
		worker.postMessage({
			msg: "resize",
			width: canvas.offsetWidth,
			height: canvas.offsetHeight
		});
	},
	false
);
// ---- pointer events ----
const pointer = {
	x: 0,
	y: 0,
	down(e) {
		this.move(e);
		worker.postMessage({
			msg: "pointerDown",
			x: this.x,
			y: this.y
		});
	},
	up(e) {
		worker.postMessage({
			msg: "pointerUp"
		});
	},
	move(e) {
		if (e.targetTouches) {
			e.preventDefault();
			this.x = e.targetTouches[0].clientX;
			this.y = e.targetTouches[0].clientY;
		} else {
			this.x = e.clientX;
			this.y = e.clientY;
		}
		worker.postMessage({
			msg: "pointerMove",
			x: this.x,
			y: this.y
		});
	}
};
window.addEventListener("mousemove", e => pointer.move(e), false);
canvas.addEventListener("touchmove", e => pointer.move(e), false);
window.addEventListener("mousedown", e => pointer.down(e), false);
window.addEventListener("touchstart", e => pointer.down(e), false);
window.addEventListener("mouseup", e => pointer.up(e), false);
window.addEventListener("touchend", e => pointer.up(e), false);