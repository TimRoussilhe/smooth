
# Smooth
![enter image description here](https://media.giphy.com/media/ZbRAvMuUsnME8/giphy.gif)

## What's Smooth?

Custom library to handle scroll.

There is 3 main things that Smooth can take care of for you :
- Wrapping a container ( usually the page ) and adding a smooth scroll ( with some lerping/momemtum to it )
    - This can be some by keeping the real scroll and scrollbar for a more native experience
    - Or this can be done using virtual-scroll for a more smooth experience
- Handling Parallax
    - Smooth will act as a controller to handle parallax
- Scroll Trigger, to reveal element when they reach a certain  


> The library works on mobile but I recommend to keep the real scroll on mobile.

## Usage

### HTML 
```
<!DOCTYPE html>

<html lang="en">
  <head>
    <title>Title</title>
  </head>
  <body>
    <main id="content">
      <section class="page-wrapper">...</section>
    </main>
  </body>
</html>

```

### Javascript
#### Create a smooth instance
```
import Smooth from '@timroussilhe/smooth';

this.smooth = new Smooth({
  scrollElement: document.querySelector('.scroll-wrapper'),
  scrollOptions: {
    useVirtualScroll: false,
    smoothContainer: true,
    easing: 0.12,
    friction: null,
  }
});

this.smooth.start();
```


#### Add Scroll Elements
```
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
this.smooth.addElements([elementParallax, elementTrigger]);
```

### Reflow/resize

```
this.smooth.reset(this.getScrollElement());
this.smooth.resize();
```

## API

### Smooth Properties/Options

| property         	| type        	| default    	| description                                        	|
|------------------	|-------------	|------------	|----------------------------------------------------	|
| scrollElement    	| DOM element 	| null       	| *required* DOM element for the Scroll wrapper      	|
| scrollbarElement 	| DOM element 	| null       	| *optional* DOM element for the Scrollbar container 	|
| scrollOptions    	| Object      	| {}         	| *required* Option for the Scroll                   	|
| scrollbarOptions 	| Object      	| {}         	| *optional* Option for the Scroll                   	|

### Scroll Properties/Options

| property             	| type    	| default  	| description                                                                              	|
|----------------------	|---------	|----------	|------------------------------------------------------------------------------------------	|
| easing               	| number  	| 0.5      	| easing value for the scroll                                                              	|
| friction             	| number  	| 0.2      	| friction value for the scroll                                                            	|
| wheelDeltaMultiplier 	| number  	| 0.45     	| Multiplier to add to the wheel delta                                                     	|
| maxWheel             	| number  	| 400      	| Max value that the wheel event delta can get to                                          	|
| autoUpdate           	| boolean 	| true     	| Let Scroll update its own requestanimationframe loop                                     	|
| useVirtualScroll     	| boolean 	| true     	| Use virtual-scroll or the native scroll                                                  	|
| direction            	| string  	| vertical 	| Direction of the scroll, vertical or horizontal                                          	|
| infinite             	| boolean 	| false    	| Infinite scroll will not stop the Scroll when reaching the limit of the scroll Wrapper. 	|

### Scrollbar Properties/Options

| property           	| type     	| default         	| description                                       	|
|--------------------	|----------	|-----------------	|---------------------------------------------------	|
| orientation        	| string   	| vertical        	| Orientation and placement of the scrollbar        	|
| minSize            	| number   	| 50              	| Smallest size that the Scrollbar thumb can reach  	|
| fade               	| boolean  	| true            	| If the Scrollbar thumb need to fade or not        	|
| fadeTime           	| number   	| 1200            	| Fade Timer duration                               	|
| className          	| string   	| scrollbar-thumb 	| className of the generated Scrollbar              	|
| updateScrollTarget 	| function 	| null            	| Function to called when the Scrollbar get updated 	|

### Smooth Element Option

| property 	| type        	| description          	|
|----------	|-------------	|----------------------	|
| el       	| DOM Element 	| Target element       	|
| trigger  	| Object      	| Trigger Item values  	|
| parallax 	| Array      	| Array of Parallax Item values 	|

#### Smooth Element Paralaxe

| property        	| type             	| description                                                                                                                                    	|
|-----------------	|------------------	|------------------------------------------------------------------------------------------------------------------------------------------------	|
| start           	| string \| number 	| start value for the scroll element. This can be a number or use 'in-viewport' 'out-viewport'                                                   	|
| end             	| string \| number 	| end value for the scroll element. This can be a number or use 'in-viewport' 'out-viewport'                                                     	|
| properties      	| array            	| Properties to animate, each property should be an array following this structure [property,valueStart,ValueEnd] ex: `['translateY', 0, 200]`   	|
| viewFactorStart 	| string \| number 	| factor to add to the start value, this can be a number that will be used as a factor of the element height or a fixed pixel value. Ex: `200px` 	|
| viewFactorEnd   	| string \| number 	| factor to add to the end value, this can be a number that will be used as a factor of the element height or a fixed pixel value. Ex:  `200px`  	|

#### Smooth Element Trigger

| property        	| type                            	| description                                                                                                                                       	|
|-----------------	|---------------------------------	|---------------------------------------------------------------------------------------------------------------------------------------------------	|
| start           	| string \| number                	| start value for the scroll element. This can be a number or use 'in-viewport' 'out-viewport'                                                      	|
| end             	| string \| number                	| end value for the scroll element. This can be a number or use 'in-viewport' 'out-viewport'                                                        	|
| viewFactorStart 	| string \| number                	| factor to add to the start value, this can be a number that will be used as a factor of the element height or a fixed pixel value. Ex: `200px`    	|
| viewFactorEnd   	| string \| number                	| factor to add to the end value, this can be a number that will be used as a factor of the element height or a fixed pixel value. Ex:  `200px`     	|
| callback        	| function (scrollPosition) => {} 	| callback function to be called when the trigger start or end scroll values are reached. `scrollPosition` is -1 for before, 0 for in, 1 for after. 	|
| repeat          	| boolean                         	| Repeat the callback function after the first trigger in.                                                                                          	|

### Smooth Method
| Method                  	| Description                                                                                                	|
|-------------------------	|------------------------------------------------------------------------------------------------------------	|
| start                   	| Start Smooth                                                                                               	|
| addElements(elements)   	| Add Scroll Elements. Arguments: `elements`                                                                 	|
| reset(elements)         	| Reset Scroll Elements. Usually used on resize                                                              	|
| disable                 	| Disable Smooth                                                                                             	|
| enable                  	| Enable Smooth                                                                                              	|
| scrollTo(target,direct) 	| Set Scroll Position. Arguments: `target`: scroll position. `direct` scroll to the target with no animation 	|
| resize(target)          	| Resize Smooth. Arguments: `target`: you can provide a fixed height but this is not necessary               	|
| destroy()               	| Destroy Smooth instance and clear events.                                                                  	|



## Live Examples
- [WakaWaka](https://wakawaka.world/)
- [David William Baum](https://www.davidwilliambaum.com)
- [Alexandre Rochet Folio](http://alexandrerochet.com)
- [Stink Studio](https://www.stinkstudios.com)
- [Andy H Wei](http://andyweiart.com)
