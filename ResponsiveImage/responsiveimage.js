jQuery.fn.responsiveImage = function (o) {
	var $ = jQuery;
	
	var settings = {
		'steps': new Array(
			['desktop', 960],
			['tablet-retina', 720, 2],
			['tablet', 720],
			['small-tablet', 600],
			['mobile-retina', 320, 2]
		)
	};
	$.extend(settings, o);
	
	var pixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
	var width = $(window).width();
	
	this.each(function () {
		var el = $(this);
		
		for (var i=0, len=settings.steps.length; i<len; i++) {
			if (settings.steps[i][1] <= width && el.attr('data-'+settings.steps[i][0]) && (settings.steps[i][2] !== undefined ? pixelRatio >= settings.steps[i][2] : true)) {
				el.attr('src', el.attr('data-'+settings.steps[i][0]));
				break;
			}
		}
	});
};