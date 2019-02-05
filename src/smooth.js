/*!
 * Make everything smooth like butter when you scroll
 *
 * Version : 2.0.0
 * Website : coming soon
 * Repo    : https://github.com/TimRoussilhe/smooth
 * Author  : Tim Roussilhe (@timroussilhe)
 *
 * Free to use under terms of MIT license
 */

class Smooth {
  constructor() {
    var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    this.handlers = {
      run: null,
      debounce: null,
      resize: null
    };

    this.setupListeners = {
      resize: opts.setupListeners !== undefined && opts.setupListeners.resize !== undefined ? opts.setupListeners.resize : true,
      scroll: opts.setupListeners !== undefined && opts.setupListeners.scroll !== undefined ? opts.setupListeners.scroll : true,
      update: opts.setupListeners !== undefined && opts.setupListeners.update !== undefined ? opts.setupListeners.update : true
    };

    this.perfs = {
      now: null,
      last: null
    };

    this.vars = {
      preload: opts.preload || false,
      current: 0,
      target: 0,
      height: 0,
      documentHeight: 0,
      bounding: 0,
      timer: null,
      ticking: false
    };

    // pony trick here, we remove easing on frist frame to avoid ucking flash or blink or big scroll
    this.firstFrame = true;

    this.ticketScroll = false;

    this.smoothContainer = opts.smoothContainer;

    if (this.smoothContainer) {
      this.smoothSection = {
        el: opts.smoothSection ? opts.smoothSection : document.body,
        animation: {
          transform: [
            {
              transformType: 'translate3d',
              axis: 'y',
              ease: 0.12,
              initialValue: 0
            }
          ]
        }
      };
    }

    // lister is use for smooth scrolling container
    this.dom = document.body;
    this.fakeDiv = null;

    this.elementsParallaxe = [];
    this.elementsTrigger = [];
    this.isDisabled = false;

    this.resize();
  }

  init() {
    this.vars.preload && this.preloadImages();
    this.addEvents();
    !this.vars.preload && this.resize();
  }

  start() {
    this.reflow();
    if (this.setupListeners.update) this.raf = window.requestAnimationFrame(this.handlers.run);
  }

  addElement(element, reflow = true) {
    if (!element.el) return false;

    if (element.animations !== undefined) {
      this.elementsParallaxe.push(element);
    }

    if (element.trigger !== undefined) {
      element.triggered = false;
      this.elementsTrigger.push(element);
    }

    if (reflow) this.reflow();
  }

  addElements(elements) {
    for (var i = 0; i < elements.length; i++) {
      this.addElement(elements[i], false);
    }

    this.reflow();
  }

  resetElement(element, reflow = true) {
    let match = null;
    for (let i = 0; i < this.elementsParallaxe.length; i++) {
      let current = this.elementsParallaxe[i];
      if (current.el === element.el) {
        match = { index: i, element: current };
      }
    }

    if (match !== null) {
      this.elementsParallaxe.splice(match.index, 1);
      this.addElement(match.element, reflow);
    }
  }

  // In case we wanna add dynamic value from the instaciation of the parent resize
  resetElements(elements) {
    console.log('elements', elements);
    console.log('elements instanceof Array', elements instanceof Array);

    // MAKE SURE elements is an array and not a single object
    if (elements instanceof Array === false) {
      elements = [elements]; // we could also just call addElement here i guess
    }

    this.elementsParallaxe = [];
    this.elementsTrigger = [];

    this.addElements(elements);
    this.reflow();
  }

  // If an object as several transform we need extra work ( thanks you css !)
  setTransformSequence(animation) {
    animation.startValue = this.findStart(animation.transform);
    animation.endValue = this.findEnd(animation.transform);
  }

  preloadImages() {
    var images = Array.prototype.slice.call(this.dom.querySelectorAll('img'), 0);

    images.forEach(
      function(image) {
        var img = new Image();

        img.onload = function(el) {
          images.splice(images.indexOf(image), 1);
          images.length === 0 && this.resize();
        }.bind(this);

        img.src = image.getAttribute('src');
      }.bind(this)
    );
  }

  debounce() {
    this.ticketScroll = true;
  }

