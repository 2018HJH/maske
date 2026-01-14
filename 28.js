// ==UserScript==
// @name         PC28提醒-v4.8极致迷你版
// @namespace    http://tampermonkey.net/
// @version      4.8
// @description  UI尺寸极致缩小，宽度约100px，靠右下角，基于2.8内核
// @author       mini
// @match        *://gameconsole.pchat.im/*
// @run-at       document-end
// @grant        none
// @updateURL    https://raw.githubusercontent.com/2018HJH/maske/main/28.js
// @downloadURL  https://raw.githubusercontent.com/2018HJH/maske/main/28.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 设置音效链接 (Catbox 稳定源)
    const ALARM_URL = "https://file.garden/aWd7k_hwaGcNwkBP/boss.ogg";
    const START_URL = "https://actions.google.com/sounds/v1/alarms/beep_short.ogg";

    const alarmSound = new Audio(ALARM_URL);
    const startSound = new Audio(START_URL);

    let isRunning = false;
    let lastCount = 0;

    // 2. 创建极致迷你 UI 面板 (宽度减至 102px)
    const panel = document.createElement('div');
    panel.style = "position:fixed; bottom:5px; right:5px; z-index:2147483647; background:#1a1a1a; color:#52c41a; padding:6px; border-radius:4px; border:1px solid #52c41a; font-family:sans-serif; width:88px; box-shadow:0 0 6px rgba(0,0,0,0.5); font-size:10px;";
    panel.innerHTML = `
        <div id="m-stat" style="color:#ff4d4f; margin-bottom:4px; text-align:center; font-weight:bold;">● 已停止</div>
        <button id="m-start-btn" style="width:100%; padding:3px; background:#52c41a; color:white; border:none; cursor:pointer; font-weight:bold; border-radius:2px; font-size:10px; margin-bottom:3px;">开始</button>
        <button id="m-stop-btn" style="width:100%; padding:3px; background:#ff4d4f; color:white; border:none; cursor:pointer; font-weight:bold; border-radius:2px; font-size:10px; display:none;">停止</button>
        <div id="m-info" style="font-size:9px; color:#fff; background:#333; padding:2px; border-radius:2px; text-align:center;">待命</div>
    `;
    document.body.appendChild(panel);

    const startBtn = document.getElementById('m-start-btn');
    const stopBtn = document.getElementById('m-stop-btn');
    const statText = document.getElementById('m-stat');
    const infoBox = document.getElementById('m-info');

    // 3. 点击激活逻辑
    startBtn.onclick = function() {
        startSound.play();
        isRunning = true;
        lastCount = 0;
        startBtn.style.display = 'none';
        stopBtn.style.display = 'block';
        statText.innerText = "● 运行中";
        statText.style.color = "#52c41a";
        alarmSound.load();
    };

    stopBtn.onclick = function() {
        isRunning = false;
        alarmSound.pause();
        alarmSound.currentTime = 0;
        startBtn.style.display = 'block';
        stopBtn.style.display = 'none';
        statText.innerText = "● 已停止";
        statText.style.color = "#ff4d4f";
        document.title = "已停止";
    };

    // 4. 核心 2.8 扫描逻辑 (单次响铃)
    function deepScan() {
        if (!isRunning) return;

        let fullText = document.body.innerText;
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            try { fullText += iframe.contentDocument.body.innerText; } catch (e) { }
        });

        const match = fullText.match(/上下分申请\((\d+)\)/);
        const count = match ? parseInt(match[1], 10) : 0;

        infoBox.innerText = "申请: " + count;

        if (count > 0) {
            if (count > lastCount) {
                alarmSound.play().catch(() => {});
            }
            document.title = "⚠️[" + count + "]";
            infoBox.style.background = "#ff4d4f";
        } else {
            document.title = "监控中...";
            infoBox.style.background = "#333";
        }

        lastCount = count;
    }

    setInterval(deepScan, 2000);
})();
