define([
	'common'
],function($){
	var delegateEventSplitter = /^(\S+)\s*(.*)$/;

	var Render = function(){
		this._num = 1;
		this._objDeep = 1;
		this._html = "";
		this.config = {
			hello: {
				Dpage: 'index',
				main: 'helloworld'
			},
			page: {
				Dpage: 'index',
				main: 'page2'
			}
		}
		
	};
	$.extend(Render.prototype, {

		delegateEvents: function(events, keepOld){
			if(!(events || (events = this.events))){
				return this;
			}
			if(!keepOld){
				this.undelegateEvens();
			}
			for (var key in events){
				var method = events[key];
				if(typeof method !== 'function'){
					method = this[events[key]];
				}

				var match = key.match(delegateEventSplitter);
				var eventName = match[1],
					selector = match[2] ? match[2] : null;
				document.querySelector(selector)['on'+eventName] = method;
			}
			return this;
		},

		undelegateEvens: function(){
			return this;
		},

		resursionTpl: function(partials, _callback){
			if(_callback && typeof _callback == 'function'){
				_callback();
			}
			this.getObjDeep(window.tplObj.page);
			var _view = $.extend({}, this.renderData,window.tplObj.data);
			for(var _i = 0; _i <= this._objDeep; _i++){
				this._html = !this._html 
				? $.mustache.render(this.renderData['tpl_'+ window.tplObj.page], _view) 
				: $.mustache.render(this._html, _view);
			}
			document.getElementById("J_wrapper").innerHTML = this._html;
			this.delegateEvents();

			this._num = 1;
			this._html = "";
			delete this.renderData;
			return this;			
		},

		getObjDeep: function(_name){
			if(!this.config[_name]) return;
			this.renderData = {};

			var _default = this.config[_name]['Dpage'] ? this.config[_name]['Dpage'] : _name;
			this.renderData['tpl_' + _name] =  window.tplObj.tpl['tpl_' + window.tplObj.page];
			for(var i in this.config[_name]){
				if(typeof(this.config[_name][i]) == 'object'){
					this._objDeep ++;
				}
				this.renderData['tpl_' + i] = window.tplObj.tpl['tpl_'+this.config[_name][i]];
			}

		},


		cycle: function(_name,partials,_parent,_callback){
			var _that = this,
				_parent = _parent ? _parent : this.config,
				_key = typeof _parent[_name] != 'string' ? _name : _parent[_name];
			if(!(_parent[_name] && (typeof _parent[_name] == "string" || typeof _parent[_name] == "object"))) {
				console.log("tpl config error"); 
				return;
			}

			if(typeof _parent[_name] != "string"){
				var _newParentObj = _parent[_name];
				for(var _tem in _newParentObj){
					if(('tpl_' + _key) in window.tplObj.tpl || _tem == 'Dpage') continue;
					_that._num++;
					_that.cycle(_tem, partials,_newParentObj);
				}
			}

			if(('tpl_' + _key) in window.tplObj.tpl){
				_that._num--;
				if(_that._num === 0) _that.resursionTpl(partials);
			}else{
				var _link = typeof _parent[_name] != 'string' 
				? 'text!tpl/' + (_parent[_name]['Dpage'] ? _parent[_name]['Dpage'] : _name) + '.mustache' 
				: 'text!tpl/'+ _parent[_name] +'.mustache';
				require([_link], function(tpl){
					_that._num--;
					window.tplObj.tpl['tpl_' + _key] = tpl;
					if(_that._num === 0) _that.resursionTpl(partials, _callback);
				});
			}
			

		},
		refreshHash: function(_callback, partials){
			if(!("onhashchange" in window)) {
				location.reload(); 
				return;
			}
			var _linkHash = window.tplObj.page = window.tplObj.data.helloworld ? 'hello' : 'page';

			this.cycle(_linkHash,partials,'',_callback);
		}
	})

	return Render;        
});