  addScrollingClass() {
    clearTimeout(this.vars.timer);
    if (!this.vars.ticking) {
      this.vars.ticking = true;
      // this.perfs.now = Date.now();
      // this.dom.classList.add('is-scrolling');
      this.dom.style.pointerEvents = 'none';
    }

    this.vars.timer = setTimeout(() => {
      this.vars.ticking = false;
      // this.dom.classList.remove('is-scrolling');
      this.dom.style.pointerEvents = 'auto';
    }, 300);
  }

  addScrollingClassHandler() {
    this.vars.ticking = false;
    // this.dom.classList.remove('is-scrolling');
    this.dom.style.pointerEvents = 'auto';
  }

  run() {
    if (this.isDisabled) {
      return false;
    }

    if (this.ticketScroll) {
      this.vars.target = window.scrollY || window.pageYOffset;
      // this.addScrollingClass();
      this.ticketScroll = false;
    }

    // this.vars.current += (this.vars.target - this.vars.current) * this.vars.ease;
    this.vars.current = this.vars.target;

    // USELESS
    // this.vars.current < .1 && (this.vars.current = 0);

    // If we are having a global smooth container
    // Animate it following scroll position of dom
    if (this.smoothContainer) this.updatesmoothContainer(this.vars.current === this.vars.old);

    // Still not sure why i pass frame here since we register this globaly...
    this.updateParallaxeElements(this.vars.current, this.vars.current === this.vars.old);
    if (this.vars.current !== this.vars.old) this.checkTriggerElements(this.vars.current);

    this.vars.old = this.vars.current;

    this.raf = window.requestAnimationFrame(this.handlers.run);
  }

  updatesmoothContainer(notScrolling) {
    if (!this.smoothSection.animation.transform[0].done || !notScrolling) {
      this.smoothSection.animation.properties = [];
      // so far we only allow one transform on the body (x or y)
      this.computeTransformStyle(this.smoothSection.animation, this.smoothSection.animation.transform[0], -this.vars.current);

      this.setStyle(this.smoothSection.el, this.smoothSection.animation.properties);
    }
  }

  /**
   * Update all Elements
   * Edge Management
   */
  updateParallaxeElements(frame, notScrolling) {
    var index = 0;
    for (; index < this.elementsParallaxe.length; index++) {
      var element = this.elementsParallaxe[index];
      // var properties = [];

      for (var j = 0; j < element.animations.length; j++) {
        var animation = element.animations[j];
        var before = frame < animation.startValue;
        var after = frame > animation.endValue;

        // create a new array to catch all properties related to the same el
        animation.properties = [];

        // If we are before/after the first/`last frame, set the styles according first/last value.
        if (before || after) {
          // we are at firt or last and allready setStyle to reach initial/final Value
          if ((before && animation.edge === -1) || (after && animation.edge === 1)) {
            if (animation.done) continue;
          }

          animation.edge = before ? -1 : 1;

          if (animation.transform) {
            // We need to check that all subAnimation are done so we use this as a flag
            let transformDone = true;

            for (let indexTransform = 0; indexTransform < animation.transform.length; indexTransform++) {
              let transformAnimation = animation.transform[indexTransform];
              this.computeTransformStyle(animation, transformAnimation, animation.edge === -1 ? transformAnimation.initialValue : transformAnimation.finalValue);
              if (transformAnimation.done === false) transformDone = false;
            }

            // no we check the flag
            // if one of the subAnimation is not done the flag will be false
            // if all done then the main animation is done
            if (transformDone === true) {
              animation.done = true;
            } else {
              animation.done = false;
            }
          } else {
            this.computeClassicStyle(animation, animation.edge === -1 ? animation.initialValue : animation.finalValue);
          }

          // now we have array of properties we gonna parse them and apply them
          if (animation.properties.length > 0) this.setStyle(element.el, animation.properties);

          continue;
        } else {
          if (animation.done && animation.edge === 0 && notScrolling) continue;
          animation.edge = 0;

          // We need to check that all subAnimation are done so we use this as a flag
          var transformDone = true;

          if (animation.transform) {
            for (let indexTransform = 0; indexTransform < animation.transform.length; indexTransform++) {
              let transformAnimation = animation.transform[indexTransform];

              // Cap progress between 0 and 1 ( Mostly because of transform sequences )
              let progress = Math.min(Math.max((frame - transformAnimation.startValue) / (transformAnimation.endValue - transformAnimation.startValue), 0), 1);
              // TODO: ADD EASING
              // progress = left.props[key].easing(progress);
              let currentValue = transformAnimation.initialValue + (transformAnimation.finalValue - transformAnimation.initialValue) * progress;
              this.computeTransformStyle(animation, transformAnimation, currentValue);
              if (transformAnimation.done === false) transformDone = false;
            }

            // no we check the flag
            // if one of the subAnimation is not done the flag will be false
            // if all done then the main animation is done
            if (transformDone === true) {
              animation.done = true;
            } else {
              animation.done = false;
            }
          } else {
            let progress = (frame - animation.startValue) / (animation.endValue - animation.startValue);
            let currentValue = animation.initialValue + (animation.finalValue - animation.initialValue) * progress;

            this.computeClassicStyle(animation, currentValue);
          }

          // now we have array of properties we gonna parse them and apply them
          // we are doing this one per animation not once per element
          if (animation.properties.length > 0) this.setStyle(element.el, animation.properties);
        }
      }
    }
  }

