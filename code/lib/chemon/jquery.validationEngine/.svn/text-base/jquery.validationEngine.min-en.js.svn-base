(function ($) {
    var methods = { init: function (options) {
        var form = this;
        if (!form.data('jqv') || form.data('jqv') == null) {
            methods._saveOptions(form, options);
            $(".formError").live("click", function () {
                $(this).fadeOut(150, function () {
                    $(this).remove()
                })
            })
        };
        return this
    },
        attach: function (userOptions) {
            var form = this;
            var options;
            if (userOptions) options = methods._saveOptions(form, userOptions);
            else options = form.data('jqv');
            var validateAttribute = (form.find("[data-validation-engine*=validate]")) ? "data-validation-engine" : "vclass";
            //alert(options.binded);
            // if (!options.binded) {//修改了如果重新获取组件html无法即时验证的问题
            if (options.bindMethod == "bind") {
                form.find("[vclass*=validate]").not("[type=checkbox]").not("[type=radio]").not(".datepicker").not("[readonly=readonly]").bind(options.validationEventTrigger, methods._onFieldEvent);
                form.find("[vclass*=validate][type=checkbox],[vclass*=validate][type=radio]").bind("click", methods._onFieldEvent);
                form.find("[vclass*=validate][vclass*=datepicker]").bind(options.validationEventTrigger, { "delay": 300 }, methods._onFieldEvent);

                form.bind("submit", methods._onSubmitEvent)
            } else if (options.bindMethod == "live") {
                form.find("[vclass*=validate]").not("[type=checkbox]").not(".datepicker").not("[readonly=readonly]").live(options.validationEventTrigger, methods._onFieldEvent);
                form.find("[vclass*=validate][type=checkbox]").live("click", methods._onFieldEvent);
                form.find("[vclass*=validate][vclass*=datepicker]").live(options.validationEventTrigger, { "delay": 300 }, methods._onFieldEvent);
                form.live("submit", methods._onSubmitEvent)
            };
            options.binded = true;
            if (options.autoPositionUpdate) {
                $(window).bind("resize", { "noAnimation": true, "formElem": form }, methods.updatePromptsPosition)
            }
            // };
            return this
        },
        detach: function () {
            var form = this;
            var options = form.data('jqv');
            if (options.binded) {
                form.find("[vclass*=validate]").not("[type=checkbox]").unbind(options.validationEventTrigger, methods._onFieldEvent);
                form.find("[vclass*=validate][type=checkbox],[vclass*=validate][type=radio]").unbind("click", methods._onFieldEvent);
                form.unbind("submit", methods.onAjaxFormComplete);
                form.find("[vclass*=validate]").not("[type=checkbox]").die(options.validationEventTrigger, methods._onFieldEvent);
                form.find("[vclass*=validate][type=checkbox]").die("click", methods._onFieldEvent);
                form.die("submit", methods.onAjaxFormComplete);
                form.removeData('jqv');
                if (options.autoPositionUpdate) {
                    $(window).unbind("resize", methods.updatePromptsPosition)
                }
            };
            return this
        },
        validate: function () {
            return methods._validateFields(this)
        },
        validateField: function (el) {
            var options = $(this).data('jqv');
            var r = methods._validateField($(el), options);
            if (options.onSuccess && options.InvalidFields.length == 0) {
                options.onSuccess();
            }
            else if (options.onFailure && options.InvalidFields.length > 0) {
                options.onFailure();
            }
            return r
        },
        validateform: function () {
            return methods._onSubmitEvent.call(this)
        },
        updatePromptsPosition: function (event) {
            if (event && this == window) var form = event.data.formElem, noAnimation = event.data.noAnimation;
            else
                var form = $(this.closest('form'));
            var options = form.data('jqv');
            form.find('[vclass*=validate]').not(':hidden').not(":disabled").each(function () {
                var field = $(this); var prompt = methods._getPrompt(field);
                var promptText = $(prompt).find(".formErrorContent").html();
                if (prompt) methods._updatePrompt(field, $(prompt), promptText, undefined, false, options, noAnimation)
            });
            return this
        }
 , showPrompt: function (promptText, type, promptPosition, showArrow) {
     var form = this.closest('form'); var options = form.data('jqv');
     if (!options) options = methods._saveOptions(this, options);
     if (promptPosition) options.promptPosition = promptPosition;
     options.showArrow = showArrow == true;
     methods._showPrompt(this, promptText, type, false, options);
     return this
 }
 , hidePrompt: function () {
     var promptClass = "." + methods._getClassName($(this).attr("id")) + "formError";
     $(promptClass).fadeTo("fast", 0.3, function () { $(this).remove() });
     return this
 }
, hide: function () {
    var closingtag;

    if ($(this).is("form")) { closingtag = "parentForm" + methods._getClassName($(this).attr("id")) }
    else { closingtag = methods._getClassName($(this).attr("id")) + "formError" };
    $('.' + closingtag).fadeTo("fast", 0.3, function () { $(this).remove() });
    return this
}
, hideAll: function () { $('.formError').fadeTo("fast", 0.3, function () { $(this).remove() }); return this }
, _onFieldEvent: function (event) {//单个验证，入口
    var field = $(this);
    var form = field.closest('form');
    var options = form.data('jqv');
    window.setTimeout(function () {
        methods._validateField(field, options);
        if (options.InvalidFields.length == 0 && options.onSuccess) { options.onSuccess() }
        else if
          (options.InvalidFields.length > 0 && options.onFailure) {
            options.onFailure()
        }
    }, (event.data) ? event.data.delay : 0)
}
, _onSubmitEvent: function () {//form验证入口
    var form = $(this);
    var options = form.data('jqv');
    var r = methods._validateFields(form, true);
    if (r && options.ajaxFormValidation) {
        methods._validateFormWithAjax(form, options);
        return false
    };
    if (options.onValidationComplete) {
        options.onValidationComplete(form, r);
        return false
    };
    return r
}
, _checkAjaxStatus: function (options) {
    var status = true;
    $.each(options.ajaxValidCache, function (key, value) {
        if (!value) { status = false; return false }
    });
    return status
}, _validateFields: function (form, skipAjaxValidation) {
    var options = form.data('jqv');
    var errorFound = false;
    form.trigger("jqv.form.validating");
    var first_err = null;
    form.find('[vclass*=validate]').not(':hidden').not(":disabled").each(
                        function () {
                            var field = $(this);
                            errorFound |= methods._validateField(field, options, skipAjaxValidation);
                            if (options.doNotShowAllErrosOnSubmit)
                                return false;
                            if (errorFound && first_err == null) first_err = field
                        });
    form.trigger("jqv.form.result", [errorFound]);
    if (errorFound) {
        options.scroll = true;
        if (options.scroll) {
            var destination = first_err.offset().top;
            var fixleft = first_err.offset().left;
            var positionType = options.promptPosition;
            if (typeof (positionType) == 'string') {
                if (positionType.indexOf(":") != -1) {
                    positionType = positionType.substring(0, positionType.indexOf(":"))
                }
            };
            if (positionType != "bottomRight" && positionType != "bottomLeft") {
                var prompt_err = methods._getPrompt(first_err);
                destination = prompt_err.offset().top
            };
            $("html:not(:animated),body:not(:animated)").animate({ scrollTop: destination, scrollLeft: fixleft }, 1, function () {
                if (options.focusFirstField)
                    first_err.focus()
            });
            if (options.isOverflown) {
                var overflowDIV = $(options.overflownDIV); var scrollContainerScroll = overflowDIV.scrollTop();
                var scrollContainerPos = -parseInt(overflowDIV.offset().top);
                destination += scrollContainerScroll + scrollContainerPos - 5;
                var scrollContainer = $(options.overflownDIV + ":not(:animated)");
                scrollContainer.animate({ scrollTop: destination }, 1)
            }
        }
        else if (options.focusFirstField)
            first_err.focus();
        return false
    };
    return true
}

, _validateFormWithAjax: function (form, options) {
    var data = form.serialize();
    var url = (options.ajaxFormValidationURL) ? options.ajaxFormValidationURL : form.attr("action");

    $.ajax(
    {
        type: "GET",
        url: url,
        cache: false,
        dataType: "json",
        data: data,
        form: form,
        methods: methods,
        options: options,
        beforeSend: function () {
            return options.onBeforeAjaxFormValidation(form, options)
        }
    , error: function (data, transport) {
        methods._ajaxError(data, transport)
    }
    , success: function (json) {
        if (json !== true) {
            var errorInForm = false;
            for (var i = 0; i < json.length; i++) {
                var value = json[i];
                var errorFieldId = value[0];
                var errorField = $($("#" + errorFieldId)[0]);
                if (errorField.length == 1) {
                    var msg = value[2];
                    if (value[1] == true) {
                        if (msg == "" || !msg) {
                            methods._closePrompt(errorField)
                        } else {
                            if (options.allrules[msg]) {
                                var txt = options.allrules[msg].alertTextOk;
                                if (txt) msg = txt
                            };
                            methods._showPrompt(errorField, msg, "pass", false, options, true)
                        }
                    } else {
                        errorInForm |= true; if (options.allrules[msg]) {
                            var txt = options.allrules[msg].alertText;
                            if (txt) msg = txt
                        };
                        methods._showPrompt(errorField, msg, "", false, options, true)
                    }
                }
            }; options.onAjaxFormComplete(!errorInForm, form, json, options)
        } else options.onAjaxFormComplete(true, form, "", options)
    }
    })
},
validateFieldsNotShowTip: function (form, field, skipAjaxValidation) {
    //方全伟添加，为了统计页面填写的合格率
    var options = form.data('jqv');
    var errorFound = false;
    form.trigger("jqv.form.validating");


    errorFound |= methods._validateFieldNotShowTip(field, options, skipAjaxValidation);

    form.trigger("jqv.form.result", [errorFound]);
    if (errorFound) {

        return false
    };
    return true
},
_validateFieldNotShowTip: function (field, options, skipAjaxValidation) {
    if (!field.attr("id"))
        $.error("jQueryValidate: an ID attribute is required for this field: " + field.attr("name") + " vclass:" + field.attr("vclass"));
    var rulesParsing = field.attr('vclass');
    var getRules = /validate\[(.*)\]/.exec(rulesParsing);
    if (!getRules) return false;
    var str = getRules[1];
    var rules = str.split(/\[|,|\]/);
    var isAjaxValidator = false;
    var fieldName = field.attr("name");
    var promptText = "";
    var required = false; options.isError = false;
    options.showArrow = true;
    var form = $(field.closest("form"));

    for (var i = 0; i < rules.length; i++) {
        rules[i] = rules[i].replace(" ", "");
        var errorMsg = undefined;
        switch (rules[i]) {
            case "required":
                required = true;
                errorMsg = methods._required(field, rules, i, options);
                break;
            case "custom":
                errorMsg = methods._customRegex(field, rules, i, options); break;
            case "groupRequired":
                var classGroup = "[vclass*=" + rules[i + 1] + "]";
                var firstOfGroup = form.find(classGroup).eq(0);
                if (firstOfGroup[0] != field[0]) {
                    methods._validateField(firstOfGroup, options, skipAjaxValidation); options.showArrow = true;
                    continue
                }; errorMsg = methods._groupRequired(field, rules, i, options);
                if (errorMsg) required = true; options.showArrow = false; break;
            case "ajax": if (!skipAjaxValidation) {
                    methods._ajax(field, rules, i, options);
                    isAjaxValidator = true
                }; break;
            case "minSize": errorMsg = methods._minSize(field, rules, i, options); break;
            case "maxSize": errorMsg = methods._maxSize(field, rules, i, options); break;
            case "min": errorMsg = methods._min(field, rules, i, options); break;
            case "max": errorMsg = methods._max(field, rules, i, options); break;
            case "past": errorMsg = methods._past(field, rules, i, options); break;
            case "future": errorMsg = methods._future(field, rules, i, options); break;
            case "dateRange":
                var classGroup = "[vclass*=" + rules[i + 1] + "]";
                var firstOfGroup = form.find(classGroup).eq(0);
                var secondOfGroup = form.find(classGroup).eq(1);
                if (firstOfGroup[0].value || secondOfGroup[0].value) {
                    errorMsg = methods._dateRange(firstOfGroup, secondOfGroup, rules, i, options)
                };
                if (errorMsg) required = true; options.showArrow = false; break;
            case "dateTimeRange": var classGroup = "[vclass*=" + rules[i + 1] + "]";
                var firstOfGroup = form.find(classGroup).eq(0); var secondOfGroup = form.find(classGroup).eq(1);
                if (firstOfGroup[0].value || secondOfGroup[0].value) { errorMsg = methods._dateTimeRange(firstOfGroup, secondOfGroup, rules, i, options) };
                if (errorMsg) required = true; options.showArrow = false; break;
            case "maxCheckbox": errorMsg = methods._maxCheckbox(form, field, rules, i, options);
                field = $(form.find("input[name='" + fieldName + "']")); break;
            case "minCheckbox": errorMsg = methods._minCheckbox(form, field, rules, i, options);
                field = $(form.find("input[name='" + fieldName + "']")); break;
            case "equals": errorMsg = methods._equals(field, rules, i, options); break;
            case "funcCall": errorMsg = methods._funcCall(field, rules, i, options); break; default:
        };
        if (errorMsg !== undefined) {
            promptText += errorMsg + "<br/>"; options.isError = true
        }
    };

    if (!required && field.val() == "")
        options.isError = false;
    var fieldType = field.prop("type");
    if ((fieldType == "radio" || fieldType == "checkbox") && form.find("input[name='" + fieldName + "']").size() > 1) {
        field = $(form.find("input[name='" + fieldName + "'][type!=hidden]:first"));
        options.showArrow = false
    };
    if (fieldType == "text" && form.find("input[name='" + fieldName + "']").size() > 1) {
        field = $(form.find("input[name='" + fieldName + "'][type!=hidden]:first"));
        options.showArrow = false
    };
//    if (options.isError) {
//        methods._showPrompt(field, promptText, "", false, options)
//    }
//    else {
//        if (!isAjaxValidator) methods._closePrompt(field)
//    };
    if (!isAjaxValidator) {
        field.trigger("jqv.field.result", [field, options.isError, promptText])
    };
    var errindex = $.inArray(field[0], options.InvalidFields); if (errindex == -1) {
        if (options.isError) options.InvalidFields.push(field[0])
    } else if (!options.isError) {
        options.InvalidFields.splice(errindex, 1)
    };

    return options.isError
},
        _validateField: function (field, options, skipAjaxValidation) {//验证入口
            if (!field.attr("id"))
                $.error("jQueryValidate: an ID attribute is required for this field: " + field.attr("name") + " vclass:" + field.attr("vclass"));
            var rulesParsing = field.attr('vclass');
            var getRules = /validate\[(.*)\]/.exec(rulesParsing);
            if (!getRules) return false;
            var str = getRules[1];
            var rules = str.split(/\[|,|\]/);
            var isAjaxValidator = false;
            var fieldName = field.attr("name");
            var promptText = "";
            var required = false; options.isError = false;
            options.showArrow = true;
            var form = $(field.closest("form"));

            for (var i = 0; i < rules.length; i++) {
                rules[i] = rules[i].replace(" ", "");
                var errorMsg = undefined;
                switch (rules[i]) {
                    case "required":
                        required = true;
                        errorMsg = methods._required(field, rules, i, options);
                        break;
                    case "custom":
                        errorMsg = methods._customRegex(field, rules, i, options); break;
                    case "groupRequired":
                        var classGroup = "[vclass*=" + rules[i + 1] + "]";
                        var firstOfGroup = form.find(classGroup).eq(0);
                        if (firstOfGroup[0] != field[0]) {
                            methods._validateField(firstOfGroup, options, skipAjaxValidation); options.showArrow = true;
                            continue
                        }; errorMsg = methods._groupRequired(field, rules, i, options);
                        if (errorMsg) required = true; options.showArrow = false; break;
                    case "ajax": if (!skipAjaxValidation) {
                            methods._ajax(field, rules, i, options);
                            isAjaxValidator = true
                        }; break;
                    case "minSize": errorMsg = methods._minSize(field, rules, i, options); break;
                    case "maxSize": errorMsg = methods._maxSize(field, rules, i, options); break;
                    case "min": errorMsg = methods._min(field, rules, i, options); break;
                    case "max": errorMsg = methods._max(field, rules, i, options); break;
                    case "past": errorMsg = methods._past(field, rules, i, options); break;
                    case "future": errorMsg = methods._future(field, rules, i, options); break;
                    case "dateRange":
                        var classGroup = "[vclass*=" + rules[i + 1] + "]";
                        var firstOfGroup = form.find(classGroup).eq(0);
                        var secondOfGroup = form.find(classGroup).eq(1);
                        if (firstOfGroup[0].value || secondOfGroup[0].value) {
                            errorMsg = methods._dateRange(firstOfGroup, secondOfGroup, rules, i, options)
                        };
                        if (errorMsg) required = true; options.showArrow = false; break;
                    case "dateTimeRange": var classGroup = "[vclass*=" + rules[i + 1] + "]";
                        var firstOfGroup = form.find(classGroup).eq(0); var secondOfGroup = form.find(classGroup).eq(1);
                        if (firstOfGroup[0].value || secondOfGroup[0].value) { errorMsg = methods._dateTimeRange(firstOfGroup, secondOfGroup, rules, i, options) };
                        if (errorMsg) required = true; options.showArrow = false; break;
                    case "maxCheckbox": errorMsg = methods._maxCheckbox(form, field, rules, i, options);
                        field = $(form.find("input[name='" + fieldName + "']")); break;
                    case "minCheckbox": errorMsg = methods._minCheckbox(form, field, rules, i, options);
                        field = $(form.find("input[name='" + fieldName + "']")); break;
                    case "equals": errorMsg = methods._equals(field, rules, i, options); break;
                    case "funcCall": errorMsg = methods._funcCall(field, rules, i, options); break; default:
                };
                if (errorMsg !== undefined) {
                    promptText += errorMsg + "<br/>"; options.isError = true
                }
            };

            if (!required && field.val() == "")
                options.isError = false;
            var fieldType = field.prop("type");
            if ((fieldType == "radio" || fieldType == "checkbox") && form.find("input[name='" + fieldName + "']").size() > 1) {
                field = $(form.find("input[name='" + fieldName + "'][type!=hidden]:first"));
                options.showArrow = false
            };
            if (fieldType == "text" && form.find("input[name='" + fieldName + "']").size() > 1) {
                field = $(form.find("input[name='" + fieldName + "'][type!=hidden]:first"));
                options.showArrow = false
            };
            if (options.isError) {
                methods._showPrompt(field, promptText, "", false, options)
            }
            else {
                if (!isAjaxValidator) methods._closePrompt(field)
            };
            if (!isAjaxValidator) {
                field.trigger("jqv.field.result", [field, options.isError, promptText])
            };
            var errindex = $.inArray(field[0], options.InvalidFields); if (errindex == -1) {
                if (options.isError) options.InvalidFields.push(field[0])
            } else if (!options.isError) {
                options.InvalidFields.splice(errindex, 1)
            };

            return options.isError
        },
        _required: function (field, rules, i, options) {
            switch (field.prop("type")) {
                case "text":
                case "password":
                case "textarea":
                case "file":
                default:
                    if (!field.val())
                        return options.allrules[rules[i]].alertText;
                    break;
                case "radio":
                case "checkbox":
                    var form = field.closest("form");
                    var name = field.attr("name");
                    if (form.find("input[name='" + name + "']:checked").size() == 0) {
                        if (form.find("input[name='" + name + "']").size() == 1) {
                            return options.allrules[rules[i]].alertTextCheckboxe;
                        }
                        else {
                            return options.allrules[rules[i]].alertTextCheckboxMultiple
                        }
                    }; break;
                case "select-one":
                    if (!field.val()) {
                        return options.allrules[rules[i]].alertText;
                    }
                    else if (field.val() == '-1') {
                        return options.allrules[rules[i]].alertText;
                    }
                    else if (field.val() == '0') {
                        return options.allrules[rules[i]].alertText;
                    }
                    break;
                case "select-multiple":
                    if (!field.find("option:selected").val()) {
                        return options.allrules[rules[i]].alertText;
                    }
                    break
            }
        },
        _groupRequired: function (field, rules, i, options) {
            var classGroup = "[vclass*=" + rules[i + 1] + "]";
            var isValid = false;
            field.closest("form").find(classGroup).each(
function () {
    if (!methods._required($(this), rules, i, options)) {
        isValid = true; return false
    }
});
            if (!isValid)
                return options.allrules[rules[i]].alertText
        }, _customRegex: function (field, rules, i, options) {
            var customRule = rules[i + 1];
            var rule = options.allrules[customRule];
            if (!rule) { alert("jqv:custom rule not found " + customRule); return };
            var ex = rule.regex;
            if (!ex) { alert("jqv:custom regex not found " + customRule); return };
            var pattern = new RegExp(ex);
            if (!pattern.test(field.val()))
                return options.allrules[customRule].alertText
        }, _funcCall: function (field, rules, i, options) {
            var functionName = rules[i + 1];
            var fn = window[functionName] || options.customFunctions[functionName];
            if (typeof (fn) == 'function')
                return fn(field, rules, i, options)
        }, _equals: function (field, rules, i, options) {
            var equalsField = rules[i + 1]; if (field.val() != $("#" + equalsField).val())
                return options.allrules.equals.alertText
        }
, _maxSize: function (field, rules, i, options) {
    var max = rules[i + 1]; var len = field.val().length;
    if (len > max) { var rule = options.allrules.maxSize; return rule.alertText + max + rule.alertText2 }
}
, _minSize: function (field, rules, i, options) {
    var min = rules[i + 1];
    var len = field.val().length; if (len < min) {
        var rule = options.allrules.minSize;
        return rule.alertText + min + rule.alertText2
    }
}
, _min: function (field, rules, i, options) {
    var min = parseFloat(rules[i + 1]); var len = parseFloat(field.val());
    if (len < min) {
        var rule = options.allrules.min;
        if (rule.alertText2)
            return rule.alertText + min + rule.alertText2;
        return rule.alertText + min
    }
}, _max: function (field, rules, i, options) {
    var max = parseFloat(rules[i + 1]); var len = parseFloat(field.val());
    if (len > max) {
        var rule = options.allrules.max; if (rule.alertText2)
            return rule.alertText + max + rule.alertText2;
        return rule.alertText + max
    }
}, _past: function (field, rules, i, options) {
    var p = rules[i + 1]; var pdate = (p.toLowerCase() == "now") ? new Date() : methods._parseDate(p);
    var vdate = methods._parseDate(field.val()); if (vdate < pdate) {
        var rule = options.allrules.past; if (rule.alertText2) return rule.alertText + methods._dateToString(pdate) + rule.alertText2;
        return rule.alertText + methods._dateToString(pdate)
    }
}, _future: function (field, rules, i, options) {
    var p = rules[i + 1];
    var pdate = (p.toLowerCase() == "now") ? new Date() : methods._parseDate(p);
    var vdate = methods._parseDate(field.val());
    if (vdate > pdate) {
        var rule = options.allrules.future; if (rule.alertText2)
            return rule.alertText + methods._dateToString(pdate) + rule.alertText2;
        return rule.alertText + methods._dateToString(pdate)
    }
}, _isDate: function (value) {
    var dateRegEx = new RegExp(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(?:(?:0?[1-9]|1[0-2])(\/|-)(?:0?[1-9]|1\d|2[0-8]))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(0?2(\/|-)29)(\/|-)(?:(?:0[48]00|[13579][26]00|[2468][048]00)|(?:\d\d)?(?:0[48]|[2468][048]|[13579][26]))$/); if (dateRegEx.test(value)) { return true }; return false
}
, _isDateTime: function (value) {
    var dateTimeRegEx = new RegExp(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1}$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^((1[012]|0?[1-9]){1}\/(0?[1-9]|[12][0-9]|3[01]){1}\/\d{2,4}\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1})$/); if (dateTimeRegEx.test(value)) { return true }
    ; return false
}, _dateCompare: function (start, end) { return (new Date(start.toString()) < new Date(end.toString())) }
, _dateRange: function (first, second, rules, i, options) {
    if ((!first[0].value && second[0].value) || (first[0].value && !second[0].value)) {
        return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2
    }; if (!methods._isDate(first[0].value) || !methods._isDate(second[0].value)) {
        return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2
    }; if (!methods._dateCompare(first[0].value, second[0].value)) {
        return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2
    }
}
, _dateTimeRange: function (first, second, rules, i, options) {
    if ((!first[0].value && second[0].value) || (first[0].value && !second[0].value)) {
        return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2
    }; if (!methods._isDateTime(first[0].value) || !methods._isDateTime(second[0].value)) {
        return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2
    }; if (!methods._dateCompare(first[0].value, second[0].value)) {
        return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2
    }
}, _maxCheckbox: function (form, field, rules, i, options) {
    var nbCheck = rules[i + 1]; var groupname = field.attr("name"); var groupSize = form.find("input[name='" + groupname + "']:checked").size(); if (groupSize > nbCheck) {
        options.showArrow = false;
        if (options.allrules.maxCheckbox.alertText2) return options.allrules.maxCheckbox.alertText + " " + nbCheck + " " + options.allrules.maxCheckbox.alertText2;
        return options.allrules.maxCheckbox.alertText
    }
}, _minCheckbox: function (form, field, rules, i, options) {
    var nbCheck = rules[i + 1]; var groupname = field.attr("name");
    var groupSize = form.find("input[name='" + groupname + "']:checked").size(); if (groupSize < nbCheck) {
        options.showArrow = false;
        return options.allrules.minCheckbox.alertText + " " + nbCheck + " " + options.allrules.minCheckbox.alertText2
    }
}
, _ajax: function (field, rules, i, options) {//使用ajax验证
    var errorSelector = rules[i + 1];
    var rule = options.allrules[errorSelector];
    var extraData = rule.extraData;
    var extraDataDynamic = rule.extraDataDynamic;
    if (!extraData) extraData = "";
    if (extraDataDynamic) {
        var tmpData = [];
        var domIds = String(extraDataDynamic).split(",");
        for (var i = 0; i < domIds.length; i++) {
            var id = domIds[i];
            if ($(id).length) {
                var inputValue = field.closest("form").find(id).val();
                var keyValue = id.replace('#', '') + '=' + escape(inputValue); tmpData.push(keyValue)
            }
        };
        extraDataDynamic = tmpData.join("&")
    }
    else {
        extraDataDynamic = ""
    };
    if (!options.isError) {
        $.ajax(
        {
            type: "GET",
            url: rule.url,
            cache: false,
            dataType: "json",
            data: "fieldId=" + field.attr("id") + "&fieldValue=" + escape(field.val()) + "&extraData=" + extraData + "&" + extraDataDynamic,
            field: field,
            rule: rule,
            methods: methods,
            options: options,
            beforeSend: function () {
                var loadingText = rule.alertTextLoad;
                if (loadingText)
                    methods._showPrompt(field, loadingText, "load", true, options)
            },
            error: function (data, transport) {
                methods._ajaxError(data, transport)
            },
            success: function (json) {
                var errorFieldId = json[0];
                var errorField = $($("#" + errorFieldId)[0]);

                if (errorField.length == 1) {
                    var status = json[1];
                    var msg = json[2];
                    if (!status) {
                        options.ajaxValidCache[errorFieldId] = false;
                        options.isError = true;
                        if (msg) {
                            if (options.allrules[msg]) {
                                var txt = options.allrules[msg].alertText;
                                if (txt) msg = txt
                            }
                        }
                        else {
                            msg = rule.alertText;
                        }
                        methods._showPrompt(errorField, msg, "", true, options)
                    }
                    else {
                        if (options.ajaxValidCache[errorFieldId] !== undefined) {
                            options.ajaxValidCache[errorFieldId] = true;
                        }
                        if (msg) {
                            if (options.allrules[msg]) {
                                var txt = options.allrules[msg].alertTextOk;
                                if (txt) msg = txt
                            }
                        }
                        else {
                            msg = rule.alertTextOk;
                        }
                        if (msg) {
                            methods._showPrompt(errorField, msg, "pass", true, options);
                        }
                        else {
                            methods._closePrompt(errorField)
                        }
                    }
                };
                errorField.trigger("jqv.field.result", [errorField, !options.isError, msg])
            }
        })
    }
},
        _ajaxError: function (data, transport) {
            if (data.status == 0 && transport == null) alert("The page is not served from a server! ajax call failed");
            else if (typeof console != "undefined") console.log("Ajax error: " + data.status + " " + transport)
        },
        _dateToString: function (date) {
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
        },
        _parseDate: function (d) {
            var dateParts = d.split("-"); if (dateParts == d) dateParts = d.split("/");
            return new Date(dateParts[0], (dateParts[1] - 1), dateParts[2])
        },
        _showPrompt: function (field, promptText, type, ajaxed, options, ajaxform) {
            var prompt = methods._getPrompt(field); if (ajaxform) prompt = false;
            if (prompt)
                methods._updatePrompt(field, prompt, promptText, type, ajaxed, options);
            else
                methods._buildPrompt(field, promptText, type, ajaxed, options)
        },
        _buildPrompt: function (field, promptText, type, ajaxed, options) {
            var prompt = $('<div>'); prompt.addClass(methods._getClassName(field.attr("id")) + "formError");
            if (field.is(":input")) prompt.addClass("parentForm" + methods._getClassName(field.parents('form').attr("id"))); prompt.addClass("formError");
            switch (type) {
                case "pass": prompt.addClass("greenPopup"); break;
                case "load": prompt.addClass("blackPopup"); break;
                default: options.InvalidCount++
            };
            if (ajaxed) prompt.addClass("ajaxed");
            var promptContent = $('<div>').addClass("formErrorContent").html(promptText).appendTo(prompt);
            if (options.showArrow) {
                var arrow = $('<div>').addClass("formErrorArrow");
                var positionType = field.data("promptPosition") || options.promptPosition;
                if (typeof (positionType) == 'string') {
                    if (positionType.indexOf(":") != -1) {
                        positionType = positionType.substring(0, positionType.indexOf(":"))
                    }
                };
                switch (positionType) {
                    case "bottomLeft":
                    case "bottomRight": prompt.find(".formErrorContent").before(arrow);
                        arrow.addClass("formErrorArrowBottom").html('<div class="line1"><!-- --></div><div class="line2"><!-- --></div><div class="line3"><!-- --></div><div class="line4"><!-- --></div><div class="line5"><!-- --></div><div class="line6"><!-- --></div><div class="line7"><!-- --></div><div class="line8"><!-- --></div><div class="line9"><!-- --></div><div class="line10"><!-- --></div>');
                        break;
                    case "topLeft":
                    case "topRight":
                        arrow.html('<div class="line10"><!-- --></div><div class="line9"><!-- --></div><div class="line8"><!-- --></div><div class="line7"><!-- --></div><div class="line6"><!-- --></div><div class="line5"><!-- --></div><div class="line4"><!-- --></div><div class="line3"><!-- --></div><div class="line2"><!-- --></div><div class="line1"><!-- --></div>');
                        prompt.append(arrow); break
                }
            };
            if (options.isOverflown) field.before(prompt);
            else $("body").append(prompt);
            var pos = methods._calculatePosition(field, prompt, options);
            //alert(field.attr("id") + ":" + pos.callerleftPosition);
            if (pos.callerleftPosition.substring(0, 1) == '-') {
                pos = methods._calculatePosition($("#FOB"), prompt, options);
                //alert(field.attr("id") + ":" + pos.callerleftPosition);
            }
            prompt.css(
            {
                "top": pos.callerTopPosition,
                "left": pos.callerleftPosition,
                "marginTop": pos.marginTopSize,
                "opacity": 0
            })
            .data("callerField", field);
            return prompt.animate({ "opacity": 0.95 })
        }
, _updatePrompt: function (field, prompt, promptText, type, ajaxed, options, noAnimation) {
    if (prompt) {
        if (typeof type !== "undefined") {
            if (type == "pass") prompt.addClass("greenPopup");
            else prompt.removeClass("greenPopup"); if (type == "load") prompt.addClass("blackPopup");
            else prompt.removeClass("blackPopup")
        }; if (ajaxed) prompt.addClass("ajaxed");
        else prompt.removeClass("ajaxed"); prompt.find(".formErrorContent").html(promptText);
        var pos = methods._calculatePosition(field, prompt, options);
        if (pos.callerleftPosition.substring(0, 1) == '-') {
            pos = methods._calculatePosition($("#FOB"), prompt, options);
            //alert(field.attr("id") + ":" + pos.callerleftPosition);
        };
        css = { "top": pos.callerTopPosition
     , "left": pos.callerleftPosition
     , "marginTop": pos.marginTopSize
        };
        if (noAnimation) prompt.css(css); else prompt.animate(css)
    }
}
, _closePrompt: function (field) {
    var prompt = methods._getPrompt(field);
    if (prompt) prompt.fadeTo("fast", 0, function () { prompt.remove() })
}
, closePrompt: function (field) {
    return methods._closePrompt(field)
}
, _getPrompt: function (field) {
    var className = methods._getClassName(field.attr("id")) + "formError";
    var match = $("." + methods._escapeExpression(className))[0]; if (match) return $(match)
}
, _escapeExpression: function (selector) { return selector.replace(/([#;&,\.\+\*\~':"\!\^$\[\]\(\)=>\|])/g, "\\$1") }
, _calculatePosition: function (field, promptElmt, options) {
    var promptTopPosition, promptleftPosition, marginTopSize;
    var fieldWidth = field.width();
    var promptHeight = promptElmt.height();
    var overflow = options.isOverflown;
    if (overflow) { promptTopPosition = promptleftPosition = 0; marginTopSize = -promptHeight }
    else { var offset = field.offset(); promptTopPosition = offset.top; promptleftPosition = offset.left; marginTopSize = 0 };
    var positionType = field.data("promptPosition") || options.promptPosition; var shift1 = "";
    var shift2 = "";
    var shiftX = 0; var shiftY = 0; if (typeof (positionType) == 'string') {
        if (positionType.indexOf(":") != -1) {
            shift1 = positionType.substring(positionType.indexOf(":") + 1); positionType = positionType.substring(0, positionType.indexOf(":"));
            if (shift1.indexOf(",") != -1) {
                shift2 = shift1.substring(shift1.indexOf(",") + 1); shift1 = shift1.substring(0, shift1.indexOf(","));
                shiftY = parseInt(shift2); if (isNaN(shiftY)) { shiftY = 0 }
            }; shiftX = parseInt(shift1); if (isNaN(shift1)) { shift1 = 0 }
        }
    };
    switch (positionType) {
        default:
        case "topRight":
            if (overflow)
                promptleftPosition += fieldWidth - 30;
            else {
                promptleftPosition += fieldWidth - 30;
                //alert(promptleftPosition);
                promptTopPosition += -promptHeight - 2
            };
            break;
        case "topLeft": promptTopPosition += -promptHeight - 10;
            break;
        case "centerRight": promptleftPosition += fieldWidth + 13;
            break; case "bottomLeft": promptTopPosition = promptTopPosition + field.height() + 15;
            break;
        case "bottomRight": promptleftPosition += fieldWidth - 30; promptTopPosition += field.height() + 5
    }; promptleftPosition += shiftX; promptTopPosition += shiftY;
    return { "callerTopPosition": promptTopPosition + "px", "callerleftPosition": promptleftPosition + "px", "marginTopSize": marginTopSize + "px" }
}
, _saveOptions: function (form, options) {
    if ($.validationEngineLanguage) var allRules = $.validationEngineLanguage.allRules;
    else $.error("jQuery.validationEngine rules are not loaded, plz add localization files to the page");
    $.validationEngine.defaults.allrules = allRules;
    var userOptions = $.extend(true, {}, $.validationEngine.defaults, options);
    form.data('jqv', userOptions);
    return userOptions
}
, _getClassName: function (className) { if (className) { return className.replace(/:/g, "_").replace(/\./g, "_") } }
    };
    $.fn.validationEngine = function (method) {
        var form = $(this);
        if (!form[0])
            return false;
        if (typeof (method) == 'string' && method.charAt(0) != '_' && methods[method]) {
            if (method != "showPrompt" && method != "hidePrompt" && method != "hide" && method != "hideAll") methods.init.apply(form);
            return methods[method].apply(form, Array.prototype.slice.call(arguments, 1))
        }
        else if (typeof method == 'object' || !method) {
            methods.init.apply(form, arguments);
            return methods.attach.apply(form)
        }
        else {
            $.error('Method ' + method + ' does not exist in jQuery.validationEngine')
        }
    };
    $.validationEngine = {
        defaults: {
            validationEventTrigger: "blur"
, scroll: true
, focusFirstField: true
, promptPosition: "topRight"
, bindMethod: "bind"
, inlineAjax: false
, ajaxFormValidation: false
, ajaxFormValidationURL: false
, onAjaxFormComplete: $.noop
, onBeforeAjaxFormValidation: $.noop
, onValidationComplete: false
, isOverflown: false
, overflownDIV: ""
, doNotShowAllErrosOnSubmit: false
, binded: false
, showArrow: true
, isError: false, ajaxValidCache: {}
, autoPositionUpdate: false
, InvalidFields: []
, onSuccess: false, onFailure: false
        }
    };
}
)(jQuery);

(function ($) {
    // 验证规则
    $.fn.validationEngineLanguage = function () { };
    $.validationEngineLanguage = {
        newLang: function () {
            $.validationEngineLanguage.allRules = {
                          "required": { // Add your regex rules here, you can take telephone as an example
                    "regex": "none",
                    "alertText": "* This field is required",
                    "alertTextCheckboxMultiple": "* Please select an option",
                    "alertTextCheckboxe": "* This checkbox is required",
                    "alertTextDateRange": "* Both date range fields are required"
                },
                "requiredInFunction": { 
                    "func": function(field, rules, i, options){
                        return (field.val() == "test") ? true : false;
                    },
                    "alertText": "* Field must equal test"
                },
                "dateRange": {
                    "regex": "none",
                    "alertText": "* Invalid ",
                    "alertText2": "Date Range"
                },
                "dateTimeRange": {
                    "regex": "none",
                    "alertText": "* Invalid ",
                    "alertText2": "Date Time Range"
                },
                "minSize": {
                    "regex": "none",
                    "alertText": "* Minimum ",
                    "alertText2": " characters allowed"
                },
                "maxSize": {
                    "regex": "none",
                    "alertText": "* Maximum ",
                    "alertText2": " characters allowed"
                },
				"groupRequired": {
                    "regex": "none",
                    "alertText": "* You must fill one of the following fields"
                },
                "min": {
                    "regex": "none",
                    "alertText": "* Minimum value is "
                },
                "max": {
                    "regex": "none",
                    "alertText": "* Maximum value is "
                },
                "past": {
                    "regex": "none",
                    "alertText": "* Date prior to "
                },
                "future": {
                    "regex": "none",
                    "alertText": "* Date past "
                },	
                "maxCheckbox": {
                    "regex": "none",
                    "alertText": "* Maximum ",
                    "alertText2": " options allowed"
                },
                "minCheckbox": {
                    "regex": "none",
                    "alertText": "* Please select ",
                    "alertText2": " options"
                },
                "equals": {
                    "regex": "none",
                    "alertText": "* Fields do not match"
                },
                "creditCard": {
                    "regex": "none",
                    "alertText": "* Invalid credit card number"
                },
                "phone": {
                    // credit: jquery.h5validate.js / orefalo
                    "regex": /^([\+][0-9]{1,3}[\ \.\-])?([\(]{1}[0-9]{2,6}[\)])?([0-9\ \.\-\/]{3,20})((x|ext|extension)[\ ]?[0-9]{1,4})?$/,
                    "alertText": "* Invalid phone number"
                },
                "email": {
                    // HTML5 compatible email regex ( http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#    e-mail-state-%28type=email%29 )
                    "regex": /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                    "alertText": "* Invalid email address"
                },
                "integer": {
                    "regex": /^[\-\+]?\d+$/,
                    "alertText": "* Not a valid integer"
                },
                "number": {
                    // Number, including positive, negative, and floating decimal. credit: orefalo
                    "regex": /^[\-\+]?((([0-9]{1,3})([,][0-9]{3})*)|([0-9]+))?([\.]([0-9]+))?$/,
                    "alertText": "* Invalid floating decimal number"
                },
                "date": {                    
                    //	Check if date is valid by leap year
			"func": function (field) {
					var pattern = new RegExp(/^(\d{4})[\/\-\.](0?[1-9]|1[012])[\/\-\.](0?[1-9]|[12][0-9]|3[01])$/);
					var match = pattern.exec(field.val());
					if (match == null)
					   return false;
	
					var year = match[1];
					var month = match[2]*1;
					var day = match[3]*1;					
					var date = new Date(year, month - 1, day); // because months starts from 0.
	
					return (date.getFullYear() == year && date.getMonth() == (month - 1) && date.getDate() == day);
				},                		
			 "alertText": "* Invalid date, must be in YYYY-MM-DD format"
                },
                "ipv4": {
                    "regex": /^((([01]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))[.]){3}(([0-1]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))$/,
                    "alertText": "* Invalid IP address"
                },
                "url": {
                    "regex": /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
                    "alertText": "* Invalid URL"
                },
                "onlyNumberSp": {
                    "regex": /^[0-9\ ]+$/,
                    "alertText": "* Numbers only"
                },
                "onlyLetterSp": {
                    "regex": /^[a-zA-Z\ \']+$/,
                    "alertText": "* Letters only"
                },
                "onlyLetterNumber": {
                    "regex": /^[0-9a-zA-Z]+$/,
                    "alertText": "* No special characters allowed"
                },
 		"signlessNumber": {
                    "regex": /^[1-9]\d*$/,
                    "alertText": "* Positive integer only"
                },
                // --- CUSTOM RULES -- Those are specific to the demos, they can be removed or changed to your likings
       // --- CUSTOM RULES -- Those are specific to the demos, they can be removed or changed to your likings
                "ajaxUserCall": {
                    "url": "ajaxValidateFieldUser",
                    // you may want to pass extra data on the ajax call
                    "extraData": "name=eric",
                    "alertText": "* This user is already taken",
                    "alertTextLoad": "* Validating, please wait"
                },
				"ajaxUserCallPhp": {
                    "url": "phpajax/ajaxValidateFieldUser.php",
                    // you may want to pass extra data on the ajax call
                    "extraData": "name=eric",
                    // if you provide an "alertTextOk", it will show as a green prompt when the field validates
                    "alertTextOk": "* This username is available",
                    "alertText": "* This user is already taken",
                    "alertTextLoad": "* Validating, please wait"
                },
                "ajaxNameCall": {
                    // remote json service location
                    "url": "ajaxValidateFieldName",
                    // error
                    "alertText": "* This name is already taken",
                    // if you provide an "alertTextOk", it will show as a green prompt when the field validates
                    "alertTextOk": "* This name is available",
                    // speaks by itself
                    "alertTextLoad": "* Validating, please wait"
                },
				 "ajaxNameCallPhp": {
	                    // remote json service location
	                    "url": "phpajax/ajaxValidateFieldName.php",
	                    // error
	                    "alertText": "* This name is already taken",
	                    // speaks by itself
	                    "alertTextLoad": "* Validating, please wait"
	                },
                "validate2fields": {
                    "alertText": "* Please input HELLO"
                },
	            //tls warning:homegrown not fielded 
                "dateFormat":{
                    "regex": /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(?:(?:0?[1-9]|1[0-2])(\/|-)(?:0?[1-9]|1\d|2[0-8]))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(0?2(\/|-)29)(\/|-)(?:(?:0[48]00|[13579][26]00|[2468][048]00)|(?:\d\d)?(?:0[48]|[2468][048]|[13579][26]))$/,
                    "alertText": "* Invalid Date"
                },
                //tls warning:homegrown not fielded 
		"dateTimeFormat": {
	                "regex": /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1}$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^((1[012]|0?[1-9]){1}\/(0?[1-9]|[12][0-9]|3[01]){1}\/\d{2,4}\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1})$/,
                    "alertText": "* Invalid Date or Date Format",
                    "alertText2": "Expected Format: ",
                    "alertText3": "mm/dd/yyyy hh:mm:ss AM|PM or ", 
                    "alertText4": "yyyy-mm-dd hh:mm:ss AM|PM"
	         },
                
                ///////////////////////// 自定义行为开始////////////////////////////////////////
                "hscode": {
                    "regex": /^[0-9.]{1,12}$/,
                    "alertText": "* HS编码只能数字或小数点,长度不能超过12位"
                }
            };

        }
    };
    $.validationEngineLanguage.newLang();
})(jQuery);