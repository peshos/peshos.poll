"use strict";

var PeshOS = PeshOS || {};

PeshOS.Common = (function() {
	function rgb2hex(rgb) {
		rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		function hex(x) {
			return ("0" + parseInt(x).toString(16)).slice(-2);
		}
		return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
	}
	
	function queryString(key) {
		key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&");
		var match = location.search.match(new RegExp("[?&]" + key + "=([^&]+)(&|$)"));
		return match && decodeURIComponent(match[1].replace(/\+/g, " "));
	}

	function removeURLParameter(url, parameter) {
	    var urlparts = url.split('?');
	    if (urlparts.length >= 2) {

	        var prefix = encodeURIComponent(parameter) + '=';
	        var pars = urlparts[1].split(/[&;]/g);

	        for (var i = pars.length; i-- > 0;) {
	            if (pars[i].lastIndexOf(prefix, 0) !== -1) {
	                pars.splice(i, 1);
	            }
	        }

	        url = urlparts[0] + '?' + pars.join('&');
	        return url;
	    } else {
	        return url;
	    }
	}
	
	function resizeApp(width, height) {
	    if (!window.parent) {
	        return;
	    }

	    var message = ['<Message senderId=', queryString('SenderId'), ' >',
                'resize(', width, ',', height, ')</Message>'].join('');

	    window.parent.postMessage(message, '*');
	}

	return {
		rgb2hex: rgb2hex,
		queryString: queryString,
		removeURLParameter: removeURLParameter,
		resizeApp: resizeApp
	};
}());