  checkTriggerElements(frame) {
    var index = 0;
    for (; index < this.elementsTrigger.length; index++) {
      var element = this.elementsTrigger[index];
      var before = frame < element.startValue;

      // add css transition
      if (!element.isInit && element.trigger.finalValues) {
        this.setStyle(element.el, element.transition, true);

        element.isInit = true;
      }

      // So far we are not using after for the trigger
      if (before) {
        if (before && element.edge === -1) continue;

        element.edge = before ? -1 : 1;

        // if we are going back before trigger point
        if (element.trigger.reset) {
          for (var i = 0; i < element.initialStyles.length; i++) {
            this.setStyle(element.el, element.initialStyles[i], true);
          }

          // if ( element.initialStyles.length === 0 ) {
          //   for ( var i = 0; i < element.finalStyles.length; i++ ) {
          //     element.el.style[ element.finalStyles[ i ].style[ 0 ] ] = null
          //   }
          // }

          if (element.trigger.addClass) {
            element.el.classList.remove(element.trigger.addClass);
          }

          element.triggered = false;
        }
      } else if (!element.triggered) {
        element.edge = 0;
        element.triggered = true;

        for (var i = 0; i < element.finalStyles.length; i++) {
          this.setStyle(element.el, element.finalStyles[i].style, true);
        }

        if (element.trigger.addClass) {
          element.el.classList.add(element.trigger.addClass);
        }

        if (element.trigger.callback) {
          element.trigger.callback();
        }
      }
    }
  }

  // force reflow of the smoothvalue so it will go to it without easing
  forceTransformStyle(value = -this.vars.current) {
    // tfAnimation.smoothValue = tfAnimation.initialValue;
    if (this.smoothSection.animation.transform[0].smoothValue !== undefined) {
      this.smoothSection.animation.transform[0].smoothValue = value - this.smoothSection.animation.transform[0].smoothValue;
    }
  }

