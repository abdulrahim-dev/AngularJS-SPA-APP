jQuery(document).ready(function($) {

	var my_nav = $('.navbar-sticky'); 
	// grab the initial top offset of the navigation 
	var sticky_navigation_offset_top = my_nav.offset().top;
	
	// our function that decides weather the navigation bar should have "fixed" css position or not.
	var sticky_navigation = function(){
		var scroll_top = $(window).scrollTop(); // our current vertical position from the top
		
		// if we've scrolled more than the navigation, change its position to fixed to stick to top, otherwise change it back to relative
		if (scroll_top > sticky_navigation_offset_top) { 
			my_nav.addClass( 'stick' );
		} else {
			my_nav.removeClass( 'stick' );
		}   
	};

	var initio_parallax_animation = function() { 
		$('.parallax').each( function(i, obj) {
			var speed = $(this).attr('parallax-speed');
			if( speed ) {
				var background_pos = '-' + (window.pageYOffset / speed) + "px";
				$(this).css( 'background-position', 'center ' + background_pos );
			}
		});
	}
	
	// run our function on load
	sticky_navigation();
	
	// and run it again every time you scroll
	$(window).scroll(function() {
		 sticky_navigation();
		 initio_parallax_animation();
	});


    /**
     * Menu hide after click on li item
     */
	$('.navbar-default .navbar-nav a:not(".dropdown-toggle")').click(function () {
	    $('#bs-example-navbar-collapse-1').removeClass('in');
	    $('#bs-example-navbar-collapse-1').addClass('collapse');
	});

    /**
    * Menu hide when click other places in body section
    */
	$(document).click(function (event) {
	    var clickover = $(event.target);
	    var opened = $(".navbar-collapse").hasClass("navbar-collapse in");
	    if (opened === true && !clickover.hasClass("navbar-toggle")) {
	        $("button.navbar-toggle").click();
	    }
	});
});