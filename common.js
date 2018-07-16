define([
	'mustache',
	'extend'
], function(mustache, extend){
	var $ = {};
	$.mustache = mustache;
	window.tplObj = {
		page: "",
		tpl: {},
		data: {
			helloworld: true
		}
	}
	$.extend = extend.extend;

	return $;
});