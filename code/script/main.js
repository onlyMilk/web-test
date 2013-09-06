/**
 * Created with JetBrains WebStorm.
 * User: yangcheng
 * Date: 13-9-6
 * Time: 下午2:27
 * To change this template use File | Settings | File Templates.
 */
require.config({
    paths: {
        'jquery':  'http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min',
        'bsp': 'module/bootstrap.min',
        'jquery-ui': 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min',
        'Jslimscroll': '../lib/jquery-slimScroll-1.1.0/jquery.slimscroll',
        /*
        'jicheck': '../lib/jquery-icheck/jquery.icheck.min',
        'bdatepicker': '../lib/bootstrap-datepicker/js/bootstrap-datepicker',
        'btimepicker': '../lib/bootstrap-timepicker/js/bootstrap-timepicker',
        'bdate': '../lib/bootstrap-daterangepicker/date',
        'bdaterangepicker': '../lib/bootstrap-daterangepicker/daterangepicker',
        'bdatetimepicker': 'module/bootstrap-datetimepicker.min',
        'bdatetimepicker-zh-CN': 'module/locales/bootstrap-datetimepicker.zh-CN',
        'jplaceholder': 'module/jquery.placeholder',
        'jform': 'module/jquery.form',
        'ports': 'module/ports',
        'portSelector': 'module/portSelector',
        'cjquery': '../lib/chosen-bootstrap/chosen/chosen.jquery.min',*/
        'app': 'module/chemon-app'
    },
    shim: {
        'bsp': {
            deps: ['jquery'],
            exports: 'jQuery.fn'
        },
        'jquery-ui': {
            deps: ['jquery'],
            exports: 'jQuery.fn'
        },
        'Jslimscroll': {
            deps: ['jquery'],
            exports: 'jQuery.fn.slimScroll'
        },
        /*
        'jicheck': {
            deps: ['jquery'],
            exports: "jQuery.fn['iCheck']"
        },
        'bdatepicker': {
            deps: ['jquery'],
            exports: 'jQuery.fn.datepicker'
        },
        'btimepicker': {
            deps: ['jQuery'],
            exports: 'jQuery.fn.timepicker'
        },
        'bdaterangepicker': {
            deps: ['jQuery'],
            exports: 'jQuery.fn.daterangepicker'
        },
        'bdate': {
            deps: ['jquery'],
            exports: ''
        },
        'bdatetimepicker': {
            deps: ['jquery'],
            exports: 'jQuery.fn.datetimepicker'
        },
        'bdatetimepicker-zh-CN': {
            deps: ['jQuery'],
            exports: "jQuery.fn.datetimepicker.dates['zh-CN']"
        },
        'jplaceholder': {
            deps: ['jquery'],
            exports: 'jQuery.fn.placeholder'
        },
        'jform': {
            deps: ['jquery'],
            exports: 'jQuery.fn.clearFields'
        },
        'ports': {
            exports: 'Ports'
        },
        'portSelector': {
            deps: ['jquery'],
            exports: 'PortSelector'
        },
        'cjquery': {
            deps: ['jquery'],
            exports: 'SelectParser'
        },*/
        'app': {
            deps: ['jquery'],
            exports: 'Chemon'
        }
    }
})

require([
    'jquery',
    'app',
    'bsp',
    'jquery-ui',
    'Jslimscroll'
],function($,Chemon){
    $(function() {
        Chemon.App.init();
        $("div.section").on("click.chemon", "[data-action='showCover']", function(e) {
            e = e || window.event; e.preventDefault();
            return $(this).siblings(".cover").fadeIn();
            // 此处应将搜索历史用ajax得到放到页面中
        }).on("click.chemon", ".cover .close", function(e) {
                e = e || window.event; e.preventDefault();
                return $(this).parents(".cover").fadeOut();
            }).on("click.chemon", ".tab-nav > a", function(e) {
                // 切换TAB页
                e = e || window.event; e.preventDefault();
                $(this).hasClass("active") ? 1 : $(this).addClass("active").siblings("a[data-toggle='tab']").removeClass("active");
                if ($(this).attr("href") == "#tab2") {
                    $("#tab2").load("url", {});
                }
            }).on("click.chemon", "[data-action='setHot']", function(e) {
                // 设置热门
                e = e || window.event; e.preventDefault();
                var $li = $(this).parents("li");
                if ($li.hasClass("hot")) {
                    // 如果已经是热门，则直接发送请求，然后在执行回调函数
                    $.get("url", function() {
                        $li.removeClass("hot");
                    });
                } else if($li.parents(".tab-pane").find("li.hot").length >= 6) {
                    alert("最多只能设置6个热门产品！");
                } else {
                    // 设置热门产品
                    $.get("url", function() {
                        $li.addClass("hot");
                    });
                }
                // $li.hasClass("hot") ? $li.removeClass("hot") : $li.parents(".tab-pane").find("li.hot").length >= 6 ? alert("最多只能设置6个热门产品！") : $li.addClass("hot");
                // 以上判断热门产品数量应从数据库中查找，并将设置后的数据保存至数据库
            }).on("click.chemon", "[data-action='removePro']", function(e) {
                // 删除产品
                e = e || window.event; e.preventDefault();
                window.confirm("确定删除产品？", function() {
                    $(this).parents("li").remove()
                });
            });

        $("#showMore").on("click", function(e) {
            e = e || window.event;e.preventDefault();
            var $this = $(this);
            $.get("loading-page/proList.html", function(data) {
                $this.before(data);
            });
        });

        $("#birds").on("keydown", function(e) {
            if ( e.keyCode === $.ui.keyCode.TAB && $( this ).data( "ui-autocomplete" ).menu.active ) {
                e.preventDefault();
            }
        }).autocomplete({
                source: function( request, response ) {
                    $.getJSON("../json/autocomplete.json", {
                        term: extractLast(request.term)
                    }, response);
                },
                focus: function() {
                    // prevent value inserted on focus
                    return false;
                },
                select: function( event, ui ) {
                    alert("选择了" + ui.item.value);
                }
            });
    });
})