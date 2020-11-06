import './main.scss';
import Smooth from './../src/Smooth';

console.log('Smooth', Smooth);

class App {
  constructor(el) {
    this.el = el;

    this.init();
  }

  init() {
    this.smooth = new Smooth({
      scrollElement: this.el.querySelector('.scroll-wrapper'),
      scrollbarElement: this.el.querySelector('.scrollbar-container'),
      scrollOptions: {
        useVirtualScroll: false,
        smoothContainer: true,
        easing: 0.12,
        friction: null,
      },
      scrollbarOptions: {
        orientation: 'vertical',
      },
    });

    this.smooth.start();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App(document.querySelector('.page-wrapper'));
});
