(function ($, window) {

    var source =
            '<li class="{{clz}}">' +
                '<a data-id="{{id}}" {{#selected}}class="active"{{/selected}} href="#1" data-action="tab">{{cnName}}</a>' +
                '</li>',
        source2 = $("#resource-template").html(),
        template = Handlebars.compile(source),
        template2 = null;
    if (source2 && source2.length > 0) {
        template2 = Handlebars.compile(source2);
    }
    var $shippingLine = $("#shipping_line"),
        $ul = $shippingLine.find("ul");
    /*
     $ul.empty();
     $(SHIPPING_LINE).each(function (i, row) {
     var colSize = row.length;
     var spanSize = 12 / colSize;
     $(row).each(function (j, col) {
     if (!$.isEmptyObject(col)) {
     var id = col.id;
     if ($.isArray(col.id) && col.id.length > 0) {
     id = col.id.join(",");
     }
     var data = $.extend({}, col, {clz: (col.clz || "") + " span" + spanSize, id: id});
     $ul.append(template(data));
     }
     });
     });*/

    $shippingLine.on("click.tradx", "[data-action='tab']", function (e) {
        !e && (e = window.event);
        e.preventDefault();
        var $this = $(this);
        if ($this.hasClass("active")) {
            return false;
        }

        $.ajax({
            url: "advantageLines/",
            data: {lineIds: $this.data("id")},

            success: function (data) {
                var $content = $this.parents(".section-body").find(".body-right > .inner");
                $this.parents(".section-body").find("[data-action='tab']").removeClass("active");
                $this.addClass("active");

                var $secondUl = $content.find("ul:last").empty();
                if (data.length > 0) {
                    for (var i = 0, j = data.length; i < j; i++) {
                        data[i]["tagPosition"] = 3 + 135 * (parseInt(data[i]["orderedContainers"]) / parseInt(data[i]["totalContainers"]));
                        $secondUl.append(template2(data[i]));
                    }
                } else {
                    $secondUl.append("<li class='nodata'>您所查看的航线目前没有数据</li>")
                }
                $content.find("ul:first").animate({"margin-top": -1 * ($content.find("ul:first").outerHeight() + 20)}, 600, function () {
                    $content.find("ul:first").empty().remove().insertAfter($content.find("ul:last")).css("margin-top", "0");
                    $this.parents(".section").find("[data-action='scroll-horizontal']").scrollHorizontal("init"); // 再次初始化状态
                });
            }
        });

    });

})(jQuery, window);