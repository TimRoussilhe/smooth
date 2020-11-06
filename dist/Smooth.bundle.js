/*! For license information please see Smooth.bundle.js.LICENSE.txt */
var smooth;smooth=(()=>{var e={414:(e,t,i)=>{"use strict";i.r(t),i.d(t,{Scroll:()=>Y,ScrollBar:()=>L,default:()=>F});var n=i(796),r=i.n(n),s={linear:function(e){return e},easeInQuad:function(e){return e*e},easeOutQuad:function(e){return e*(2-e)},easeInOutQuad:function(e){return e<.5?2*e*e:(4-2*e)*e-1},easeInCubic:function(e){return e*e*e},easeOutCubic:function(e){return--e*e*e+1},easeInOutCubic:function(e){return e<.5?4*e*e*e:(e-1)*(2*e-2)*(2*e-2)+1},easeInQuart:function(e){return e*e*e*e},easeOutQuart:function(e){return 1- --e*e*e*e},easeInOutQuart:function(e){return e<.5?8*e*e*e*e:1-8*--e*e*e*e},easeInQuint:function(e){return e*e*e*e*e},easeOutQuint:function(e){return 1+--e*e*e*e*e},easeInOutQuint:function(e){return e<.5?16*e*e*e*e*e:1+16*--e*e*e*e*e}};function o(){if("undefined"!=typeof window&&"function"==typeof window.addEventListener){var e=!1,t=Object.defineProperty({},"passive",{get:function(){e=!0}}),i=function(){};return window.addEventListener("testPassiveEventSupport",i,t),window.removeEventListener("testPassiveEventSupport",i,t),e}}function a(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),i.push.apply(i,n)}return i}function l(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?a(Object(i),!0).forEach((function(t){h(e,t,i[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):a(Object(i)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))}))}return e}function h(e,t,i){return t in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}function c(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}var u=37,d=38,p=39,v=40,f=32,g={mouseMultiplier:3,touchMultiplier:-3,firefoxMultiplier:15,keyStep:200,preventTouch:!1,unpreventTouchClass:"vs-touchmove-allowed",limitInertia:!1,passive:!0};const m=function(){function e(t){var i,n,r=this;(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.el=window,t&&t.el&&(this.el=t.el,delete t.el),!t.callback||t.callback&&"function"!=typeof t.callback)?console.error("No Callback provided"):(this.options=l(l({},g),t),this.support={hasWheelEvent:"onwheel"in document,hasMouseWheelEvent:"onmousewheel"in document,hasTouch:"ontouchstart"in document,hasTouchWin:navigator.msMaxTouchPoints&&navigator.msMaxTouchPoints>1,hasPointer:!!window.navigator.msPointerEnabled,hasKeyDown:"onkeydown"in document,isFirefox:navigator.userAgent.indexOf("Firefox")>-1},this.handlers={onWheel:function(e){return r.onWheel(e)},onMouseWheel:function(e){return r.onMouseWheel(e)},onTouchStart:function(e){return r.onTouchStart(e)},onTouchEnd:function(e){return r.onTouchEnd(e)},onTouchMove:function(e){return r.onTouchMove(e)},onKeyDown:function(e){return r.onKeyDown(e)}},this.options.limitInertia&&(this.lethargy=new Lethargy),this.event={y:0,x:0,deltaX:0,deltaY:0},this.touchStartX=null,this.touchStartY=null,this.bodyTouchAction=null,this.isTouchDown=!1,this.isTouch=(this.support.hasTouch||this.support.hasTouchWin)&&(n=!1,i=navigator.userAgent||navigator.vendor||window.opera,(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(i)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(i.substr(0,4)))&&(n=!0),n)||!1,this.target=0,void 0!==this.options.passive&&(this.listenerOptions={passive:o()}))}var t,i,n;return t=e,(i=[{key:"updateTarget",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,i=this.event;i.x+=i.deltaX,i.y+=i.deltaY,this.options.callback({deltaX:i.deltaX,deltaY:i.deltaY},t)}},{key:"onWheel",value:function(e){var t=this.options,i=this.event,n=r()(e);i.deltaY=n.pixelY*t.mouseMultiplier,this.updateTarget(e)}},{key:"onMouseWheel",value:function(e){if(!this.options.limitInertia||!1!==this.lethargy.check(e)){var t=this.event;t.deltaX=e.wheelDeltaX?e.wheelDeltaX:0,t.deltaY=e.wheelDeltaY?e.wheelDeltaY:e.wheelDelta,this.updateTarget(e)}}},{key:"onTouchStart",value:function(e){this.isTouchDown=!0;var t=e.targetTouches?e.targetTouches[0]:e;this.touchStartX=t.pageX,this.touchStartY=t.pageY}},{key:"onTouchMove",value:function(e){e.preventDefault();var t=this.options;t.preventTouch&&!e.target.classList.contains(t.unpreventTouchClass)&&e.preventDefault();var i=this.event,n=e.targetTouches?e.targetTouches[0]:e;i.deltaX=(n.pageX-this.touchStartX)*t.touchMultiplier,i.deltaY=(n.pageY-this.touchStartY)*t.touchMultiplier,this.touchStartX=n.pageX,this.touchStartY=n.pageY,this.updateTarget(e)}},{key:"onTouchEnd",value:function(e){this.isTouchDown=!1}},{key:"onKeyDown",value:function(e){var t=this.event;t.deltaX=t.deltaY=0;var i=window.innerHeight-40;switch(e.keyCode){case u:case d:t.deltaY=-this.options.keyStep;break;case p:case v:t.deltaY=+this.options.keyStep;break;case f&&e.shiftKey:t.deltaY=-i;break;case f:t.deltaY=+i;break;default:return}this.updateTarget(e,"keydown")}},{key:"bind",value:function(){this.support.hasWheelEvent&&this.el.addEventListener("wheel",this.handlers.onWheel,this.listenerOptions),this.support.hasMouseWheelEvent&&this.el.addEventListener("mousewheel",this.handlers.onMouseWheel,this.listenerOptions),this.support.hasTouch&&(this.el.addEventListener("touchstart",this.handlers.onTouchStart,this.listenerOptions),this.el.addEventListener("touchend",this.handlers.onTouchEnd,this.listenerOptions),this.el.addEventListener("touchmove",this.handlers.onTouchMove,{passive:!1})),this.support.hasPointer&&this.support.hasTouchWin&&(this.bodyTouchAction=document.body.style.msTouchAction,document.body.style.msTouchAction="none",this.el.addEventListener("MSPointerDown",this.handlers.onTouchStart,!0),this.el.addEventListener("MSPointerUp",this.handlers.onTouchEnd,!0),this.el.addEventListener("MSPointerMove",this.handlers.onTouchMove,!0)),this.support.hasKeyDown&&document.addEventListener("keydown",this.handlers.onKeyDown)}},{key:"unbind",value:function(){this.support.hasWheelEvent&&this.el.removeEventListener("wheel",this.handlers.onWheel),this.support.hasMouseWheelEvent&&this.el.removeEventListener("mousewheel",this.handlers.onMouseWheel),this.support.hasTouch&&(this.el.removeEventListener("touchstart",this.handlers.onTouchStart),this.el.removeEventListener("touchend",this.handlers.onTouchEnd),this.el.removeEventListener("touchmove",this.handlers.onTouchMove)),this.support.hasPointer&&this.support.hasTouchWin&&(document.body.style.msTouchAction=this.bodyTouchAction,this.el.removeEventListener("MSPointerDown",this.handlers.onTouchStart),this.el.removeEventListener("MSPointerUp",this.handlers.onTouchEnd),this.el.removeEventListener("MSPointerMove",this.handlers.onTouchMove)),this.support.hasKeyDown&&document.removeEventListener("keydown",this.handlers.onKeyDown)}},{key:"reset",value:function(){var e=this.event;e.x=0,e.y=0}},{key:"destroy",value:function(){this.unbind()}}])&&c(t.prototype,i),n&&c(t,n),e}();function y(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function b(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}var w=.5,k=.2,E=.45,S=400,x=!0,T=!0,D=!0,P="vertical",O=!1,M=!1;const Y=function(){function e(){var t=this,i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};y(this,e),this.scrollElement=i.scrollElement||null,this.scrollbar=i.scrollbar||null,this.handlers={},this.handlers.onMouseScroll=function(e){return t.onMouseScroll(e)},this.y=0,this.target=0,this.speedDifferenceY=0,this.percent=0,this.vy=0,this.deltaY=0,this.fakeDiv=null,this.easing=void 0!==i.easing?i.easing:w,this.friction=void 0!==i.friction?i.friction:k,this.wheelDeltaMultiplier=void 0!==i.wheelDeltaMultiplier?i.wheelDeltaMultiplier:E,this.maxWheel=void 0!==i.maxWheel?i.maxWheel:S,this.autoUpdate=void 0!==i.autoUpdate?i.autoUpdate:x,this.useVirtualScroll=void 0!==i.useVirtualScroll?i.useVirtualScroll:T,this.smoothContainer=void 0!==i.smoothContainer?i.smoothContainer:D,this.direction=void 0!==i.direction?i.direction:P,this.noTransform=void 0!==i.noTransform?i.noTransform:O,this.infinite=void 0!==i.infinite?i.infinite:M,this.isScrollEnabled=!0,this.isWheelEnabled=!0,this.firstScroll=(window.scrollY||window.pageYOffset)>0,this.raf,this.maxHeight=0,this.resize(),this.start()}var t,i,n;return t=e,(i=[{key:"start",value:function(){var e=this;if(this.smoothContainer&&(this.scrollElement.style.willChange="transform",this.scrollElement.style.position="fixed"),this.scrollbar&&(this.scrollbar.updateScrollTarget=function(t){return e.updateTargetPercent(t)}),this.useVirtualScroll)this.vs=new m({callback:function(t,i){return e.updateTarget(t,i)}}),this.vs.bind();else{this.scrollHandler=function(t){return e.updateTargetNativeScroll(t)};var t=o();window.addEventListener("scroll",this.scrollHandler,{passive:t})}this.autoUpdate&&this.update()}},{key:"updateTargetNativeScroll",value:function(e){this.target=window.scrollY||window.pageYOffset,this.applyConstrains()}},{key:"updateTarget",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;if(!this.isScrollEnabled||!this.isWheelEnabled)return!1;var i=0;i=e.deltaY>0&&"keydown"!==t?Math.min(e.deltaY,this.maxWheel):-Math.min(Math.abs(e.deltaY),this.maxWheel),i*=this.wheelDeltaMultiplier,"keydown"===t&&(i=e.deltaY),this.target+=i,this.target=Math.round(1e4*this.target)/1e4,this.scrollbar&&this.scrollbar.isScrollbarDragging&&this.scrollbar.stopDrag(),this.applyConstrains()}},{key:"updateTargetPercent",value:function(e){this.target=this.maxHeight*e,this.applyConstrains()}},{key:"setTarget",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];this.target=e,t&&(this.y=e,this.vy=0,this.deltaY=0),this.applyConstrains()}},{key:"update",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];if(this.isScrollEnabled)if(void 0!==this.target&&this.vs&&this.vs.isTouch&&this.vs.isTouchDown||!this.vs||this.vs&&!this.vs.isTouch)this.deltaY=this.target-this.y,t?(this.vy=0,this.y=this.target):(this.easing&&!this.friction?this.y+=this.deltaY*this.easing:this.friction&&this.easing?(this.vy+=this.deltaY*this.easing,this.y+=this.vy*=this.friction):this.y=this.target,Math.abs(this.y-this.target)<.1&&(this.y=this.target),this.speedDifferenceY=(1e4*(this.y-this.oldY)|0)/1e4*2);else if(this.vs&&this.vs.isTouch&&!this.vs.isTouchDown){this.speedDifferenceY*=.96,Math.abs(this.speedDifferenceY)<=.1&&(this.speedDifferenceY=0),this.vy=0,this.deltaY=0,this.y+=this.speedDifferenceY;var i=this.height-this.boundingHeight;this.y<0?this.y=0:this.y>i&&(this.y=i),this.target=this.y}this.y=(1e3*this.y|0)/1e3,this.speedDifferenceY=(1e4*this.speedDifferenceY|0)/1e4,!this.preventDomUpdate&&this.smoothContainer&&(this.oldY!==this.y||t?this.updateScrollElement():this.oldY===this.y&&this.target!==this.y&&(this.y=Math.round(this.y),this.target=this.y,this.updateScrollElement())),this.percent=this.y/(this.height-this.boundingHeight),this.percent=(1e4*this.percent|0)/1e4,this.oldY=this.y,this.scrollbar&&(this.scrollbar.isScrollbarDragging||this.updateScrollbarPosition(),this.scrollbar.update()),this.autoUpdate&&!t&&(this.raf=window.requestAnimationFrame((function(){return e.update()})))}},{key:"updateScrollElement",value:function(e){var t;this.noTransform||(t="horizontal"===this.direction?"translate3d("+-this.y+"px, 0px, 0)":"translate3d(0px, "+-this.y+"px,0)",e&&(t+=" "+e),this.scrollElement.style.transform=t)}},{key:"applyConstrains",value:function(){if(!this.infinite){var e=this.height-this.boundingHeight;e<0||this.target<0?this.target=0:this.target>e&&(this.target=e)}}},{key:"resize",value:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.height=e||("horizontal"===this.direction?this.scrollElement.getBoundingClientRect().width:this.scrollElement.getBoundingClientRect().height),"horizontal"===this.direction?this.boundingHeight=window.innerWidth:this.boundingHeight=window.innerHeight,this.maxHeight=this.height-this.boundingHeight,this.scrollbar&&this.scrollbar.resize(this.height),this.applyConstrains(),this.update(!0),!this.useVirtualScroll&&this.smoothContainer&&this.addFakeScrollHeight(this.height)}},{key:"stop",value:function(){this.isScrollEnabled=!1,this.target=this.y,this.deltaY=this.target-this.y,this.vy=0}},{key:"reset",value:function(){this.y=this.target=this.oldY=this.percent=0}},{key:"updateScrollbarPosition",value:function(){this.height>this.boundingHeight&&(this.scrollbar.percent=this.target/(this.height-this.boundingHeight))}},{key:"removeFakeScrollHeight",value:function(){this.fakeDiv.parentNode.removeChild(this.fakeDiv),this.fakeDiv=null,this.scrollElement.style.removeProperty("position"),this.scrollElement.style.removeProperty("width"),this.scrollElement.style.removeProperty("transform")}},{key:"addFakeScrollHeight",value:function(e){null===this.fakeDiv?(this.fakeDiv=document.createElement("div"),this.fakeDiv.className="smooth-fake-scroll",this.fakeDiv.style.height=e+"px",this.scrollElement.parentNode.insertBefore(this.fakeDiv,this.scrollElement.nextSibling)):this.fakeDiv.style.height=e+"px",this.scrollElement.style.position="fixed",this.scrollElement.style.width="100%"}},{key:"destroy",value:function(){this.raf&&(window.cancelAnimationFrame(this.raf),this.raf=null),this.scrollbar&&this.scrollbar.destroy(),this.vs&&this.vs.destroy(),this.fakeDiv&&this.removeFakeScrollHeight(),this.useVirtualScroll||window.removeEventListener("scroll",this.scrollHandler)}}])&&b(t.prototype,i),n&&b(t,n),e}();function C(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function V(e,t,i){return t&&C(e.prototype,t),i&&C(e,i),e}const L=function(){function e(t,i){var n=this,r=i.orientation,s=void 0===r?"vertical":r,a=i.minSize,l=void 0===a?50:a,h=i.fade,c=void 0===h||h,u=i.fadeTime,d=void 0===u?1200:u,p=i.className,v=void 0===p?"scrollbar-thumb":p,f=i.updateScrollTarget,g=void 0===f?null:f;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.containerEl=t,this.direction=s,this.minSize=l,this.fade=c,this.fadeTime=d,this.scrollbarEl=document.createElement("span"),this.scrollbarEl.className=v,this._percent=0,this.position=0,this.oldPosition=0,this.isScrollbarDragging=!1,t.appendChild(this.scrollbarEl),this.handlers={},this.handlers.onScrollbarDrag=function(e){return n.onScrollbarDrag(e)},this.handlers.onScrollbarDragStart=function(e){return n.onScrollbarDragStart(e)},this.handlers.onScrollbarDragEnd=function(e){return n.onScrollbarDragEnd(e)},this.handlers.onContainerPointerDown=function(e){return n.onContainerPointerDown(e)},this.updateScrollTarget=g,this.supportPassive=o(),this.bindEvents()}return V(e,[{key:"percent",set:function(e){this._percent=e,this.scrollbarBCR&&(this.position=this.getPositionFromPercent(this._percent))},get:function(){return this._percent}}]),V(e,[{key:"bindEvents",value:function(){var e=this;this.containerEl.addEventListener("pointerdown",(function(t){return e.onContainerPointerDown(t)}));var t={passive:this.supportPassive};this.scrollbarEl.addEventListener("mousedown",this.handlers.onScrollbarDragStart),this.scrollbarEl.addEventListener("touchstart",this.handlers.onScrollbarDragStart,t)}},{key:"unBindEvents",value:function(){var e=this;this.containerEl.removeEventListener("pointerdown",(function(t){return e.onContainerPointerDown(t)})),this.scrollbarEl.removeEventListener("mousedown",this.onDragStart),this.scrollbarEl.removeEventListener("touchstart",this.onDragStart)}},{key:"update",value:function(){this.oldPosition!==this.position&&(this.updateScrollbarElement(),this.isScrollbarDragging&&this.updateScrollTarget&&this.updateScrollTarget(this.getScrollPercentFromPosition(this.position))),this.oldPosition=this.position}},{key:"getScrollPercentFromPosition",value:function(e){return e/(("vertical"===this.direction?this.scrollbarBCR.height:this.scrollbarBCR.width)-this.scrollbarSize)}},{key:"getPositionFromPercent",value:function(e){return e*(("vertical"===this.direction?this.scrollbarBCR.height:this.scrollbarBCR.width)-this.scrollbarSize)}},{key:"showThumb",value:function(){this.isThumbHidden=!1,this.scrollbarEl.style.opacity=1}},{key:"hideThumb",value:function(){this.isThumbHidden=!0,this.scrollbarEl.style.opacity=0}},{key:"updateScrollbarElement",value:function(){var e=this;this.fade&&(this.isThumbHidden&&this.showThumb(),this.fadeTimer&&clearTimeout(this.fadeTimer),this.fadeTimer=setTimeout((function(){e.hideThumb()}),this.fadeTime)),"vertical"===this.direction?this.scrollbarEl.style.transform="translate3d(0,".concat(this.position,"px,0)"):this.scrollbarEl.style.transform="translate3d(".concat(this.position,"px,0,0)")}},{key:"onContainerPointerDown",value:function(e){if((e=e.originalEvent&&e.originalEvent.touches&&e.originalEvent.touches[0]||e).target.classList.contains(this.scrollbarEl.className))return!1;var t="vertical"===this.direction?e.clientY/this.scrollbarBCR.height:e.clientX/this.scrollbarBCR.width;this.updateScrollTarget(t)}},{key:"onScrollbarDragStart",value:function(e){e.preventDefault(),e=e.originalEvent&&e.originalEvent.touches&&e.originalEvent.touches[0]||e,this.isScrollbarDragging=!0;var t="vertical"===this.direction?e.clientY-this.scrollbarBCR.top:e.clientX-this.scrollbarBCR.left;this.initialDragPosition=t-this.position,this.moveScrollbar(e);var i={passive:this.supportPassive};window.addEventListener("mouseup",this.handlers.onScrollbarDragEnd,i),window.addEventListener("touchend",this.handlers.onScrollbarDragEnd,i),window.addEventListener("mousemove",this.handlers.onScrollbarDrag,i),window.addEventListener("touchmove",this.handlers.onScrollbarDrag,i)}},{key:"onScrollbarDrag",value:function(e){e=e.originalEvent&&e.originalEvent.touches&&e.originalEvent.touches[0]||e,this.moveScrollbar(e)}},{key:"moveScrollbar",value:function(e){var t=("vertical"===this.direction?e.clientY-this.scrollbarBCR.top:e.clientX-this.scrollbarBCR.left)-this.initialDragPosition;this.position=this.applyConstrains(t)}},{key:"applyConstrains",value:function(e){if(e<0)return 0;var t=("vertical"===this.direction?this.scrollbarBCR.height:this.scrollbarBCR.width)-this.scrollbarSize;return e>t?t:e}},{key:"onScrollbarDragEnd",value:function(){this.isScrollbarDragging=!1,window.removeEventListener("mouseup",this.handlers.onScrollbarDragEnd),window.removeEventListener("touchend",this.handlers.onScrollbarDragEnd),window.removeEventListener("mousemove",this.handlers.onScrollbarDrag),window.removeEventListener("touchmove",this.handlers.onScrollbarDrag)}},{key:"stopDrag",value:function(){this.onScrollbarDragEnd()}},{key:"resize",value:function(e){if(void 0===e)throw new Error("scrollHeight target need to be defined");this.scrollbarBCR=this.scrollbarEl.parentNode.getBoundingClientRect(),this.scrollbarSize="vertical"===this.direction?this.scrollbarBCR.height/e*this.scrollbarBCR.height:this.scrollbarBCR.width/e*this.scrollbarBCR.width,this.scrollbarSize<this.minSize&&(this.scrollbarSize=this.minSize),this.scrollbarEl.style["vertical"===this.direction?"height":"width"]=this.scrollbarSize+"px"}},{key:"destroy",value:function(){this.unBindEvents()}}]),e}();function j(e){return(j="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function z(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),i.push.apply(i,n)}return i}function W(e,t,i){return t in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}function N(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}const F=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.scrollElement=t.scrollElement,this.scrollbarElement=t.scrollbarElement,this.scrollOptions=t.scrollOptions,this.scrollbarOptions=t.scrollbarOptions,this.direction=t.scrollOptions.direction||"vertical",this.elements=[],this.sections=[],this.frame=-1,this.initScroll(),this.isEnabled=!0,this.needRounding=!1}var t,i,n;return t=e,(i=[{key:"initScroll",value:function(){this.scrollbarElement&&(this.scrollBar=new L(this.scrollbarElement,this.scrollbarOptions)),this.scroll=new Y(function(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?z(Object(i),!0).forEach((function(t){W(e,t,i[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):z(Object(i)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))}))}return e}({scrollElement:this.scrollElement,scrollbar:this.scrollBar},this.scrollOptions))}},{key:"addElement",value:function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];e.el||void 0===e.parallax||console.error("DOM element non valid: "+e),e.trigger&&"function"!=typeof e.trigger.callback&&console.error("Trigger callback is not a function",e),this.createElement(e),t&&this.reflow()}},{key:"addElements",value:function(e){!Array.isArray(e)&&this.isObject(e)&&(e=[e]);for(var t=0;t<e.length;t++)this.addElement(e[t],!1);this.reflow()}},{key:"addSections",value:function(e){var t=this;!Array.isArray(e)&&this.isObject(e)&&(e=[e]),this.sections=e.map((function(e){return t.createSection(e)})),this.reflow()}},{key:"createElement",value:function(e){this.elements.push(e)}},{key:"createSection",value:function(e){return{el:e.el,section:{start:"in-viewport",end:"out-viewport",properties:[["translateY",0,0]],viewFactorStart:0,viewFactorEnd:0,edge:null,done:!1}}}},{key:"start",value:function(){"scrollRestoration"in history&&(history.scrollRestoration="manual"),window.scrollTo(0,0),this.run()}},{key:"run",value:function(){var e=this,t=this.scroll.y;if(this.frame!==t&&t>=0&&this.isEnabled){var i=0;for(-1!==this.frame&&(this.needRounding=!0);i<this.elements.length;i++){var n=0,r=this.elements[i],s=[];if(r.parallax)for(;n<r.parallax.length;n++){var o=r.parallax[n],a=t<=o.startValue,l=t>o.endValue;if(a||l){if(a&&-1===o.edge||l&&1===o.edge||l&&a)continue;(-1===o.edge&&l||1===o.edge&&a)&&(o.done=!1),o.edge=a?-1:1,this.setProgress(o,a?0:1),s.push(r)}else o.done&&0===o.edge||(o.edge=0,o.done=!1,this.updateElementProgress(o,t),s.push(r))}if(r.trigger){var h=r.trigger,c=t<h.startValue,u=t>h.endValue;if(c||u){if(c&&-1===h.edge||u&&1===h.edge||u&&c||h.done)continue;h.edge=c?-1:1,h.callback(c?-1:1,r);continue}if(h.done&&0===h.edge)continue;0!==h.edge&&h.callback(0,r),h.edge=0,!1===h.repeat&&(h.done=!0)}if(r.timeline){var d=r.timeline,p=t<d.startValue,v=t>d.endValue;if(p||v){if(p&&-1===d.edge||v&&1===d.edge||v&&p||d.done)continue;d.edge=p?-1:1;var f=p?0:1;d.timeline.progress(f);continue}this.updateElementProgress(d,t),d.timeline.progress(d.progress),d.edge=0}s.length>0&&this.draw(r)}for(var g=0;g<this.sections.length;g++){var m=this.sections[g],y=this.sections[g].section,b=t<=y.startValue,w=t>y.endValue;if(b||w){if(b&&-1===y.edge||w&&1===y.edge||w&&b)continue;(-1===y.edge&&w||1===y.edge&&b)&&(y.done=!1),(-1!==y.edge&&b||1!==y.edge&&w)&&b&&t!==y.startValue&&(m.el.style.opacity=0,m.el.style.pointerEvents="none"),y.edge=b?-1:1,this.setProgress(y,b?0:1),this.drawSection(m)}else y.done&&0===y.edge||(0!==y.edge&&(m.el.style.removeProperty("opacity"),m.el.style.removeProperty("pointer-events")),y.edge=0,y.done=!1,this.updateElementProgress(y,t),this.drawSection(m))}}else if(this.frame===t&&!0===this.needRounding){this.needRounding=!1;for(var k=0;k<this.elements.length;k++){var E=this.elements[k],S=[];if(E.parallax){for(var x=0;x<E.parallax.length;x++){var T=E.parallax[x];if(!1===T.done)for(var D=0;D<T.properties.length;D++){var P=T.properties[D],O=this.getStyleValue(P,T.progress);S.push(O)}}S.length>0&&this.applyStyle(E,S,!0)}}for(var M=0;M<this.sections.length;M++){var Y=this.sections[M],C=Y.section;if(!1===C.done){var V=C.properties[0],L=this.getStyleValue(V,C.progress);this.applyStyle(Y,[L],!0)}}}this.frame=t,this.raf=window.requestAnimationFrame((function(){return e.run()}))}},{key:"draw",value:function(e){for(var t=0,i=[];t<e.parallax.length;t++){var n=e.parallax[t];if(!1===n.done){for(var r=0;r<n.properties.length;r++){var s=n.properties[r],o=this.getStyleValue(s,n.progress);i.push(o)}(n.progress<=0&&-1===n.edge||n.progress>=1&&1===n.edge)&&(n.done=!0)}}i.length>0&&this.applyStyle(e,i)}},{key:"drawSection",value:function(e){var t=e.section;if(!1===t.done){var i=t.properties[0],n=this.getStyleValue(i,t.progress);(t.progress<=0&&-1===t.edge||t.progress>=1&&1===t.edge)&&(t.done=!0),this.applyStyle(e,[n])}}},{key:"getStyleValue",value:function(e,t){var i=e[0],n=e[1],r=n+(e[2]-n)*t;return[i,this.roundNumber(r,3)]}},{key:"applyStyle",value:function(e,t){var i,n,r,s,o=arguments.length>2&&void 0!==arguments[2]&&arguments[2],a=this._getOpacity(t),l=this._getTransform(t,o);null!==a&&(e.el.style.opacity=a),void 0!==l.translate&&(i="translate3d(".concat(l.translate.x?l.translate.x:0,"px, ").concat(l.translate.y?l.translate.y:0,"px, ").concat(l.translate.z?l.translate.z:0,"px)")),void 0!==l.scale&&(n="scale3d(".concat(l.scale.x?l.scale.x:1,", ").concat(l.scale.y?l.scale.y:1,", 1)")),void 0!==l.rotate&&(s="rotate(".concat(l.rotate,"deg")),void 0!==l.skew&&(r="skew(".concat(l.skew.x?l.skew.x:0,"deg, ").concat(l.skew.y?l.skew.y:0,"deg)"));var h="".concat((i?i+" ":"")+(n?n+" ":"")+(r?r+" ":"")+(s?s+" ":""));e.el.style.transform=h}},{key:"_getTransform",value:function(e){for(var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],i={},n=0;n<e.length;n++){var r=e[n],s=r[0],o=r[1];"translateX"===s&&(o=t?Math.round(r[1]):r[1],i.translate?i.translate.x=o:i.translate={x:o}),"translateY"===s&&(o=t?Math.round(r[1]):r[1],i.translate?i.translate.y=o:i.translate={y:o}),"translateZ"===s&&(o=t?Math.round(r[1]):r[1],i.translate?i.translate.z=o:i.translate={z:o}),"scale"===s&&(i.scale?i.scale.x=o:i.scale={x:o},i.scale?i.scale.y=o:i.scale={y:o}),"scaleX"===s&&(i.scale?i.scale.x=o:i.scale={x:o}),"scaleY"===s&&(i.scale?i.scale.y=o:i.scale={y:o}),"rotate"===s&&(i.rotate=o),"skew"===s&&(i.skew?i.skew.x=o:i.skew={x:o},i.skew?i.skew.y=o:i.skew={y:o}),"skewX"===s&&(i.skew?i.skew.x=o:i.skew={x:o}),"skewY"===s&&(i.skew?i.skew.y=o:i.skew={y:o})}return i}},{key:"_getOpacity",value:function(e){for(var t=null,i=0;i<e.length;i++)"opacity"===e[i][0]&&(t=e[i][1]);return t}},{key:"updateElementProgress",value:function(e,t){var i=e.progress,n=Math.min(Math.max((t-e.startValue)/(e.endValue-e.startValue),0),1);return this.setProgress(e,n),i===n}},{key:"setProgress",value:function(e,t){var i=t;e.ease&&s[e.ease]&&(i=s[e.ease](t)),e.progress=i}},{key:"reflow",value:function(){for(var e=0;e<this.elements.length;e++){var t=0,i=this.elements[e];if(i.parallax)for(;t<i.parallax.length;t++){var n=i.parallax[t];n.startValue=+this.getPosition("start",i.el,n),n.endValue=+this.getPosition("end",i.el,n),n.edge=null,n.done=!1}i.trigger&&(i.trigger.startValue=+this.getPosition("start",i.el,i.trigger),i.trigger.endValue=+this.getPosition("end",i.el,i.trigger),i.trigger.edge=null,i.trigger.done=!1),i.timeline&&(i.timeline.startValue=+this.getPosition("start",i.el,i.timeline),i.timeline.endValue=+this.getPosition("end",i.el,i.timeline),i.timeline.edge=null,i.timeline.done=!1)}for(var r=0;r<this.sections.length;r++){var s=this.sections[r],o=this.sections[r].section;if(o.properties[0][2]=-window.innerHeight-s.el.offsetHeight,o.edge=null,o.done=!1,o.startValue=+this.getPosition("start",s.el,o),o.endValue=+this.getPosition("end",s.el,o),o.startValue<=0&&(o.properties[0][2]=-this.getOffset(s.el)-s.el.offsetHeight),o.endValue>=this.scroll.maxHeight-1){var a=+this.getPosition("end",s.el,o,!1)-o.endValue;o.properties[0][2]+=this.roundNumber(a,2)}o.startValue>0&&(o.startValue-=100,o.properties[0][1]+=100),o.endValue<=this.scroll.maxHeight-1&&(o.endValue+=100,o.properties[0][2]-=100),o.properties[0][1]-=o.startValue,o.properties[0][2]-=o.startValue}this.frame=-1}},{key:"getOffset",value:function(e){var t=e,i=0;do{i+=t.offsetTop,t=t.offsetParent}while(t);return Math.floor(i)}},{key:"getPosition",value:function(e,t,i){var n=!(arguments.length>3&&void 0!==arguments[3])||arguments[3],r=i[e]||!1;if("in-viewport"===r||"out-viewport"===r)return this.getPositionBasedOnViewport(e,t,i,n);var s="start"===e?i.start:i.end;return this.roundNumber(s,2)}},{key:"getPositionBasedOnViewport",value:function(e,t,i){var n=!(arguments.length>3&&void 0!==arguments[3])||arguments[3];t.style.webkitTransform=null,t.style.mozTransform=null,t.style.msTransform=null,t.style.transform=null;var r,s,o=i.offsetParent||t,a=this.getOffset(o);"horizontal"===this.direction?(r=t.offsetWidth,s=window.innerWidth):(r=t.offsetHeight,s=window.innerHeight);var l,h="start"===e?i.viewFactorStart&&i.viewFactorStart||0:i.viewFactorEnd&&i.viewFactorEnd||0,c=i[e];return"in-viewport"===c?l=a-s:"out-viewport"===c&&(l=a+r),isNaN(h)&&-1!==h.indexOf("px")?l+=parseInt(h,10):l+=r*h,n?this.getPositionInBounds(l,s):this.roundNumber(l,2)}},{key:"getPositionInBounds",value:function(e,t){return e<=0?0:e>this.scroll.height-t?this.roundNumber(this.scroll.height-t,2):this.roundNumber(e,2)}},{key:"reset",value:function(e){var t=this,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];this.elements=[],this.sections=[];for(var n=0;n<e.length;n++){var r=e[n];this.addElement(r,!1)}i.length>0&&(this.sections=i.map((function(e){return t.createSection(e)})))}},{key:"disable",value:function(){this.isEnabled=!1,this.scroll.enabled=!1}},{key:"enable",value:function(){this.isEnabled=!0,this.scroll.enabled=!0,this.run()}},{key:"scrollTo",value:function(e,t){this.scroll.setTarget(e,t)}},{key:"resize",value:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.scroll&&this.scroll.resize(e),this.reflow()}},{key:"destroy",value:function(){window.cancelAnimationFrame(this.raf),this.raf=null,this.elements.forEach((function(e){e.parallax&&e.parallax.forEach((function(t){t.properties.forEach((function(t){"opacity"===t?e.el.style.removeProperty("opacity"):e.el.style.removeProperty("transform")}))}))})),this.scroll&&this.scroll.destroy()}},{key:"roundNumber",value:function(e){var t,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2;return 1===i&&(t=10),2===i&&(t=100),3===i&&(t=1e3),Math.round(e*t)/t}},{key:"isObject",value:function(e){return e&&"object"===j(e)&&e.constructor===Object}},{key:"getVisibleSections",value:function(){var e=this.scroll.target,t=[];return this.sections.forEach((function(i){var n=i.section,r=n.startValue,s=n.endValue;e>=r&&e<=s&&t.push(i)})),t}}])&&N(t.prototype,i),n&&N(t,n),e}()},796:(e,t,i)=>{e.exports=i(643)},264:e=>{"use strict";var t=!("undefined"==typeof window||!window.document||!window.document.createElement),i={canUseDOM:t,canUseWorkers:"undefined"!=typeof Worker,canUseEventListeners:t&&!(!window.addEventListener&&!window.attachEvent),canUseViewport:t&&!!window.screen,isInWorker:!t};e.exports=i},518:e=>{var t,i,n,r,s,o,a,l,h,c,u,d,p,v,f,g=!1;function m(){if(!g){g=!0;var e=navigator.userAgent,m=/(?:MSIE.(\d+\.\d+))|(?:(?:Firefox|GranParadiso|Iceweasel).(\d+\.\d+))|(?:Opera(?:.+Version.|.)(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))|(?:Trident\/\d+\.\d+.*rv:(\d+\.\d+))/.exec(e),y=/(Mac OS X)|(Windows)|(Linux)/.exec(e);if(d=/\b(iPhone|iP[ao]d)/.exec(e),p=/\b(iP[ao]d)/.exec(e),c=/Android/i.exec(e),v=/FBAN\/\w+;/i.exec(e),f=/Mobile/i.exec(e),u=!!/Win64/.exec(e),m){(t=m[1]?parseFloat(m[1]):m[5]?parseFloat(m[5]):NaN)&&document&&document.documentMode&&(t=document.documentMode);var b=/(?:Trident\/(\d+.\d+))/.exec(e);o=b?parseFloat(b[1])+4:t,i=m[2]?parseFloat(m[2]):NaN,n=m[3]?parseFloat(m[3]):NaN,(r=m[4]?parseFloat(m[4]):NaN)?(m=/(?:Chrome\/(\d+\.\d+))/.exec(e),s=m&&m[1]?parseFloat(m[1]):NaN):s=NaN}else t=i=n=s=r=NaN;if(y){if(y[1]){var w=/(?:Mac OS X (\d+(?:[._]\d+)?))/.exec(e);a=!w||parseFloat(w[1].replace("_","."))}else a=!1;l=!!y[2],h=!!y[3]}else a=l=h=!1}}var y={ie:function(){return m()||t},ieCompatibilityMode:function(){return m()||o>t},ie64:function(){return y.ie()&&u},firefox:function(){return m()||i},opera:function(){return m()||n},webkit:function(){return m()||r},safari:function(){return y.webkit()},chrome:function(){return m()||s},windows:function(){return m()||l},osx:function(){return m()||a},linux:function(){return m()||h},iphone:function(){return m()||d},mobile:function(){return m()||d||p||c||f},nativeApp:function(){return m()||v},android:function(){return m()||c},ipad:function(){return m()||p}};e.exports=y},534:(e,t,i)=>{"use strict";var n,r=i(264);r.canUseDOM&&(n=document.implementation&&document.implementation.hasFeature&&!0!==document.implementation.hasFeature("","")),e.exports=function(e,t){if(!r.canUseDOM||t&&!("addEventListener"in document))return!1;var i="on"+e,s=i in document;if(!s){var o=document.createElement("div");o.setAttribute(i,"return;"),s="function"==typeof o[i]}return!s&&n&&"wheel"===e&&(s=document.implementation.hasFeature("Events.wheel","3.0")),s}},643:(e,t,i)=>{"use strict";var n=i(518),r=i(534);function s(e){var t=0,i=0,n=0,r=0;return"detail"in e&&(i=e.detail),"wheelDelta"in e&&(i=-e.wheelDelta/120),"wheelDeltaY"in e&&(i=-e.wheelDeltaY/120),"wheelDeltaX"in e&&(t=-e.wheelDeltaX/120),"axis"in e&&e.axis===e.HORIZONTAL_AXIS&&(t=i,i=0),n=10*t,r=10*i,"deltaY"in e&&(r=e.deltaY),"deltaX"in e&&(n=e.deltaX),(n||r)&&e.deltaMode&&(1==e.deltaMode?(n*=40,r*=40):(n*=800,r*=800)),n&&!t&&(t=n<1?-1:1),r&&!i&&(i=r<1?-1:1),{spinX:t,spinY:i,pixelX:n,pixelY:r}}s.getEventType=function(){return n.firefox()?"DOMMouseScroll":r("wheel")?"wheel":"mousewheel"},e.exports=s}},t={};function i(n){if(t[n])return t[n].exports;var r=t[n]={exports:{}};return e[n](r,r.exports,i),r.exports}return i.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return i.d(t,{a:t}),t},i.d=(e,t)=>{for(var n in t)i.o(t,n)&&!i.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),i.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i(414)})();
//# sourceMappingURL=Smooth.bundle.js.map