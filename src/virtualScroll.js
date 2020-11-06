import normalizeWheel from 'normalize-wheel';
import { supportsPassiveEvents } from './utils';

/**
 * Fork from https://github.com/ayamflow/virtual-scroll
 * Used to collect custom scroll event with inertia/momentum.
 */

let keyCodes = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  SPACE: 32,
};

const DEFAULTS = {
  mouseMultiplier: 3,
  touchMultiplier: -3,
  firefoxMultiplier: 15,
  keyStep: 200,
  preventTouch: false,
  unpreventTouchClass: 'vs-touchmove-allowed',
  limitInertia: false,
  passive: true,
};

const SUPPORT = () => {
  return {
    hasWheelEvent: 'onwheel' in document,
    hasMouseWheelEvent: 'onmousewheel' in document,
    hasTouch: 'ontouchstart' in document,
    hasTouchWin: navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 1,
    hasPointer: !!window.navigator.msPointerEnabled,
    hasKeyDown: 'onkeydown' in document,
    isFirefox: navigator.userAgent.indexOf('Firefox') > -1,
  };
};

/* eslint-disable */
// prettier-ignore
const mobileAndTabletCheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
/* eslint-enable */

class CustomScroll {
  constructor(props) {
    this.el = window;
    if (props && props.el) {
      this.el = props.el;
      delete props.el;
    }

    if (!props.callback || (props.callback && typeof props.callback !== 'function')) {
      console.error('No Callback provided');
      return;
    }

    this.options = {
      ...DEFAULTS,
      ...props,
    };

    this.support = SUPPORT();

    this.handlers = {
      onWheel: (e) => this.onWheel(e),
      onMouseWheel: (e) => this.onMouseWheel(e),
      onTouchStart: (e) => this.onTouchStart(e),
      onTouchEnd: (e) => this.onTouchEnd(e),
      onTouchMove: (e) => this.onTouchMove(e),
      onKeyDown: (e) => this.onKeyDown(e),
    };

    if (this.options.limitInertia) this.lethargy = new Lethargy();

    this.event = {
      y: 0,
      x: 0,
      deltaX: 0,
      deltaY: 0,
    };

    this.touchStartX = null;
    this.touchStartY = null;
    this.bodyTouchAction = null;
    this.isTouchDown = false;
    this.isTouch = ((this.support.hasTouch || this.support.hasTouchWin) && mobileAndTabletCheck()) || false;

    // scroll target value
    // this is the main scroll Y position
    this.target = 0;

    if (this.options.passive !== undefined) {
      this.listenerOptions = { passive: supportsPassiveEvents() };
    }
  }

  updateTarget(e, origin = null) {
    let evt = this.event;
    evt.x += evt.deltaX;
    evt.y += evt.deltaY;

    this.options.callback(
      {
        deltaX: evt.deltaX,
        deltaY: evt.deltaY,
      },
      origin
    );
  }

  onWheel(e) {
    let options = this.options;
    let evt = this.event;

    // // In Chrome and in Firefox (at least the new one)
    // evt.deltaX = e.wheelDeltaX * -1 || e.deltaX * -1;
    // evt.deltaY = e.wheelDeltaY * -1 || e.deltaY * -1;

    // // for our purpose deltamode = 1 means user is on a wheel mouse, not touch pad
    // // real meaning: https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent#Delta_modes
    // if (this.support.isFirefox && e.deltaMode == 1) {
    // 	evt.deltaX *= options.firefoxMultiplier;
    // 	evt.deltaY *= options.firefoxMultiplier;
    // }

    // evt.deltaX *= options.mouseMultiplier;
    // evt.deltaY *= options.mouseMultiplier;
    // TODO: potentially improve touchpad versus mouse values here
    const normalized = normalizeWheel(e);
    evt.deltaY = normalized.pixelY * options.mouseMultiplier;
    this.updateTarget(e);
  }

  onMouseWheel(e) {
    if (this.options.limitInertia && this.lethargy.check(e) === false) return;

    let evt = this.event;

    // In Safari, IE and in Chrome if 'wheel' isn't defined
    evt.deltaX = e.wheelDeltaX ? e.wheelDeltaX : 0;
    evt.deltaY = e.wheelDeltaY ? e.wheelDeltaY : e.wheelDelta;

    this.updateTarget(e);
  }

