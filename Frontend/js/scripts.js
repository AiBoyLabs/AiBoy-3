(function($){
	$(document).ready(function() {	

		// Scroll to Top
		jQuery('.scrolltotop').click(function(){
			jQuery('html').animate({'scrollTop' : '0px'}, 400);
			return false;
		});
		
		jQuery(window).scroll(function(){
			var upto = jQuery(window).scrollTop();
			if(upto > 500) {
				jQuery('.scrolltotop').fadeIn();
			} else {
				jQuery('.scrolltotop').fadeOut();
			}
		});


		$('.menu-item ul li a').click(function(){
			$('.menu-item ul li a').removeClass("active");
			$(this).addClass("active");
		});

		$('.mobile-menu-item ul li a').click(function(){
			$('.mobile-menu-item ul li a').removeClass("m-active");
			$(this).addClass("m-active");
		});

		

				
		
		
		
		
		
		
		
		
	});
})(jQuery);

AOS.init({
	duration: 1900,
})





