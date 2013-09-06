$.validation = $.validation||{};
$.validation.error = function(error, element) {
	var elementName = error[0].htmlFor;
	$(("#v_") + elementName).removeClass("input-success icon-ok");
	$(("#v_") + elementName).addClass("input-error icon-exclamation-sign");
	$(("#v_") + elementName).attr("data-original-title", error[0].innerText);
};

$.validation.success = function(error, element) {
	var elementName = error[0].htmlFor;
	$(("#v_") + elementName).removeClass("input-error icon-exclamation-sign");
	$(("#v_") + elementName).addClass("input-success icon-ok");
	$(("#v_") + elementName).attr("data-original-title", error[0].innerText);
};

$.utils = $.utils||{};
$.utils.showError = function(error){
	if(error==""){
		alert("Connection Failure!");
	}else if(error instanceof Error){
		alert(error.message);
	}else{
		alert("Error");
	}
};