import VirtualScroll from './virtualScroll';
import { supportsPassiveEvents } from './utils';

const DEFAULTS = {
  easing: 0.5,
  friction: 0.2,
  // wheelDeltaMultiplier: 0.36, // based on my research this match regular DOM scroll distance pretty well
  wheelDeltaMultiplier: 0.45, // a little bit more smooth for now
  maxWheel: 400,
  autoUpdate: true,
  useVirtualScroll: true,
  smoothContainer: true,
  direction: 'vertical',
  noTransform: false,
  infinite: false,
};

class Scroll {
  constructor(props = {}) {
    this.scrollElement = props.scrollElement || null;
    this.scrollbar = props.scrollbar || null;

    this.handlers = {};
    this.handlers.onMouseScroll = (e) => this.onMouseScroll(e);

    this.y = 0;
    this.target = 0;
    this.speedDifferenceY = 0;

    this.percent = 0;
    this.vy = 0;
    this.deltaY = 0;
    this.fakeDiv = null;

    this.easing = props.easing !== undefined ? props.easing : DEFAULTS.easing;
    this.friction = props.friction !== undefined ? props.friction : DEFAULTS.friction;
    this.wheelDeltaMultiplier =
      props.wheelDeltaMultiplier !== undefined ? props.wheelDeltaMultiplier : DEFAULTS.wheelDeltaMultiplier;
    this.maxWheel = props.maxWheel !== undefined ? props.maxWheel : DEFAULTS.maxWheel;

    this.autoUpdate = props.autoUpdate !== undefined ? props.autoUpdate : DEFAULTS.autoUpdate;
    this.useVirtualScroll = props.useVirtualScroll !== undefined ? props.useVirtualScroll : DEFAULTS.useVirtualScroll;
    this.smoothContainer = props.smoothContainer !== undefined ? props.smoothContainer : DEFAULTS.smoothContainer;

    this.direction = props.direction !== undefined ? props.direction : DEFAULTS.direction;

    this.noTransform = props.noTransform !== undefined ? props.noTransform : DEFAULTS.noTransform;
    this.infinite = props.infinite !== undefined ? props.infinite : DEFAULTS.infinite;

    this.isScrollEnabled = true;

    // allows the user to disable wheel update but not the main scroll
    // this can be useful if you want to disable wheel updates but still set the target
    this.isWheelEnabled = true;

    this.firstScroll = (window.scrollY || window.pageYOffset) > 0;
    this.raf;

    // max scroll height
    this.maxHeight = 0;
    this.resize();
    this.start();
  }

  start() {
    if (this.smoothContainer) {
      this.scrollElement.style.willChange = 'transform';
      this.scrollElement.style.position = 'fixed';
    }

    if (this.scrollbar) {
      this.scrollbar.updateScrollTarget = (percent) => this.updateTargetPercent(percent);
    }

    if (this.useVirtualScroll) {
      // plug virtual Scroll to get the Y delta
      const vsCallback = (y, origin) => this.updateTarget(y, origin);
      this.vs = new VirtualScroll({
        callback: vsCallback,
      });
      this.vs.bind();
    } else {
      this.scrollHandler = (e) => this.updateTargetNativeScroll(e);
      const passive = supportsPassiveEvents();
      window.addEventListener('scroll', this.scrollHandler, { passive });
    }

    if (this.autoUpdate) this.update();
  }

  updateTargetNativeScroll(e) {
    this.target = window.scrollY || window.pageYOffset;
    this.applyConstrains();
  }

  // main target Y here
  // different that physical Y inside RAF
  updateTarget(evt, origin = null) {
    if (!this.isScrollEnabled || !this.isWheelEnabled) return false;
    let deltaWheelY = 0;
    if (evt.deltaY > 0 && origin !== 'keydown') {
      deltaWheelY = Math.min(evt.deltaY, this.maxWheel);
    } else {
      deltaWheelY = -Math.min(Math.abs(evt.deltaY), this.maxWheel);
    }

    deltaWheelY = deltaWheelY * this.wheelDeltaMultiplier;

    if (origin === 'keydown') {
      deltaWheelY = evt.deltaY;
    }

    this.target += deltaWheelY;
    this.target = Math.round(this.target * 10000) / 10000;

    if (this.scrollbar && this.scrollbar.isScrollbarDragging) {
      this.scrollbar.stopDrag();
    }

    this.applyConstrains();
  }

  updateTargetPercent(percent) {
    this.target = this.maxHeight * percent;
    this.applyConstrains();
  }

  setTarget(target, direct = false) {
    this.target = target;

    if (direct) {
      this.y = target;
      this.vy = 0;
      this.deltaY = 0;
    }

    this.applyConstrains();
  }

