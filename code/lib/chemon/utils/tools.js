function ajaxTurn2Page(contextSel, baseUrl, number) {
	if (baseUrl.indexOf('?')<0)
	{
		baseUrl=baseUrl+"?number="+number;
	}
	else
	{
		baseUrl=baseUrl+"&number="+number;
	}	
		$.get(baseUrl, function(data) {
			$(contextSel).empty();
			$(contextSel).append(data);
		});
}



//
function isContainsChinese(desc){
	var reg=/.*[\u4e00-\u9fa5]+.*$/m;
	var flag=reg.test(desc);
	return flag;
}