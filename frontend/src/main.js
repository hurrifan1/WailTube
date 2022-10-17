import './style.css';
import './app.css';

// import Wails from "../wailsjs/runtime/runtime.js";
// import "../wailsjs/runtime/runtime.js";
// import Wails from '@wailsapp/runtime';
// window.wails = Eve;

// import logo from './assets/images/logo-krabs-1.png';
import logo from './assets/images/krabs start.svg';
import { GetYTtrack } from '../wailsjs/go/main/App';
import { EventsOn } from '../wailsjs/runtime/runtime.js';
// import { EventsOn } from '../wailsjs/runtime/runtime.js';

// Animations
const animEnterTiming = { duration: 500 };
const animExitTiming = { duration: 200 };
const animScanlineExit = [
    { opacity: 1, translate: '0 0' },
    { opacity: 0, transform: '0 -30px' },
];
const animResultTextExit = [
    { opacity: 1 },
    { opacity: 0 },
];

document.querySelector('#app').innerHTML = `
    <img id="logo" class="logo">
    <div class="hello" id="hello">pop that youtube link right here, just nice like that 👇</div>

    <div class="input-box" id="input">
        <input class="input" id="ytLink" type="text" autocomplete="off" />
        <button class="btn" onclick="getYt()">sickem</button>
        <div class="result" id="result">
            <div id="resultText"></div>
        </div>
    </div>

    <div class="stdout-box" id="stdb"></div>
`;
document.getElementById('logo').src = logo;

let ytLinkElement = document.getElementById("ytLink");
ytLinkElement.focus();
let resultElement = document.getElementById("resultText");
let stdOutElement = document.getElementById("stdb");

// Setup the getYt function
window.getYt = function () {
    // Get YouTube link
    let yl = ytLink.value;

    // Check if the input is empty
    if (yl === "") return;

    // Clear the previous results and logs
    ["successResult", "errorResult"].forEach((c) => {
        resultElement.classList.remove(c);
    })
    resultElement.innerText = "Running...";

    document.querySelectorAll(".scanline").forEach((l) => {
        l.animate(animScanlineExit, animExitTiming).finished
            .then(() => {
                stdOutElement.removeChild(l);
            })
    })

    // Call App.GetYTtrack(link)
    try {
        GetYTtrack(yl)
            .then((result) => {
                // Update result with data back from App.GetYTtrack()
                resultElement.innerText = result.resultRaw;
                resultElement.classList.add(`${result.resultType}Result`);
            })
            .catch((err) => {
                console.error(err);
            });
    } catch (err) {
        console.error(err);
    }
};

function addScanLine(l) {
    let ne = document.createElement("div");
    ne.innerText = l;
    ne.className = "scanline";
    stdOutElement.appendChild(ne);
}

// function addAnimations(node, enterAnim, exitAnim) {
//     document.querySelector("g").animate()
// }

EventsOn("scanEv", (d) => {
    console.log(d);
    addScanLine(d);
});
