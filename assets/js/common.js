//----SMOOTH SCROLL---//
function init() {
    if (document.body) {
        var e = document.body,
            t = document.documentElement,
            n = window.innerHeight,
            o = e.scrollHeight;
        if (root = document.compatMode.indexOf("CSS") >= 0 ? t : e, activeElement = e, initdone = !0, top != self) frame = !0;
        else if (o > n && (e.offsetHeight <= n || t.offsetHeight <= n)) {
            var r = !1,
                a = function() {
                    r || t.scrollHeight == document.height || (r = !0, setTimeout(function() {
                        t.style.height = document.height + "px", r = !1
                    }, 500))
                };
            if (t.style.height = "", setTimeout(a, 10), addEvent("DOMNodeInserted", a), addEvent("DOMNodeRemoved", a), root.offsetHeight <= n) {
                var i = document.createElement("div");
                i.style.clear = "both", e.appendChild(i)
            }
        }
        if (document.URL.indexOf("mail.google.com") > -1) {
            var l = document.createElement("style");
            l.innerHTML = ".iu { visibility: hidden }", (document.getElementsByTagName("head")[0] || t).appendChild(l)
        }
        fixedback || disabled || (e.style.backgroundAttachment = "scroll", t.style.backgroundAttachment = "scroll")
    }
}

function scrollArray(e, t, n, o) {
    if (o || (o = 1e3), directionCheck(t, n), acceleration) {
        var r = +new Date,
            a = r - lastScroll;
        if (accelDelta > a) {
            var i = (1 + 30 / a) / 2;
            i > 1 && (i = Math.min(i, accelMax), t *= i, n *= i)
        }
        lastScroll = +new Date
    }
    if (que.push({
            x: t,
            y: n,
            lastX: 0 > t ? .99 : -.99,
            lastY: 0 > n ? .99 : -.99,
            start: +new Date
        }), !pending) {
        var l = e === document.body,
            c = function() {
                for (var r = +new Date, a = 0, i = 0, s = 0; s < que.length; s++) {
                    var d = que[s],
                        u = r - d.start,
                        m = u >= animtime,
                        f = m ? 1 : u / animtime;
                    pulseAlgorithm && (f = pulse(f));
                    var h = d.x * f - d.lastX >> 0,
                        p = d.y * f - d.lastY >> 0;
                    a += h, i += p, d.lastX += h, d.lastY += p, m && (que.splice(s, 1), s--)
                }
                l ? window.scrollBy(a, i) : (a && (e.scrollLeft += a), i && (e.scrollTop += i)), t || n || (que = []), que.length ? requestFrame(c, e, o / framerate + 1) : pending = !1
            };
        requestFrame(c, e, 0), pending = !0
    }
}

function wheel(e) {
    initdone || init();
    var t = e.target,
        n = overflowingAncestor(t);
    if (!n || e.defaultPrevented || isNodeName(activeElement, "embed") || isNodeName(t, "embed") && /\.pdf/i.test(t.src)) return !0;
    var o = e.wheelDeltaX || 0,
        r = e.wheelDeltaY || 0;
    o || r || (r = e.wheelDelta || 0), Math.abs(o) > 1.2 && (o *= stepsize / 120), Math.abs(r) > 1.2 && (r *= stepsize / 120), scrollArray(n, -o, -r), e.preventDefault()
}

