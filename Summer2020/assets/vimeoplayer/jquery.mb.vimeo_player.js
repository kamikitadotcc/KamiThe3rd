/*___________________________________________________________________________________________________________________________________________________
 _ jquery.mb.components                                                                                                                             _
 _                                                                                                                                                  _
 _ file: jquery.mb.vimeo_player.js                                                                                                                   _
 _ last modified: 26/12/16 15.39                                                                                                                    _
 _                                                                                                                                                  _
 _ Open Lab s.r.l., Florence - Italy                                                                                                                _
 _                                                                                                                                                  _
 _ email: matteo@open-lab.com                                                                                                                       _
 _ site: http://pupunzi.com                                                                                                                         _
 _       http://open-lab.com                                                                                                                        _
 _ blog: http://pupunzi.open-lab.com                                                                                                                _
 _ Q&A:  http://jquery.pupunzi.com                                                                                                                  _
 _                                                                                                                                                  _
 _ Licences: MIT, GPL                                                                                                                               _
 _    http://www.opensource.org/licenses/mit-license.php                                                                                            _
 _    http://www.gnu.org/licenses/gpl.html                                                                                                          _
 _                                                                                                                                                  _
 _ Copyright (c) 2001-2016. Matteo Bicocchi (Pupunzi);                                                                                              _
 ___________________________________________________________________________________________________________________________________________________*/
