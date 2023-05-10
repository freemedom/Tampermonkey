// ==UserScript==
// @name         coca
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.english-corpora.org/coca/*
// @icon         https://www.google.com/s2/favicons?domain=english-corpora.org
// @grant        none
// @require        https://gcore.jsdelivr.net/gh/andywang425/BLTH@dac0d115a45450e6d3f3e17acd4328ab581d0514/assets/js/library/Ajax-hook.min.js
// ==/UserScript==

function disen_sel() {
// 	debugger
    document.onselectstart = new Function("return true")
	document.getElementsByName("x1")[0].contentWindow.document.onselectstart = new Function("return true")
	document.getElementsByName("x2")[0].contentWindow.document.onselectstart = new Function("return true")
	document.getElementsByName("x3")[0].contentWindow.document.onselectstart = new Function("return true")
	document.getElementsByName("x4")[0].contentWindow.document.onselectstart = new Function("return true")
}

(function () {
	'use strict';
// 	loader = () => {
// 		return false;
// 	}
	setInterval(disen_sel, 3000);

// 	ah.proxy({
// 		onResponse: async (response, handler) => {
//             console.log(response.config.url)
// 			if (response.config.url.includes('/coca/x3.asp')) {
// 				console.log(response.response)

// 				response.response = response.response.replace('parent.location.href == self.location.href', 'false');
// 			}
// 			handler.next(response);
// 		}
// 	})
	//Your code here ...
})();