  update(preventDomUpdate = false) {
    if (this.isScrollEnabled) {
      if (
        (this.target !== undefined && this.vs && this.vs.isTouch && this.vs.isTouchDown) ||
        !this.vs ||
        (this.vs && !this.vs.isTouch)
      ) {
        this.deltaY = this.target - this.y;

        if (preventDomUpdate) {
          this.vy = 0;
          this.y = this.target;
        } else {
          // using just easing/lerp value
          if (this.easing && !this.friction) {
            this.y += this.deltaY * this.easing;
          } else if (this.friction && this.easing) {
            // using just easing and friction value
            this.vy += this.deltaY * this.easing;
            this.y += this.vy *= this.friction;
          } else {
            // no smooth/momentum added
            this.y = this.target;
          }

          if (Math.abs(this.y - this.target) < 0.1) this.y = this.target;

          // test for "speed, momentum" based animation, mobile throw
          // TODO: Explore further
          this.speedDifferenceY = 2 * (((10000 * (this.y - this.oldY)) | 0) / 10000);
        }
      } else if (this.vs && this.vs.isTouch && !this.vs.isTouchDown) {
        // this.speedX *= 0.96;
        this.speedDifferenceY *= 0.96;

        // if (Math.abs(this.speedX) <= 0.1) this.speedX = 0;
        if (Math.abs(this.speedDifferenceY) <= 0.1) this.speedDifferenceY = 0;
        this.vy = 0;
        this.deltaY = 0;
        this.y += this.speedDifferenceY;
        let t = this.height - this.boundingHeight;

        if (this.y < 0) {
          this.y = 0;
        } else {
          if (this.y > t) {
            this.y = t;
          }
        }

        this.target = this.y;
      }
    }

    this.y = ((1000 * this.y) | 0) / 1000;
    this.speedDifferenceY = ((10000 * this.speedDifferenceY) | 0) / 10000;

    if (!this.preventDomUpdate && this.smoothContainer) {
      if (!(this.oldY === this.y && !preventDomUpdate)) {
        this.updateScrollElement();
      } else if (this.oldY === this.y) {
        if (this.target !== this.y) {
          // when dom animating the scroll container, round its position to an integer value
          // to avoid potential blurry sub layouts
          this.y = Math.round(this.y);
          this.target = this.y;
          this.updateScrollElement();
        }
      }
    }

    this.percent = this.y / (this.height - this.boundingHeight);
    this.percent = ((10000 * this.percent) | 0) / 10000;

    this.oldY = this.y;

    if (this.scrollbar) {
      if (!this.scrollbar.isScrollbarDragging) this.updateScrollbarPosition();
      this.scrollbar.update();
    }

    if (this.autoUpdate && !preventDomUpdate) {
      this.raf = window.requestAnimationFrame(() => this.update());
    }
  }

  updateScrollElement(additionalTransform) {
    if (!this.noTransform) {
      let style;

      if (this.direction === 'horizontal') {
        style = 'translate3d(' + -this.y + 'px, 0px, 0)';
      } else {
        style = 'translate3d(0px, ' + -this.y + 'px,0)';
      }

      if (additionalTransform) {
        style += ' ' + additionalTransform;
      }

      this.scrollElement.style.transform = style;
    }
  }

  applyConstrains() {
    if (!this.infinite) {
      let t = this.height - this.boundingHeight;
      if (t < 0 || this.target < 0) {
        this.target = 0;
      } else {
        if (this.target > t) {
          this.target = t;
        }
      }
    }
  }

  resize(targetHeight = false) {
    if (targetHeight) this.height = targetHeight;
    else {
      this.height =
        this.direction === 'horizontal'
          ? this.scrollElement.getBoundingClientRect().width
          : this.scrollElement.getBoundingClientRect().height;
    }

    if (this.direction === 'horizontal') {
      this.boundingHeight = window.innerWidth;
    } else {
      this.boundingHeight = window.innerHeight;
    }

    this.maxHeight = this.height - this.boundingHeight;
    if (this.scrollbar) this.scrollbar.resize(this.height);
    this.applyConstrains();
    this.update(true);

    if (!this.useVirtualScroll && this.smoothContainer) {
      this.addFakeScrollHeight(this.height);
    }
  }

  stop() {
    this.isScrollEnabled = false;
    this.target = this.y;
    this.deltaY = this.target - this.y;
    this.vy = 0;
  }

  reset() {
    this.y = this.target = this.oldY = this.percent = 0;
  }

  updateScrollbarPosition() {
    if (this.height > this.boundingHeight) {
      this.scrollbar.percent = this.target / (this.height - this.boundingHeight);
    }
  }

  removeFakeScrollHeight() {
    this.fakeDiv.parentNode.removeChild(this.fakeDiv);
    this.fakeDiv = null;

    this.scrollElement.style.removeProperty('position');
    this.scrollElement.style.removeProperty('width');
    this.scrollElement.style.removeProperty('transform');
  }

  addFakeScrollHeight(value) {
    if (this.fakeDiv === null) {
      this.fakeDiv = document.createElement('div');
      this.fakeDiv.className = 'smooth-fake-scroll';
      this.fakeDiv.style.height = value + 'px';

      this.scrollElement.parentNode.insertBefore(this.fakeDiv, this.scrollElement.nextSibling);
    } else {
      this.fakeDiv.style.height = value + 'px';
    }

    this.scrollElement.style.position = 'fixed';
    this.scrollElement.style.width = '100%';
  }

  destroy() {
    if (this.raf) {
      window.cancelAnimationFrame(this.raf);
      this.raf = null;
    }

    if (this.scrollbar) {
      this.scrollbar.destroy();
    }

    this.vs && this.vs.destroy();

    this.fakeDiv && this.removeFakeScrollHeight();
    if (!this.useVirtualScroll) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }
}

export default Scroll;