  // OUTPUT
  // animation : main animation ( example contains Opactiy + transform)
  // tfAnimation : current transform line
  // value : current value to apply
  computeTransformStyle(animation, tfAnimation, value) {
    // We calculate smooth value here if easing
    // here means first fucking frame
    if (tfAnimation.smoothValue === undefined) {
      tfAnimation.smoothValue = tfAnimation.initialValue;
      tfAnimation.smoothValue += value - tfAnimation.smoothValue;
    } else {
      tfAnimation.smoothValue += (value - tfAnimation.smoothValue) * tfAnimation.ease;
    }

    // specific round values for translate and scale
    let roundedValue;
    if (tfAnimation.transformType === 'translate3d') {
      roundedValue = Math.round(tfAnimation.smoothValue * 100) / 100;
    } else {
      roundedValue = Math.round(tfAnimation.smoothValue * 1000) / 1000;
    }

    // TEST TO ROUND THE VALUE FOR LESS CALCULATION
    // if(value - roundedValue < .1) roundedValue = value;

    // checking if animation of transform value is done
    // check if animation is done comparing the final value to the rounded one
    // we need to round the final value too to be able to compate to roundedValue
    if (Math.round(value * 1000) / 1000 === roundedValue) tfAnimation.done = true;
    else tfAnimation.done = false;

    // We check if there is allready a transform in the main animation
    if (animation.properties) {
      for (var i = 0; i < animation.properties.length; i++) {
        // Case for transform
        if (animation.properties[i].property === tfAnimation.transformType) {
          animation.properties[i][tfAnimation.axis] = roundedValue;

          return false;
        }
      }
    }

    // If there is no transform we create the object
    var style = {
      property: tfAnimation.transformType
    };

    style[tfAnimation.axis] = roundedValue;
    style.isPercent = tfAnimation.valueIsPercent;

    // push value to parent animation
    animation.properties.push(style);
  }

  computeClassicStyle(animation, value) {
    // We calculate smooth value here if easing
    // here means first fucking frame so no easing to avoid blick/flash etc
    if (animation.smoothValue === undefined) {
      animation.smoothValue = animation.initialValue;
      animation.smoothValue += value - animation.smoothValue;
    } else {
      animation.smoothValue += (value - animation.smoothValue) * animation.ease;
    }

    var roundedValue = Math.round(animation.smoothValue * 100) / 100;

    var style = {
      property: animation.property,
      value: roundedValue
    };

    // check if animation is done comparing the final value to the rounded one
    // we need to round the final value too to be able to compate to roundedValue
    if (Math.round(value * 100) / 100 === roundedValue) animation.done = true;
    else animation.done = false;

    // save property into animation object
    animation.properties.push(style);
  }

  /**
   * Set Future Style
   * Element is here to pass el of current Element
   * Animation is current animation of element ( need to be precised because it can be several ones )
   * Value is current scroll value ( need to be calculated before ) Here we just apply momemtum is ease < 1
   */
  // rounded number
  // https://jsperf.com/parsefloat-tofixed-vs-math-round

  setStyle(el, style, noParsing) {
    if (!noParsing) var style = this.parseStyle(style);

    if (style[0] === 'transform') {
      el.style.transform = style[1];
    } else if (style[0] === 'opacity') {
      el.style.opacity = style[1];
    } else if (style[0] === 'transition') {
      el.style.transition = style[1];
    }
  }

