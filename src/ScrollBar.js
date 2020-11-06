import { supportsPassiveEvents } from './utils';

class ScrollBar {
  set percent(percentValue) {
    this._percent = percentValue;
    if (this.scrollbarBCR) {
      this.position = this.getPositionFromPercent(this._percent);
    }
  }

  get percent() {
    return this._percent;
  }

  constructor(
    container,
    {
      orientation = 'vertical',
      minSize = 50,
      fade = true,
      fadeTime = 1200,
      className = 'scrollbar-thumb',
      updateScrollTarget = null,
    }
  ) {
    this.containerEl = container;
    this.direction = orientation;

    this.minSize = minSize;
    this.fade = fade;
    this.fadeTime = fadeTime;

    this.scrollbarEl = document.createElement('span');
    this.scrollbarEl.className = className;

    this._percent = 0;
    this.position = 0;
    this.oldPosition = 0;

    this.isScrollbarDragging = false;

    container.appendChild(this.scrollbarEl);

    // handlers
    this.handlers = {};
    this.handlers.onScrollbarDrag = (e) => this.onScrollbarDrag(e);
    this.handlers.onScrollbarDragStart = (e) => this.onScrollbarDragStart(e);
    this.handlers.onScrollbarDragEnd = (e) => this.onScrollbarDragEnd(e);
    this.handlers.onContainerPointerDown = (e) => this.onContainerPointerDown(e);

    // callbacks
    this.updateScrollTarget = updateScrollTarget;

    this.supportPassive = supportsPassiveEvents();
    this.bindEvents();
  }

  bindEvents() {
    this.containerEl.addEventListener('pointerdown', (e) => this.onContainerPointerDown(e));

    const passiveEvents = {
      passive: this.supportPassive,
    };

    this.scrollbarEl.addEventListener('mousedown', this.handlers.onScrollbarDragStart);
    this.scrollbarEl.addEventListener('touchstart', this.handlers.onScrollbarDragStart, passiveEvents);
  }

  unBindEvents() {
    this.containerEl.removeEventListener('pointerdown', (e) => this.onContainerPointerDown(e));

    this.scrollbarEl.removeEventListener('mousedown', this.onDragStart);
    this.scrollbarEl.removeEventListener('touchstart', this.onDragStart);
  }

  update() {
    if (this.oldPosition !== this.position) {
      this.updateScrollbarElement();

      // this happens if we are dragging the cursor
      if (this.isScrollbarDragging) {
        if (this.updateScrollTarget) this.updateScrollTarget(this.getScrollPercentFromPosition(this.position));
      }
    }
    this.oldPosition = this.position;
  }

  getScrollPercentFromPosition(position) {
    const constraintsRect = this.direction === 'vertical' ? this.scrollbarBCR.height : this.scrollbarBCR.width;
    return position / (constraintsRect - this.scrollbarSize);
  }

  getPositionFromPercent(percent) {
    const totalDistance =
      (this.direction === 'vertical' ? this.scrollbarBCR.height : this.scrollbarBCR.width) - this.scrollbarSize;
    return percent * totalDistance;
  }

  showThumb() {
    this.isThumbHidden = false;
    this.scrollbarEl.style.opacity = 1;
  }

  hideThumb() {
    this.isThumbHidden = true;
    this.scrollbarEl.style.opacity = 0;
  }

  updateScrollbarElement() {
    if (this.fade) {
      if (this.isThumbHidden) {
        this.showThumb();
      }
      if (this.fadeTimer) {
        clearTimeout(this.fadeTimer);
      }

      this.fadeTimer = setTimeout(() => {
        this.hideThumb();
      }, this.fadeTime);
    }

    if (this.direction === 'vertical') {
      this.scrollbarEl.style.transform = `translate3d(0,${this.position}px,0)`;
    } else {
      this.scrollbarEl.style.transform = `translate3d(${this.position}px,0,0)`;
    }
  }

  onContainerPointerDown(e) {
    const touch = e.originalEvent && e.originalEvent.touches && e.originalEvent.touches[0];
    e = touch || e;

    // don't update scroll target here since the user is also dragging
    if (e.target.classList.contains(this.scrollbarEl.className)) {
      return false;
    }

    const nextPercent =
      this.direction === 'vertical' ? e.clientY / this.scrollbarBCR.height : e.clientX / this.scrollbarBCR.width;
    this.updateScrollTarget(nextPercent);
  }

  onScrollbarDragStart(e) {
    // prevent native drag event
    e.preventDefault();
    const touch = e.originalEvent && e.originalEvent.touches && e.originalEvent.touches[0];
    e = touch || e;

    this.isScrollbarDragging = true;

    const offsetDrag =
      this.direction === 'vertical' ? e.clientY - this.scrollbarBCR.top : e.clientX - this.scrollbarBCR.left;
    this.initialDragPosition = offsetDrag - this.position;

    // move the scrollbarThumb
    this.moveScrollbar(e);

    const passiveEvents = {
      passive: this.supportPassive,
    };

    window.addEventListener('mouseup', this.handlers.onScrollbarDragEnd, passiveEvents);
    window.addEventListener('touchend', this.handlers.onScrollbarDragEnd, passiveEvents);
    window.addEventListener('mousemove', this.handlers.onScrollbarDrag, passiveEvents);
    window.addEventListener('touchmove', this.handlers.onScrollbarDrag, passiveEvents);
  }

  // moving the scroll bar thumb
  onScrollbarDrag(e) {
    const touch = e.originalEvent && e.originalEvent.touches && e.originalEvent.touches[0];
    e = touch || e;

    this.moveScrollbar(e);
  }

  moveScrollbar(e) {
    const offsetTarget =
      this.direction === 'vertical' ? e.clientY - this.scrollbarBCR.top : e.clientX - this.scrollbarBCR.left;

    const nextPosition = offsetTarget - this.initialDragPosition;
    this.position = this.applyConstrains(nextPosition);
  }

  applyConstrains(nextPosition) {
    if (nextPosition < 0) {
      return 0;
    } else {
      const bounds =
        (this.direction === 'vertical' ? this.scrollbarBCR.height : this.scrollbarBCR.width) - this.scrollbarSize;
      if (nextPosition > bounds) return bounds;
    }

    return nextPosition;
  }

  onScrollbarDragEnd() {
    this.isScrollbarDragging = false;
    window.removeEventListener('mouseup', this.handlers.onScrollbarDragEnd);
    window.removeEventListener('touchend', this.handlers.onScrollbarDragEnd);
    window.removeEventListener('mousemove', this.handlers.onScrollbarDrag);
    window.removeEventListener('touchmove', this.handlers.onScrollbarDrag);
  }

  // function to stop the dragging
  // usually called when user hold drag + trigger a scroll event
  stopDrag() {
    this.onScrollbarDragEnd();
  }

  resize(scrollHeight) {
    if (scrollHeight === undefined) {
      throw new Error('scrollHeight target need to be defined');
    }

    this.scrollbarBCR = this.scrollbarEl.parentNode.getBoundingClientRect();
    this.scrollbarSize =
      this.direction === 'vertical'
        ? (this.scrollbarBCR.height / scrollHeight) * this.scrollbarBCR.height
        : (this.scrollbarBCR.width / scrollHeight) * this.scrollbarBCR.width;

    if (this.scrollbarSize < this.minSize) {
      this.scrollbarSize = this.minSize;
    }
    this.scrollbarEl.style[this.direction === 'vertical' ? 'height' : 'width'] = this.scrollbarSize + 'px';
  }

  destroy() {
    this.unBindEvents();
  }
}

export default ScrollBar;
