# smooth
//DOC

		Example of instanciation

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

		so if in-viewport is true and viewfactor are zero it will be trigger when element appears and when element complitely dissaper
		if viewFactor are 1 it will be whem it's totally in and will stop when reach end of windo viewport

		TRIGGER


				var elementTrigger =
				{
						el :event.detail,

						trigger :
						{
								start : 'in-viewport',
								viewFactorStart : 0.3,
								initialValues : [
										{
												animation : [
														{
																property : "translate3d",
																y : -30
														},
														{
																property : "scale3d",
																both: 1.1
														}
												]
										},
										{
												animation: [{
														property : "opacity",
														value: 0
												}]
										}
								],
								finalValues : [
										{
												delay : 0,
												duration : 500,
												easing  : 'cubic-bezier(0.6, 0.2, 0.1, 1)',
												animation : [
														{
																property : "translate3d",
																y : 0
														},
														{
																property : "scale3d",
																both: 1.0
														}
												]
										},
										{
												delay : 0.0,
												duration : 200,
												easing  : 'cubic-bezier(0.6, 0.2, 0.1, 1)',
												animation: [{
														property : "opacity",
														value: 1
												}]
										}
								],
								reset : true

						}

				};