function keydown(e) {
    var t = e.target,
        n = e.ctrlKey || e.altKey || e.metaKey || e.shiftKey && e.keyCode !== key.spacebar;
    if (/input|textarea|select|embed/i.test(t.nodeName) || t.isContentEditable || e.defaultPrevented || n) return !0;
    if (isNodeName(t, "button") && e.keyCode === key.spacebar) return !0;
    var o, r = 0,
        a = 0,
        i = overflowingAncestor(activeElement),
        l = i.clientHeight;
    switch (i == document.body && (l = window.innerHeight), e.keyCode) {
        case key.up:
            a = -arrowscroll;
            break;
        case key.down:
            a = arrowscroll;
            break;
        case key.spacebar:
            o = e.shiftKey ? 1 : -1, a = -o * l * .9;
            break;
        case key.pageup:
            a = .9 * -l;
            break;
        case key.pagedown:
            a = .9 * l;
            break;
        case key.home:
            a = -i.scrollTop;
            break;
        case key.end:
            var c = i.scrollHeight - i.scrollTop - l;
            a = c > 0 ? c + 10 : 0;
            break;
        case key.left:
            r = -arrowscroll;
            break;
        case key.right:
            r = arrowscroll;
            break;
        default:
            return !0
    }
    scrollArray(i, r, a), e.preventDefault()
}

function mousedown(e) {
    activeElement = e.target
}

function setCache(e, t) {
    for (var n = e.length; n--;) cache[uniqueID(e[n])] = t;
    return t
}

function overflowingAncestor(e) {
    var t = [],
        n = root.scrollHeight;
    do {
        var o = cache[uniqueID(e)];
        if (o) return setCache(t, o);
        if (t.push(e), n === e.scrollHeight) {
            if (!frame || root.clientHeight + 10 < n) return setCache(t, document.body)
        } else if (e.clientHeight + 10 < e.scrollHeight && (overflow = getComputedStyle(e, "").getPropertyValue("overflow-y"), "scroll" === overflow || "auto" === overflow)) return setCache(t, e)
    } while (e = e.parentNode)
}

function addEvent(e, t, n) {
    window.addEventListener(e, t, n || !1)
}

function removeEvent(e, t, n) {
    window.removeEventListener(e, t, n || !1)
}

function isNodeName(e, t) {
    return (e.nodeName || "").toLowerCase() === t.toLowerCase()
}

function directionCheck(e, t) {
    e = e > 0 ? 1 : -1, t = t > 0 ? 1 : -1, (direction.x !== e || direction.y !== t) && (direction.x = e, direction.y = t, que = [], lastScroll = 0)
}

function pulse_(e) {
    var t, n, o;
    return e *= pulseScale, 1 > e ? t = e - (1 - Math.exp(-e)) : (n = Math.exp(-1), e -= 1, o = 1 - Math.exp(-e), t = n + o * (1 - n)), t * pulseNormalize
}

function pulse(e) {
    return e >= 1 ? 1 : 0 >= e ? 0 : (1 == pulseNormalize && (pulseNormalize /= pulse_(1)), pulse_(e))
}
if (!jQuery(".enable_smoothscroll").length && jQuery(window).width() > 1024) {
    var framerate = 150,
        animtime = 4e3,
        stepsize = 200,
        pulseAlgorithm = !0,
        pulseScale = 25,
        pulseNormalize = 1,
        acceleration = !1,
        accelDelta = 10,
        accelMax = 1,
        keyboardsupport = !0,
        disableKeyboard = !1,
        arrowscroll = 50,
        exclude = "",
        disabled = !1,
        frame = !1,
        direction = {
            x: 0,
            y: 0
        },
        initdone = !1,
        fixedback = !0,
        root = document.documentElement,
        activeElement, key = {
            left: 37,
            up: 38,
            right: 39,
            down: 40,
            spacebar: 32,
            pageup: 33,
            pagedown: 34,
            end: 35,
            home: 36
        },
        que = [],
        pending = !1,
        lastScroll = +new Date,
        cache = {};
    setInterval(function() {
        cache = {}
    }, 1e4);
    var uniqueID = function() {
            var e = 0;
            return function(t) {
                return t.uniqueID || (t.uniqueID = e++)
            }
        }(),
        requestFrame = function() {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || function(e, t, n) {
                window.setTimeout(e, n || 1e3 / 60)
            }
        }();
    addEvent("mousedown", mousedown), addEvent("mousewheel", wheel), addEvent("load", init)
}



