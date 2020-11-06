import Scroll from './Scroll';
import Scrollbar from './ScrollBar';
import { EasingFunctions } from './utils';

/**
 * Smooth main controller.
 *
 * This allows you to create a scroll wrapper for your page
 * and also to add elements to the main scroll logic
 * @constructor
 */

class Smooth {
  constructor(props) {
    this.scrollElement = props.scrollElement;
    this.scrollbarElement = props.scrollbarElement;
    this.scrollOptions = props.scrollOptions;
    this.scrollbarOptions = props.scrollbarOptions;
    this.direction = props.scrollOptions.direction || 'vertical';

    this.elements = [];
    this.sections = [];
    this.frame = -1;
    this.initScroll();
    this.isEnabled = true;
    this.needRounding = false;
  }

  initScroll() {
    if (this.scrollbarElement) {
      this.scrollBar = new Scrollbar(this.scrollbarElement, this.scrollbarOptions);
    }

    this.scroll = new Scroll({
      scrollElement: this.scrollElement,
      scrollbar: this.scrollBar,
      ...this.scrollOptions,
    });
  }

  addElement(element, reflow = true) {
    if (!element.el && element.parallax !== undefined) {
      console.error('DOM element non valid: ' + element);
    }

    if (element.trigger && typeof element.trigger.callback !== 'function') {
      console.error('Trigger callback is not a function', element);
    }

    this.createElement(element);

    if (reflow) this.reflow();
  }

  addElements(elements) {
    // in case we pass a single object here instead of an array
    if (!Array.isArray(elements) && this.isObject(elements)) {
      elements = [elements];
    }

    for (let i = 0; i < elements.length; i++) {
      this.addElement(elements[i], false);
    }

    this.reflow();
  }

  addSections(sections) {
    // in case we pass a single object here instead of an array
    if (!Array.isArray(sections) && this.isObject(sections)) {
      sections = [sections];
    }

    this.sections = sections.map((section) => this.createSection(section));
    this.reflow();
  }

  createElement(element) {
    this.elements.push(element);
  }

  // section Schema
  // TODO: Refactor all schema to be better documented
  createSection(section) {
    return {
      el: section.el,
      section: {
        start: 'in-viewport',
        end: 'out-viewport',
        properties: [['translateY', 0, 0]],
        viewFactorStart: 0,
        viewFactorEnd: 0,
        edge: null,
        done: false,
      },
    };
  }

  start() {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    this.run();
  }

