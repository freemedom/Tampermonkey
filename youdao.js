// ==UserScript==
// @name         有道翻译内容保存/备份
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://fanyi.youdao.com/index.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youdao.com
// @grant GM_getValue
// @grant GM_setValue
// ==/UserScript==

(function () {
	'use strict';

	// Your code here...
})();
setInterval(() => {
	// 
	var array_text = GM_getValue('array_text')//Set无法直接GM存，存的话为空
	if (!array_text) {
		array_text = new Set();
	}
	var set_text = new Set(array_text);

	set_text.add(document.querySelector("#js_fanyi_input").innerText);
	array_text = Array.from(set_text)

	GM_setValue('array_text', array_text)
}, 10000);