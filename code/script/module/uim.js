$(function () {
    initCountryProvCityArea();
    initCountryCityPort();
    function initCountryProvCityArea() {
        $("select.country-select", "div.country-prov-city-area").chosen().change(function () {
            var $this = $(this);
            var countryId = $this.val();
            ajaxJSONReq(ctx + "/province/getProvincesJSON/" + countryId, null, function (data) {
                var $prov = $("select.prov-select", $this.parent("div"));
                var $city = $("select.city-select", $this.parent("div"));
                var $area = $("select.area-select", $this.parent("div"));

                $prov.empty();
                $city.empty();
                $area.empty();

                var selectedProvCode = $prov.data("prov-code");
                for (var i = 0; i < data.length; i++) {
                    var prov = data[i];
                    if (prov.code == selectedProvCode) {
                        $prov.append("<option value=\"" + prov.code + "\" selected=\"selected\">" + prov.cnName + "</option>");
                    } else {
                        $prov.append("<option value=\"" + prov.code + "\">" + prov.cnName + "</option>");
                    }
                }

                $prov.trigger("liszt:updated");
                $prov.trigger("change");
            });
        });

        $("select.country-select", "div.country-prov-city-area").each(function () {
            var $country = $(this);
            if (!$.isEmptyObject($country.val())) {
                $country.trigger("change");
            }
        });

        $("select.prov-select", "div.country-prov-city-area").chosen().change(function () {
            var $this = $(this);
            var provCode = $this.val();
            ajaxJSONReq(ctx + "/city/getCitiesJSON/" + provCode, null, function (data) {
                var $city = $("select.city-select", $this.parent("div"));
                var $area = $("select.area-select", $this.parent("div"));
                $city.empty();
                $area.empty();

                var selectedCityCode = $city.data("city-code");
                for (var i = 0; i < data.length; i++) {
                    var city = data[i];
                    if (city.code == selectedCityCode) {
                        $city.append("<option value=\"" + city.code + "\" selected=\"selected\">" + city.cnName + "</option>");
                    } else {
                        $city.append("<option value=\"" + city.code + "\">" + city.cnName + "</option>");
                    }
                }
                $city.trigger("liszt:updated");
                $city.trigger("change");
            });
        });

        $("select.city-select", "div.country-prov-city-area").chosen().change(function () {
            var $this = $(this);
            var cityCode = $this.val();
            ajaxJSONReq(ctx + "/area/getAreasJSON/" + cityCode, null, function (data) {
                var $area = $("select.area-select", $this.parent("div"));
                $area.empty();

                var selectedAreaCode = $area.data("area-code");
                for (var i = 0; i < data.length; i++) {
                    var area = data[i];
                    if (area.code == selectedAreaCode) {
                        $area.append("<option value=\"" + area.code + "\" selected=\"selected\">" + area.cnName + "</option>");
                    } else {
                        $area.append("<option value=\"" + area.code + "\">" + area.cnName + "</option>");
                    }
                }
                $area.trigger("liszt:updated");
            });
        });
    }
    function initCountryCityPort(){
    	$("select.country-select","div.country-city-port").chosen().change(function(){
    		var $this = $(this);
    		var countryId = $this.val();
    		ajaxJSONReq( ctx +"/city/getCitiesJSONByCountryId/" + countryId  ,null,function(data){
                 var $city = $("select.city-select", $this.parent("div"));
                 var $port = $("select.port-select", $this.parent("div"));
                 $city.empty();
                 $port.empty();
                 
                 var selectedCityCode = $city.data("city-code");
                 for(var i=0;i<data.length;i++){
                	 var city = data[i];
                	 if(city.code == selectedCityCode){
                		 $city.append("<option value=\"" + city.code +"\" selected=\"selected\">"+ city.cnName +"</option>" );
                	 }else{
                		 $city.append("<option value=\"" + city.code +"\">"+ city.cnName +"</option>" );
                	 }
                 }
                 $city.trigger("liszt:updated");
                 $city.trigger("change");
    		});
    	});
    	
    	$("select.country-select", "div.country-city-port").each(function () {
            var $country = $(this);
            if (!$.isEmptyObject($country.val())) {
                $country.trigger("change");
            }
        });
    	
    	$("select.city-select","div.country-city-port").chosen().change(function(){
    		var $this = $(this);
    		var cityCode = $this.val();
    		ajaxJSONReq(ctx +"/portcode/getPortsJSONByCityCode/" + cityCode  ,null,function(data){
                 var $port = $("select.port-select", $this.parent("div"));
                 $port.empty();
                 
                 var selectedPortId= $port.data("port-id");
                 for(var i=0;i<data.length;i++){
                	 var port = data[i];
                	 if(port.id == selectedPortId){
                		 $port.append("<option value=\"" + port.id +"\" selected=\"selected\">"+ port.cnName +"</option>" );
                	 }else{
                		 $port.append("<option value=\"" + port.id +"\">"+ port.cnName +"</option>" );
                	 }
                 }
                 $port.trigger("liszt:updated");
    		});
    	});    	
    }
});