  run() {
    const frame = this.scroll.y;

    if (this.frame !== frame && frame >= 0 && this.isEnabled) {
      let i = 0;
      if (this.frame !== -1) {
        this.needRounding = true;
      }

      for (; i < this.elements.length; i++) {
        let j = 0;
        const currentElement = this.elements[i];
        let activeParallax = [];

        if (currentElement.parallax) {
          for (; j < currentElement.parallax.length; j++) {
            let animation = currentElement.parallax[j];
            // adding <= so first frame can also be unactive if === 0
            let before = frame <= animation.startValue;
            let after = frame > animation.endValue;

            // create a new array to catch all properties related to the same el
            // animation.properties = [];

            // If we are before/after the first/`last frame, set the styles according first/last value.
            if (before || after) {
              // we are at first or last and already setStyle to reach initial/final Value
              if ((before && animation.edge === -1) || (after && animation.edge === 1) || (after && before)) {
                // if (animation.done) continue;
                continue;
              }

              // edge case, in case frame goes from before to after in a single frame
              // TODO: explore done, and also check this for other cases
              if ((animation.edge === -1 && after) || (animation.edge === 1 && before)) {
                animation.done = false;
              }
              animation.edge = before ? -1 : 1;
              // animation.active = true;

              this.setProgress(animation, before ? 0 : 1);
              // this.draw(currentElement);
              activeParallax.push(currentElement);

              // this goes later now
              // animation.done = true;

              continue;
            } else {
              // if (animation.done && animation.edge === 0 && notScrolling) continue;
              if (animation.done && animation.edge === 0) continue;

              animation.edge = 0;
              animation.done = false;
              this.updateElementProgress(animation, frame);

              // this.draw(currentElement);
              activeParallax.push(currentElement);
            }
          }
        }

        if (currentElement.trigger) {
          let animation = currentElement.trigger;
          // adding <= so first frame can also be unactive if === 0
          let before = frame < animation.startValue;
          let after = frame > animation.endValue;

          // create a new array to catch all properties related to the same el
          // animation.properties = [];

          // If we are before/after the first/`last frame, set the styles according first/last value.
          if (before || after) {
            // we are at fisrt or last and already setStyle to reach initial/final Value
            if (
              (before && animation.edge === -1) ||
              (after && animation.edge === 1) ||
              (after && before) ||
              animation.done
            ) {
              // if (animation.done) continue;
              continue;
            }

            animation.edge = before ? -1 : 1;
            animation.callback(before ? -1 : 1, currentElement);

            continue;
          } else {
            // if (animation.done && animation.edge === 0 && notScrolling) continue;
            if (animation.done && animation.edge === 0) continue;
            if (animation.edge !== 0) animation.callback(0, currentElement);
            animation.edge = 0;
            if (animation.repeat === false) animation.done = true;
          }
        }

        if (currentElement.timeline) {
          let animation = currentElement.timeline;
          // adding <= so first frame can also be unactive if === 0
          let before = frame < animation.startValue;
          let after = frame > animation.endValue;

          // create a new array to catch all properties related to the same el
          // animation.properties = [];

          // If we are before/after the first/`last frame, set the styles according first/last value.
          if (before || after) {
            // we are at first or last and already setStyle to reach initial/final Value
            if (
              (before && animation.edge === -1) ||
              (after && animation.edge === 1) ||
              (after && before) ||
              animation.done
            ) {
              // if (animation.done) continue;
              continue;
            }

            animation.edge = before ? -1 : 1;
            const progress = before ? 0 : 1;
            animation.timeline.progress(progress);

            continue;
          } else {
            this.updateElementProgress(animation, frame);
            animation.timeline.progress(animation.progress);

            // animation.timeline.progress(animation.progress);
            animation.edge = 0;
          }
        }

        // TODO: actually at the end i should go trough the state and see if the element need to be drawn!
        if (activeParallax.length > 0) {
          this.draw(currentElement);
        }
      }

      for (let i = 0; i < this.sections.length; i++) {
        const currentSectionElement = this.sections[i];
        const currentSection = this.sections[i].section;

        // adding <= so first frame can also be unactive if === 0
        let before = frame <= currentSection.startValue;
        let after = frame > currentSection.endValue;

        // If we are before/after the first/`last frame, set the styles according first/last value.
        if (before || after) {
          // we are at first or last and already setStyle to reach initial/final Value
          if ((before && currentSection.edge === -1) || (after && currentSection.edge === 1) || (after && before)) {
            // if (animation.done) continue;
            continue;
          }

          // edge case, in case frame goes from before to after in a single frame
          // TODO: explore done, and also check this for other cases
          if ((currentSection.edge === -1 && after) || (currentSection.edge === 1 && before)) {
            currentSection.done = false;
          }

          if ((currentSection.edge !== -1 && before) || (currentSection.edge !== 1 && after)) {
            if (before && frame !== currentSection.startValue) {
              currentSectionElement.el.style.opacity = 0;
              currentSectionElement.el.style.pointerEvents = 'none';
            }
          }

          currentSection.edge = before ? -1 : 1;
          // animation.active = true;
          this.setProgress(currentSection, before ? 0 : 1);
          this.drawSection(currentSectionElement);

          continue;
        } else {
          if (currentSection.done && currentSection.edge === 0) continue;
          if (currentSection.edge !== 0) {
            currentSectionElement.el.style.removeProperty('opacity');
            currentSectionElement.el.style.removeProperty('pointer-events');
          }

          currentSection.edge = 0;
          currentSection.done = false;
          this.updateElementProgress(currentSection, frame);
          this.drawSection(currentSectionElement);
        }
      }
    } else {
      if (this.frame === frame) {
        if (this.needRounding === true) {
          this.needRounding = false;

          for (let i = 0; i < this.elements.length; i++) {
            const currentElement = this.elements[i];

            const activeStyles = [];
            if (currentElement.parallax) {
              for (let j = 0; j < currentElement.parallax.length; j++) {
                const currentParallax = currentElement.parallax[j];
                if (currentParallax.done === false) {
                  for (let k = 0; k < currentParallax.properties.length; k++) {
                    let current = currentParallax.properties[k];
                    const style = this.getStyleValue(current, currentParallax.progress);
                    activeStyles.push(style);
                  }
                }
              }

              if (activeStyles.length > 0) this.applyStyle(currentElement, activeStyles, true);
            }
          }

          for (let i = 0; i < this.sections.length; i++) {
            const element = this.sections[i];
            const section = element.section;
            if (section.done === false) {
              const sectionAnimation = section.properties[0];
              const style = this.getStyleValue(sectionAnimation, section.progress);
              this.applyStyle(element, [style], true);
            }
          }
        }
      }
    }

    this.frame = frame;
    this.raf = window.requestAnimationFrame(() => this.run());
  }

