;
window.Account = {};
(function ($, exports, undefined) {
    function changeRegistrationType() {
        var inputPhoneNumber = $("#inputPhoneNumber");
        var inputEmail = $("#inputEmail");
        var registrationTypeText = $("#registrationTypeText");
        var tip1 = $("#tip1");
        var tip2 = $("#tip2");
        var loginType = $("#loginType");
        if (inputPhoneNumber.is(":hidden")) {
            inputPhoneNumber.show();
            inputEmail.val(null).hide();
            registrationTypeText.text("手机");
            tip2.hide();
            tip1.show();
            loginType.val(0);  // LoginType.BY_PHONE
            inputPhoneNumber.parent().find(".help-inline").empty();
        } else if (inputEmail.is(":hidden")) {
            inputEmail.show();
            inputPhoneNumber.val(null).hide();
            registrationTypeText.text("邮箱");
            tip1.hide();
            tip2.show();
            loginType.val(1);  // LoginType.BY_EMAIL
            inputEmail.parent().find(".help-inline").empty();
        }
    }

    $(function () {
        $(".login form.valid").validate({
            errorPlacement: function (errors, element) {
                var error = errors[0];
                element.parent().find(".help-inline").empty().append(error.innerHTML);
            },
            unhighlight: function (element) {
                var $e = $(element);
                $e.removeClass("error").parent().find(".help-inline").empty();
            }
        });
    });

    exports.changeRegistrationType = changeRegistrationType;
})(jQuery, window.Account);


