(function(root, factory){
	if(typeof exports === "object" && exports){
		factory(exports); // CommonJS
	} else {
		var extend = {};
		factory(extend);
		if(typeof define === "function" && define.amd){
			define(extend);
		} else {
			root.extend = extend
		}
	}
}(this, function (extend){
	extend.extend = function (dest, ...srcs) {

		if(!dest) {
			dest = {};
		}
		if(!(srcs && srcs.length > 0)) {
			return dest;
		}
		for (var i = 0; i < srcs.length; i++){
			for(var key in srcs[i]){
				dest[key] = srcs[i][key];
			}
		}

		return dest;
	}

}));