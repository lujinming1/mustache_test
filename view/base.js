define([
	'common',
	'view/renderTpl'
], function($,BaseView){
	function eventView(){};

	eventView.prototype = new BaseView();
	eventView.prototype.constructor = BaseView;

	var eventFunction = {
		events: {
			'click .J-btn': 'changePage'
		},
		changePage: function(){
			var _view = eventView.prototype,
				helloworld = window.tplObj.data.helloworld;
			if(helloworld !== 'undefinde' && helloworld !== 'null'){
				helloworld = !helloworld;
			} else {
				helloworld = true;
			}
			window.tplObj.data.helloworld = helloworld;
			eventView.prototype.URLparse();
		},

		renderIndex: function(_callback){
			if(!(_callback && typeof _callback == "function")) return;
			_callback();
		},

		URLparse: function(){
			var _tplObjData = window.tplObj.data,
				_refreshHash = function(_callback){eventView.prototype.refreshHash(_callback)};
			eventView.prototype.renderIndex(_refreshHash);

		}
	}
	$.extend(eventView.prototype, eventFunction);

	return new eventView();
});