  // this is where the magic happens = the brain
  // get styles and apply them of one element at instant T
  draw(element) {
    // need to go trough all the parallax
    // see if there is any active progress
    // we need to check progress and animationDone somehow
    // when we have it all we need to apply it all at once
    let i = 0;
    const activeStyles = [];
    for (; i < element.parallax.length; i++) {
      const currentParallax = element.parallax[i];
      if (currentParallax.done === false) {
        for (let j = 0; j < currentParallax.properties.length; j++) {
          let current = currentParallax.properties[j];
          const style = this.getStyleValue(current, currentParallax.progress);
          activeStyles.push(style);
        }

        // apply the done attributes here now that the draw call is "async"
        if (
          (currentParallax.progress <= 0 && currentParallax.edge === -1) ||
          (currentParallax.progress >= 1 && currentParallax.edge === 1)
        ) {
          currentParallax.done = true;
        }
      }
    }

    if (activeStyles.length > 0) this.applyStyle(element, activeStyles);
  }

  // this is where the magic happens = the brain
  // get styles and apply them of one element at instant T
  drawSection(sectionElement) {
    const section = sectionElement.section;
    // need to go trough all the parallax
    // see if there is any active progress
    // we need to check progress and animationDone somehow
    // when we have it all we need to apply it all at once
    if (section.done === false) {
      const sectionAnimation = section.properties[0];
      const style = this.getStyleValue(sectionAnimation, section.progress);
      // apply the done attributes here now that the draw call is "async"
      if ((section.progress <= 0 && section.edge === -1) || (section.progress >= 1 && section.edge === 1)) {
        section.done = true;
      }

      this.applyStyle(sectionElement, [style]);
    }
  }

  getStyleValue(property, progress) {
    const type = property[0];
    const start = property[1];
    const end = property[2];

    const value = start + (end - start) * progress;
    return [type, this.roundNumber(value, 3)];
  }

