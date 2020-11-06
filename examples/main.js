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

    const elementParallax = {
      el: document.querySelector('.scroll-wrapper'),
      parallax: [
        {
          start: 0,
          end: 500,
          properties: [['translateY', 0, 250]],
          easing: 'easeInOutCubic',
          viewFactorStart: 0,
          viewFactorEnd: 0,
        },
      ],
    };

    const $footer = document.querySelector('footer');
    const elementTrigger = {
      el: $footer,
      trigger: {
        start: 'in-viewport',
        end: 'out-viewport',
        viewFactorStart: 0,
        viewFactorEnd: 0,
        callback: (before) => {
          if (before === 0) {
            $footer.classList.add('footer--in');
          } else if (before === -1) {
            $footer.classList.remove('footer--in');
          }
        },
      },
    };

    this.smooth.addElements([elementPhotoItem, elementTrigger]);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App(document.querySelector('.page-wrapper'));
});
