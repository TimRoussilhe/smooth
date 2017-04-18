# Smooth
---
Custom library to handle scroll.
There is 3 main role :
- Wrapping a container ( usually the page ) and adding momemtum to it ( keeping the scrollbar )
- Triggering scroll animation
- Smooth Parallaxe
    - For parallaxe the following prority are available :
        - Translate
        - Rotate
        - Scale
        - Opacity

> The library works on mobile and support modern browser via autoprefix;

## Documentation
---
### Init ( here you can see smoothContainer is set to true )
```
this.smooth = new Smooth({smoothContainer: true, smoothSection:this.el.querySelector('.scroll-wrapper')});
this.smooth.init();
```

### Add Elements

##Trigger example
```
for (let i = 0; i < elements.length; i++) {

			var elementTrigger =
				{
					el : elements[i],

					trigger :
					{
						start : 'in-viewport',
						viewFactorStart : 0.6,
						initialValues : [
							{
								animation : [
									{
										property : 'translate3d',
										y : 20
									}
								]
							},
							{
								animation: [{
									property : 'opacity',
									value: 0
								}]
							}
						],
						finalValues : [
							{
								delay : 200 * (i % 3),
								duration : 800,
								easing  : 'cubic-bezier(0.6, 0.2, 0.1, 1)',
								animation : [
									{
										property : 'translate3d',
										y : 0
									}
								]
							},
							{
								delay : 200 * (i % 3),
								duration : 800,
								easing  : 'cubic-bezier(0.6, 0.2, 0.1, 1)',
								animation: [{
									property : 'opacity',
									value: 1
								}]
							}
						],
						reset : true

					}

				};

			this.smooth.addElement(elementTrigger);
```

##Paralaxe example
```
el : this.$decoration[0],
				animations : [
						{
								transform : [

										{
												start : 1700,
												end : 2700,
												initialValue : -100,
												finalValue : 50,
												transformType : 'translate3d',
												axis : 'y',
												ease : 0.2

										}
								]

						}
				]

		animations : [
						{
								start : 'in-viewport',
								end : 'out-viewport',
								initialValue : 0,
								finalValue : 1,
								property : 'opacity',
								ease : 0.1,
								viewFactorStart : 0,
								viewFactorEnd : 1
						}
				]
```

### Start
```
this.smooth.start();
```

### Listener 
You can pass listener if you don't want to use the one setup by smooth and use a global raq for example
```
{
    setupListeners: 
        update: false,
        resize: false,
        scroll: false
}
```

### Reflow
```
tYou can use the lib situated here : src/smooth.js as a module
Otherwise i setup a UMD wrapper via webpack to generate a standalone librabry ( you can build to get a nex one or use the one in the lib folder )

```
Npm run dev
```
```
Npm run build
```

## Live Examples
---
[Alexandre Rochet Folio](http://eslint.org/)
[Stink Studio](stinkstudios.com)
[Volund](volund.ca)
his.smooth.reflow();
```