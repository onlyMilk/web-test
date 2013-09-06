/**
 * 初始华下拉框
 * @param url 请求地址
 * @param params 参数 obj
 * @param id 数据加载到的那个select id
 * @param defValue 默认选中的值
 */
function initSelected(url,params,id,defValue){
	var target = $("#"+id);
	var _val = defValue ? defValue:"";
	$.ajax({
        type: 'GET',
        url: url,
        data : params,
        dataType: 'json',
        success: function (data) {
        	target.empty();
     	   if(data.successed)
     		{
     		  target.append("<option value=''>"+ "请选择"+ "</option>");
              $.each(data.valueObject, function(i,item){
            	  if(_val == item.code){
            		  target.append("<option selected value='" + item.code + "'>"+ item.cnName+ "</option>");
            	  }else{
            	      target.append("<option  value='" + item.code + "'>"+ item.cnName+ "</option>");
            	  }
              });
              target.trigger("liszt:updated");
     		 }
     	   else
     	   {
     		   alert(data.returnObject);
     	   }
        }
    });
}