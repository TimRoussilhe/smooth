(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Smooth", [], factory);
	else if(typeof exports === 'object')
		exports["Smooth"] = factory();
	else
		root["Smooth"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
			value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var raf = __webpack_require__(1);
	var prefix = __webpack_require__(4);
	var transform = prefix.dash('transform');
	var transition = prefix.dash('transition');
	
	/*!
	 * smooth core
	 *
	 * Tim Roussilhe
	 *
	 * Free to use under terms of MIT license
	 */
	
	/*!
	
	 */
	
	var Smooth = function () {
			/*
	   * Global api.
	   */
	
			function Smooth() {
					_classCallCheck(this, Smooth);
	
					this.VERSION = '0.0.1';
	
					var opt = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
					this.handlers = {
							run: null,
							debounce: null,
							resize: null
					};
	
					this.perfs = {
							now: null,
							last: null
					};
	
					this.vars = {
							preload: opt.preload || true,
							current: 0,
							target: 0,
							height: 0,
							documentHeight: 0,
							bounding: 0,
							timer: null,
							ticking: false
					};
	
					//pony trick here, we remove easing on frist frame to avoid flash or blink or big scroll
					this.firstFrame = true;
	
					this.ticketScroll = false;
	
					this.smoothContainer = opt.smoothContainer;
	
					if (this.smoothContainer) {
	
							this.smoothSection = {
									el: opt.smoothSection ? opt.smoothSection : document.body,
									animation: {
											transform: [{
													transformType: 'translate3d',
													axis: 'y',
													ease: 0.15,
													initialValue: 0
											}]
									}
							};
					}
	
					//lister is use for smooth scrolling container
					this.dom = document.body;
					this.fakeDiv = null;
	
					this.elementsParallaxe = [];
					this.elementsTrigger = [];
	
					this.resize();
			}
	
			_createClass(Smooth, [{
					key: 'init',
					value: function init() {
	
							this.vars.preload && this.preloadImages();
	
							this.addEvents();
	
							!this.vars.preload && this.resize();
					}
			}, {
					key: 'start',
					value: function start() {
							this.reflow();
							this.raf = raf(this.handlers.run);
					}
			}, {
					key: 'addElement',
					value: function addElement(element) {
	
							if (element.animations !== undefined) {
	
									this.elementsParallaxe.push(element);
							}
	
							if (element.trigger !== undefined) {
	
									element.triggered = false;
									this.elementsTrigger.push(element);
							}
					}
			}, {
					key: 'addElements',
					value: function addElements(elements) {
	
							for (var i = 0; i < elements.length; i++) {
	
									this.addElement(elements[i]);
							}
					}
					//In case we wanna add dynamic value from the instaciation of the parent resize
	
			}, {
					key: 'resetElements',
					value: function resetElements(elements) {
	
							this.elementsParallaxe = [];
							this.elementsTrigger = [];
	
							this.addElements(elements);
							this.reflow();
					}
					//If an object as several transform we need extra work ( thanks you css !)
	
			}, {
					key: 'setTransformSequence',
					value: function setTransformSequence(animation) {
	
							animation.startValue = this.findStart(animation.transform);
							animation.endValue = this.findEnd(animation.transform);
					}
			}, {
					key: 'preloadImages',
					value: function preloadImages() {
	
							var images = Array.prototype.slice.call(this.dom.querySelectorAll('img'), 0);
	
							images.forEach(function (image) {
	
									var img = new Image();
	
									img.onload = function (el) {
	
											images.splice(images.indexOf(image), 1);
											images.length === 0 && this.resize();
									}.bind(this);
	
									img.src = image.getAttribute('src');
							}.bind(this));
					}
			}, {
					key: 'debounce',
					value: function debounce() {
	
							this.ticketScroll = true;
					}
			}, {
					key: 'addScrollingClass',
					value: function addScrollingClass() {
	
							clearTimeout(this.vars.timer);
	
							if (!this.vars.ticking) {
									this.vars.ticking = true;
	
									this.dom.classList.add('is-scrolling');
							}
	
							this.vars.timer = setTimeout(function () {
									this.vars.ticking = false;
	
									this.dom.classList.remove('is-scrolling');
							}.bind(this), 200);
					}
			}, {
					key: 'run',
					value: function run() {
	
							if (this.ticketScroll) {
	
									this.vars.target = window.scrollY || window.pageYOffset;
									this.addScrollingClass();
									this.ticketScroll = false;
							}
	
							this.vars.current = this.vars.target;
							this.vars.current < .1 && (this.vars.current = 0);
	
							console.log('this.vars.current', this.vars.current);
	
							// If we are having a global smooth container
							// Animate it following scroll position of dom
							if (this.smoothContainer) this.updatesmoothContainer(this.vars.current === this.vars.old);
	
							//Still not sure why i pass frame here since we register this globaly...
							this.updateParallaxeElements(this.vars.current, this.vars.current === this.vars.old);
							if (this.vars.current != this.vars.old) this.checkTriggerElements(this.vars.current);
	
							this.vars.old = this.vars.current;
	
							//this.rAF = requestAnimationFrame(this.run.bind(this));
							this.raf = raf(this.handlers.run);
					}
			}, {
					key: 'updatesmoothContainer',
					value: function updatesmoothContainer(notScrolling) {
	
							if (!this.smoothSection.animation.transform[0].done || !notScrolling) {
	
									this.smoothSection.animation.properties = [];
									//so far we only allow one transform on the body (x or y)
									this.computeTransformStyle(this.smoothSection.animation, this.smoothSection.animation.transform[0], -this.vars.current);
	
									this.setStyle(this.smoothSection.el, this.smoothSection.animation.properties);
							}
					}
					/**
	    * Update all Elements
	    * Edge Management
	    */
	
			}, {
					key: 'updateParallaxeElements',
					value: function updateParallaxeElements(frame, notScrolling) {
	
							var index = 0;
							for (; index < this.elementsParallaxe.length; index++) {
	
									var element = this.elementsParallaxe[index];
									var properties = [];
	
									for (var j = 0; j < element.animations.length; j++) {
	
											var animation = element.animations[j];
											var before = frame < animation.startValue;
											var after = frame > animation.endValue;
	
											//create a new array to catch all properties related to the same el
											animation.properties = [];
	
											//If we are before/after the first/`last frame, set the styles according first/last value.
											if (before || after) {
	
													//we are at firt or last and allready setStyle to reach initial/final Value
													if (before && animation.edge === -1 || after && animation.edge === 1) {
															if (animation.done) continue;
													}
	
													animation.edge = before ? -1 : 1;
	
													if (animation.transform) {
	
															//We need to check that all subAnimation are done so we use this as a flag
															var transformDone = true;
	
															for (var indexTransform = 0; indexTransform < animation.transform.length; indexTransform++) {
	
																	var transformAnimation = animation.transform[indexTransform];
																	this.computeTransformStyle(animation, transformAnimation, animation.edge === -1 ? transformAnimation.initialValue : transformAnimation.finalValue);
																	if (transformAnimation.done === false) transformDone = false;
															}
															//no we check the flag
															// if one of the subAnimation is not done the flag will be false
															// // if all done then the main animation is done
															if (transformDone === true) {
	
																	animation.done = true;
															} else {
	
																	animation.done = false;
															}
													} else {
	
															this.computeClassicStyle(animation, animation.edge === -1 ? animation.initialValue : animation.finalValue);
													}
	
													//now we have array of properties we gonna parse them and apply them
													if (animation.properties.length > 0) this.setStyle(element.el, animation.properties);
	
													continue;
											} else {
	
													if (animation.done && animation.edge === 0 && notScrolling) continue;
													animation.edge = 0;
	
													//We need to check that all subAnimation are done so we use this as a flag
													var transformDone = true;
	
													if (animation.transform) {
	
															for (var indexTransform = 0; indexTransform < animation.transform.length; indexTransform++) {
	
																	var transformAnimation = animation.transform[indexTransform];
	
																	//Cap progress between 0 and 1 ( Mostly because of transform sequences )
																	var progress = Math.min(Math.max((frame - transformAnimation.startValue) / (transformAnimation.endValue - transformAnimation.startValue), 0), 1);
	
																	//TODO ADD EASING
																	// progress = left.props[key].easing(progress);
																	var currentValue = transformAnimation.initialValue + (transformAnimation.finalValue - transformAnimation.initialValue) * progress;
																	this.computeTransformStyle(animation, transformAnimation, currentValue);
																	if (transformAnimation.done === false) transformDone = false;
															}
															//no we check the flag
															// if one of the subAnimation is not done the flag will be false
															// if all done then the main animation is done
															if (transformDone === true) {
																	animation.done = true;
															} else {
																	animation.done = false;
															}
													} else {
	
															var progress = (frame - animation.startValue) / (animation.endValue - animation.startValue);
															var currentValue = animation.initialValue + (animation.finalValue - animation.initialValue) * progress;
	
															this.computeClassicStyle(animation, currentValue);
													}
	
													// now we have array of properties we gonna parse them and apply them
													// we are doing this one per animation not once per element
													if (animation.properties.length > 0) this.setStyle(element.el, animation.properties);
											}
									}
							}
					}
			}, {
					key: 'checkTriggerElements',
					value: function checkTriggerElements(frame) {
	
							var index = 0;
							for (; index < this.elementsTrigger.length; index++) {
	
									var element = this.elementsTrigger[index];
									var before = frame < element.startValue;
	
									//add css transition and trigger first position
									if (!element.isInit) {
	
											this.setStyle(element.el, element.transition, true);
											element.isInit = true;
									}
	
									// So far we are not using after for the trigger
									if (before) {
	
											if (before && element.edge === -1) continue;
	
											element.edge = before ? -1 : 1;
	
											// if we are going back before trigger point
											// triggered = false
											if (element.trigger.reset) {
	
													for (var i = 0; i < element.initialStyles.length; i++) {
															this.setStyle(element.el, element.initialStyles[i], true);
													}
	
													element.triggered = false;
											}
									} else if (!element.triggered) {
	
											element.edge = 0;
											element.triggered = true;
	
											for (var i = 0; i < element.finalStyles.length; i++) {
													this.setStyle(element.el, element.finalStyles[i].style, true);
											}
									}
							}
					}
					//OUTPUT
	
			}, {
					key: 'computeTransformStyle',
					value: function computeTransformStyle(animation, tfAnimation, value) {
	
							//We calculate smooth value here if easing
							//here means first fucking frame
							if (tfAnimation.smoothValue === undefined) {
									tfAnimation.smoothValue = tfAnimation.initialValue;
									tfAnimation.smoothValue += value - tfAnimation.smoothValue;
							} else {
									tfAnimation.smoothValue += (value - tfAnimation.smoothValue) * tfAnimation.ease;
							}
	
							var roundedValue = Math.round(tfAnimation.smoothValue * 1000) / 1000;
	
							// checking if animation of transform value is done
							// check if animation is done comparing the final value to the rounded one
							// we need to round the final value too to be able to compate to roundedValue
							if (Math.round(value * 1000) / 1000 === roundedValue) tfAnimation.done = true;else tfAnimation.done = false;
	
							//We check if there is allready a transform in the main animation
							if (animation.properties) {
	
									for (var i = 0; i < animation.properties.length; i++) {
	
											//Case for transform
											if (animation.properties[i].property === tfAnimation.transformType) {
	
													animation.properties[i][tfAnimation.axis] = roundedValue;
	
													return false;
											}
									}
							}
	
							//If there is no transform we create the object
							var style = {
									property: tfAnimation.transformType
							};
	
							style[tfAnimation.axis] = roundedValue;
	
							//push value to parent animation
							animation.properties.push(style);
					}
			}, {
					key: 'computeClassicStyle',
					value: function computeClassicStyle(animation, value) {
	
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
	
							//check if animation is done comparing the final value to the rounded one
							// we need to round the final value too to be able to compate to roundedValue
							if (Math.round(value * 100) / 100 === roundedValue) animation.done = true;else animation.done = false;
	
							//save property into animation object
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
	
			}, {
					key: 'setStyle',
					value: function setStyle(el, style, noParsing) {
	
							if (!noParsing) var style = this.parseStyle(style);
	
							if (style[0] === 'transform') {
									el.style[transform] = style[1];
							} else if (style[0] === 'opacity') {
									el.style.opacity = style[1];
							} else if (style[0] === 'transition') {
									el.style[transition] = style[1];
							}
					}
	
					// return an object containing all style
					// ====>
					// Example Object {transform: "translate3d(66.5px,66.5px,0) scale3d(1.06,1.06,1)"}
					// ====>
	
			}, {
					key: 'parseStyle',
					value: function parseStyle(properties) {
							// could use regexpt and a pattern here but want to avoid replace inside raf
							// so we chose switch and string concatenation
							// also useful if we want to add more control here such as translate or translate3d... background color calculcation etc
							// https://jsperf.com/string-concat-vs-regex-replace/2
	
							//TODO Centralize Animations when severals animations and at the end set all style
							// AND return all
							var parsedStyle = [];
	
							for (var i = 0; i < properties.length; i++) {
	
									var currentProperty = properties[i];
									switch (currentProperty.property) {
	
											case 'translate3d':
	
													var x = currentProperty.x ? currentProperty.x + 'px' : 0;
													var y = currentProperty.y ? currentProperty.y + 'px' : 0;
													var z = currentProperty.z ? currentProperty.z + 'px' : 0;
	
													//parsedStyle['transform'] ? parsedStyle['transform'] += ' translate3d('+ x +','+ y +','+ z +')' : parsedStyle["transform"] = 'translate3d('+ x +','+ y +','+ z +')';
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
													var z = currentProperty.z ? currentProperty.z + 'px' : 1;
	
													//parsedStyle["transform"] ?  parsedStyle["transform"] += ' scale3d('+ x +','+ y +','+ z +')' : parsedStyle["transform"] = 'scale3d('+ x +','+ y +','+ z +')'
													if (parsedStyle[0] === 'transform') {
															parsedStyle[1] += ' scale3d(' + x + ',' + y + ',' + z + ')';
													} else {
															parsedStyle[0] = 'transform';
															parsedStyle[1] = 'scale3d(' + x + ',' + y + ',' + z + ')';
													}
													break;
											case 'rotate3d':
	
													var x = currentProperty.x || currentProperty.both ? currentProperty.x || currentProperty.both : 1;
													var y = currentProperty.y || currentProperty.both ? currentProperty.y || currentProperty.both : 1;
													var z = currentProperty.z ? currentProperty.z + 'px' : 1;
	
													//parsedStyle["transform"] = parsedStyle["transform"] = 'rotate('+currentProperty.y+'deg)'
													if (parsedStyle[0] === 'transform') {
															parsedStyle[1] += ' rotate(' + x + ',' + y + ',' + z + ')';
													} else {
															parsedStyle[0] = 'transform';
															parsedStyle[1] = 'rotate(' + x + ',' + y + ',' + z + ')';
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
			}, {
					key: 'generateTransition',
					value: function generateTransition(elem) {
	
							var transition = [];
							transition[0] = 'transition';
							transition[1] = '';
	
							//We decided to check final styles value to add proper properties ( also initial state can be set in CSS too)
							for (var i = 0; i < elem.finalStyles.length; i++) {
	
									var finalStyle = elem.finalStyles[i];
									transition[1] += finalStyle.style[0] + ' ' + finalStyle.duration / 1000 + 's ' + finalStyle.easing + ' ' + finalStyle.delay / 1000 + 's';
	
									if (i != elem.finalStyles.length - 1) {
											transition[1] += ' , ';
									}
							}
	
							return transition;
					}
			}, {
					key: 'addEvents',
					value: function addEvents() {
	
							console.log('addEvents this.handlers', this.handlers);
	
							this.handlers.debounce = this.debounce.bind(this);
							//this.handlers.resize     = this.resize.bind(this);
							this.handlers.run = this.run.bind(this);
	
							window.addEventListener('scroll', this.handlers.debounce);
							//window.addEventListener('resize', this.handlers.resize);
					}
			}, {
					key: 'removeEvents',
					value: function removeEvents() {
	
							console.log('removeEvents this.handlers', this.handlers);
	
							window.removeEventListener('scroll', this.handlers.debounce);
							//window.removeEventListener('resize', this.handlers.resize);
	
							raf.cancel(this.raf);
	
							this.handlers = {
									run: null,
									debounce: null,
									resize: null
							};
					}
			}, {
					key: 'removeFakeScrollHeight',
					value: function removeFakeScrollHeight() {
	
							this.fakeDiv.parentNode.removeChild(this.fakeDiv);
							this.fakeDiv = null;
	
							this.smoothSection.el.style.position = "relative";
							this.smoothSection.el.style.width = "auto";
							this.smoothSection.el.style.transform = "";
					}
			}, {
					key: 'addFakeScrollHeight',
					value: function addFakeScrollHeight(value) {
	
							if (this.fakeDiv === null) {
	
									this.fakeDiv = document.createElement("div");
									this.fakeDiv.className = "smooth-fake-scroll";
									this.fakeDiv.style.height = value + "px";
	
									this.smoothSection.el.parentNode.insertBefore(this.fakeDiv, this.smoothSection.el.nextSibling);
							} else {
	
									this.fakeDiv.style.height = value + "px";
							}
	
							this.smoothSection.el.style.position = "fixed";
							this.smoothSection.el.style.width = "100%";
					}
			}, {
					key: 'addFakeHeight',
					value: function addFakeHeight(value) {
	
							this.dom.style.height = value + 'px';
					}
			}, {
					key: 'removeFakeHeight',
					value: function removeFakeHeight() {
	
							this.dom.style.height = 'auto';
					}
			}, {
					key: 'scrollTo',
					value: function scrollTo(value) {
	
							//TODO ADD COOL SCROLLING AND EASING
	
					}
			}, {
					key: 'getOffset',
					value: function getOffset(el) {
	
							var bodyRect = this.dom.getBoundingClientRect(),
							    elemRect = el.getBoundingClientRect(),
							    offset = elemRect.top - bodyRect.top;
	
							return offset;
					}
	
					//here we receive the actual DOM element and the animation
	
			}, {
					key: 'getPositionStart',
					value: function getPositionStart(el, animation) {
	
							if (animation.start === 'in-viewport') {
	
									var offset = this.getOffset(el);
									var elementHeight = el.offsetHeight;
									var windowHeight = this.vars.height;
	
									var factor = animation.viewFactorStart ? animation.viewFactorStart : 0;
	
									if (isNaN(factor) && factor.indexOf('px') !== -1) {
											var positionTop = offset - windowHeight + parseInt(animation.viewFactorStart, 10);
									} else {
											var positionTop = offset - windowHeight + elementHeight * factor;
									}
	
									return positionTop > 0 ? positionTop : 0;
							} else {
	
									return animation.start;
							}
					}
			}, {
					key: 'getPositionEnd',
					value: function getPositionEnd(el, animation) {
	
							if (animation.end === 'out-viewport') {
	
									var offset = this.getOffset(el);
									var elementHeight = el.offsetHeight;
									var factor = animation.viewFactorEnd ? animation.viewFactorEnd : 0;
	
									var positionBottom = offset + elementHeight - elementHeight * factor;
	
									return positionBottom > this.vars.documentHeight - this.vars.height ? this.vars.documentHeight - this.vars.height : positionBottom;
							} else {
	
									return animation.end;
							}
					}
			}, {
					key: 'findStart',
					value: function findStart(array) {
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
			}, {
					key: 'findEnd',
					value: function findEnd(array) {
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
			}, {
					key: 'getDocumentHeight',
					value: function getDocumentHeight() {
	
							var body = this.dom,
							    html = document.documentElement;
	
							return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
					}
	
					//Here we check all element and set their data correctly
					//Mostly usefull to parse viewport relative timeline
	
			}, {
					key: 'reflow',
					value: function reflow() {
	
							var end = 0;
	
							for (var i = 0; i < this.elementsParallaxe.length; i++) {
	
									var element = this.elementsParallaxe[i];
	
									for (var j = 0; j < element.animations.length; j++) {
	
											var animation = element.animations[j];
	
											//now we check for transform animations array
											if (animation.transform) {
	
													for (var l = 0; l < animation.transform.length; l++) {
	
															//start for each transfor of the array
															animation.transform[l].startValue = this.getPositionStart(element.el, animation.transform[l]);
															animation.transform[l].endValue = this.getPositionEnd(element.el, animation.transform[l]);
													}
											} else {
	
													animation.startValue = this.getPositionStart(element.el, animation);
													animation.endValue = this.getPositionEnd(element.el, animation);
											}
	
											//we build global sequence if there is a timeline of transform
											if (animation.transform) this.setTransformSequence(animation);
	
											if (animation.endValue > end) end = animation.endValue;
									}
							}
	
							for (var k = 0; k < this.elementsTrigger.length; k++) {
	
									var element = this.elementsTrigger[k];
	
									//here we convert viewport to actual scrolling value if needed
	
									//TODO IMPROVE THIS FOR TRIGGER
									element.startValue = this.getPositionStart(element.el, element.trigger);
	
									//we need also to define initial and final values here
									//since we just need to applicate them when we reache trigger Y Value
	
									//Can be optional if set in CSS
									if (element.trigger.initialValues) {
											element.initialStyles = [];
	
											for (var i = 0; i < element.trigger.initialValues.length; i++) {
	
													var value = element.trigger.initialValues[i];
	
													element.initialStyles.push(this.parseStyle(value.animation));
											}
									}
	
									//those are required
									element.finalStyles = [];
	
									for (var i = 0; i < element.trigger.finalValues.length; i++) {
	
											var value = element.trigger.finalValues[i];
	
											var animationObject = {
													delay: value.delay,
													duration: value.duration,
													easing: value.easing,
													style: this.parseStyle(value.animation)
											};
											element.finalStyles.push(animationObject);
									}
	
									element.transition = this.generateTransition(element);
							}
	
							//check to initiate first state if needed
							if (this.elementsTrigger.length > 0) this.checkTriggerElements(this.vars.current);
	
							// Now we computed all start and end of each animation
							// we checked if need to add more scroll to be sure that we can display them all.
							if (this.smoothContainer) {
	
									var prop = 'height';
									this.vars.bounding = this.smoothSection.el.getBoundingClientRect().height;
									this.addFakeScrollHeight(this.vars.bounding);
							}
	
							if (end > this.vars.documentHeight) this.addFakeHeight(end + this.vars.documentHeight);
					}
			}, {
					key: 'resize',
					value: function resize() {
	
							this.vars.height = document.documentElement.clientHeight || window.innerHeight;
							this.vars.width = document.documentElement.clientWidth || window.innerWidth;
							this.vars.documentHeight = this.getDocumentHeight();
							this.reflow();
					}
			}, {
					key: 'destroy',
					value: function destroy() {
	
							if (this.fakeDiv) this.removeFakeScrollHeight();
							this.removeFakeHeight();
							this.removeEvents();
	
							this.elementsTrigger.length = 0;
							this.elementsTrigger = [];
	
							this.elementsParallaxe.length = 0;
							this.elementsParallaxe = [];
					}
			}]);
	
			return Smooth;
	}();
	
	exports.default = Smooth;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var now = __webpack_require__(2)
	  , root = typeof window === 'undefined' ? global : window
	  , vendors = ['moz', 'webkit']
	  , suffix = 'AnimationFrame'
	  , raf = root['request' + suffix]
	  , caf = root['cancel' + suffix] || root['cancelRequest' + suffix]
	
	for(var i = 0; !raf && i < vendors.length; i++) {
	  raf = root[vendors[i] + 'Request' + suffix]
	  caf = root[vendors[i] + 'Cancel' + suffix]
	      || root[vendors[i] + 'CancelRequest' + suffix]
	}
	
	// Some versions of FF have rAF but not cAF
	if(!raf || !caf) {
	  var last = 0
	    , id = 0
	    , queue = []
	    , frameDuration = 1000 / 60
	
	  raf = function(callback) {
	    if(queue.length === 0) {
	      var _now = now()
	        , next = Math.max(0, frameDuration - (_now - last))
	      last = next + _now
	      setTimeout(function() {
	        var cp = queue.slice(0)
	        // Clear queue here to prevent
	        // callbacks from appending listeners
	        // to the current frame's queue
	        queue.length = 0
	        for(var i = 0; i < cp.length; i++) {
	          if(!cp[i].cancelled) {
	            try{
	              cp[i].callback(last)
	            } catch(e) {
	              setTimeout(function() { throw e }, 0)
	            }
	          }
	        }
	      }, Math.round(next))
	    }
	    queue.push({
	      handle: ++id,
	      callback: callback,
	      cancelled: false
	    })
	    return id
	  }
	
	  caf = function(handle) {
	    for(var i = 0; i < queue.length; i++) {
	      if(queue[i].handle === handle) {
	        queue[i].cancelled = true
	      }
	    }
	  }
	}
	
	module.exports = function(fn) {
	  // Wrap in a new function to prevent
	  // `cancel` potentially being assigned
	  // to the native rAF function
	  return raf.call(root, fn)
	}
	module.exports.cancel = function() {
	  caf.apply(root, arguments)
	}
	module.exports.polyfill = function() {
	  root.requestAnimationFrame = raf
	  root.cancelAnimationFrame = caf
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Generated by CoffeeScript 1.7.1
	(function() {
	  var getNanoSeconds, hrtime, loadTime;
	
	  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
	    module.exports = function() {
	      return performance.now();
	    };
	  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
	    module.exports = function() {
	      return (getNanoSeconds() - loadTime) / 1e6;
	    };
	    hrtime = process.hrtime;
	    getNanoSeconds = function() {
	      var hr;
	      hr = hrtime();
	      return hr[0] * 1e9 + hr[1];
	    };
	    loadTime = getNanoSeconds();
	  } else if (Date.now) {
	    module.exports = function() {
	      return Date.now() - loadTime;
	    };
	    loadTime = Date.now();
	  } else {
	    module.exports = function() {
	      return new Date().getTime() - loadTime;
	    };
	    loadTime = new Date().getTime();
	  }
	
	}).call(this);
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 3 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	
	
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	
	
	
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	var style = document.createElement('p').style,
	    prefixes = 'O ms Moz webkit'.split(' '),
	    hasPrefix = /^(o|ms|moz|webkit)/,
	    upper = /([A-Z])/g,
	    memo = {};
	
	function get(key){
	    return (key in memo) ? memo[key] : memo[key] = prefix(key);
	}
	
	function prefix(key){
	    var capitalizedKey = key.replace(/-([a-z])/g, function(s, match){
	            return match.toUpperCase();
	        }),
	        i = prefixes.length,
	        name;
	
	    if (style[capitalizedKey] !== undefined) return capitalizedKey;
	
	    capitalizedKey = capitalize(key);
	
	    while (i--) {
	        name = prefixes[i] + capitalizedKey;
	        if (style[name] !== undefined) return name;
	    }
	
	    throw new Error('unable to prefix ' + key);
	}
	
	function capitalize(str){
	    return str.charAt(0).toUpperCase() + str.slice(1);
	}
	
	function dashedPrefix(key){
	    var prefixedKey = get(key),
	        upper = /([A-Z])/g;
	
	    if (upper.test(prefixedKey)) {
	        prefixedKey = (hasPrefix.test(prefixedKey) ? '-' : '') + prefixedKey.replace(upper, '-$1');
	    }
	
	    return prefixedKey.toLowerCase();
	}
	
	module.exports = get;
	module.exports.dash = dashedPrefix;


/***/ }
/******/ ])
});
;
//# sourceMappingURL=Smooth.js.map