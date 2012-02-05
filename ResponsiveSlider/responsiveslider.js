jQuery.fn.responsiveSlider = function (o) {
	var $ = jQuery;
	
	var settings = {
		'slideClass': 'slide',
		'infinite': false,
		'navigation': true,
		'containerClass': 'responsiveSliderContainer',
		'nextClass': 'responsiveSliderNext',
		'previousClass': 'responsiveSliderPrevious',
		'nextText': 'next',
		'previousText': 'previous',
		'automate': false,
		'displayTime': 5000,
		'animationTime': 350,
		'keyboard': false,
		'touch': true,
		'onChange': function () { }
	};
	$.extend(settings, o);
	
	if (settings.automate) settings.infinite = true;
	
	this.each(function () {
		//PROPERTIES
		var slider 			= {};
		slider.el 			= $(this);
		slider.slides 		= slider.el.find('.'+settings.slideClass);
		slider.currentIndex = 0;
		slider.settings 	= settings;
		
		//METHODS
		slider.recalculateTotalSlides = function () {
			if (slider.slides.eq(0).outerWidth() == slider.el.width()) {
				slider.totalSlides = slider.slides.size();
			}
			else {
				var slides = slider.slides.size();
				var width  = slider.slides.eq(0).outerWidth();
				var slidesPerPage = slider.el.width() / width;
				slider.totalSlides = Math.ceil(slides / slidesPerPage);
			}
		};
		var width = slider.el.width();
		slider.resize = function (force) {
			//set width and heights
			var nWidth = slider.el.width();
			if (force || width != nWidth) {
				width = nWidth;
				
				slider.recalculateTotalSlides();
				slider.container.width(width * slider.totalSlides);
				slider.el.height(slider.slides.eq(0).outerHeight());
				
				//reposition slide
				slider.slideTo(slider.currentIndex < slider.totalSlides - 1 ? slider.currentIndex : slider.totalSlides - 1, true, true);
			}
		};
		slider.previous = function () {
			if (slider.currentIndex > 0) {
				slider.slideTo(slider.currentIndex - 1);
			}
			else {
				if (slider.settings.infinite) {
					slider.slideTo(slider.totalSlides - 1);
				}
			}
		};
		slider.next = function () {
			if (slider.totalSlides - 1 > slider.currentIndex) {
				slider.slideTo(slider.currentIndex + 1);
			}
			else {
				if (slider.settings.infinite) {
					slider.slideTo(0);
				}
			}
		};
		slider.slideTo = function (i, dontAnimate, didntChange) {
			if (dontAnimate === undefined) dontAnimate = false;
			if (didntChange === undefined) didntChange = false;
			slider.currentIndex = i;
			
			//slide to new position
			var width = slider.el.width();
			var left = 0 - (width * slider.currentIndex);
			if (!dontAnimate) {
				slider.container.animate({'left': left}, slider.settings.animationTime);
			}
			else {
				slider.container.css({'left': left});
			}
			
			//if not infinite and has navigation, show/hide nav items
			if (!slider.settings.infinite && slider.settings.navigation) {
				//show/hide previous
				if (slider.currentIndex == 0) {
					slider.el.find('.'+slider.settings.previousClass).hide();
				}
				else {
					slider.el.find('.'+slider.settings.previousClass).show();
				}
				
				//show/hide next
				if (slider.totalSlides - 1 == slider.currentIndex) {
					slider.el.find('.'+slider.settings.nextClass).hide();
				}
				else {
					slider.el.find('.'+slider.settings.nextClass).show();
				}
			}
			
			if (!didntChange) {
				settings.onChange(slider);
			}
		};
		slider.snapToClosest = function () {
			var width = slider.el.width();
			var left = slider.container.offset().left;
			var page = left / width;
			var remainder = (Math.abs(left) % width) / width;
			
			if (page <= 0) {
				if (remainder > 0.5) {
					page = page < 0 ? Math.floor(page) : Math.ceil(page);
				}
				else {
					page = page < 0 ? Math.ceil(page) : Math.floor(page);
				}
				var slide = Math.abs(page);
			}
			else {
				var slide = 0;
			}
			if (slide > slider.totalSlides - 1) slide = slider.totalSlides - 1;
			if (slide < 0) slide = 0;
			slider.slideTo(slide);
		},
		slider.insertBefore = function (slide) {
			//add slide
			slide.prependTo(slider.container);
			
			//count slides
			slider.slides 		= slider.el.find('.'+slider.settings.slideClass);
			slider.totalSlides 	= slider.slides.size();
			slider.slides.each(function () { $(this).css('float', 'left'); });
			
			//reset position
			slider.resize(true);
			slider.slideTo(slider.currentIndex + 1, true, true);
		};
		slider.insertAfter = function (slide) {
			//add slide
			slide.appendTo(slider.container);
			
			//count slides
			slider.slides 		= slider.el.find('.'+slider.settings.slideClass);
			slider.totalSlides 	= slider.slides.size();
			slider.slides.each(function () { $(this).css('float', 'left'); });
			
			//reset position
			slider.resize(true);
			slider.slideTo(slider.currentIndex, true, true);
		};
		
		//INITIALIZE SLIDER
		
		//put slides into a container
		slider.el.css('position', 'relative');
		slider.el.data('responsiveSlider', slider);
		slider.container = $('<div />', {
			'class': slider.settings.containerClass,
			'css': {'position': 'absolute', 'top': 0, 'left': 0}
		});
		slider.slides.each(function () { $(this).appendTo(slider.container).css('float', 'left'); });
		slider.container.appendTo(slider.el);
		slider.el.css('overflow', 'hidden');
		
		slider.recalculateTotalSlides();
		
		//add navigation
		if (slider.settings.navigation) {
			slider.el.append('<a href="#" class="'+slider.settings.previousClass+'">'+slider.settings.previousText+'</a>');
			slider.el.append('<a href="#" class="'+slider.settings.nextClass+'">'+slider.settings.nextText+'</a>');
			
			slider.el.find('.'+slider.settings.previousClass).click(function () {
				slider.previous();
				return false;
			});
			slider.el.find('.'+slider.settings.nextClass).click(function () {
				slider.next();
				return false;
			});
		}
		
		if (slider.settings.keyboard) {
			$(document).keydown(function(e){
			    if (e.keyCode == 37) { //left arrow
			    	slider.previous();
					return false;
			    }
			    if (e.keyCode == 39) { //right arrow
			    	slider.next();
			    	return false;
			    }
			});
		}
		
		if (slider.settings.touch && 'ontouchstart' in document.documentElement) {
			var startX = null;
			var startLeft = null;
			var direction = null;
			var x = null;
			
			slider.el.get(0).ontouchstart = function (e) {
				startX = e.touches[0].pageX;
				startLeft = slider.container.offset().left;
			};
			slider.el.get(0).ontouchmove = function (e) {
				x = e.touches[0].pageX;
				if (Math.abs(x - startX) > 10) {
					slider.container.css('left', startLeft + (x - startX));
					return false;
				}
			};
			slider.el.get(0).ontouchend = function (e) {
				direction = x - startX > 0 ? 'positive' : 'negative';
				startX = null;
				slider.snapToClosest(direction);
			};
		}
		
		if (slider.settings.automate) {
			setInterval(function () {
				slider.next();
			}, slider.settings.displayTime + slider.settings.animationTime)
		}
		
		//set size of container
		slider.resize(true);
		
		$(window).resize(function () { slider.resize() });
	});
};