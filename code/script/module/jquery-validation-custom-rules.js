jQuery.validator.addMethod("cdate", function (value, element) {
    return this.optional(element) || /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(value);
}, "请输入有效的日期(yyyy-mm-dd)");
jQuery.validator.addMethod("nonNegativeInteger", function (value, element) {
    return this.optional(element) || /^\d+$/.test(value);
}, "请输入非负整数");
jQuery.validator.addMethod("positiveInteger", function (value, element) {
    return this.optional(element) || /^([1-9]\d*)$/.test(value);
}, "请输入正整数");
jQuery.validator.addMethod("positiveNumber", function (value, element) {
    return this.optional(element) || /^(0\.\d+)|([1-9]\d*\.?\d*)$/.test(value);
}, "请输入正数");