var get_vimeo_videoID = function(d) {
    return 0 < d.indexOf("vimeo.com") ? d.substr(d.lastIndexOf("/") + 1, d.length) : 15 < d.length ? null : d
};
(function(d) {
    jQuery.vimeo_player = {
        name: "jquery.mb.vimeo_player",
        author: "Matteo Bicocchi (pupunzi)",
        version: "1.0.6",
        build: "373",
        defaults: {
            containment: "body",
            ratio: "16/9",
            videoURL: null,
            startAt: 0,
            stopAt: 0,
            autoPlay: !0,
            vol: 50,
            addRaster: !1,
            opacity: 1,
            mute: !1,
            loop: !0,
            showControls: !0,
            show_vimeo_logo: !0,
            stopMovieOnBlur: !0,
            realfullscreen: !0,
            mobileFallbackImage: null,
            gaTrack: !0,
            optimizeDisplay: !0,
            mask: !1,
            align: "center,center",
            onReady: function(b) {}
        },
        controls: {
            play: "P",
            pause: "p",
            mute: "M",
            unmute: "A",
            fullscreen: "O",
            showSite: "R",
            logo: "V"
        },
        buildPlayer: function(b) {
            var c = function() {
                    var a = !1;
                    try {
                        self.location.href != top.location.href && (a = !0)
                    } catch (b) {
                        a = !0
                    }
                    return a
                },
                e = document.createElement("script");
            e.src = "https://player.vimeo.com/api/player.js";
            e.onload = function() {
                jQuery(document).trigger("vimeo_api_loaded")
            };
            document.head.appendChild(e);
            return this.each(function() {
                var a = this,
                    f = jQuery(a);
                a.loop = 0;
                a.opt = {};
                a.state = {};
                a.id = a.id || "YTP_" + (new Date).getTime();
                f.addClass("vimeo_player");
                var e = f.data("property") && "string" ==
                    typeof f.data("property") ? eval("(" + f.data("property") + ")") : f.data("property");
                jQuery.extend(a.opt, jQuery.vimeo_player.defaults, b, e);
                a.opt.ratio = "auto" == a.opt.ratio ? "16/9" : a.opt.ratio;
                eval(a.opt.loop) && (a.opt.loop = 9999);
                a.isRetina = window.retina || 1 < window.devicePixelRatio;
                a.canGoFullScreen = !(jQuery.browser.msie || jQuery.browser.opera || c());
                a.canGoFullScreen || (a.opt.realfullscreen = !1);
                a.isAlone = !1;
                a.hasFocus = !0;
                a.videoID = this.opt.videoURL ? get_vimeo_videoID(this.opt.videoURL) : f.attr("href") ? get_vimeo_videoID(f.attr("href")) :
                    !1;
                a.isSelf = "self" == a.opt.containment;
                a.opt.containment = "self" == a.opt.containment ? jQuery(this) : jQuery(a.opt.containment);
                a.isBackground = a.opt.containment.is("body");
                if (!a.isBackground || !a.backgroundIsInited) {
                    a.canPlayOnMobile = a.isSelf && 0 === jQuery(this).children().length;
                    a.isSelf || f.hide();
                    var e = jQuery("<div/>").css({
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%"
                        }).addClass("vimeo_player_overlay"),
                        d = "vimeo_player_" + a.id,
                        g = jQuery("<div/>").addClass("vimeo_player_wrapper").attr("id", "vimeo_player_wrapper_" +
                            d);
                    g.css({
                        position: "absolute",
                        zIndex: 0,
                        minWidth: "100%",
                        minHeight: "100%",
                        left: 0,
                        top: 0,
                        overflow: "hidden",
                        opacity: 0
                    });
                    a.playerBox = jQuery("<iframe/>").attr("id", d).addClass("playerBox");
                    a.playerBox.css({
                        position: "absolute",
                        zIndex: 0,
                        width: "100%",
                        height: "100%",
                        top: -10,
                        frameBorder: 0,
                        overflow: "hidden",
                        left: 0
                    }).attr({
                        src: "https://player.vimeo.com/video/" + a.videoID + "?background=1&autopause=0"
                    });
                    if (!jQuery.browser.mobile || a.canPlayOnMobile) {
                        g.append(a.playerBox);
                        a.opt.containment.children().not("script, style").each(function() {
                            "static" ==
                            jQuery(this).css("position") && jQuery(this).css("position", "relative")
                        });
                        a.isBackground ? (jQuery("body").css({
                            boxSizing: "border-box"
                        }), g.css({
                            position: "fixed",
                            top: 0,
                            left: 0,
                            zIndex: 0
                        })) : "static" == a.opt.containment.css("position") && a.opt.containment.css({
                            position: "relative"
                        });
                        a.opt.containment.prepend(g);
                        a.wrapper = g;
                        a.playerBox.css({
                            opacity: 1
                        });
                        jQuery.browser.mobile || (a.playerBox.after(e), a.overlay = e);
                        if (!a.isBackground) e.on("mouseenter", function() {
                            a.controlBar && a.controlBar.length && a.controlBar.addClass("visible")
                        }).on("mouseleave",
                            function() {
                                a.controlBar && a.controlBar.length && a.controlBar.removeClass("visible")
                            });
                        jQuery(document).on("vimeo_api_loaded", function() {
                            a.player = new Vimeo.Player(d, b);
                            a.player.ready().then(function() {
                                function b() {
                                    a.isReady = !0;
                                    a.opt.mute && setTimeout(function() {
                                        f.v_mute()
                                    }, 1E3);
                                    a.opt.showControls && jQuery.vimeo_player.buildControls(a);
                                    a.opt.autoPlay ? setTimeout(function() {
                                        f.v_play();
                                        setTimeout(function() {
                                            c = jQuery.Event("VPStart");
                                            f.trigger(c)
                                        }, 1500)
                                    }, 100) : f.v_pause();
                                    c = jQuery.Event("VPReady");
                                    f.trigger(c)
                                }
                                var c;
                                a.opt.startAt ? (a.player.play().then(function() {
                                    a.player.pause()
                                }), f.v_seekTo(a.opt.startAt, function() {
                                    b()
                                })) : b();
                                f.v_optimize_display();
                                jQuery(window).off("resize.vimeo_player_" + a.id).on("resize.vimeo_player_" + a.id, function() {
                                    f.v_optimize_display()
                                });
                                a.player.on("progress", function(a) {
                                    console.debug("progress:: ", a)
                                });
                                a.player.on("error", function(b) {
                                    a.state = -1;
                                    c = jQuery.Event("VPError");
                                    c.error = b;
                                    f.trigger(c)
                                });
                                a.player.on("play", function(b) {
                                    a.state = 1;
                                    f.trigger("change_state");
                                    a.controlBar && a.controlBar.length &&
                                        a.controlBar.find(".vimeo_player_pause").html(jQuery.vimeo_player.controls.pause);
                                    "undefined" != typeof _gaq && eval(a.opt.gaTrack) && _gaq.push(["_trackEvent", "vimeo_player", "Play", a.videoID]);
                                    "undefined" != typeof ga && eval(a.opt.gaTrack) && ga("send", "event", "vimeo_player", "play", a.videoID);
                                    c = jQuery.Event("VPPlay");
                                    c.error = b;
                                    f.trigger(c)
                                });
                                a.player.on("pause", function(b) {
                                    a.state = 2;
                                    f.trigger("change_state");
                                    a.controlBar && a.controlBar.length && a.controlBar.find(".vimeo_player_pause").html(jQuery.vimeo_player.controls.play);
                                    c = jQuery.Event("VPPause");
                                    c.time = b;
                                    f.trigger(c)
                                });
                                a.player.on("seeked", function(c) {
                                    a.state = 3;
                                    f.trigger("change_state")
                                });
                                a.player.on("ended", function(b) {
                                    a.state = 0;
                                    f.trigger("change_state");
                                    c = jQuery.Event("VPEnd");
                                    c.time = b;
                                    f.trigger(c)
                                });
                                a.player.on("timeupdate", function(b) {
                                    a.duration = b.duration;
                                    a.percent = b.percent;
                                    a.seconds = b.seconds;
                                    a.state = 1;
                                    a.player.getPaused().then(function(b) {
                                        b && (a.state = 2)
                                    });
                                    a.opt.stopMovieOnBlur && !document.hasFocus() && 1 == a.state && (a.hasFocus = !1, f.v_pause(), a.document_focus =
                                        setInterval(function() {
                                            document.hasFocus() && !a.hasFocus && (a.hasFocus = !0, f.v_play(), clearInterval(a.document_focus))
                                        }, 300));
                                    if (a.opt.showControls) {
                                        var e = jQuery("#controlBar_" + a.id),
                                            d = e.find(".vimeo_player_pogress"),
                                            g = e.find(".vimeo_player_loaded"),
                                            e = e.find(".vimeo_player_seek_bar"),
                                            d = d.outerWidth(),
                                            d = Math.floor(b.seconds) * d / Math.floor(b.duration);
                                        g.css({
                                            left: 0,
                                            width: 100 * b.percent + "%"
                                        });
                                        e.css({
                                            left: 0,
                                            width: d
                                        });
                                        b.duration ? a.controlBar.find(".vimeo_player_time").html(jQuery.vimeo_player.formatTime(b.seconds) +
                                            " / " + jQuery.vimeo_player.formatTime(b.duration)) : a.controlBar.find(".vimeo_player_time").html("-- : -- / -- : --")
                                    }
                                    a.opt.addRaster ? (g = "dot" == a.opt.addRaster ? "raster-dot" : "raster", a.overlay.addClass(a.isRetina ? g + " retina" : g)) : a.overlay.removeClass(function(a, b) {
                                        var c = b.split(" "),
                                            e = [];
                                        jQuery.each(c, function(a, b) {
                                            /raster.*/.test(b) && e.push(b)
                                        });
                                        e.push("retina");
                                        return e.join(" ")
                                    });
                                    a.opt.stopAt = a.opt.stopAt > b.duration ? b.duration - .6 : a.opt.stopAt;
                                    b.seconds >= (a.opt.stopAt || b.duration - .6) && (a.loop = a.loop ||
                                        0, a.opt.loop && a.loop < a.opt.loop ? (f.v_seekTo(a.opt.startAt), a.loop++) : (f.v_pause(), a.state = 0, f.trigger("change_state")));
                                    c = jQuery.Event("VPTime");
                                    c.time = b.seconds;
                                    f.trigger(c)
                                })
                            });
                            f.on("change_state", function() {
                                console.debug("player state:: ", a.state);
                                0 == a.state && a.wrapper.fadeOut(500, function() {
                                    f.v_seekTo(0)
                                })
                            })
                        })
                    } else a.opt.mobileFallbackImage && g.css({
                            backgroundImage: "url(" + a.opt.mobileFallbackImage + ")",
                            backgroundPosition: "center center",
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            opacity: 1
                        }),
                        f.remove()
                }
            })
        },
        formatTime: function(b) {
            var c = Math.floor(b / 60);
            b = Math.floor(b - 60 * c);
            return (9 >= c ? "0" + c : c) + " : " + (9 >= b ? "0" + b : b)
        },
        play: function() {
            var b = this.get(0);
            if (!b.isReady) return this;
            b.player.play();
            setTimeout(function() {
                b.wrapper.fadeTo(1E3, b.opt.opacity)
            }, 1E3);
            var c = jQuery("#controlBar_" + b.id);
            c.length && c.find(".mb_YTPPvimeo_player_playpause").html(jQuery.vimeo_player.controls.pause);
            b.state = 1;
            jQuery(b).css("background-image", "none");
            return this
        },
        togglePlay: function(b) {
            var c = this.get(0);
            1 == c.state ?
                this.v_pause() : this.v_play();
            "function" == typeof b && b(c.state);
            return this
        },
        pause: function() {
            var b = this.get(0);
            b.player.pause();
            b.state = 2;
            return this
        },
        seekTo: function(b, c) {
            var e = this.get(0);
            e.player.setCurrentTime(e.opt.stopAt && b >= e.opt.stopAt ? e.opt.stopAt - .5 : b).then(function(a) {
                "function" == typeof c && c(a)
            });
            return this
        },
        setVolume: function(b) {
            var c = this.get(0);
            console.debug("setVolume:: ", b);
            console.debug("volume:: ", c.opt.vol);
            b || c.opt.vol || !c.isMute ? !b && !c.isMute || b && c.opt.vol == b ? c.isMute ? jQuery(c).v_mute() :
                jQuery(c).v_unmute() : (c.opt.vol = b, c.player.setVolume(c.opt.vol), c.volumeBar && c.volumeBar.length && c.volumeBar.updateSliderVal(100 * b)) : jQuery(c).v_unmute();
            return this
        },
        toggleVolume: function() {
            var b = this.get(0);
            if (b) {
                if (b.isMute) return jQuery(b).v_unmute(), !0;
                jQuery(b).v_mute();
                return !1
            }
        },
        mute: function() {
            var b = this.get(0);
            if (!b.isMute) return b.isMute = !0, b.player.setVolume(0), b.volumeBar && b.volumeBar.length && 10 < b.volumeBar.width() && b.volumeBar.updateSliderVal(0), jQuery("#controlBar_" + b.id).find(".vimeo_player_muteUnmute").html(jQuery.vimeo_player.controls.unmute),
                jQuery(b).addClass("isMuted"), b.volumeBar && b.volumeBar.length && b.volumeBar.addClass("muted"), this
        },
        unmute: function() {
            var b = this.get(0);
            if (b.isMute) return b.isMute = !1, jQuery(b).v_set_volume(b.opt.vol), b.volumeBar && b.volumeBar.length && b.volumeBar.updateSliderVal(.1 < b.opt.vol ? b.opt.vol : .1), jQuery("#controlBar_" + b.id).find(".vimeo_player_muteUnmute").html(jQuery.vimeo_player.controls.mute), jQuery(b).removeClass("isMuted"), b.volumeBar && b.volumeBar.length && b.volumeBar.removeClass("muted"), this
        },
        changeMovie: function(b) {
            var c =
                this.get(0);
            c.player.loadVideo(b.url).then(function(b) {
                jQuery(c).v_setState()
            })
        },
        buildControls: function(b) {
            var c = b.opt;
            if (!jQuery("#controlBar_" + b.id).length) {
                b.controlBar = jQuery("<span/>").attr("id", "controlBar_" + b.id).addClass("vimeo_player_bar").css({
                    whiteSpace: "noWrap",
                    position: b.isBackground ? "fixed" : "absolute",
                    zIndex: b.isBackground ? 1E4 : 1E3
                });
                var e = jQuery("<div/>").addClass("buttonBar"),
                    a = jQuery("<span>" + jQuery.vimeo_player.controls.play + "</span>").addClass("vimeo_player_pause vimeo_icon").click(function() {
                        1 ==
                            b.state ? jQuery(b).v_pause() : jQuery(b).v_play()
                    }),
                    f = jQuery("<span>" + jQuery.vimeo_player.controls.mute + "</span>").addClass("vimeo_player_muteUnmute vimeo_icon").click(function() {
                        b.isMute ? jQuery(b).v_unmute() : jQuery(b).v_mute()
                    }),
                    d = jQuery("<div/>").addClass("vimeo_player_volume_bar").css({
                        display: "inline-block"
                    });
                b.volumeBar = d;
                var k = jQuery("<span/>").addClass("vimeo_player_time"),
                    g = "https://vimeo.com/" + b.videoID,
                    h = jQuery("<span/>").html(jQuery.vimeo_player.controls.logo).addClass("vimeo_url vimeo_icon").attr("title",
                        "view on Vimeo").on("click", function() {
                        console.debug(g);
                        window.open(g, "viewOnVimeo")
                    }),
                    l = jQuery("<span/>").html(jQuery.vimeo_player.controls.fullscreen).addClass("vimeo_fullscreen vimeo_icon").on("click", function() {
                        jQuery(b).v_fullscreen(c.realfullscreen)
                    }),
                    m = jQuery("<div/>").addClass("vimeo_player_pogress").css("position", "absolute").click(function(a) {
                        n.css({
                            width: a.clientX - n.offset().left
                        });
                        b.timeW = a.clientX - n.offset().left;
                        b.controlBar.find(".vimeo_player_loaded").css({
                            width: 0
                        });
                        a = Math.floor(b.duration);
                        b.goto = n.outerWidth() * a / m.outerWidth();
                        console.debug(b.goto);
                        jQuery(b).v_seekTo(parseFloat(b.goto));
                        b.controlBar.find(".vimeo_player_loaded").css({
                            width: 0
                        })
                    }),
                    q = jQuery("<div/>").addClass("vimeo_player_loaded").css("position", "absolute"),
                    n = jQuery("<div/>").addClass("vimeo_player_seek_bar").css("position", "absolute");
                m.append(q).append(n);
                e.append(a).append(f).append(d).append(k);
                c.show_vimeo_logo && e.append(h);
                (b.isBackground || eval(b.opt.realfullscreen) && !b.isBackground) && e.append(l);
                b.controlBar.append(e).append(m);
                b.isBackground ? jQuery("body").after(b.controlBar) : b.wrapper.before(b.controlBar);
                d.simpleSlider({
                    initialval: b.opt.vol,
                    scale: 100,
                    orientation: "h",
                    callback: function(a) {
                        0 == a.value ? jQuery(b).v_mute() : jQuery(b).v_unmute();
                        b.player.setVolume(a.value / 100);
                        b.isMute || (b.opt.vol = a.value)
                    }
                })
            }
        },
        optimizeVimeoDisplay: function(b) {
            var c = this.get(0),
                e, a, f, d;
            c.opt.align = b || c.opt.align;
            c.opt.align = "undefined " != typeof c.opt.align ? c.opt.align : "center,center";
            b = c.opt.align.split(",");
            if (c.opt.optimizeDisplay) {
                var k = c.isPlayer ?
                    0 : 80,
                    g, h;
                e = c.wrapper;
                g = e.outerWidth();
                h = e.outerHeight() + k;
                e = g;
                a = "16/9" == c.opt.ratio ? Math.ceil(.5625 * e) : Math.ceil(.75 * e);
                f = -((a - h) / 2);
                d = 0;
                var l = a < h;
                l && (a = h + k, e = "16/9" == c.opt.ratio ? Math.floor(16 / 9 * a) : Math.floor(4 / 3 * a), f = 0, d = -((e - g) / 2));
                for (var m in b)
                    if (b.hasOwnProperty(m)) switch (b[m].replace(/ /g, "")) {
                        case "top":
                            f = l ? -((a - h) / 2) : 0;
                            break;
                        case "bottom":
                            f = l ? 0 : -(a - h);
                            break;
                        case "left":
                            d = 0;
                            break;
                        case "right":
                            d = l ? -(e - g) : 0;
                            break;
                        default:
                            e > g && (d = -((e - g) / 2))
                    }
            } else a = e = "100%", d = f = 0;
            c.playerBox.css({
                width: e,
                height: a,
                marginTop: f,
                marginLeft: d,
                maxWidth: "initial"
            })
        },
        setAlign: function(b) {
            this.v_optimize_display(b)
        },
        getAlign: function() {
            return this.get(0).opt.align
        },
        fullscreen: function(b) {
            function c(a, b) {
                for (var c = ["webkit", "moz", "ms", "o", ""], e = 0, d, f; e < c.length && !a[d];) {
                    d = b;
                    "" == c[e] && (d = d.substr(0, 1).toLowerCase() + d.substr(1));
                    d = c[e] + d;
                    f = typeof a[d];
                    if ("undefined" != f) return "function" == f ? a[d]() : a[d];
                    e++
                }
            }

            function e(a) {
                c(a, "RequestFullScreen")
            }
            var a = this.get(0),
                d = jQuery(a),
                p;
            "undefined" == typeof b && (b = a.opt.realfullscreen);
            b = eval(b);
            var k = jQuery("#controlBar_" + a.id),
                g = k.find(".vimeo_fullscreen"),
                h = a.isSelf ? a.opt.containment : a.wrapper;
            if (b) {
                var l = jQuery.browser.mozilla ? "mozfullscreenchange" : jQuery.browser.webkit ? "webkitfullscreenchange" : "fullscreenchange";
                jQuery(document).off(l).on(l, function() {
                    c(document, "IsFullScreen") || c(document, "FullScreen") ? p = jQuery.Event("VPFullScreenStart") : (a.isAlone = !1, g.html(jQuery.vimeo_player.controls.fullscreen), h.removeClass("vimeo_player_Fullscreen"), h.fadeTo(500, a.opt.opacity), h.css({
                            zIndex: 0
                        }),
                        a.isBackground ? jQuery("body").after(k) : a.wrapper.before(k), jQuery(window).resize(), p = jQuery.Event("VPFullScreenEnd"));
                    d.trigger(p)
                })
            }
            if (a.isAlone) jQuery(document).off("mousemove.vimeo_player"), clearTimeout(a.hideCursor), a.overlay.css({
                cursor: "auto"
            }), b ? (c(document, "FullScreen") || c(document, "IsFullScreen")) && c(document, "CancelFullScreen") : h.fadeTo(1E3, a.opt.opacity).css({
                zIndex: 0
            }), g.html(jQuery.vimeo_player.controls.fullscreen), a.isAlone = !1;
            else {
                var m = function() {
                    a.overlay.css({
                        cursor: "none"
                    })
                };
                jQuery(document).on("mousemove.vimeo_player",
                    function(b) {
                        a.overlay.css({
                            cursor: "auto"
                        });
                        clearTimeout(a.hideCursor);
                        jQuery(b.target).parents().is(".vimeo_player_bar") || (a.hideCursor = setTimeout(m, 3E3))
                    });
                m();
                b ? (h.css({
                    opacity: 0
                }), h.addClass("vimeo_player_Fullscreen"), e(h.get(0)), setTimeout(function() {
                    h.fadeTo(1E3, 1);
                    a.wrapper.append(k);
                    jQuery(a).v_optimize_display()
                }, 500)) : h.css({
                    zIndex: 1E4
                }).fadeTo(1E3, 1);
                g.html(jQuery.vimeo_player.controls.showSite);
                a.isAlone = !0
            }
            return this
        }
    };
    jQuery.fn.vimeo_player = jQuery.vimeo_player.buildPlayer;
    jQuery.fn.v_play =
        jQuery.vimeo_player.play;
    jQuery.fn.v_toggle_play = jQuery.vimeo_player.togglePlay;
    jQuery.fn.v_change_movie = jQuery.vimeo_player.changeMovie;
    jQuery.fn.v_pause = jQuery.vimeo_player.pause;
    jQuery.fn.v_seekTo = jQuery.vimeo_player.seekTo;
    jQuery.fn.v_optimize_display = jQuery.vimeo_player.optimizeVimeoDisplay;
    jQuery.fn.v_set_align = jQuery.vimeo_player.setAlign;
    jQuery.fn.v_get_align = jQuery.vimeo_player.getAlign;
    jQuery.fn.v_fullscreen = jQuery.vimeo_player.fullscreen;
    jQuery.fn.v_mute = jQuery.vimeo_player.mute;
    jQuery.fn.v_unmute =
        jQuery.vimeo_player.unmute;
    jQuery.fn.v_set_volume = jQuery.vimeo_player.setVolume;
    jQuery.fn.v_toggle_volume = jQuery.vimeo_player.toggleVolume
})(jQuery);
var nAgt = navigator.userAgent;
if (!jQuery.browser) {
    var isTouchSupported = function() {
        var d = nAgt.msMaxTouchPoints,
            b = "ontouchstart" in document.createElement("div");
        return d || b ? !0 : !1
    };
    jQuery.browser = {};
    jQuery.browser.mozilla = !1;
    jQuery.browser.webkit = !1;
    jQuery.browser.opera = !1;
    jQuery.browser.safari = !1;
    jQuery.browser.chrome = !1;
    jQuery.browser.androidStock = !1;
    jQuery.browser.msie = !1;
    jQuery.browser.edge = !1;
    jQuery.browser.hasTouch = isTouchSupported();
    jQuery.browser.ua = nAgt;
    jQuery.browser.name = navigator.appName;
    jQuery.browser.fullVersion = "" +
        parseFloat(navigator.appVersion);
    jQuery.browser.majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;
    if (-1 != (verOffset = nAgt.indexOf("Opera"))) jQuery.browser.opera = !0, jQuery.browser.name = "Opera", jQuery.browser.fullVersion = nAgt.substring(verOffset + 6), -1 != (verOffset = nAgt.indexOf("Version")) && (jQuery.browser.fullVersion = nAgt.substring(verOffset + 8));
    else if (-1 != (verOffset = nAgt.indexOf("OPR"))) jQuery.browser.opera = !0, jQuery.browser.name = "Opera", jQuery.browser.fullVersion = nAgt.substring(verOffset +
        4);
    else if (-1 != (verOffset = nAgt.indexOf("MSIE"))) jQuery.browser.msie = !0, jQuery.browser.name = "Microsoft Internet Explorer", jQuery.browser.fullVersion = nAgt.substring(verOffset + 5);
    else if (-1 != nAgt.indexOf("Trident")) {
        jQuery.browser.msie = !0;
        jQuery.browser.name = "Microsoft Internet Explorer";
        var start = nAgt.indexOf("rv:") + 3,
            end = start + 4;
        jQuery.browser.fullVersion = nAgt.substring(start, end)
    } else -1 != (verOffset = nAgt.indexOf("Edge")) ? (jQuery.browser.edge = !0, jQuery.browser.name = "Microsoft Edge", jQuery.browser.fullVersion =
        nAgt.substring(verOffset + 5)) : -1 != (verOffset = nAgt.indexOf("Chrome")) ? (jQuery.browser.webkit = !0, jQuery.browser.chrome = !0, jQuery.browser.name = "Chrome", jQuery.browser.fullVersion = nAgt.substring(verOffset + 7)) : -1 < nAgt.indexOf("mozilla/5.0") && -1 < nAgt.indexOf("android ") && -1 < nAgt.indexOf("applewebkit") && !(-1 < nAgt.indexOf("chrome")) ? (verOffset = nAgt.indexOf("Chrome"), jQuery.browser.webkit = !0, jQuery.browser.androidStock = !0, jQuery.browser.name = "androidStock", jQuery.browser.fullVersion = nAgt.substring(verOffset +
        7)) : -1 != (verOffset = nAgt.indexOf("Safari")) ? (jQuery.browser.webkit = !0, jQuery.browser.safari = !0, jQuery.browser.name = "Safari", jQuery.browser.fullVersion = nAgt.substring(verOffset + 7), -1 != (verOffset = nAgt.indexOf("Version")) && (jQuery.browser.fullVersion = nAgt.substring(verOffset + 8))) : -1 != (verOffset = nAgt.indexOf("AppleWebkit")) ? (jQuery.browser.webkit = !0, jQuery.browser.safari = !0, jQuery.browser.name = "Safari", jQuery.browser.fullVersion = nAgt.substring(verOffset + 7), -1 != (verOffset = nAgt.indexOf("Version")) && (jQuery.browser.fullVersion =
        nAgt.substring(verOffset + 8))) : -1 != (verOffset = nAgt.indexOf("Firefox")) ? (jQuery.browser.mozilla = !0, jQuery.browser.name = "Firefox", jQuery.browser.fullVersion = nAgt.substring(verOffset + 8)) : (nameOffset = nAgt.lastIndexOf(" ") + 1) < (verOffset = nAgt.lastIndexOf("/")) && (jQuery.browser.name = nAgt.substring(nameOffset, verOffset), jQuery.browser.fullVersion = nAgt.substring(verOffset + 1), jQuery.browser.name.toLowerCase() == jQuery.browser.name.toUpperCase() && (jQuery.browser.name = navigator.appName)); - 1 != (ix = jQuery.browser.fullVersion.indexOf(";")) &&
        (jQuery.browser.fullVersion = jQuery.browser.fullVersion.substring(0, ix)); - 1 != (ix = jQuery.browser.fullVersion.indexOf(" ")) && (jQuery.browser.fullVersion = jQuery.browser.fullVersion.substring(0, ix));
    jQuery.browser.majorVersion = parseInt("" + jQuery.browser.fullVersion, 10);
    isNaN(jQuery.browser.majorVersion) && (jQuery.browser.fullVersion = "" + parseFloat(navigator.appVersion), jQuery.browser.majorVersion = parseInt(navigator.appVersion, 10));
    jQuery.browser.version = jQuery.browser.majorVersion
}
jQuery.browser.android = /Android/i.test(nAgt);
jQuery.browser.blackberry = /BlackBerry|BB|PlayBook/i.test(nAgt);
jQuery.browser.ios = /iPhone|iPad|iPod|webOS/i.test(nAgt);
jQuery.browser.operaMobile = /Opera Mini/i.test(nAgt);
jQuery.browser.windowsMobile = /IEMobile|Windows Phone/i.test(nAgt);
jQuery.browser.kindle = /Kindle|Silk/i.test(nAgt);
jQuery.browser.mobile = jQuery.browser.android || jQuery.browser.blackberry || jQuery.browser.ios || jQuery.browser.windowsMobile || jQuery.browser.operaMobile || jQuery.browser.kindle;
jQuery.isMobile = jQuery.browser.mobile;
jQuery.isTablet = jQuery.browser.mobile && 765 < jQuery(window).width();
jQuery.isAndroidDefault = jQuery.browser.android && !/chrome/i.test(nAgt);
nAgt = navigator.userAgent;
jQuery.browser || (jQuery.browser = {}, jQuery.browser.mozilla = !1, jQuery.browser.webkit = !1, jQuery.browser.opera = !1, jQuery.browser.safari = !1, jQuery.browser.chrome = !1, jQuery.browser.androidStock = !1, jQuery.browser.msie = !1, jQuery.browser.ua = nAgt, jQuery.browser.name = navigator.appName, jQuery.browser.fullVersion = "" + parseFloat(navigator.appVersion), jQuery.browser.majorVersion = parseInt(navigator.appVersion, 10), -1 != (verOffset = nAgt.indexOf("Opera")) ? (jQuery.browser.opera = !0, jQuery.browser.name = "Opera", jQuery.browser.fullVersion =
    nAgt.substring(verOffset + 6), -1 != (verOffset = nAgt.indexOf("Version")) && (jQuery.browser.fullVersion = nAgt.substring(verOffset + 8))) : -1 != (verOffset = nAgt.indexOf("OPR")) ? (jQuery.browser.opera = !0, jQuery.browser.name = "Opera", jQuery.browser.fullVersion = nAgt.substring(verOffset + 4)) : -1 != (verOffset = nAgt.indexOf("MSIE")) ? (jQuery.browser.msie = !0, jQuery.browser.name = "Microsoft Internet Explorer", jQuery.browser.fullVersion = nAgt.substring(verOffset + 5)) : -1 != nAgt.indexOf("Trident") || -1 != nAgt.indexOf("Edge") ? (jQuery.browser.msie = !0, jQuery.browser.name = "Microsoft Internet Explorer", start = nAgt.indexOf("rv:") + 3, end = start + 4, jQuery.browser.fullVersion = nAgt.substring(start, end)) : -1 != (verOffset = nAgt.indexOf("Chrome")) ? (jQuery.browser.webkit = !0, jQuery.browser.chrome = !0, jQuery.browser.name = "Chrome", jQuery.browser.fullVersion = nAgt.substring(verOffset + 7)) : -1 < nAgt.indexOf("mozilla/5.0") && -1 < nAgt.indexOf("android ") && -1 < nAgt.indexOf("applewebkit") && !(-1 < nAgt.indexOf("chrome")) ? (verOffset = nAgt.indexOf("Chrome"), jQuery.browser.webkit = !0,
    jQuery.browser.androidStock = !0, jQuery.browser.name = "androidStock", jQuery.browser.fullVersion = nAgt.substring(verOffset + 7)) : -1 != (verOffset = nAgt.indexOf("Safari")) ? (jQuery.browser.webkit = !0, jQuery.browser.safari = !0, jQuery.browser.name = "Safari", jQuery.browser.fullVersion = nAgt.substring(verOffset + 7), -1 != (verOffset = nAgt.indexOf("Version")) && (jQuery.browser.fullVersion = nAgt.substring(verOffset + 8))) : -1 != (verOffset = nAgt.indexOf("AppleWebkit")) ? (jQuery.browser.webkit = !0, jQuery.browser.safari = !0, jQuery.browser.name =
    "Safari", jQuery.browser.fullVersion = nAgt.substring(verOffset + 7), -1 != (verOffset = nAgt.indexOf("Version")) && (jQuery.browser.fullVersion = nAgt.substring(verOffset + 8))) : -1 != (verOffset = nAgt.indexOf("Firefox")) ? (jQuery.browser.mozilla = !0, jQuery.browser.name = "Firefox", jQuery.browser.fullVersion = nAgt.substring(verOffset + 8)) : (nameOffset = nAgt.lastIndexOf(" ") + 1) < (verOffset = nAgt.lastIndexOf("/")) && (jQuery.browser.name = nAgt.substring(nameOffset, verOffset), jQuery.browser.fullVersion = nAgt.substring(verOffset + 1),
    jQuery.browser.name.toLowerCase() == jQuery.browser.name.toUpperCase() && (jQuery.browser.name = navigator.appName)), -1 != (ix = jQuery.browser.fullVersion.indexOf(";")) && (jQuery.browser.fullVersion = jQuery.browser.fullVersion.substring(0, ix)), -1 != (ix = jQuery.browser.fullVersion.indexOf(" ")) && (jQuery.browser.fullVersion = jQuery.browser.fullVersion.substring(0, ix)), jQuery.browser.majorVersion = parseInt("" + jQuery.browser.fullVersion, 10), isNaN(jQuery.browser.majorVersion) && (jQuery.browser.fullVersion = "" + parseFloat(navigator.appVersion),
    jQuery.browser.majorVersion = parseInt(navigator.appVersion, 10)), jQuery.browser.version = jQuery.browser.majorVersion);