  applyStyle(element, styles, roundValue = false) {
    let opacity = this._getOpacity(styles);
    let transform = this._getTransform(styles, roundValue);

    if (opacity !== null) {
      element.el.style.opacity = opacity;
    }

    let translate;
    let scale;
    let skew;
    let rotate;

    // maybe improve this part to check for empty object, but i feel this is faster.
    if (transform.translate !== undefined) {
      translate = `translate3d(${transform.translate.x ? transform.translate.x : 0}px, ${
        transform.translate.y ? transform.translate.y : 0
      }px, ${transform.translate.z ? transform.translate.z : 0}px)`;
    }

    if (transform.scale !== undefined) {
      scale = `scale3d(${transform.scale.x ? transform.scale.x : 1}, ${transform.scale.y ? transform.scale.y : 1}, 1)`;
    }

    if (transform.rotate !== undefined) {
      rotate = `rotate(${transform.rotate}deg`;
    }

    if (transform.skew !== undefined) {
      skew = `skew(${transform.skew.x ? transform.skew.x : 0}deg, ${transform.skew.y ? transform.skew.y : 0}deg)`;
    }

    const style = `${
      (translate ? translate + ' ' : '') +
      (scale ? scale + ' ' : '') +
      (skew ? skew + ' ' : '') +
      (rotate ? rotate + ' ' : '')
    }`;
    element.el.style.transform = style;
  }

  // Parses the transform values for an element, returning an object with x, y, z, scaleX, scaleY, scaleZ, rotation, rotationX, rotationY, skewX, and skewY properties.
  // TODO : so far if a value is getting applied twice, it's the latest in the array who win. See if i want to do something about this
  _getTransform(styles, roundValue = false) {
    let transform = {};

    for (let i = 0; i < styles.length; i++) {
      let currentStyle = styles[i];
      const styleType = currentStyle[0];
      let styleValue = currentStyle[1];

      if (styleType === 'translateX') {
        styleValue = !roundValue ? currentStyle[1] : Math.round(currentStyle[1]);
        transform.translate ? (transform.translate.x = styleValue) : (transform.translate = { x: styleValue });
      }
      if (styleType === 'translateY') {
        styleValue = !roundValue ? currentStyle[1] : Math.round(currentStyle[1]);
        transform.translate ? (transform.translate.y = styleValue) : (transform.translate = { y: styleValue });
      }
      if (styleType === 'translateZ') {
        styleValue = !roundValue ? currentStyle[1] : Math.round(currentStyle[1]);
        transform.translate ? (transform.translate.z = styleValue) : (transform.translate = { z: styleValue });
      }
      if (styleType === 'scale') {
        transform.scale ? (transform.scale.x = styleValue) : (transform.scale = { x: styleValue });
        transform.scale ? (transform.scale.y = styleValue) : (transform.scale = { y: styleValue });
      }
      if (styleType === 'scaleX') {
        transform.scale ? (transform.scale.x = styleValue) : (transform.scale = { x: styleValue });
      }
      if (styleType === 'scaleY') {
        transform.scale ? (transform.scale.y = styleValue) : (transform.scale = { y: styleValue });
      }
      if (styleType === 'rotate') {
        transform.rotate = styleValue;
      }
      if (styleType === 'skew') {
        transform.skew ? (transform.skew.x = styleValue) : (transform.skew = { x: styleValue });
        transform.skew ? (transform.skew.y = styleValue) : (transform.skew = { y: styleValue });
      }
      if (styleType === 'skewX') {
        transform.skew ? (transform.skew.x = styleValue) : (transform.skew = { x: styleValue });
      }
      if (styleType === 'skewY') {
        transform.skew ? (transform.skew.y = styleValue) : (transform.skew = { y: styleValue });
      }
    }

    return transform;
  }

  // Parses the opacity value for an element, returning an object opacity;
  _getOpacity(styles) {
    let opacity = null;

    for (let i = 0; i < styles.length; i++) {
      if (styles[i][0] === 'opacity') opacity = styles[i][1];
    }
    return opacity;
  }

  updateElementProgress(element, target) {
    let oldProgress = element.progress;
    let progress = Math.min(Math.max((target - element.startValue) / (element.endValue - element.startValue), 0), 1);
    this.setProgress(element, progress);

    return oldProgress === progress;
  }

  setProgress(element, progressValue) {
    let progress = progressValue;
    if (element.ease && EasingFunctions[element.ease]) {
      progress = EasingFunctions[element.ease](progressValue);
    }
    element.progress = progress;
  }

