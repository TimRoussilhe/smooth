// import Signal from 'signals';
// import VirtualScroll from './virtualScroll';

const DEFAULTS = {
	easing: 0.5,
	friction: 0.12,
	wheelDeltaMultiplier: 0.36, // based on my research this match regular DOM scroll distance pretty well
	maxWheel: 300,
	autoUpdate: true
};

class CustomScroll {
	set enabled(isEnabled) {
		if (isEnabled) {
			this.dom.style.willChange = 'transform';
			// if (this.fakeElement) {
			//   this.fakeElement.style.display = null;
			// }
			if (!this.scrollbar) {
				window.scrollTo(0, this.y);
			}
		} else {
			// if (this.fakeElement) {
			//   this.fakeElement.style.display = 'none';
			// }
			this.dom.style.willChange = null;
		}

		this.isLocked = !isEnabled;
	}

	get enabled() {
		return !this.isLocked;
	}

	set height(height) {
		this._height = height;
		// this.fakeElement && (this.fakeElement.style.height = this._height + 'px');
	}

	get height() {
		return this._height;
	}

	constructor(props) {
		this.dom = (props && props.dom) || null;
		this.scrollbar = (props && props.scrollbar) || null;

		this.prevent = (props && props.prevent) || null;

		this.handlers = {};
		this.handlers.onMouseScroll = (e) => this.onMouseScroll(e);

		this.y = 0;
		this.target = 0;

		this.percent = 0;
		this.vy = 0;
		this.deltaY = 0;
		console.log('props', props);

		this.easing = props.easing !== undefined ? props.easing : DEFAULTS.easing;
		this.friction = props.friction !== undefined ? props.friction : DEFAULTS.friction;
		this.wheelDeltaMultiplier = props.wheelDeltaMultiplier !== undefined ? props.wheelDeltaMultiplier : DEFAULTS.wheelDeltaMultiplier;
		this.maxWheel = props.maxWheel !== undefined ? props.maxWheel : DEFAULTS.maxWheel;

		this.autoUpdate = props.autoUpdate !== undefined ? props.autoUpdate : DEFAULTS.autoUpdate;

		this.isLocked = false;
		this.firstScroll = (window.scrollY || window.pageYOffset) > 0;
		this.raf;

		let transformProp = (function () {
			let testEl = document.createElement('div');

			if (testEl.style.transform == null) {
				let vendors = ['Webkit', 'Moz', 'ms'];

				for (let vendor in vendors) {
					if (testEl.style[vendors[vendor] + 'Transform'] !== undefined) {
						return vendors[vendor] + 'Transform';
					}
				}
			}
			return 'transform';
		})();

		this.transformProp = transformProp;
		// this.scrolled = new Signal();

		this.resize();

		this.start();
	}

	start() {
		this.dom.style.position = 'fixed';
		this.dom.style.willChange = 'transform';

		this.bindEvents();

		// if (this.scrollbar) {
		// 	this.scrollbar.scrolled.add(() => this.onScrollbarScrolled());
		// }

		// plug virtual Scroll to get the Y delta
		// const vsCallback = (y) => this.updateTarget(y);

		// this.vs = new VirtualScroll({
		// 	callback: vsCallback
		// });
		// this.vs.bind();

		// this._wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : undefined !== document.onmousewheel ? 'mousewheel' : 'DOMMouseScroll';
		// const passiveEvents = {
		//   passive: this.supportsPassiveEvents()
		// };

		// this.dom.addEventListener(this._wheelEvent, this.handlers.onMouseScroll, passiveEvents);
	}

	bindEvents() {
		console.log('bindEvents');
		this.scrollHandler = () => this.onScroll();
		window.addEventListener('scroll', this.scrollHandler, {passive: true});
	}

	onScroll() {
		this.target = window.pageYOffset;
	}

	// main target Y here
	// diferent that physical Y inside RAF
	updateTarget(evt) {
		let deltaWheelY = 0;

		if (evt.deltaY > 0) {
			deltaWheelY = Math.min(evt.deltaY, this.maxWheel);
		} else {
			deltaWheelY = -Math.min(Math.abs(evt.deltaY), this.maxWheel);
		}

		deltaWheelY = deltaWheelY * this.wheelDeltaMultiplier;

		this.target += deltaWheelY;
		this.target = Math.round(this.target * 10000) / 10000;

		this.applyConstrains();
		// if (this.scrollbar) this.updateScrollbarPosition();
	}

	update(preventDomUpdate = false) {

		if (!this.isLocked) {
			if (this.target !== undefined) {
				this.deltaY = this.target - this.y;
				if (preventDomUpdate) {
					this.vy = 0;
					this.y = this.target;
				} else {
					this.vy += this.deltaY * this.easing;
					this.y += this.vy *= this.friction;
				}
			}
		}

		this.y = ((1000 * this.y) | 0) / 1000;

		if (!this.preventDomUpdate) {
			if (!(this.oldY === this.y && !preventDomUpdate)) {
				this.updateDom();
			}
		}

		this.percent = this.y / (this.height - this.boundingHeight);
		this.percent = ((10000 * this.percent) | 0) / 10000;

		this.oldY = this.y;

		// if (this.scrollbar) {
		// 	this.scrollbar.update();
		// }

		if (this.autoUpdate) this.raf = window.requestAnimationFrame(() => this.update());
	}

	updateDom(additionalTransform) {
		let style = 'translate3d(0px, ' + -this.y + 'px,0)';

		if (additionalTransform) {
			style += ' ' + additionalTransform;
		}

		this.dom.style[this.transformProp] = style;
	}

	applyConstrains() {
		let t = this.height - this.boundingHeight;

		if (this.target < 0) {
			this.target = 0;
		} else {
			if (this.target > t) {
				this.target = t;
			}
		}
	}

	reset() {
		this.y = this.target = this.oldY = this.percent = 0;
	}

	resize(t) {
		this.height = this.dom.getBoundingClientRect().height;
		this.boundingHeight = window.innerHeight;
		// if (this.scrollbar) this.scrollbar.resize(this.height);
		document.body.style.height = this.height + 'px';

		this.applyConstrains();
		this.update(true);
	}

	destroy() {
		if (this.raf) {
			window.cancelAnimationFrame(this.raf);
			this.raf = null;
		}

		// if (this.scrollbar) {
		// 	this.scrollbar.destroy();
		// }

		// this.vs.destroy();
		// this.fakeElement && this.fakeElement.parentNode.removeChild(this.fakeElement);
		// this.dom.removeEventListener(this._wheelEvent, this.handlers.onMouseScroll);
	}

	// updateScrollbarPosition() {
	// 	if (this.height > this.boundingHeight) {
	// 		this.scrollbar.percent = this.target / (this.height - this.boundingHeight);
	// 	}
	// }

	// onScrollbarScrolled() {
	// 	if (!this.isLocked) {
	// 		this.target = this.scrollbar ? this.scrollbar.percent * (this.height - this.boundingHeight) : window.scrollY || window.pageYOffset;

	// 		let firstScroll = this._firstScroll;

	// 		if (this._firstScroll) {
	// 			this.y = this.oldY = this.target;
	// 			this._firstScroll = false;
	// 			this.update(true);
	// 		} else {
	// 			if (!this.target) {
	// 				this._firstScroll = false;
	// 			}
	// 		}
	// 		// this.scrolled.dispatch(firstScroll);
	// 	}
	// }
}

export default CustomScroll;
