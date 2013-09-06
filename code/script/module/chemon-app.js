// CHEMON COMMON PLUGIN

var Chemon = {
    timmer: {}, // for the tile plugin interval timmer
    log: function (obj) {
        if (!window.console || !window.console.log) return false;
        console.log("【Chemon日志】〖" + (new Date()).toLocaleString() + "〗");
        console.log(obj);
    },
    share: {},
    ltIE9 : (navigator.userAgent.match(/msie \d{1,2}/i) && navigator.userAgent.match(/msie \d{1,2}/i)[0].substring(5) - 0 < 10),
    isPad : navigator.userAgent.match(/ipad/i)
};

// TILE
;(function ($) {
    // "use strict";

    var Tile = function () {
        this.settings = {
            speed: 5000
        };
    }, tile = new Tile();

    Tile.prototype.method = {
        init: function () {
            return this.each(function (index) {
                var $this = $(this),
                    timmerId = (new Date()).getTime() + index,
                    _height = $this.find("li").outerHeight(true);
                $this.data("timmerId", timmerId);
                setTimeout(function () {
                    Chemon.timmer[timmerId] = setInterval(function () {
                        $this.animate({"margin-top": "-" + _height + "px"}, 750, function () {
                            $this.css("margin-top", 0)
                                .find("li:first").detach().insertAfter($this.find("li:last"));
                        });
                    }, tile.settings.speed);
                }, index * 2000);
                timmerId = null;
            });
        },

        stop: function () {
            return this.each(function (index) {
                var timmerId = $(this).data("timmerId");
                clearInterval(Chemon.timmer[timmerId]);
                timmerId = null;
            });
        }
    };

    $.fn.tile = function () {
        var arg0 = arguments[0],
            method = tile.method.init,
            args = [];
        if (typeof(arg0) == "object") {
            tile.settings = $.extend(tile.settings, arg0);
        } else if (typeof(arg0) == "string" && tile.method[arg0]) {
            method = tile.method[arg0];
            args = Array.prototype.slice.call(arguments, 1);
        } else if (arg0) {
            $.error("METHOD '" + arg0 + "' DOES NOT EXIST ON jQuery.Tile");
            return this;
        }
        arg0 = null;
        return method.apply(this, args);
    };

})(jQuery);

// SCROLL-HORIZONTAL
;(function ($) {
    // "use strict";

    var ScrollHorizontal = function () {
        this.settings = {
            speed: 400,
            maxSize: 3
        };
    }, scrollHorizontal = new ScrollHorizontal();

    ScrollHorizontal.prototype.method = {
        init: function () {
            return this.each(function () {
                var $this = $(this),
                    $ul = $this.parents(".scroll-horizontal").find($this.attr("data-target")),
                    toggleDir = $this.attr("toggle-dir") == "left" ? 1 : -1,
                    currStatus = {
                        count: $ul.find("li").length,
                        maxSize: scrollHorizontal.settings.maxSize,
                        _w: parseInt($ul.find("li").outerWidth()) + (parseInt($ul.find("li").css("margin-left")) || 0) + (parseInt($ul.find("li").css("margin-right")) || 0),
                        leftDis: (parseInt($ul.css("margin-left")) || 0),
                        times: 0
                    };
                toggleDir == 1 ? $this.addClass("disabled") : currStatus.maxSize >= currStatus.count ? $this.addClass("disabled") : $this.removeClass("disabled");
                $ul.data("currStatus", currStatus).removeAttr("style");
                currStatus = $this = $ul = toggleDir = null;
            });
        },

        move: function () {
            var $this = this,
                $ul = $this.parents(".scroll-horizontal").find($this.attr("data-target")),
                toggleDir = $this.attr("toggle-dir") == "left" ? 1 : -1,
                currStatus = $ul.data("currStatus") || {};
            $ul.animate({"margin-left": (currStatus.leftDis + toggleDir * currStatus._w) + "px"}, scrollHorizontal.settings.speed, function () {
                currStatus.times = (-1 * parseInt($ul.css("margin-left"))) / currStatus._w;
                currStatus.leftDis = parseInt($ul.css("margin-left") || "0");
                $this.parent().find("[toggle-dir='left']").toggleClass("disabled", currStatus.times <= 0);
                $this.parent().find("[toggle-dir='right']").toggleClass("disabled", currStatus.maxSize + currStatus.times >= currStatus.count);
                $ul.data("currStatus", currStatus);
                currStatus = $this = $ul = toggleDir = null;
            });
        }
    };

    $.fn.scrollHorizontal = function () {
        var arg0 = arguments[0],
            method = scrollHorizontal.method.init,
            args = [];
        if (typeof(arg0) == "object") {
            scrollHorizontal.settings = $.extend(scrollHorizontal.settings, arg0);
        } else if (typeof(arg0) == "string" && scrollHorizontal.method[arg0]) {
            method = scrollHorizontal.method[arg0];
            args = Array.prototype.slice.call(arguments, 1);
        } else if (arg0) {
            $.error("METHOD '" + arg0 + "' DOES NOT EXIST ON jQuery.scrollHorizontal");
            return this;
        }
        arg0 = null;
        return method.apply(this, args);
    };

})(jQuery);