//---- PARALLAX ---//

(function($) {
    var $window = $(window);
    var windowHeight = $window.height();

    $window.resize(function() {
        windowHeight = $window.height();
    });

    $.fn.parallax = function(xpos, speedFactor, outerHeight) {
        var $this = $(this);
        var getHeight;
        var firstTop;
        var paddingTop = 0;

        //get the starting position of each element to have parallax applied to it	
        function update() {

            $this.each(function() {

                firstTop = $this.offset().top;
            });

            if (outerHeight) {
                getHeight = function(jqo) {
                    return jqo.outerHeight(true);
                };
            } else {
                getHeight = function(jqo) {
                    return jqo.height();
                };
            }

            // setup defaults if arguments aren't specified
            if (arguments.length < 1 || xpos === null) xpos = "50%";
            if (arguments.length < 2 || speedFactor === null) speedFactor = 0.5;
            if (arguments.length < 3 || outerHeight === null) outerHeight = true;

            // function to be called whenever the window is scrolled or resized

            var pos = $window.scrollTop();

            $this.each(function() {
                var $element = $(this);
                var top = $element.offset().top;
                var height = getHeight($element);

                // Check if totally above or totally below viewport
                if (top + height < pos || top > pos + windowHeight) {
                    return;
                }

                $this.css('backgroundPosition', xpos + " " + Math.round((firstTop - pos) * speedFactor) + "px");

            });
        }

        $window.bind('scroll', update).resize(update);
        update();
    };
})(jQuery);


// =============================================
// Parallax Init
// =============================================

jQuery(window).bind('load', function() {
    parallaxInit();
});

function parallaxInit() {
    jQuery('.parallax').each(function() {
        jQuery(this).parallax("30%", 0.3);
    });
}

function parallax() {
    var scrollPosition = $(window).scrollTop();
    $('#parallax').css('top', (0 - (scrollPosition * 0.3)) + 'px'); // bg image moves at 30% of scrolling speed
    $('#hero').css('opacity', ((100 - scrollPosition / 2) * 0.01));
}


	jQuery(document).ready(function($){

		/*	Parallax
		================================================== */

		$(window).on('scroll', function(e) {
			parallax();
		});

		/*	Wow Anim
		================================================== */		
		new WOW().init();	

		/*	Local Scroll
		================================================== */

		jQuery('.navbar').localScroll({
			offset: -80,
			duration: 500
		});

		/*	Active Menu
		================================================== */

		jQuery(function() {
			var sections = jQuery('section');
			var navigation_links = jQuery('nav a');
			sections.waypoint({
				handler: function(direction) {
					var active_section;
					active_section = jQuery(this);
					if (direction === "up") active_section = active_section.prev();
					var active_link = jQuery('nav a[href="#' + active_section.attr("id") + '"]');
					navigation_links.parent().removeClass("active");
					active_link.parent().addClass("active");
					active_section.addClass("active-section");
				},
				offset: '35%'
			});
		});

		/*	Gallery
		================================================== */		
			$('#gallery').magnificPopup({
				delegate: 'a',
				type: 'image',
				tLoading: 'Loading image #%curr%...',
				mainClass: 'mfp-img-mobile',
				gallery: {
					enabled: true,
					navigateByImgClick: true,
					preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
				},
				image: {
					tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
					titleSrc: function(item) {
						return item.el.attr('title') + '<small></small>';
					}
				}
			});		


		/*	Bootstrap Carousel
		================================================== */

		jQuery('.carousel').carousel()


	});
	
const btn = document.querySelector("#topBtn");

window.addEventListener("scroll", scrollFunction);

function scrollFunction(){
    if (window.pageYOffset > 100){
        btn.style.display = "block";
    }
    else{
        btn.style.display = "none";
    }
}

btn.addEventListener("click", backToTop);

function backToTop(){
    window.scrollTo(0,0);
}

