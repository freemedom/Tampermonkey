// ==UserScript==
// @name         zhihu红色消息提示消除
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      *://*.zhihu.com/*
// @grant        none
// ==/UserScript==
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

setTimeout(async () => {
    document.querySelector("div.css-11oarr3").click()
    await sleep(1000)
    document.querySelector("div.Messages-list > a.Messages-item.Messages-followItem.Messages-newItem").click()
    await sleep(2200)
    document.querySelector("div.Modal.Modal--default.ChatBoxModal > button").click()
}, 4000);
