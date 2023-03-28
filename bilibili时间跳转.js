// ==UserScript==
// @name         bilibili时间跳转
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// ==/UserScript==

setTimeout(() => {
	add_container()
	add_input()

}, 3000);

function add_input() {
	var inp = document.createElement("input");
	// inp.type = "number";//不能显示字符串
	//传入点击按钮的value值到新的按钮
	inp.value = '参考格式00:00:00';

	inp.style.fontSize = "20px"//fontsize没大写
	inp.onchange = function () {
		data_string = "0 " + inp.value
		new_time = (new Date(data_string).getTime() - new Date("0 00:00:00").getTime()) / 1000
		document.querySelector("a[data-video-time]").setAttribute("data-video-time", new_time)
	}

	var contain_ = document.querySelector("#sp-ac-container")
	contain_.appendChild(inp);

	//传入点击按钮的id到新的按钮(传入是id+1防止重复)
	// inp.id = id;
	//当方法有参数时，用onclick = 方法名(参数)时就有错了，需要在方法名前面加function()
	// inp.onclick = function() {
	// 	b1(id);
	// };
}

function add_container() {
	let Container = document.createElement('div');
	Container.id = "sp-ac-container";
	Container.style.position = "fixed";
	Container.style.right = "150px";
	Container.style.top = "80px";
	document.body.appendChild(Container);
}