(function ($, window, undefined) {

    var ProductSelector = function () {
        this.initialize.apply(this, arguments);
    };

    ProductSelector.defaults = {
        invokeCharLength: 1,
        invokeInterval: 2000
    };

    ProductSelector.prototype = {
        constructor: ProductSelector,

        /* 初始化 */
        initialize: function (element, options) {
            this.options = options;
//            this.oCity = options.sea ? options.dSeaPorts : dAirPorts;
            this.input = $(element);
            this.hsCodeInput = $(this.input.data("hscode-el"));
            this.rootDiv = $("<div class='citySelector' style='position:absolute;z-index:999999;'></div>");
            // 判断是否IE6，如果是IE6需要添加iframe才能遮住SELECT框
            var isIe = (document.all) ? true : false;
            var isIE6 = this.isIE6 = isIe && !window.XMLHttpRequest;
            if (isIE6) {
                this.myIframe = $("<iframe src='about:blank' style='position: absolute;z-index: -1' frameBorder=0></iframe>");
                this.rootDiv.append(this.myIframe);
            }

            $(document.body).append(this.rootDiv);

            this.initEvent();
        },

        remove: function () {
            if (this.myIframe) {
                this.myIframe.remove();
            }
            if (this.cityBox) {
                this.cityBox.remove();
                this.cityBox = null;
            }
            this.rootDiv.remove();
        },

        doClean: function () {
            var $selector = $(".citySelector");
            $selector.find(".cityBox").addClass("hide");
            $selector.find("ul.cityslide").addClass("hide");
            $selector.find("iframe").addClass("hide");
        },

        startTimer: function () {
            var that = this;
            this.timerId = setInterval(function () {
                that.fetchProducts(1);
            }, this.options.invokeInterval);
        },

        stopTimer: function () {
            window.clearInterval(this.timerId);
        },

        fetchProducts: function (targetPage) {
            var that = this;
            var value = $.trim(this.input.val());
            if (value) {
                if (value.length >= this.options.invokeCharLength) {
                    $.ajax({
                        url: ctx + "/dropdown/productsSection",
                        data: {
                            name: value,
                            pageSize: 10,
                            currentPage: targetPage
                        },
                        success: function (html) {
                            that.lastPage = targetPage;
                            that.createUl(html);
                        }
                    });
                }
            } else {
                this.doClean();
            }

        },

        next: function () {
            var targetPage = this.lastPage ? this.lastPage + 1 : 1;
            this.fetchProducts(targetPage);
        },

        prev: function () {
            var targetPage = this.lastPage ? this.lastPage - 1 : 1;
            this.fetchProducts(targetPage);
        },

        inputFocus: function (event) {
            this.fetchProducts(1);
        },

        inputKeyup: function (event) {
            event.preventDefault();
            event.stopPropagation();
            var keycode = event.keyCode;
            if (!(keycode == 13 || keycode == 38 || keycode == 40)) {
                this.fetchProducts(1);
            }
            if (this.ul && !$(this.ul).hasClass("hide")) {
                this.KeyboardEvent(event, keycode);
            }

            return false;
        },

        liHover: function (event) {
            this.rootDiv.find("li.on").removeClass("on");
            if (event.type == "mouseenter") {
                $(event.target).addClass("on");
            }
        },

        initEvent: function () {
            var that = this;
            this.input.on('focus', $.proxy(this.inputFocus, this));
//            this.input.on('blur', $.proxy(this.stopTimer, this));

            this.input.on('keyup', $.proxy(this.inputKeyup, this));

            this.rootDiv.on("click", "a.prev", $.proxy(this.prev, this));
            this.rootDiv.on("click", "a.next", $.proxy(this.next, this));
            this.rootDiv.on("mouseenter", "li:not(.citypager)", $.proxy(this.liHover, this));
            this.rootDiv.on("click", "li:not(.citypager)", $.proxy(this.selectProduct, this));

            $(window.document).on("click", function (event) {
                if (event == that.input) return false;
                if (that.cityBox)$(that.cityBox).addClass('hide');
                if (that.ul)$(that.ul).addClass('hide');
                if (that.myIframe)$(that.myIframe).addClass('hide');
            });
        },

        selectProduct: function () {
            var li = $("li.on", this.ul);
            this.input.val(li.find(".cityname").text());
            this.hsCodeInput.val(li.find(".cityspell").text());
            $(this.ul).addClass("hide");
            /* IE6 */
            $(this.myIframe).addClass("hide");
        },

        /* *
         * 生成下拉选择列表
         * @ createUl
         * */

        createUl: function (html) {
            var str;
            var value = $.trim(this.input.val());
            // 当value不等于空的时候执行
            if (value !== '') {
                this.rootDiv.html(html);
                this.ul = this.rootDiv.find(".cityslide");
                this.count = 0;
                this.rootDiv.position({
                    of: this.input,
                    at: "left bottom",
                    my: "left top",
                    collision: "none none"
                });

                /* IE6 */
                this.changeIframe();

                // 绑定Li事件
//                this.liEvent();
            } else {
                $(this.ul).addClass("hide");
                $(this.cityBox).removeClass("hide");
                $(this.myIframe).removeClass("hide");
                this.changeIframe();
            }
        },

        /* IE6的改变遮罩SELECT 的 IFRAME尺寸大小 */
        changeIframe: function () {
            if (!this.isIE6)return;
            this.myIframe.style.width = this.rootDiv.offsetWidth + 'px';
            this.myIframe.style.height = this.rootDiv.offsetHeight + 'px';
        },

        /* *
         * 特定键盘事件，上、下、Enter键
         * @ KeyboardEvent
         * */

        KeyboardEvent: function (event, keycode) {
            var lis = $('li:not(.citypager)', this.ul);
            var len = lis.length;
            switch (keycode) {
                case 40: //向下箭头↓
                    var next = $('li.on', this.ul).next("li:not(.citypager)");
                    lis.removeClass("on");
                    if (next.length > 0) {
                        next.addClass("on");
                    } else {
                        $(lis.get(0)).addClass("on");
                    }
                    break;
                case 38: //向上箭头↑
                    var prev = $('li.on', this.ul).prev("li:not(.citypager)");
                    lis.removeClass("on");
                    if (prev.length > 0) {
                        prev.addClass("on");
                    } else {
                        $(lis.get(len - 1)).addClass("on");
                    }
                    break;
                case 13: // enter键
                    this.selectProduct();
                    break;
                default:
                    break;
            }
        }
    };

    window.ProductSelector = ProductSelector;
})
    (jQuery, window);