  // return an object containing all style
  // ====>
  // Example Object {transform: "translate3d(66.5px,66.5px,0) scale3d(1.06,1.06,1)"}
  // ====>
  parseStyle(properties) {
    // could use regexpt and a pattern here but want to avoid replace inside raf
    // so we chose switch and string concatenation
    // also useful if we want to add more control here such as translate or translate3d... background color calculcation etc
    // https://jsperf.com/string-concat-vs-regex-replace/2

    // TODO Centralize Animations when severals animations and at the end set all style
    // AND return all
    var parsedStyle = [];
    for (var i = 0; i < properties.length; i++) {
      var currentProperty = properties[i];
      const unit = currentProperty.isPercent ? '%' : 'px';
      switch (currentProperty.property) {
        case 'translate3d':
          var x = currentProperty.x ? currentProperty.x + unit : 0;
          var y = currentProperty.y ? currentProperty.y + unit : 0;
          var z = currentProperty.z ? currentProperty.z + unit : 0;

          // parsedStyle['transform'] ? parsedStyle['transform'] += ' translate3d('+ x +','+ y +','+ z +')' : parsedStyle["transform"] = 'translate3d('+ x +','+ y +','+ z +')';
          if (parsedStyle[0] === 'transform') {
            parsedStyle[1] += ' translate3d(' + x + ',' + y + ',' + z + ')';
          } else {
            parsedStyle[0] = 'transform';
            parsedStyle[1] = 'translate3d(' + x + ',' + y + ',' + z + ')';
          }

          break;
        case 'scale3d':
          var x = currentProperty.x || currentProperty.both ? currentProperty.x || currentProperty.both : 1;
          var y = currentProperty.y || currentProperty.both ? currentProperty.y || currentProperty.both : 1;
          var z = currentProperty.z ? currentProperty.z + unit : 1;

          // parsedStyle["transform"] ?  parsedStyle["transform"] += ' scale3d('+ x +','+ y +','+ z +')' : parsedStyle["transform"] = 'scale3d('+ x +','+ y +','+ z +')'
          if (parsedStyle[0] === 'transform') {
            parsedStyle[1] += ' scale3d(' + x + ',' + y + ',' + z + ')';
          } else {
            parsedStyle[0] = 'transform';
            parsedStyle[1] = 'scale3d(' + x + ',' + y + ',' + z + ')';
          }
          break;
        case 'rotate3d':
          var x = currentProperty.x || currentProperty.both ? currentProperty.x || currentProperty.both : 1;
          // var y = currentProperty.y || currentProperty.both ? currentProperty.y || currentProperty.both : 1;
          // var z = currentProperty.z ? currentProperty.z+'px' : 1;

          // parsedStyle["transform"] = parsedStyle["transform"] = 'rotate('+currentProperty.y+'deg)'
          if (parsedStyle[0] === 'transform') {
            parsedStyle[1] += 'rotate(' + x + 'deg)';
          } else {
            parsedStyle[0] = 'transform';
            parsedStyle[1] = 'rotate(' + x + 'deg)';
          }

          break;
        case 'opacity':
          if (parsedStyle.length > 0) {
            parsedStyle.push('opacity');
            parsedStyle.push(currentProperty.value);
          } else {
            parsedStyle[0] = 'opacity';
            parsedStyle[1] = currentProperty.value;
          }
          break;
      }
    }

    return parsedStyle;
  }

  generateTransition(elem) {
    var transition = [];
    transition[0] = 'transition';
    transition[1] = '';

    // We decided to check final styles value to add proper properties ( also initial state can be set in CSS too)
    for (var i = 0; i < elem.finalStyles.length; i++) {
      var finalStyle = elem.finalStyles[i];
      transition[1] += finalStyle.style[0] + ' ' + finalStyle.duration / 1000 + 's ' + finalStyle.easing + ' ' + finalStyle.delay / 1000 + 's';

      if (i != elem.finalStyles.length - 1) {
        transition[1] += ' , ';
      }
    }

    return transition;
  }

  addEvents() {
    this.handlers.debounce = this.debounce.bind(this);
    this.handlers.resize = this.resize.bind(this);
    this.handlers.run = this.run.bind(this);
    this.handlers.scrollClass = () => this.addScrollingClassHandler();

    if (this.setupListeners.scroll) window.addEventListener('scroll', this.handlers.debounce, { passive: true });
    if (this.setupListeners.resize) window.addEventListener('resize', this.handlers.resize);
  }

  removeEvents() {
    if (this.setupListeners.scroll) window.removeEventListener('scroll', this.handlers.debounce);
    if (this.setupListeners.resize) window.removeEventListener('resize', this.handlers.resize);

    if (this.setupListeners.update) window.cancelAnimationFrame(this.raf);

    this.handlers = {
      run: null,
      debounce: null,
      resize: null
    };
  }

  removeFakeScrollHeight() {
    this.fakeDiv.parentNode.removeChild(this.fakeDiv);
    this.fakeDiv = null;

    this.smoothSection.el.style.position = 'relative';
    this.smoothSection.el.style.width = 'auto';
    this.smoothSection.el.style.transform = '';
  }

  addFakeScrollHeight(value) {
    if (this.fakeDiv === null) {
      this.fakeDiv = document.createElement('div');
      this.fakeDiv.className = 'smooth-fake-scroll';
      this.fakeDiv.style.height = value + 'px';

      this.smoothSection.el.parentNode.insertBefore(this.fakeDiv, this.smoothSection.el.nextSibling);
    } else {
      this.fakeDiv.style.height = value + 'px';
    }

    this.smoothSection.el.style.position = 'fixed';
    this.smoothSection.el.style.width = '100%';
  }

  addFakeHeight(value) {
    this.dom.style.height = value + 'px';
  }

