(function ($, window, undefined) {
    var regEx = /^([\u4E00-\u9FA5\uf900-\ufa2d]+)\|([^\|]+)\|([^\|]+)/i;
    var regExChinese = /([\u4E00-\u9FA5\uf900-\ufa2d]+)/;

    var match, letter,
        reg = {
            ABC: /^[a-c]$/i,
            DEF: /^[d-f]$/i,
            GHI: /^[g-i]$/i,
            JKL: /^[j-l]$/i,
            MNO: /^[m-o]$/i,
            PQR: /^[p-r]$/i,
            STU: /^[s-u]$/i,
            VWX: /^[v-x]$/i,
            YZ: /^[y-z]$/i
        };

    var _template = [
        '<p class="tip">查询港口(支持汉字/拼音)</p>',
        '<ul>',
        '<li class="on">附近的港口</li>',
        '<li>ABC</li>',
        '<li>DEF</li>',
        '<li>GHI</li>',
        '<li>JKL</li>',
        '<li>MNO</li>',
        '<li>PQR</li>',
        '<li>STU</li>',
        '<li>VWX</li>',
        '<li>YZ</li>',
        '</ul>'];

    var PortSelector = function () {
        this.initialize.apply(this, arguments);
    };

    PortSelector.defaults = {
        reg: reg,
        regEx: regEx,
        regExChinese: regExChinese,
        template: _template
    };

    PortSelector.prototype = {
        constructor: PortSelector,

        /* 初始化 */

        initialize: function (element, options) {
            this.options = options;
//            this.oCity = options.sea ? options.dSeaPorts : dAirPorts;
            this.input = $(element);
            this.rootDiv = $("<div class='citySelector' style='position:absolute;z-index:999999;'></div>");
            // 判断是否IE6，如果是IE6需要添加iframe才能遮住SELECT框
            var isIe = (document.all) ? true : false;
            var isIE6 = this.isIE6 = isIe && !window.XMLHttpRequest;
            if (isIE6) {
                this.myIframe = $("<iframe src='about:blank' style='position: absolute;z-index: -1' frameBorder=0></iframe>");
                this.rootDiv.append(this.myIframe);
            }

            this.prepareInput();
            this.inputEvent();
        },

        remove: function () {
            if (this.myIframe) {
                this.myIframe.remove();
            }
            if (this.cityBox != null) {
                this.cityBox.remove();
            }
            this.cityBox = null;
            this.rootDiv.remove();


        },

        doClean: function () {
            var $selector = $(".citySelector");
            $selector.find(".cityBox").addClass("hide");
            $selector.find("ul.cityslide").addClass("hide");
            $selector.find("iframe").addClass("hide");
        },

        prepareInput: function () {
            this.hidden = $("<input type='hidden'>").insertAfter(this.input);
            this.hiddenType = $("<input type='hidden'>").insertAfter(this.input);
            this.hidden.attr("name", this.input.attr("name") + "_id");
            this.hiddenType.attr("name", this.input.attr("name") + "_type");
            var portId = this.input.data("portId");
            if (portId) {
                var port = this.findPortById(portId);
                if (port) {
                    this.hidden.val(port.id);
                    this.hiddenType.val(port.type);
                    if (port.type == "domesticSeaPort" || port.type == "domesticAirPort") {
                        this.input.data("region", "domestic");
                    } else {
                        this.input.data("region", "foreign");
                    }
                }
            }
        },

        getPos: function (node) {
            var scrollx = document.documentElement.scrollLeft || document.body.scrollLeft,
                scrollt = document.documentElement.scrollTop || document.body.scrollTop;
            var pos = $(node).position();
            return {top: pos.top + scrollt, right: pos.right + scrollx, bottom: pos.top + $(node).outerHeight() + scrollt, left: pos.left + scrollx }
        },

        createWarp: function () {
            var inputPos = this.getPos(this.input);
            var div = this.rootDiv;
            var that = this;

            // 设置DIV阻止冒泡
            this.rootDiv.on('click', function (event) {
                event.stopPropagation();
                return false;
            });

            $(window.document).on("click", function (event) {
                if (event == that.input) return false;
                if (that.cityBox)$(that.cityBox).addClass('hide');
                if (that.ul)$(that.ul).addClass('hide');
                if (that.myIframe)$(that.myIframe).addClass('hide');
            });

            this.cityBox = $("<div class='cityBox'>" + _template.join("") + "</div>");
            this.hotCity = $("<div class='hotCity'></div>");

            this.cityBox.append(this.hotCity);
            this.rootDiv.append(this.cityBox);
            this.createHotCity();
        },

        /* *
         * @createHotCity
         * TAB下面DIV：hot,a-h,i-p,q-z 分类HTML生成，DOM操作
         * {HOT:{hot:[]},ABCDEFGH:{a:[1,2,3],b:[1,2,3]},IJKLMNOP:{},QRSTUVWXYZ:{}}
         **/

        createHotCity: function () {
            var odiv, odl, odt, odd, odda = [], str, key, ckey, sortKey, regEx = regEx;
            var oCity = this.parseOCity();
            for (key in oCity) {

                odiv = this[key] = document.createElement('div');
                // 先设置全部隐藏hide
                odiv.className = key + ' ' + 'cityTab hide';
                this.hotCity.append(odiv);

                sortKey = [];
                if (key != "hot") {
                    for (ckey in oCity[key]) {
                        sortKey.push(ckey);
                        // ckey按照ABCDEDG顺序排序
                        sortKey.sort();
                    }
                    for (var j = 0, k = sortKey.length; j < k; j++) {
                        odl = document.createElement('dl');
                        odt = document.createElement('dt');
                        odd = document.createElement('dd');
                        odt.innerHTML = sortKey[j] == 'hot' ? '&nbsp;' : sortKey[j];
                        odda = [];
                        for (var i = 0, n = oCity[key][sortKey[j]].length; i < n; i++) {
                            str = '<a href="javascript:" data-port-id="' + oCity[key][sortKey[j]][i].id + '" data-port-type="' + oCity[key][sortKey[j]][i].type + '">' + oCity[key][sortKey[j]][i].cnName + '</a>';
                            odda.push(str);
                        }
                        odd.innerHTML = odda.join('');
                        odl.appendChild(odt);
                        odl.appendChild(odd);
                        odiv.appendChild(odl);
                    }
                } else {
                    var hotCities = oCity['hot'];
                    if (hotCities.length > 0) {
                        odl = document.createElement('dl');
                        odt = document.createElement('dt');
                        odd = document.createElement('dd');
                        odda = [];
                        for (var j = 0, k = oCity['hot'].length; j < k; j++) {
                            var port = oCity['hot'][j];
                            str = '<a href="javascript:" data-port-id="' + port.id + '" data-port-type="' + port.type + '">' + port.cnName + '</a>';
                            odda.push(str);

                        }
                        odd.innerHTML = odda.join('');
                        odl.appendChild(odt);
                        odl.appendChild(odd);
                        odiv.appendChild(odl);
                    } else {
                        this.cityBox.find("ul li:first-child").remove();
                        this.cityBox.find("ul li:first-child").addClass("on");
                        this.hotCity.find(".cityTab.hot").remove();
                    }
                }

                // 移除第一个tab隐藏CSS
                this.hotCity.find(".cityTab:first").removeClass("hide");
            }
            $(document.body).append(this.rootDiv);
            this.rootDiv.position({
                of: this.input,
                at: "left bottom",
                my: "left top",
                collision: "none none"
            });
            /* IE6 */

            this.changeIframe();

            this.tabChange();
            this.linkEvent();
        },

        parsePorts: function () {
            var oCity = [];
            var sea = this.input.data("sea");
            var region = this.input.data("region");

            if (sea == true) {
                switch (region) {
                    case "domestic":
                        oCity = Ports.domesticSeaPorts;
                        break;
                    case "foreign":
                        oCity = Ports.foreignSeaPorts;
                        break;
                    case "all":
                        oCity = Ports.domesticSeaPorts.concat(Ports.foreignSeaPorts);
                        break;
                    default :
                        oCity = [];
                }
            } else {
                switch (region) {
                    case "domestic":
                        oCity = Ports.domesticAirPorts;
                        break;
                    case "foreign":
                        oCity = Ports.foreignAirPorts;
                        break;
                    case "all":
                        oCity = Ports.domesticAirPorts.concat(Ports.foreignAirPorts);
                        break;
                    default :
                        oCity = [];
                }
            }

            return oCity;
        },

        parseOCity: function () {
            var oCity = [];
            var sea = this.input.data("sea");
            var region = this.input.data("region");
            if (sea == true) {
                switch (region) {
                    case "domestic":
                        oCity = this.options.dSeaPorts;
                        break;
                    case "foreign":
                        oCity = this.options.fSeaPorts;
                        break;
                    case "all":
                        oCity = this.options.seaPorts;
                        break;
                    default :
                        oCity = [];
                }
            } else {
                switch (region) {
                    case "domestic":
                        oCity = this.options.dAirPorts;
                        break;
                    case "foreign":
                        oCity = this.options.fAirPorts;
                        break;
                    case "all":
                        oCity = this.options.airPorts;
                        break;
                    default :
                        oCity = [];
                }
            }
            return oCity;
        },

        /* *
         *  tab按字母顺序切换
         *  @ tabChange
         * */

        tabChange: function () {
            var lis = $('li', this.cityBox);
            var divs = $('div', this.hotCity);
            var that = this;
            for (var i = 0, n = lis.length; i < n; i++) {
                lis[i].index = i;
                lis[i].onclick = function () {
                    for (var j = 0; j < n; j++) {
                        $(lis[j]).removeClass("on");
                        $(divs[j]).addClass("hide");
                    }
                    $(this).addClass("on");
                    $(divs[this.index]).removeClass("hide");
                    /* IE6 改变TAB的时候 改变Iframe 大小*/
                    that.changeIframe();
                };
            }
        },

        /* *
         * 城市LINK事件
         *  @linkEvent
         * */

        linkEvent: function () {
            var links = $('a', this.hotCity);
            var that = this;
            links.on("click", function () {
                var $this = $(this);
                that.input.val($this.html());
                that.hidden.val($this.data("port-id"));
                that.hiddenType.val($this.data("port-type"));
                that.hiddenType.trigger("change");
                $(that.cityBox).addClass("hide");
                $(that.myIframe).addClass("hide");
            });
        },

        _findPort: function (port, criteria) {
            if (criteria(port)) {
                return port;
            }

            return null;
        },

        criteria: function (port, value) {
            var reg = new RegExp("^" + value + "|\\|" + value, 'gi');
            return function () {
                return reg.test(port.enName) || reg.test(port.shortName) || reg.test(port.cnName) || value == port.countryCn || value == port.countryEn || value == port.countryShort;
            }
        },

        __findPort: function (ports, value) {
            var port, i, l, re;
            for (i = 0, l = ports.length; i < l; i++) {
                port = ports[i];
                re = this._findPort(port, this.criteria(port, value));
                if (re) {
                    break;
                }
            }
            return re;
        },

        findPort: function () {
            var re = null;
            var value = $.trim(this.input.val());
            var ports = this.parsePorts();
            if (value) {
                re = this.__findPort(ports, value);
            }
            return re;
        },

        findPortById: function (id) {
            for (var key in window.Ports) {
                var ports = Ports[key];
                for (var i = 0, l = ports.length; i < l; i++) {
                    var port = ports[i];

                    if (port.id == id) {
                        return port;
                    }
                }

            }

            return null;
        },

        /* *
         * INPUT城市输入框事件
         * @inputEvent
         * */

        inputEvent: function () {
            var that = this;
            this.input.on("click", function (event) {
                event.stopPropagation();
                if (!that.cityBox) {
                    that.createWarp();
                } else if (!!that.cityBox && that.cityBox.hasClass('hide')) {
                    // slideul 不存在或者 slideul存在但是是隐藏的时候 两者不能共存
                    if (!that.ul || (that.ul && $(that.ul).hasClass('hide'))) {
                        that.cityBox.removeClass("hide");

                        /* IE6 移除iframe 的hide 样式 */
                        //alert('click');
                        $(that.myIframe).removeClass("hide");
                        that.changeIframe();
                    }
                }
            });
            this.input.on('focus', function () {
                that.doClean();
                that.input.trigger("click");
                if (that.input.value == '城市名') that.input.value = '';
            });
            this.input.on('blur', function () {
                var $this = $(this);
                if ($this.val()) {
                    var port = that.findPort();
                    if (port) {
                        that.input.val(port.cnName);
                        that.hidden.val(port.id);
                        that.hiddenType.val(port.type);
                    }
                } else {
                    that.input.val(null);
                    that.hidden.val(null);
                    that.hiddenType.val(null);

                }
                that.hiddenType.trigger("change");
//                if (that.input.value == '') that.input.value = '城市名';
            });

            this.input.on('keydown', function (event) {
//                event.preventDefault();
//                event.stopPropagation();
                var keycode = event.keyCode;
                if (that.cityBox) {
                    that.cityBox.addClass("hide");
                }
                if (keycode != 40 && keycode != 38 && keycode != 13) {
                    that.createUl();
                }
                /* 移除iframe 的hide 样式 */
                $(that.myIframe).removeClass("hide");
                // 下拉菜单显示的时候捕捉按键事件
                if (that.ul && !$(that.ul).hasClass("hide")) {
                    that.KeyboardEvent(event, keycode);
                }

//                return false;
            });
        },

        /* *
         * 生成下拉选择列表
         * @ createUl
         * */

        createUl: function () {
            var str;
            var value = $.trim(this.input.val());
            // 当value不等于空的时候执行
            var ports = this.parsePorts();
            if (value !== '') {
                var reg = new RegExp("^" + value + "|\\|" + value, 'gi');
                var searchResult = [];
                for (var i = 0, n = ports.length; i < n; i++) {
                    var port = ports[i];
                    if (reg.test(port.enName) || reg.test(port.shortName) || reg.test(port.cnName) || value == port.countryCn || value == port.countryEn || value == port.countryShort) {
                        if (searchResult.length !== 0) {
                            str = '<li data-port-id="' + port.id + '" data-port-type="' + port.type + '"><b class="cityname">' + port.cnName + '(' + port.enName + ')' + '</b><b class="cityspell">' + port.countryCn + '</b></li>';
                        } else {
                            str = '<li class="on" data-port-id="' + port.id + '" data-port-type="' + port.type + '"><b class="cityname">' + port.cnName + '(' + port.enName + ')' + '</b><b class="cityspell">' + port.countryCn + '</b></li>';
                        }
                        searchResult.push(str);
                    }
                }
                this.isEmpty = false;
                // 如果搜索数据为空
                if (searchResult.length == 0) {
                    this.isEmpty = true;
                    str = '<li class="empty">没有找到数据 "<em>' + value + '</em>"</li>';
                    searchResult.push(str);
                }
                // 如果slideul不存在则添加ul
                if (!this.ul) {
                    var ul = this.ul = document.createElement('ul');
                    ul.className = 'cityslide';
                    this.rootDiv && this.rootDiv.append(ul);
                    // 记录按键次数，方向键
                    this.count = 0;
                } else if (this.ul && $(this.ul).hasClass("hide")) {
                    this.count = 0;
                    $(this.ul).removeClass("hide");
                }
                this.ul.innerHTML = searchResult.join('');

                /* IE6 */
                this.changeIframe();

                // 绑定Li事件
                this.liEvent();
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
            var lis = $('li', this.ul);
            var len = lis.length;
            switch (keycode) {
                case 40: //向下箭头↓
                    this.count++;
                    if (this.count > len - 1) this.count = 0;
                    for (var i = 0; i < len; i++) {
                        $(lis[i]).removeClass("on");
                    }
                    $(lis[this.count]).addClass("on");
                    break;
                case 38: //向上箭头↑
                    this.count--;
                    if (this.count < 0) this.count = len - 1;
                    for (i = 0; i < len; i++) {
                        $(lis[i]).removeClass("on");
                    }
                    $(lis[this.count]).addClass("on");
                    break;
                case 13: // enter键
                    event.preventDefault();
                    var li = $("li.on", this.ul);
                    this.input.val(regExChinese.exec(li.html())[0]);
                    this.hidden.val(li.data("port-id"));
                    this.hiddenType.val(li.data("port-type"));
                    this.hiddenType.trigger("change");
                    $(this.ul).addClass("hide");
                    /* IE6 */
                    $(this.myIframe).addClass("hide");
                    break;
                default:
                    break;
            }
        },

        /* *
         * 下拉列表的li事件
         * @ liEvent
         * */

        liEvent: function () {
            var that = this;
            var lis = $('li', this.ul);
            for (var i = 0, n = lis.length; i < n; i++) {
                var li = lis[i];
                $(li).on('click', function (event) {
                    that.input.val(regExChinese.exec(event.target.innerHTML)[0]);
                    that.hidden.val($(this).data("port-id"));
                    $(that.ul).addClass("hide");
                    /* IE6 下拉菜单点击事件 */
                    $(that.myIframe).addClass("hide");
                });
                $(lis[i]).on("mouseover", function (event) {
                    $(event.target).addClass("on");
                });
                $(lis[i]).on("mouseout", function (event) {
                    $(event.target).removeClass("on");
                });
            }
        }

    };

    window.PortSelector = PortSelector;
})
    (jQuery, window);