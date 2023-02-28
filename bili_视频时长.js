// ==UserScript==
// @name         bili_视频时长筛选
// @namespace    greasyfork
// @version      0.1
// @match        https://search.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @grant        GM_log
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// ==/UserScript==

// dis_none();
setTimeout(() => {
	dis_none()
}, 2000);//得延时一下，否则按钮和视频条目element还没加载出来，querySelectorAll取不到，不过取的为空console是不会报error的，所以我一开始没意识到



function add_listen() {
	let btns = document.querySelectorAll(".vui_pagenation--btn");
	btns.forEach(element => {
		// element.addEventListener('click', function () {
		// 	alert('我是addEventListener语法注册的事件-1')//先弹出第一个
		// });
		element.addEventListener('click', () => {
			setTimeout(dis_none, 1000);
		});
	});
}

function dis_none() {
	let li = document.querySelectorAll("div.bili-video-card__wrap.__scale-wrap > a > div > div.bili-video-card__mask > div > span");
	li.forEach(element => {
		debugger;
		let arr = element.innerText.split(':');

		if (arr[0] > 5) {
			element.closest('div.video-list-item').style.setProperty('display', 'none', 'important');
		}
	});


	add_listen();
}