  removeFakeHeight() {
    this.dom.style.height = 'auto';
  }
  scrollTo(value) {
    // TODO ADD COOL SCROLLING AND EASING
  }

  getOffset(el) {
    const bodyRect = this.dom.getBoundingClientRect();
    const elemRect = el.getBoundingClientRect();
    const offset = elemRect.top - bodyRect.top;

    return Math.floor(offset);

    // var yPos = 0

    // while ( el ) {
    //   if ( el.tagName === 'BODY' ) {
    //     // deal with browser quirks with body/window/document and page scroll
    //     var yScroll = el.scrollTop || document.documentElement.scrollTop
    //     yPos += ( el.offsetTop - yScroll + el.clientTop )
    //   }
    //   else {
    //     // for all other non-BODY elements
    //     yPos += ( el.offsetTop - el.scrollTop + el.clientTop )
    //   }
    //   el = el.offsetParent
    // }

    // // return offset
    // return yPos

    // return {
    // 	x: left + scrollX,
    // 	y: top + scrollY
    // };
  }

  // here we receive the actual DOM element and the animation
  getPositionStart(el, animation) {
    if (animation.start === 'in-viewport') {
      // be sure we remove old style
      el.style.webkitTransform = null;
      el.style.mozTransform = null;
      el.style.msTransform = null;
      el.style.opacity = null;

      var offset = this.getOffset(el);
      var elementHeight = el.offsetHeight;
      var windowHeight = this.vars.height;

      var factor = animation.viewFactorStart ? animation.viewFactorStart : 0;

      var positionTop;
      if (isNaN(factor) && factor.indexOf('px') !== -1) {
        positionTop = offset - windowHeight + parseInt(animation.viewFactorStart, 10);
      } else {
        positionTop = offset - windowHeight + elementHeight * factor;
      }

      return positionTop > 0 ? positionTop.toFixed(2) : 0;
    }
    // this comes from parent
    return Math.round(animation.start);
  }

  getPositionEnd(el, animation) {
    if (animation.end === 'in-viewport') {
      // be sure we remove old style
      el.style.webkitTransform = null;
      el.style.mozTransform = null;
      el.style.msTransform = null;
      el.style.opacity = null;

      var offset = this.getOffset(el);
      var elementHeight = el.offsetHeight;
      var windowHeight = this.vars.height;

      var factor = animation.viewFactorEnd ? animation.viewFactorEnd : 0;

      var positionBottom;
      if (isNaN(factor) && factor.indexOf('px') !== -1) {
        positionBottom = offset - windowHeight + parseInt(animation.viewFactorEnd, 10);
      } else {
        positionBottom = offset - windowHeight + elementHeight * factor;
      }

      return positionBottom > this.vars.documentHeight - this.vars.height ? (this.vars.documentHeight - this.vars.height).toFixed(2) : positionBottom.toFixed(2);
    } else if (animation.end === 'out-viewport') {
      // be sure we remove old style
      el.style.webkitTransform = null;
      el.style.mozTransform = null;
      el.style.msTransform = null;
      el.style.oTransform = null;
      el.style.opacity = null;

      var offset = this.getOffset(el);
      var elementHeight = el.offsetHeight;

      var factor = animation.viewFactorEnd ? animation.viewFactorEnd : 0;
      var positionBottom = offset + elementHeight - elementHeight * factor;
      return positionBottom > this.vars.documentHeight - this.vars.height ? (this.vars.documentHeight - this.vars.height).toFixed(2) : positionBottom.toFixed(2);
    }
    // this comes from parent
    return Math.round(animation.end);
  }

  findStart(array) {
    var min = Number.MAX_VALUE,
      a = array.length,
      counter;

    for (counter = 0; counter < a; counter++) {
      if (array[counter].startValue < min) {
        min = array[counter].startValue;
      }
    }

    return min;
  }

  findEnd(array) {
    var max = 0,
      a = array.length,
      counter;

    for (counter = 0; counter < a; counter++) {
      if (array[counter].endValue > max) {
        max = array[counter].endValue;
      }
    }

    return max;
  }