// 修改默认bootstrap菜单
;(function ($, window) {
    // "use strict";

    var CustomDropdown = function () {};

    CustomDropdown.prototype.initBind = {
        hover: function ($this, flag) {
            return flag == 1 ? ($this.addClass("open")) : ($this.removeClass("open"));
        },
        click: function ($this) {
            window.location = $this.attr("href") || "/";
            return false;
        }
    };

    window.customDropdown = new CustomDropdown();
})(jQuery, window);

// 修改默认的上传表单样式
;(function($) {
    // "user strict";

    $.fn.customFileInput = function() {
        return (this && this.length > 0) ? this.each(function(i) {
            var $this = $(this),
                _id = this.id || "file_" + (new Date()).getTime() + i;
            $this.attr({
                id          : _id,
                onchange    : _id + "_txt.value=this.value"
            }).wrap("<div class='fileinput " + $this.attr("class") + "'></div>");
            var _div = $("<div><input type='text' placeholder='请选择文件' /><button class='btn btn-primary' type='button'><i class='icomoon-arrow-up-2'></i></button></div>");
            _div.find("input").attr({
                id          : _id + "_txt",
                onclick     : _id + ".click();",
                "class"       : $this.attr("class")
            }).end().find("button").attr({
                onclick     : _id + ".click();"
            });
            $this.after(_div);
            _div = _id = $this = null;
        }) : this;
    }
})(jQuery);

// 侧边导航栏
;(function($) {
    // "use strict";

    $.fn.metroSidebarTouching = function() {
        return this.each(function() {
            var startX = 0, disX = 0, self = this, len = $(".namespace").hasClass('metro-us') ? 150 : $(this).hasClass('us') ? 150 : 109;
            self.addEventListener || (self.addEventListener = function(){}); // FOR IE 7、8
            self.addEventListener("touchstart", function(e) {
                startX = e.touches[0].pageX;
            }, false);
            self.addEventListener("touchmove", function(e) {
                e.preventDefault();
                disX = e.touches[0].pageX - startX;
                return Math.abs(disX) < 40 ? true : disX < 0 ? $(self).css("right", "0") : $(self).css("right", "-" + len + "px");
            }, false);
        });
    };
})(jQuery);

