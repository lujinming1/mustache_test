define(['view/base'],function(View){
	window.onhasechange = function(){View.URLparse();};
	View.URLparse();
});