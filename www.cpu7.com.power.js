// ==UserScript==
// @name         www.cpu7.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.cpu7.com/power/pw.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cpu7.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();

setTimeout(() => {
	let ll = document.querySelectorAll(".more_details")
for (let index = 0; index < 100; index++) {
	ll[index].click()
	
}
}, 3000);