// BOX
;(function($) {

  var Box = function (element, options) {
    this.options = options
    this.$element = $(element).delegate('[data-dismiss="box"]', 'click.dismiss.box', $.proxy(this.hide, this))
    this.options.remote && this.$element.find('.box-body').load(this.options.remote)
  }

  Box.prototype = {

      constructor: Box

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          // , e = $.Event('boxshow')

        // this.$element.trigger(e)

        if (this.isShown) return

        this.isShown = true

        this.escape()

        this.backdrop(function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move boxs dom position
          }

          that.$element.show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element.addClass('in').attr('aria-hidden', false)

        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        if (!this.isShown) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.box')

        this.$element.removeClass('in').attr('aria-hidden', true)

        $.support.transition && this.$element.hasClass('fade') ? this.hideWithTransition() : this.hidebox()

      }

    , enforceFocus: function () {
        var that = this
        $(document).on('focusin.box', function (e) {
          if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
            that.$element.focus()
          }
        })
      }

    , escape: function () {
        var that = this
        if (this.isShown && this.options.keyboard) {
          this.$element.on('keyup.dismiss.box', function ( e ) {
            e.which == 27 && that.hide()
          })
        } else if (!this.isShown) {
          this.$element.off('keyup.dismiss.box')
        }
      }

    , hideWithTransition: function () {
        var that = this
          , timeout = setTimeout(function () {
              that.$element.off($.support.transition.end)
              that.hidebox()
            }, 500)

        this.$element.one($.support.transition.end, function () {
          clearTimeout(timeout)
          that.hidebox()
        })
      }

    , hidebox: function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
          that.removeBackdrop()
          that.options.boxback(); // 触发回调函数
        })
      }

    , removeBackdrop: function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
      }

    , backdrop: function (callback) {
        var that = this
          , animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
          var doAnimate = $.support.transition && animate

          this.$backdrop = $('<div class="box-backdrop ' + animate + '" />').appendTo(document.body)

          this.$backdrop.click(
            this.options.backdrop == 'static' ?
              $.proxy(this.$element[0].focus, this.$element[0])
            : $.proxy(this.hide, this)
          )
          if (doAnimate) this.$backdrop[0].offsetWidth // force reflow
          this.$backdrop.addClass('in')
          if (!callback) return
          doAnimate ? this.$backdrop.one($.support.transition.end, callback) : callback()

        } else if (!this.isShown && this.$backdrop) {
          this.$backdrop.removeClass('in')

          $.support.transition && this.$element.hasClass('fade')?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (callback) {
          callback()
        }
      }
  }

  $.fn.box = function (option) {
    return this.each(function () {
      var $this = $(this), data = $this.data('box'), 
            options = $.extend({}, $.fn.box.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('box', (data = new Box(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.box.defaults = {
      backdrop: true
    , keyboard: false
    , show: true
    , boxback : function(){}
  }

  $.fn.box.Constructor = Box

})(jQuery);


// ALERT BOX
;(function($, window) {
    window.alert = function(str1, callback, lan) {
        str1 = str1 + "";
        str1 = str1.replace(/\</g, "&lt;");
        str1 = str1.replace(/\>/g, "&gt;");
        str1 = str1.replace(/\//g, "&#47;");
        if (typeof callback === "string") {lan = callback; callback = undefined;}
        callback = callback || (function() {});
        var $box = $("<div class='modal fade hide alert-box'><div class='modal-body'>" + str1 + "</div><div class='modal-footer'><button class='btn btn-primary callback-btn' type='button' data-dismiss='box'>" + ((lan && lan == "en") ? "OK" : "确定") + "</button></div></div>").appendTo(document.body)
        $box.box({boxback : function() {
            $box.remove(); setTimeout(callback, 400); $box = null;
        }}).box("show")
        // return str1; //不能有返回值
    };
    
    window.confirm = function(str2, callback, lan) {
        str2 = str2 + "";
        str2 = str2.replace(/\</g, "&lt;");
        str2 = str2.replace(/\>/g, "&gt;");
        str2 = str2.replace(/\//g, "&#47;");
        callback = callback || function() {};
        var $box = $("<div class='modal fade hide alert-box'><div class='modal-body'>" + str2 + "</div><div class='modal-footer'><button class='btn' type='button' data-dismiss='box'>" + ((lan && lan == "en") ? "No" : "取消") + "</button><button class='btn btn-primary callback-btn' type='button' data-dismiss='box'>" + (lan == "en" ? "OK" : "确定") + "</button></div></div>").appendTo(document.body)
        $box.box({boxback : function() {$box.remove();}})
        .find(".callback-btn").one("click", function() {setTimeout(callback, 450);});
        // return str2;
    };
})(jQuery, window);

// spinner
;(function ($) {

    var Spinner = function (element, options) {
        this.$el = $(element);
        this.options = options;
        this.init(element, options);
    };

    Spinner.prototype = {
        constructor: Spinner,

        init: function (element, options) {

            this.$el.wrap("<div class='input-append input-prepend'></div>");
            $("<span class='add-on'><i class='icon-minus' style='cursor: pointer;' onselectstart='return false;'></i></span>").insertBefore(this.$el);
            $("<span class='add-on'><i class='icon-plus' style='cursor: pointer;' onselectstart='return false;'></i></span>").insertAfter(this.$el);

            var parent = this.$el.parent();
            parent.find(".icon-minus").parent(".add-on").on("mousedown", $.proxy(this.minus, this));
            parent.find(".icon-plus").parent(".add-on").on("mousedown", $.proxy(this.plus, this));
            parent.find(".icon-plus,.icon-minus").parent(".add-on").on("mouseup", $.proxy(this.removeInterval, this));
            parent.find(".icon-plus,.icon-minus").parent(".add-on").on("mouseleave", $.proxy(this.removeInterval, this));

//            this.$el.val(options.start);
        },

        minus: function () {
            var that = this;
            this.removeInterval();
            this.intervalId = setInterval(function () {
                var num = that.parseNumber();
                var target = num - that.options.step;
                that.setNumber(target < that.options.min ? that.options.min : target);
            }, this.options.interval);
        },

        setNumber: function (num) {
            num = isNaN(num) ? 0 : parseInt(num);
            if (num != null) {
                this.$el.val(num);
            }
        },

        plus: function () {
            var that = this;
            this.removeInterval();
            this.intervalId = setInterval(function () {
                var num = that.parseNumber();
                var target = num + that.options.step;
                that.setNumber(target > that.options.max ? that.options.max : target);
            }, this.options.interval);
        },

        parseNumber: function () {
            var num = parseInt(this.$el.val());
            return !num || isNaN(num) ? 0 : num;
        },

        removeInterval: function () {
            if (this.intervalId) {
                window.clearInterval(this.intervalId);
            }
        }

    };

    $.fn.spinner = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('spinner')
                , options = $.extend({}, $.fn.spinner.defaults, $this.data(), typeof option == 'object' && option);
            if (!data) $this.data('spinner', (data = new Spinner(this, options)));
            if (typeof option == 'string') data.to(option);
        })

    };

    $.fn.spinner.defaults = {
        min: 0,
        max: 100,
        step: 1,
        start: 0,
        interval: 80
    };
})(jQuery);


Chemon.App = {

    handleScrollHorizontal: function () {
        var ctx = arguments.length > 0 ? arguments[0] : null, 
            setting = {
                maxSize : $(document.body).width() >= 1200 ? 4 : 3
            };
        $(".scroll-controls", ctx).find("[data-action='scroll-horizontal']").scrollHorizontal(setting).end()
            .on("click.chemon", "[data-action='scroll-horizontal']", function (e) {
                !e && (e = window.event);e.preventDefault();
                return $(this).hasClass("disabled") ? $(this) : $(this).scrollHorizontal("move");
            });
    },

    handleScrollTop: function () {
        var $window = $(window),
            $elem = $("[data-action='scrolltop']"),
            max = $elem.attr("scroll-affix") || 1000;
        $window.scrollTop() < max && ($elem.hide());
        $(document).on("click.chemon", "[data-action='scrolltop']", function (e) {
            !e && (e = window.event);
            e.preventDefault();
            var curr, timmer;
            timmer = setInterval(function () {
                curr = document.documentElement.scrollTop || document.body.scrollTop;
                curr -= 60;
                if (curr > 0) {
                    window.scrollTo(0, curr);
                } else {
                    window.scrollTo(0, 0);
                    clearInterval(timmer);
                }
            }, 10);
        });

        $window.on("scroll.chemon", function () {
            if ($(this).scrollTop() >= max) {
                $elem.fadeIn();
            } else {
                $elem.fadeOut();
            }
        });
    },

    handleDateTimePickers: function () {
        var ctx = arguments.length > 0 ? arguments[0] : null;
        if (jQuery().datepicker) {
            var datePickers = $('.date-picker', ctx);
            for (var i = 0; i < datePickers.size(); i++) {
                var datePicker = $(datePickers[i]);
                var dataDateFormat = datePicker.attr("data-date-format");
                var dateFormat = datePicker.attr("date-format");
                var startDate = datePicker.data("startDate");
                datePicker.datepicker({format: dataDateFormat || dateFormat || "yyyy-mm-dd", weekStart: 1, onRender: function (date) {
                    if (startDate && date.getTime() < DPGlobal.parseDate(startDate, DPGlobal.parseFormat("yyyy-mm-dd")).getTime()) {
                        return "disabled";
                    }
                }});
            }
        }

        if (jQuery().timepicker) {
            $('.timepicker-default', ctx).timepicker();
            $('.timepicker-24', ctx).timepicker({
                minuteStep: 1,
                showSeconds: true,
                showMeridian: false
            });
        }

        if (!jQuery().daterangepicker) {
            return;
        }

        $('.date-range', ctx).daterangepicker();

        $('#dashboard-report-range', ctx).daterangepicker({
                ranges: {
                    'Today': ['today', 'today'],
                    'Yesterday': ['yesterday', 'yesterday'],
                    'Last 7 Days': [Date.today().add({
                        days: -6
                    }), 'today'],
                    'Last 30 Days': [Date.today().add({
                        days: -29
                    }), 'today'],
                    'This Month': [Date.today().moveToFirstDayOfMonth(), Date.today().moveToLastDayOfMonth()],
                    'Last Month': [Date.today().moveToFirstDayOfMonth().add({
                        months: -1
                    }), Date.today().moveToFirstDayOfMonth().add({
                        days: -1
                    })]
                },
                opens: 'left',
                format: 'MM/dd/yyyy',
                separator: ' to ',
                startDate: Date.today().add({
                    days: -29
                }),
                endDate: Date.today(),
                minDate: '01/01/2012',
                maxDate: '12/31/2014',
                locale: {
                    applyLabel: 'Submit',
                    fromLabel: 'From',
                    toLabel: 'To',
                    customRangeLabel: 'Custom Range',
                    daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    firstDay: 1
                },
                showWeekNumbers: true,
                buttonClasses: ['btn-danger']
            },

            function (start, end) {
                App.blockUI(jQuery("#dashboard"));
                setTimeout(function () {
                    App.unblockUI(jQuery("#dashboard"));
                    $.gritter.add({
                        title: 'Dashboard',
                        text: 'Dashboard date range updated.'
                    });
                    App.scrollTo();
                }, 1000);
                $('#dashboard-report-range span').html(start.toString('MMMM d, yyyy') + ' - ' + end.toString('MMMM d, yyyy'));

            });

        $('#dashboard-report-range', ctx).show();

        $('#dashboard-report-range span', ctx).html(Date.today().add({
            days: -29
        }).toString('MMMM d, yyyy') + ' - ' + Date.today().toString('MMMM d, yyyy'));

        $('#form-date-range', ctx).daterangepicker({
                ranges: {
                    'Today': ['today', 'today'],
                    'Yesterday': ['yesterday', 'yesterday'],
                    'Last 7 Days': [Date.today().add({
                        days: -6
                    }), 'today'],
                    'Last 30 Days': [Date.today().add({
                        days: -29
                    }), 'today'],
                    'This Month': [Date.today().moveToFirstDayOfMonth(), Date.today().moveToLastDayOfMonth()],
                    'Last Month': [Date.today().moveToFirstDayOfMonth().add({
                        months: -1
                    }), Date.today().moveToFirstDayOfMonth().add({
                        days: -1
                    })]
                },
                opens: 'right',
                format: 'MM/dd/yyyy',
                separator: ' to ',
                startDate: Date.today().add({
                    days: -29
                }),
                endDate: Date.today(),
                minDate: '01/01/2012',
                maxDate: '12/31/2014',
                locale: {
                    applyLabel: 'Submit',
                    fromLabel: 'From',
                    toLabel: 'To',
                    customRangeLabel: 'Custom Range',
                    daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    firstDay: 1
                },
                showWeekNumbers: true,
                buttonClasses: ['btn-danger']
            },

            function (start, end) {
                $('#form-date-range span').html(start.toString('MMMM d, yyyy') + ' - ' + end.toString('MMMM d, yyyy'));
            });

        $('#form-date-range span', ctx).html(Date.today().add({
            days: -29
        }).toString('MMMM d, yyyy') + ' - ' + Date.today().toString('MMMM d, yyyy'));


        if (!jQuery().datepicker || !jQuery().timepicker) {
            return;
        }
    },

    handleChoosenSelect: function () {
        var ctx = arguments.length > 0 ? arguments[0] : null;
        if (!jQuery().chosen || navigator.userAgent.match(/ipad/i)) {
            return;
        }

        $(".chosen", ctx).chosen().change(function () {
            // $(this).valid();
        });
        $(".chosen-with-diselect", ctx).chosen({
            allow_single_deselect: true
        }).change(function () {
                // $(this).valid();
        });
    },

    handlePlaceholder: function () {
        var ctx = arguments.length > 0 ? arguments[0] : null;
        $("[placeholder]", ctx).placeholder();
    },

    handleCustomDropdown: function () {
        $(document).on("click.chemon", "[toggle-mode='hover']",function (e) {
            customDropdown.initBind["click"]($(this));
        }).on("mouseover.chemon", ".dropdown:has([toggle-mode='hover'])",function () {
                customDropdown.initBind["hover"]($(this), 1);
            }).on("mouseout.chemon", ".dropdown:has([toggle-mode='hover'])", function () {
                customDropdown.initBind["hover"]($(this), 0);
            });
    },

    handleTiles: function () {
        var ctx = arguments.length > 0 ? arguments[0] : null;
        $("[data-action='tile']", ctx).tile();
    },

    handleSpinner: function () {
        var ctx = arguments.length > 0 ? arguments[0] : null;
        $(".spinner", ctx).spinner();
    },

    handlePlaceholder: function () {
        var ctx = arguments.length > 0 ? arguments[0] : null;
        $("[placeholder]", ctx).placeholder();
    },

    handleICheck: function () {
        var type = ['blue', 'orange', 'red', 'green', 'yellow', 'grey', 'pink', 'purple', 'white'];
        $(".icheck-input").each(function() {
            var $this = $(this) , _type = "-blue";
            for (var i = 0,j = type.length; i < j; i++) {
                if ($this.hasClass(type[i])) {
                    _type = "-" + type[i];break;
                }
            }
            $this.iCheck({
                checkboxClass: ("icheckbox_minimal" + _type),
                radioClass: ("iradio_minimal" + _type)
            });
        });
        
    },

    handleCheckable: function () {
        var ctx = arguments.length > 0 ? arguments[0] : null;
        $(".checkable", ctx).each(function () {
            var $this = $(this);
            $this.toggleClass(function () {
                return $this.find(":radio, :checkbox").prop("checked") ? "active" : "";
            });
        }).on("click.chemon", function () {
            var $this = $(this), $input = $this.find("input");
            if ($input.attr("type") == "checkbox") {
                $input.prop("checked", !$this.hasClass("active")).trigger($this.hasClass('active') ? "ischecked" : "isunchecked");
            } else if ($input.attr("type") == "radio") {
                $this.hasClass("active") ? false : $input.prop("checked", true).trigger("ischecked");
            }
            $this = $input = null;
            return 1;
        });
    },

    handleCustomFileInput : function() {
        var ctx = arguments.length > 0 ? arguments[0] : null;
        $("input.boot-fileinput", ctx).customFileInput();
    },

    handleWrapResize : function() {
        var $wrap = $("div.metro div.content").find("div.wrap").css("width", $("body").width() + "px");
        $(window).resize(function() {
            var _width = $("body").width();
            // _width = _width >= 979 ? _width : 979;
            setTimeout(function() {
                $wrap.css("width", _width + "px");
            }, (Chemon.isMoving ? 500 : 0));
            return true;
        });
    },

    handleAccordion : function() {
        $(document).on("show", ".accordion-group", function() {
            $(this).addClass("active");
        }).on("hide", ".accordion-group", function() {
            $(this).removeClass("active");
        });
    },

    handleMetroSidebarTouching : function() {
        var ctx = arguments.length > 0 ? arguments[0] : null;
        $("div.metro-sidebar", ctx).metroSidebarTouching();
    },

    handleSlimscroll : function() {
        var ctx = arguments.length > 0 ? arguments[0] : null,
            ag = navigator.userAgent.toLowerCase(),
            $target = $("[slimscroll]", ctx);
        if (ag.match(/ipad/i)) {
            $target.css({"height" : "auto"}).parent().css("overflow-y", "auto"); //08.12
        } else if (ag.match(/msie/i) && ag.match(/touch/i)) {
            $target.css({"overflow-y" : "auto", "height" : "auto"}).parent().css({"overflow-y" : "auto", "margin-right" : "-25px"});
        } else {
            $target.slimscroll({
                height : "auto"
            });
        }
    },

    handleUploadInput : function() {
        var ctx = arguments.length > 0 ? arguments[0] : null;
        $(document).on("click.chemon", "[triggerUpload]", function(e) {
            e = e || window.event; e.preventDefault();
            $(this).parent().find("input:file").trigger("click");
        });
    },

    handleAjaxSection : function() {
        var ctx = arguments.length > 0 ? arguments[0] : null;
        $("[data-ajaxurl]").each(function() {
            var $this = $(this);
            $this.load($this.data("ajaxurl"), $this.data("param") || {}, function() {
                $this.trigger("ajaxcallback");
            });
        });
    },

    init: function () {
        //this.handlePlaceholder();
        this.handleSpinner();
        this.handleScrollHorizontal();
        this.handleScrollTop();
        this.handleCustomDropdown();
        this.handleTiles();
        this.handleICheck();
        this.handleCheckable();
        this.handleWrapResize();
        this.handleCustomFileInput();
        this.handleAccordion();
        this.handleMetroSidebarTouching();
        this.handleSlimscroll();
        this.handleUploadInput();
        this.handleDateTimePickers();
        this.handleChoosenSelect();
        this.handleAjaxSection();
    },

    initWithContext: function (methods, ctx) {
        var arr = methods.split(",");
        for (var i = 0; i < arr.length; i++) {
            this[arr[i]].apply(null, ctx);
        }
    }

};


function SetHome(obj, vrl) {
    try {
        obj.style.behavior = 'url(#default#homepage)';
        obj.setHomePage(vrl);
    } catch (e) {
        if (window.netscape) {
            try {
                netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
            } catch (e) {
                alert("此操作被浏览器拒绝！\n请在浏览器地址栏输入“about:config”并回车\n然后将 [signed.applets.codebase_principal_support]的值设置为'true',双击即可。");
            }
            var prefs = Components.classes['@mozilla.org/preferences-service;1']
                .getService(Components.interfaces.nsIPrefBranch);
            prefs.setCharPref('browser.startup.homepage', vrl);
        }
    }
}

//收藏
function AddFavorite(sURL, sTitle) {
    try {
        window.external.addFavorite(sURL, sTitle);
    } catch (e) {
        try {
            window.sidebar.addPanel(sTitle, sURL, "");
        } catch (e) {
            showTipDialog("加入收藏失败，请使用Ctrl+D进行添加");
        }
    }
}

Chemon.share = {
    style: "toolbar=0,resizable=1,scrollbars=yes,status=1,width=450,height=400",
    info: "CHEMON, 全球化工品外贸交易平台。",
    info_us : "I am very interested in this product! ",
    qq: function () {
        window.open("http://v.t.qq.com/share/share.php?title=" + encodeURIComponent(document.title) + "&info=" + this.info + "&url=" + encodeURIComponent(location.href) + "&source=bookmark", "_blank", this.style);
    },
    sina: function () {
        window.open('http://v.t.sina.com.cn/share/share.php?title=' + encodeURIComponent(document.title) + "&info=" + this.info + '&url=' + encodeURIComponent(location.href) + '&source=bookmark', "_blank", this.style);
    },
    renren: function () {
        window.open('http://share.renren.com/share/buttonshare.do?link=http://www.chemon.com&title=' + encodeURIComponent(document.title) + "&info=" + this.info + '&url=' + encodeURIComponent(location.href) + '&source=bookmark', "_blank", this.style);
    },
    douban: function () {
        window.open('http://www.douban.com/recommend/?url=' + encodeURIComponent(location.href) + "&info=" + this.info + '&title=' + encodeURIComponent(location.href), "douban", this.style);
    },
    wangyi: function() {
        window.open('http://t.163.com/article/user/checkLogin.do?title=' + encodeURIComponent(document.title) + '&url=' + encodeURIComponent(location.href) + "&source=bookmark", "_blank", this.style);
    },
    twitter: function() {
        window.open("https://twitter.com/intent/tweet?url=" + encodeURIComponent(location.href) + "&title=" + encodeURIComponent(document.title) + "&text=" + this.info_us + " " + encodeURIComponent(location.href) + "&source=bookmark", "_blank", this.style);
    },
    facebook: function() {
        window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(location.href) + "&title=" + encodeURIComponent(document.title), "_blank", this.style);
    }
};

function split( val ) {
  return val.split( /,\s*/ );
};
    
function extractLast( term ) {
  return split( term ).pop();
};

function toScrollFrame(iFrame, mask){   
    var mouseY = 0, mouseX = 0;   
    if (!navigator.userAgent.match(/ipad/i)) {
        return;
    }
    $(iFrame).ready(function(){   
        $(iFrame).contents()[0].body.addEventListener('touchstart', function(e){   
            mouseY = e.targetTouches[0].pageY;   
            mouseX = e.targetTouches[0].pageX;   
        });   
          
        $(iFrame).contents()[0].body.addEventListener('touchmove', function(e){   
            e.preventDefault();
            var box = $(mask);   
            box.scrollLeft(box.scrollLeft()+mouseX-e.targetTouches[0].pageX);   
            box.scrollTop(box.scrollTop()+mouseY-e.targetTouches[0].pageY);   
        });   
    });   
      
};

// READY INIT...
$(function() {
    $("a:has(i)").attr("onfocus", "this.blur()")
    // $(".header").find("a.arrow-back").attr("onfocus", "this.blur()");
    // $("#section").find("a.add-input").attr("onfocus", "this.blur()");
    $("div.ahrfsty3").click(function() {
        $(this).find(".seleck").toggle();
    });

    // 重置表单
    (function(f) {
        if (!f.length) {return;}
        $(document).on("click", "button:reset", function(e) {
            !e && (e = window.event); e.preventDefault();
            $(this).parents("form").get(0).reset();
            $(this).parents("form").find("input.icheck-input").iCheck("update");
        });
    })($("form"));

    (function(searchingbar) {
        if (!searchingbar.length) {return;}
        // SIDEBAR
        Chemon.Sidebar = {
            bar : $("#metroSidebar"),
            searching : $("#sideSearching"),
            w : $("#metroSidebar").hasClass('us') ? 150 : 105
        };
        // 如果不支持transition，则用animate
        if (Chemon.ltIE9) {
            Chemon.Sidebar.bar.css("right", ("-" + Chemon.Sidebar.w + "px")).find(".sidebar-inner").hover(function() {
                Chemon.Sidebar.bar.stop().animate({"right" : 0}, 400);
            }, function() {
                Chemon.Sidebar.bar.stop().animate({right : ("-" + Chemon.Sidebar.w + "px")}, 400);
            });
        }
        // 弹出搜索栏
        Chemon.Sidebar.bar.find("a[href='#sideSearching']").click(function(e) {
            !e && (e = window.event);e.preventDefault();
            Chemon.ltIE9 ? Chemon.Sidebar.bar.stop().animate({right : ("-" + Chemon.Sidebar.w + "px")}, 500) : Chemon.Sidebar.bar.css("right", ("-" + Chemon.Sidebar.w + "px"));
            Chemon.Sidebar.searching.animate({right : 0}, 500, function() {
                $(this).find("input:first").focus().val("");
                (Chemon.ltIE9 || Chemon.isPad) ? 0 : Chemon.Sidebar.bar.removeAttr("style");
                var ev = $.Event("searching:show");
                $(this).trigger(ev);
            });
        });
        Chemon.Sidebar.searching.find("div.searching-title i").click(function(e) {
            Chemon.Sidebar.searching.animate({right : "-250px"}, 500);
        });

        $("#searchingInput").on("keydown", function(e) {
            if ( e.keyCode === $.ui.keyCode.TAB && $(this).data("ui-autocomplete").menu.active ) {
              e.preventDefault();
            }
        }).autocomplete({
            source: function( request, response ) {
              $.getJSON(this.element.attr("autocomplete-url"), {
                "keywords": extractLast(request.term),
                "area" : parseInt(Chemon.Sidebar.searching.find(".searching-options .active").attr("searching-area")) || 0
              }, response);
            },
            focus: function() {
              // prevent value inserted on focus
              return false;
            },
            select: function( event, ui ) {
              // alert("选择了" + ui.item.value);
            }
        }).data("ui-autocomplete")._renderItem = function(ul, item) {
            var la = item.label;
            la = (la ? ("CAS:[" + la + "]&nbsp;&nbsp;(" + item.number + ")<br>") : ""); // 拼接规则
            return $("<li>").append("<a>" + la + item.value + "</a>").appendTo(ul);
        };
        Chemon.Sidebar.searching.find("input[name='area']").each(function() {
            $(this).val($(this).siblings('.btn.active').attr("searching-area"));
        }).end().on("click.chemon", "button[searching-area]", function() {
            var $this = $(this), ev = $.Event("area:change"), _input = $this.siblings('input');
            ev.value = $this.attr("searching-area");
            $this.hasClass('active') ? 1 : _input.val($this.attr("searching-area")).trigger(ev);
        });
    })($("#sideSearching"));
    
});