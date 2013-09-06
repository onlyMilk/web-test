	$(document).ready(function() {
        $(".nav-comm").hover(
			function(){ $(this).addClass("nav-active");},
			function(){ $(this).removeClass("nav-active");}
		);
    });
	
		//上下滚动
var textRoll=function(){
	var subnum=$('#addver p').size();
	if(subnum>1){
	$('#addver p:last').css({'display':'block','opacity': '0'}).insertBefore('#addver p:first').animate({'height':'35px','opacity': '1'}, 'slow', function() { $(this).css("display","block").next("p").fadeOut("slow");});
	}
}

$(function(){

//触发上下文字滚动事件

var roll=setInterval('textRoll()',4000);

$("#addver p").hover(function() {

clearInterval(roll);

}, function() {

roll = setInterval('textRoll()', 4000)

});

});