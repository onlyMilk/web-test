function ajaxTurn2Page(contextSel, baseUrl, number) {

    App.blockUI(contextSel);
    $(contextSel).trigger({
        type: "startLoad",
        number: number
    });
    //$("form", contextSel).serializeObject()
    var form = $("form", contextSel);
    if(form.length == 0){
    	form = $(contextSel).parent("form");
    }
    var param = $.extend({number: number}, form.serializeObject());
    $(contextSel).load(baseUrl, param, function () {	
        App.unblockUI(contextSel);
        App.initContext(contextSel);
        $(contextSel).trigger({
            type: "pageLoaded",
            number: number
        });
    });
 
}

function clearValueIfEqualToPlaceholder(form) {
    $("[placeholder]", form).each(function (e) {
        var $e = $(e);
        if ($e.attr("placeholder") == $e.val()) {
            $e.val('');
        }
    });
}

function turn2Page(number) {

    var page = $("#page");
    var filterForm = $("#filterForm");
    filterForm.on("submit", function (ev) {
        if (page.length == 0) {
            page = $("<input type='hidden' name='number' id='number'>").appendTo(filterForm);
        }
        page.val(number);
    });
    filterForm.submit();
}

function refreshSection(contextSel) {
    var baseUrl = $(contextSel).attr("base-url");
    ajaxTurn2Page($(contextSel), baseUrl, 1);
}

function createModal(title, body, confirmCallback, okButtonText) {
    baseCreateModal(title,
        function () {
            $("#modal_body").html(body);
        },
        function () {
            App.initContext("#modal_body");
        },
        function () {
            $("#modal_body").empty();
        },
        confirmCallback,
        okButtonText);
}

function createRemoteModal(title, bodySource, data, confirmCallback, okButtonText) {
    baseCreateModal(title,
        function () {
            $("#modal_body").load(bodySource, data);
        },
        function () {
            App.initContext("#modal_body");
        },
        function () {
            $("#modal_body").empty();
        },
        confirmCallback,
        okButtonText);
}

function baseCreateModal(title, bodyFunc, shownCallback, hiddenCallback, confirmCallback, okButtonText) {
    $("#modal_title").html(title);
    bodyFunc();
    if (okButtonText) {
        $("#modal_ok_btn").text(okButtonText);
    }
    $("#modal_ok_btn").unbind('click');
    var wrapperCallback = function () {
        if (confirmCallback() !== false) {
            $('#modal_dialog').modal('hide');
        }
    };
    $("#modal_ok_btn").click(wrapperCallback);
    $('#modal_dialog').modal({
        backdrop: true,
        show: true,
        remote: false
    });
    $('#modal_dialog').one('shown', shownCallback);
    $('#modal_dialog').one('hidden', hiddenCallback);
}

function parsePosition(position) {
    if (!position) return position;

    var px = position.replace("px", "");
    return parseFloat(px);
}

function gotoPage(url) {
    window.location.href = url;
}

function resolveError() {
    var args = arguments;
    if (args.length < 2) {
        throw Error("must have at least 2 arguments");
    }
    var ctx = args[0];
    var msgs = Array.prototype.slice.call(arguments, 1);
    var container = $(".error_container", ctx);
    for (var i = 0; i < msgs.length; i++) {
        $("<li>" + msgs[i] + "</li>").appendTo(container);
    }
    // 显示异常信息
    $(".alert-error", ctx).show();
}

function ajaxJSONReq(url, data, doneCallback) {
    $.ajax({
        url: url,
        type: "POST",
        cache: false,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data)
    }).done(function (data) {
            if (doneCallback) {
                doneCallback(data);
            }
        }
    );
}

function refreshChosen(sel) {
    $(sel).siblings(".chzn-container").remove();
    $(sel).removeClass("chzn-done").chosen();
}
