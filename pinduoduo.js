// ==UserScript==
// @name pinduoduo
// @namespace greasyfork
// @include https://mobile.yangkeduo.com/*
// @grant GM_addStyle
// @grant GM_info
// @grant GM_cookie
// @grant GM_download
// @grant GM_deleteValue
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_setClipboard
// @grant GM_openInTab
// @grant GM_xmlhttpRequest
// @run-at       document-start
// ==/UserScript==

// var array_img_src = new Object();//{} 
// Uncaught TypeError: Cannot set properties of undefined
//
//

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))


setTimeout(() => {
	add_button()
}, 2000);

// setTimeout(() => {
// 	window.scrollBy(0, 1400)
// 	// window.scrollBy(0, 500)
// 	// window.scrollBy(0, 500)
// 	// window.scrollBy(0, 500)
// }, 4000);

setTimeout(() => {
	main()
}, 4000);



function download_csv(tableRows) {
	// ，\r\n
	let CsvString = tableRows.map(data => data.join(',')).join('\r\n');
	//  CSV 
	CsvString = 'data:application/vnd.ms-excel;charset=utf-8,\uFEFF' + encodeURIComponent(CsvString);
	// a
	const link = document.createElement('a');
	link.href = CsvString;
	// 
	link.download = `_`+document.querySelector("div._3oOM3OKF > div > span > div").innerText+`.csv`;
	// 
	link.click();
	// a
	link.remove();
}

function add_button() {
	'use strict';
	let Container = document.createElement('div');
	Container.id = "sp-ac-container";  
	Container.style.position="fixed"       
	Container.style.right="150px"
	Container.style.top="0px"
	document.body.appendChild(Container);


	var button1 = document.createElement("button"); //input（）
	// button1.id = "id001";
	button1.textContent = "";
	button1.style.display = "block";
	button1.style.fontSize = "0.2rem";
	button1.title = ""
	// button1.style.width = "500px";
	// button1.style.height = "50px";
	// button1.style.align = "center";
	// button1.className = "pdd-go-to-app"


	button1.onclick = function () {
		// alert("");
		GM_setValue('stop_flag', !GM_getValue('stop_flag'))
		console.log(':', GM_getValue('stop_flag'));
		return;
	};
	background_color(button1);


	///////////

	var button2 = document.createElement("button"); //input（）
	button2.textContent = "csv";
	button2.style.display = "block";
	button2.style.fontSize = "0.2rem";
	button2.title = "，，，"
	// button2.style.width = "500px";
	// button2.style.height = "50px";
	// button2.style.align = "center";
	// button2.style.top = "70px"
	// button2.className = "pdd-go-to-app"


	button2.onclick = function () {
		// console.log('');
		// alert("");

		download_csv(GM_getValue('array_data'))
		return;
	};
	background_color(button2);


	var button3 = document.createElement("button"); //input（）
	button3.textContent = "，";
	button3.style.display = "block";
	button3.style.fontSize = "0.2rem";
	button3.onclick = function () {
		GM_setValue('array_data', 0)
		GM_setValue('array_img_src', 0)
	}
	background_color(button3);



	//，ctrl+shift+I ，Console
	var contain_ = document.querySelector("#sp-ac-container")
	contain_.appendChild(button1);
	contain_.appendChild(button2);
	contain_.appendChild(button3);

	// contain_.innerHTML += `<span class="tooltiptext"></span>`//innerHTML，event
	var span_tip = document.createElement("span");
	span_tip.textContent = ""
	span_tip.className = "tooltiptext";
	contain_.appendChild(span_tip);

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
	
		/*  */
		position: absolute;
		//z-index: 1;
	}

	.tooltiptext:hover {
		display: inline;
	}
	`
	const style = GM_addStyle(styleText);
}

const main = async () => {
	var stop_flag = GM_getValue('stop_flag')
	if (stop_flag == undefined) {
		GM_setValue('stop_flag', false)
	}
	if (stop_flag == true) {
		return;
	}

	if (location.href.indexOf('search_key') != -1) {
		// debugger
		var array_img_src = GM_getValue('array_img_src')

		//（）
		if (array_img_src) {
			for (var prop in array_img_src) {
				console.log(array_img_src[prop]);
				if (array_img_src[prop] == 0) {
					console.log(prop)

					array_img_src[prop] = 1
					GM_setValue('array_img_src', array_img_src)

					//
					let cli1 = document.querySelector("img[src='" + prop + "']")
					let cli2 = document.querySelector("img[data-src='" + prop + "']")
					if (cli1) {
						cli1.click()
						console.log("src")
					} else if (cli2) {
						cli2.click()
						console.log("data-src")
					}
					await sleep(2000) //1，click
				}

			}
		} else {

			window.scrollBy(0, 1400)
			await sleep(1000)
			window.scrollBy(0, 1400)
			await sleep(1000)
			window.scrollBy(0, 1400)
			await sleep(1000)
			window.scrollBy(0, 1400)
			await sleep(1000)

			var array_img_src = {}
			var node_list = document.querySelectorAll("div._3glhOBhU")

			//
			node_list.forEach(element => {
				if(element.getElementsByTagName("img").length == 0){
					return
				}
				var img_src = element.getElementsByTagName("img")[0].src
				if (img_src == '') {
					img_src = element.getElementsByTagName("img")[0].getAttribute("data-src")
				}
				array_img_src[img_src] = 0
				console.log(element)
				// array_img_src.push(img_src)
			});
			console.log(array_img_src)
			GM_setValue('array_img_src', array_img_src)
			// console.log("")
			alert("，，")
			//，。。。
		}



	} else {
		// debugger

		//
		var array_data = GM_getValue('array_data')
		// var array_data = []
		if (!array_data) {
			var array_data = []
		}

		var object_skus = rawData.store.initDataObj.goods.skus
		for (const key in object_skus) {
			const element = object_skus[key];

			//
			debugger
			var join_specs = ''
			for (const iterator of element.specs) {
				let {spec_key_id,spec_value_id,...deleted_iterator} = iterator

				// console.log(JSON.stringify(Object.values(iterator)))
				// temp_specs += JSON.stringify(Object.values(iterator))
				join_specs += Object.values(deleted_iterator).join('')
			}
			//
			let temp_priceDisplay = ''
			let temp_price = ''
			if (element.priceDisplay) { //，undefined
				// temp_priceDisplay = JSON.stringify(Object.values(element.priceDisplay))
				temp_priceDisplay = Object.values(element.priceDisplay).join('')
				temp_price = element.priceDisplay.price
			}
			//
			array_data.push([element.groupPrice, temp_price, temp_priceDisplay, join_specs, location.href])
		}
		GM_setValue('array_data', array_data)
		history.back();
	}
}

function background_color(button) {
	button.onmouseover = function () {
		this.style.backgroundColor = 'cyan';
	};
	button.onmouseout = function () {
		this.style.backgroundColor = 'transparent';
	};
}