  reflow() {
    let i = 0;
    for (; i < this.elements.length; i++) {
      let j = 0;
      const element = this.elements[i];

      if (element.parallax) {
        for (; j < element.parallax.length; j++) {
          const currentParallax = element.parallax[j];

          currentParallax.startValue = +this.getPosition('start', element.el, currentParallax);
          currentParallax.endValue = +this.getPosition('end', element.el, currentParallax);

          currentParallax.edge = null;
          currentParallax.done = false;
        }
      }

      if (element.trigger) {
        element.trigger.startValue = +this.getPosition('start', element.el, element.trigger);
        element.trigger.endValue = +this.getPosition('end', element.el, element.trigger);

        element.trigger.edge = null;
        element.trigger.done = false;
      }

      if (element.timeline) {
        element.timeline.startValue = +this.getPosition('start', element.el, element.timeline);
        element.timeline.endValue = +this.getPosition('end', element.el, element.timeline);

        element.timeline.edge = null;
        element.timeline.done = false;
      }
    }

    for (let i = 0; i < this.sections.length; i++) {
      const section = this.sections[i];
      const sectionAnimation = this.sections[i].section;
      // update animation
      sectionAnimation.properties[0][2] = -window.innerHeight - section.el.offsetHeight;

      sectionAnimation.edge = null;
      sectionAnimation.done = false;

      sectionAnimation.startValue = +this.getPosition('start', section.el, sectionAnimation);
      sectionAnimation.endValue = +this.getPosition('end', section.el, sectionAnimation);

      if (sectionAnimation.startValue <= 0) {
        sectionAnimation.properties[0][2] = -this.getOffset(section.el) - section.el.offsetHeight;
      }

      if (sectionAnimation.endValue >= this.scroll.maxHeight - 1) {
        const positionEndWithoutBounds = +this.getPosition('end', section.el, sectionAnimation, false);
        const scrollDifference = positionEndWithoutBounds - sectionAnimation.endValue;
        sectionAnimation.properties[0][2] += this.roundNumber(scrollDifference, 2);
      }

      // adding extra 100 pixels up and down when possible
      if (sectionAnimation.startValue > 0) {
        sectionAnimation.startValue -= 100;
        sectionAnimation.properties[0][1] += 100;
      }
      if (sectionAnimation.endValue <= this.scroll.maxHeight - 1) {
        sectionAnimation.endValue += 100;
        sectionAnimation.properties[0][2] -= 100;
      }

      sectionAnimation.properties[0][1] -= sectionAnimation.startValue;
      sectionAnimation.properties[0][2] -= sectionAnimation.startValue;
    }

    this.frame = -1;
  }

  // getOffset(el) {
  // 	const bodyRect = this.scroll.dom.getBoundingClientRect();

  // 	el.style.webkitTransform = null;
  // 	el.style.mozTransform = null;
  // 	el.style.msTransform = null;
  // 	el.style.transform = null;
  // 	const elemRect = el.getBoundingClientRect();

  // 	let offset = elemRect.top - bodyRect.top;
  // 	if (this.direction === 'horizontal') {
  // 		offset = elemRect.left - bodyRect.left;
  // 	}

  // 	return Math.floor(offset);
  // }

  getOffset(element) {
    let el = element;
    // let offsetLeft = 0;
    let offsetTop = 0;

    do {
      // offsetLeft += el.offsetLeft;
      offsetTop += el.offsetTop;

      el = el.offsetParent;
    } while (el);

    return Math.floor(offsetTop);
  }

  getPosition(coordinates, el, animation, useBounds = true) {
    // check if the animation.start or animation.end is using the `viewport` keyword instead of absolute value
    const viewportKey = animation[coordinates] || false;
    if (viewportKey === 'in-viewport' || viewportKey === 'out-viewport') {
      return this.getPositionBasedOnViewport(coordinates, el, animation, useBounds);
    }

    // return the absolute position value coming from parent
    // TODO: add viewFactor here too
    const positionValue = coordinates === 'start' ? animation.start : animation.end;
    return this.roundNumber(positionValue, 2);
  }