jQuery.browser.android = /Android/i.test(nAgt);
jQuery.browser.blackberry = /BlackBerry|BB|PlayBook/i.test(nAgt);
jQuery.browser.ios = /iPhone|iPad|iPod|webOS/i.test(nAgt);
jQuery.browser.operaMobile = /Opera Mini/i.test(nAgt);
jQuery.browser.windowsMobile = /IEMobile|Windows Phone/i.test(nAgt);
jQuery.browser.kindle = /Kindle|Silk/i.test(nAgt);
jQuery.browser.mobile = jQuery.browser.android || jQuery.browser.blackberry || jQuery.browser.ios || jQuery.browser.windowsMobile || jQuery.browser.operaMobile || jQuery.browser.kindle;
jQuery.isMobile = jQuery.browser.mobile;
jQuery.isTablet = jQuery.browser.mobile && 765 < jQuery(window).width();
jQuery.isAndroidDefault = jQuery.browser.android && !/chrome/i.test(nAgt);
(function(d) {
    d.simpleSlider = {
        defaults: {
            initialval: 0,
            scale: 100,
            orientation: "h",
            readonly: !1,
            callback: !1
        },
        events: {
            start: d.browser.mobile ? "touchstart" : "mousedown",
            end: d.browser.mobile ? "touchend" : "mouseup",
            move: d.browser.mobile ? "touchmove" : "mousemove"
        },
        init: function(b) {
            return this.each(function() {
                var c = this,
                    e = d(c);
                e.addClass("simpleSlider");
                c.opt = {};
                d.extend(c.opt, d.simpleSlider.defaults, b);
                d.extend(c.opt, e.data());
                var a = "h" == c.opt.orientation ? "horizontal" : "vertical",
                    a = d("<div/>").addClass("level").addClass(a);
                e.prepend(a);
                c.level = a;
                e.css({
                    cursor: "default"
                });
                "auto" == c.opt.scale && (c.opt.scale = d(c).outerWidth());
                e.updateSliderVal();
                c.opt.readonly || (e.on(d.simpleSlider.events.start, function(a) {
                    d.browser.mobile && (a = a.changedTouches[0]);
                    c.canSlide = !0;
                    e.updateSliderVal(a);
                    "h" == c.opt.orientation ? e.css({
                        cursor: "col-resize"
                    }) : e.css({
                        cursor: "row-resize"
                    });
                    a.preventDefault();
                    a.stopPropagation()
                }), d(document).on(d.simpleSlider.events.move, function(a) {
                    d.browser.mobile && (a = a.changedTouches[0]);
                    c.canSlide && (d(document).css({
                            cursor: "default"
                        }),
                        e.updateSliderVal(a), a.preventDefault(), a.stopPropagation())
                }).on(d.simpleSlider.events.end, function() {
                    d(document).css({
                        cursor: "auto"
                    });
                    c.canSlide = !1;
                    e.css({
                        cursor: "auto"
                    })
                }))
            })
        },
        updateSliderVal: function(b) {
            var c = this.get(0);
            if (c.opt) {
                c.opt.initialval = "number" == typeof c.opt.initialval ? c.opt.initialval : c.opt.initialval(c);
                var e = d(c).outerWidth(),
                    a = d(c).outerHeight();
                c.x = "object" == typeof b ? b.clientX + document.body.scrollLeft - this.offset().left : "number" == typeof b ? b * e / c.opt.scale : c.opt.initialval * e / c.opt.scale;
                c.y = "object" == typeof b ? b.clientY + document.body.scrollTop - this.offset().top : "number" == typeof b ? (c.opt.scale - c.opt.initialval - b) * a / c.opt.scale : c.opt.initialval * a / c.opt.scale;
                c.y = this.outerHeight() - c.y;
                c.scaleX = c.x * c.opt.scale / e;
                c.scaleY = c.y * c.opt.scale / a;
                c.outOfRangeX = c.scaleX > c.opt.scale ? c.scaleX - c.opt.scale : 0 > c.scaleX ? c.scaleX : 0;
                c.outOfRangeY = c.scaleY > c.opt.scale ? c.scaleY - c.opt.scale : 0 > c.scaleY ? c.scaleY : 0;
                c.outOfRange = "h" == c.opt.orientation ? c.outOfRangeX : c.outOfRangeY;
                c.value = "undefined" != typeof b ?
                    "h" == c.opt.orientation ? c.x >= this.outerWidth() ? c.opt.scale : 0 >= c.x ? 0 : c.scaleX : c.y >= this.outerHeight() ? c.opt.scale : 0 >= c.y ? 0 : c.scaleY : "h" == c.opt.orientation ? c.scaleX : c.scaleY;
                "h" == c.opt.orientation ? c.level.width(Math.floor(100 * c.x / e) + "%") : c.level.height(Math.floor(100 * c.y / a));
                "function" == typeof c.opt.callback && c.opt.callback(c)
            }
        }
    };
    d.fn.simpleSlider = d.simpleSlider.init;
    d.fn.updateSliderVal = d.simpleSlider.updateSliderVal
})(jQuery);