  onTouchStart(e) {
    this.isTouchDown = true;
    let t = e.targetTouches ? e.targetTouches[0] : e;
    this.touchStartX = t.pageX;
    this.touchStartY = t.pageY;
  }

  onTouchMove(e) {
    e.preventDefault();

    let options = this.options;
    if (options.preventTouch && !e.target.classList.contains(options.unpreventTouchClass)) {
      e.preventDefault();
    }

    let evt = this.event;

    let t = e.targetTouches ? e.targetTouches[0] : e;

    evt.deltaX = (t.pageX - this.touchStartX) * options.touchMultiplier;
    evt.deltaY = (t.pageY - this.touchStartY) * options.touchMultiplier;

    this.touchStartX = t.pageX;
    this.touchStartY = t.pageY;

    this.updateTarget(e);
  }

  onTouchEnd(e) {
    this.isTouchDown = false;
  }

  onKeyDown(e) {
    let evt = this.event;
    evt.deltaX = evt.deltaY = 0;
    let windowHeight = window.innerHeight - 40;

    switch (e.keyCode) {
      case keyCodes.LEFT:
      case keyCodes.UP:
        evt.deltaY = -this.options.keyStep;
        break;

      case keyCodes.RIGHT:
      case keyCodes.DOWN:
        evt.deltaY = +this.options.keyStep;
        break;
      case keyCodes.SPACE && e.shiftKey:
        evt.deltaY = -windowHeight;
        break;
      case keyCodes.SPACE:
        evt.deltaY = +windowHeight;
        break;
      default:
        return;
    }

    this.updateTarget(e, 'keydown');
  }

  bind() {
    if (this.support.hasWheelEvent) {
      this.el.addEventListener('wheel', this.handlers.onWheel, this.listenerOptions);
    }
    if (this.support.hasMouseWheelEvent) {
      this.el.addEventListener('mousewheel', this.handlers.onMouseWheel, this.listenerOptions);
    }

    if (this.support.hasTouch) {
      this.el.addEventListener('touchstart', this.handlers.onTouchStart, this.listenerOptions);
      this.el.addEventListener('touchend', this.handlers.onTouchEnd, this.listenerOptions);
      this.el.addEventListener('touchmove', this.handlers.onTouchMove, {
        passive: false,
      });
    }

    if (this.support.hasPointer && this.support.hasTouchWin) {
      this.bodyTouchAction = document.body.style.msTouchAction;
      document.body.style.msTouchAction = 'none';
      this.el.addEventListener('MSPointerDown', this.handlers.onTouchStart, true);
      this.el.addEventListener('MSPointerUp', this.handlers.onTouchEnd, true);
      this.el.addEventListener('MSPointerMove', this.handlers.onTouchMove, true);
    }

    if (this.support.hasKeyDown) document.addEventListener('keydown', this.handlers.onKeyDown);
  }

  unbind() {
    if (this.support.hasWheelEvent) this.el.removeEventListener('wheel', this.handlers.onWheel);
    if (this.support.hasMouseWheelEvent) {
      this.el.removeEventListener('mousewheel', this.handlers.onMouseWheel);
    }

    if (this.support.hasTouch) {
      this.el.removeEventListener('touchstart', this.handlers.onTouchStart);
      this.el.removeEventListener('touchend', this.handlers.onTouchEnd);
      this.el.removeEventListener('touchmove', this.handlers.onTouchMove);
    }

    if (this.support.hasPointer && this.support.hasTouchWin) {
      document.body.style.msTouchAction = this.bodyTouchAction;
      this.el.removeEventListener('MSPointerDown', this.handlers.onTouchStart);
      this.el.removeEventListener('MSPointerUp', this.handlers.onTouchEnd);
      this.el.removeEventListener('MSPointerMove', this.handlers.onTouchMove);
    }

    if (this.support.hasKeyDown) document.removeEventListener('keydown', this.handlers.onKeyDown);
  }

  reset() {
    let evt = this.event;
    evt.x = 0;
    evt.y = 0;
  }

  destroy() {
    this.unbind();
  }
}

export default CustomScroll;