  roundNumber(number, decimals = 2) {
    // NOT PRETTY BUT EFFICIENT
    var divider;
    if (decimals === 1) divider = 10;
    if (decimals === 2) divider = 100;
    if (decimals === 3) divider = 1000;

    return Math.round(number * divider) / divider;
  }

  getDocumentHeight() {
    var body = this.dom,
      html = document.documentElement;

    return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
  }

  // Here we check all element and set their data correctly
  // Mostly usefull to parse viewport relative timeline
  reflow() {
    var end = 0;

    for (var i = 0; i < this.elementsParallaxe.length; i++) {
      var element = this.elementsParallaxe[i];

      for (var j = 0; j < element.animations.length; j++) {
        var animation = element.animations[j];

        // now we check for transform animations array
        if (animation.transform) {
          for (var l = 0; l < animation.transform.length; l++) {
            // start for each transform of the array
            animation.transform[l].startValue = this.getPositionStart(element.el, animation.transform[l]);
            animation.transform[l].endValue = this.getPositionEnd(element.el, animation.transform[l]);
          }
        } else {
          animation.startValue = this.getPositionStart(element.el, animation);
          animation.endValue = this.getPositionEnd(element.el, animation);
        }

        // we build global sequence if there is a timeline of transform
        if (animation.transform) this.setTransformSequence(animation);

        if (animation.endValue > end) end = animation.endValue;
      }
    }

    for (var k = 0; k < this.elementsTrigger.length; k++) {
      let element = this.elementsTrigger[k];

      // here we convert viewport to actual scrolling value if needed

      // TODO IMPROVE THIS FOR TRIGGER
      element.startValue = this.getPositionStart(element.el, element.trigger);

      // we need also to define initial and final values here
      // since we just need to applicate them when we reache trigger Y Value

      // Can be optional if set in CSS
      element.initialStyles = [];

      if (element.trigger.initialValues) {
        for (let i = 0; i < element.trigger.initialValues.length; i++) {
          let value = element.trigger.initialValues[i];
          element.initialStyles.push(this.parseStyle(value.animation));
        }
      }

      element.finalStyles = [];

      if (element.trigger.finalValues) {
        for (let i = 0; i < element.trigger.finalValues.length; i++) {
          let value = element.trigger.finalValues[i];

          let animationObject = {
            delay: value.delay,
            duration: value.duration,
            easing: value.easing,
            style: this.parseStyle(value.animation)
          };
          element.finalStyles.push(animationObject);
        }
      }

      element.transition = this.generateTransition(element);

      //set initial style that we just erased
      if (!element.reset && !element.triggered) {
        for (var i = 0; i < element.initialStyles.length; i++) {
          this.setStyle(element.el, element.initialStyles[i], true);
        }
      }

      // reset egde so initial set style get called again if needed
      element.edge = null;
    }

    // check to initiate first state if needed
    if (this.elementsTrigger.length > 0) this.checkTriggerElements(this.vars.current);

    // Now we computed all start and end of each animation
    // we checked if need to add more scroll to be sure that we can display them all.
    if (this.smoothContainer) {
      var prop = 'height';
      this.vars.bounding = this.smoothSection.el.getBoundingClientRect().height;
      this.addFakeScrollHeight(this.vars.bounding);
    }

    if (end > this.vars.documentHeight) this.addFakeHeight(end);
  }

  resize() {
    this.vars.height = window.innerHeight;
    this.vars.width = window.innerWidth;
    this.vars.documentHeight = this.getDocumentHeight();
    this.reflow();
  }

  enable() {
    this.isDisabled = false;
    this.forceTransformStyle();
    this.run();
    this.resize();
  }

  disable() {
    if (this.fakeDiv) {
      this.fakeDiv.style.height = 0 + 'px';
    }
    this.isDisabled = true;
  }

  destroy() {
    clearTimeout(this.vars.timer);

    if (this.fakeDiv) this.removeFakeScrollHeight();
    this.removeFakeHeight();
    this.removeEvents();

    this.elementsTrigger.length = 0;
    this.elementsTrigger = [];

    this.elementsParallaxe.length = 0;
    this.elementsParallaxe = [];
  }
}

module.exports = Smooth;
