// ==UserScript==
// @name         网易见外工作台
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://jianwai.youdao.com/videocheck/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youdao.com
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
	// setInterval(() => {
	// 	document.querySelector("div.caption-text.caption-text-bg").style.display="block"
	// }, 1000);
	setTimeout(() => {
		add_button()
	}, 2000);
})();


function add_button() {
	'use strict';
	add_container();

	var button1 = document.createElement("button"); //创建一个input对象（提示框按钮）
	// button1.id = "id001";
	button1.textContent = "切换视频宽度";
	button1.style.display = "block";
	button1.style.fontSize = "0.2rem";
	button1.title = ""

	button1.onclick = function () {
		let now_width = document.querySelector("div.c-video > video").style.width
		if (now_width == '') {
			document.querySelector("div.c-video > video").style.width = "auto"
		} else {
			document.querySelector("div.c-video > video").style.width = ""
			let evt = new MouseEvent("mousedown", {//Uncaught ReferenceError: evt is not defined
				bubbles: true,
				cancelable: true,
				view: window,
			});
			document.querySelector("span.icon.icon-expand").dispatchEvent(evt);
		}

		return;
	};
	background_color(button1);


	///////////



	//在浏览器控制台可以查看所有函数，ctrl+shift+I 调出控制台，在Console窗口进行实验测试
	var contain_ = document.querySelector("#sp-ac-container")
	contain_.appendChild(button1);

	// // contain_.innerHTML += `<span class="tooltiptext">提示文本</span>`//不能用innerHTML，否则event会消失
	// var span_tip = document.createElement("span");
	// span_tip.textContent = "提示文本"
	// span_tip.className = "tooltiptext";
	// contain_.appendChild(span_tip);

	//var y = document.getElementById('s_btn_wr');
	//y.appendChild(button);

	const styleText = `
	.tooltiptext {
		//visibility: hidden;
		display: none;
		//width: 120px;
		background-color: black;
		color: #fff;
		text-align: center;
		//border-radius: 6px;
		//padding: 5px 0;
	
		/* 定位 */
		position: absolute;
		//z-index: 1;
	}

	.tooltiptext:hover {
		display: inline;
	}
	`
	const style = GM_addStyle(styleText);
}


function add_container() {
	let Container = document.createElement('div');
	Container.id = "sp-ac-container";
	Container.style.position = "fixed";
	Container.style.right = "150px";
	Container.style.top = "0px";
	document.body.appendChild(Container);
}

function background_color(button) {
	button.onmouseover = function () {
		this.style.backgroundColor = 'cyan';
	};
	button.onmouseout = function () {
		this.style.backgroundColor = 'transparent';
	};
}

function display_block(){
	setTimeout(() => {
		document.querySelector("div.caption-text.caption-text-bg").style.display="block"
	}, 50);
}

$(document).ready(function () {
    $(document).keydown(function (event) { //调用键盘编码，按了键盘回调keydown里的function(event)函数，event就是你按的那个按键的code码
        debugger
        // console.log(event.altKey);
        // console.log(event.keyCode)

        // if (event.keyCode == 77 && event.altKey){
        //     click_nextpage();
        // }
		display_block();

    });

	$(document).click(function (event) {
		display_block();

    });
});