// ==UserScript==
// @name         bili_��Ƶʱ��ɸѡ
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
}, 2000);//����ʱһ�£�����ť����Ƶ��Ŀelement��û���س�����querySelectorAllȡ����������ȡ��Ϊ��console�ǲ��ᱨerror�ģ�������һ��ʼû��ʶ��



function add_listen() {
	let btns = document.querySelectorAll(".vui_pagenation--btn");
	btns.forEach(element => {
		// element.addEventListener('click', function () {
		// 	alert('����addEventListener�﷨ע����¼�-1')//�ȵ�����һ��
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