  getPositionBasedOnViewport(coordinates, el, animation, useBounds = true) {
    // be sure we remove old style
    el.style.webkitTransform = null;
    el.style.mozTransform = null;
    el.style.msTransform = null;
    el.style.transform = null;

    const elementOffset = animation.offsetParent || el;
    const offset = this.getOffset(elementOffset);

    let elementHeight;
    let windowHeight;
    if (this.direction === 'horizontal') {
      elementHeight = el.offsetWidth;
      windowHeight = window.innerWidth;
    } else {
      elementHeight = el.offsetHeight;
      windowHeight = window.innerHeight;
    }

    const factor =
      coordinates === 'start'
        ? (animation.viewFactorStart && animation.viewFactorStart) || 0
        : (animation.viewFactorEnd && animation.viewFactorEnd) || 0;

    const viewportKey = animation[coordinates];
    let positionValue;
    if (viewportKey === 'in-viewport') {
      positionValue = offset - windowHeight;
    } else if (viewportKey === 'out-viewport') {
      positionValue = offset + elementHeight;
    }

    // viewFactor is a pixel value
    if (isNaN(factor) && factor.indexOf('px') !== -1) {
      positionValue = positionValue + parseInt(factor, 10);
    } else {
      // viewFactor is a ratio of the elementHeight
      positionValue += elementHeight * factor;
    }

    return useBounds ? this.getPositionInBounds(positionValue, windowHeight) : this.roundNumber(positionValue, 2);
  }

  getPositionInBounds(positionValue, windowHeight) {
    if (positionValue <= 0) return 0;

    if (positionValue > this.scroll.height - windowHeight) {
      return this.roundNumber(this.scroll.height - windowHeight, 2);
    }

    return this.roundNumber(positionValue, 2);
  }

  reset(elements, sections = []) {
    this.elements = [];
    this.sections = [];

    for (let i = 0; i < elements.length; i++) {
      let current = elements[i];
      this.addElement(current, false);
    }

    if (sections.length > 0) {
      this.sections = sections.map((section) => this.createSection(section));
    }
  }

  disable() {
    this.isEnabled = false;
    this.scroll.enabled = false;
  }

  enable() {
    this.isEnabled = true;
    this.scroll.enabled = true;
    this.run();
  }

  scrollTo(target, direct) {
    this.scroll.setTarget(target, direct);
  }

  resize(target = false) {
    if (this.scroll) this.scroll.resize(target);
    this.reflow();
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);
    this.raf = null;

    this.elements.forEach((scrollElement) => {
      if (scrollElement.parallax) {
        scrollElement.parallax.forEach((parallax) => {
          parallax.properties.forEach((property) => {
            if (property === 'opacity') {
              scrollElement.el.style.removeProperty('opacity');
            } else {
              scrollElement.el.style.removeProperty('transform');
            }
          });
        });
      }
    });
    if (this.scroll) this.scroll.destroy();
  }

  roundNumber(number, decimals = 2) {
    // NOT PRETTY BUT EFFICIENT
    let divider;
    if (decimals === 1) divider = 10;
    if (decimals === 2) divider = 100;
    if (decimals === 3) divider = 1000;

    return Math.round(number * divider) / divider;
  }

  isObject(value) {
    return value && typeof value === 'object' && value.constructor === Object;
  }

  getVisibleSections() {
    const y = this.scroll.target;
    const visibleSections = [];
    this.sections.forEach((section) => {
      const { startValue, endValue } = section.section;
      if (y >= startValue && y <= endValue) {
        visibleSections.push(section);
      }
    });

    return visibleSections;
  }
}

export default Smooth;
