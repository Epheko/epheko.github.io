let table = document.getElementById("UI");
let buttonHrefs = [];
let buttonCnt = 12;
let TargetButton = -1;
let showCrossTime = 2;
let showFloorTime = 2;
let startTime = 0;
let centerDisplayParent = document.getElementById("centerParent");
let centerDisplay = document.getElementById("center");

let cycleCountMax = document.getElementById("cntContainer").innerHTML;
let cycleCount = 0;

for (let n = 0; n < buttonCnt; n++) {
    buttonHrefs.push("imgs/button" + (n + 1) + ".png");
}

OneCycle();

function OneCycle() {
    if (cycleCountMax <= cycleCount) {
        if (cycleCountMax == 4) {
            window.location = "production.html";
        } else {
            window.location = "finish.html";
        }
    }
    cycleCount++;
    centerDisplayParent.style.display = "flex";
    let cross = document.createElement('img');
    cross.setAttribute("src", "imgs/cross.png");
    centerDisplay.appendChild(cross);
    setTimeout(showFloorNum, showCrossTime * 1000);
}

function showFloorNum() {
    while (centerDisplay.firstChild)
        centerDisplay.removeChild(centerDisplay.firstChild);
    TargetButton = Math.floor(Math.random() * (buttonCnt - 2)) + 2
    let floorNum = document.createElement('p');
    floorNum.innerHTML = +TargetButton + "階";
    centerDisplay.appendChild(floorNum);
    let nextButton = document.createElement("button");
    nextButton.addEventListener('click', randomPlace);
    nextButton.innerHTML = "次へ";
    centerDisplay.appendChild(nextButton);
}

function randomPlace() {
    while (centerDisplay.firstChild)
        centerDisplay.removeChild(centerDisplay.firstChild);
    centerDisplayParent.style.display = "none";
    let rand = Math.random();
    if (rand < 0.25) {
        Top2DownZ();
    } else if (rand < 0.5) {
        Top2DownN();
    } else if (rand < 0.75) {
        Down2TopZ();
    } else {
        Down2TopN();
    }
    startTime = performance.now();
}

function OnButtonClicked(pushFloor) {
    let endTime = performance.now();
    console.log(endTime - startTime);
    if (cycleCountMax != 4) {
        var req = new XMLHttpRequest();
        req.open("POST", "send.php", true);
        req.setRequestHeader('content-type',
           'application/x-www-form-urlencoded;charset=UTF-8');
        let data = {time: endTime-startTime, placeOrder: "z", targetF: TargetButton, answerF: pushFloor };
        req.addEventListener('load', function () {
            console.log(this.response);
        });
        req.send(data);//経過時間、参加者ID、階数ボタン、正答かどうか    
        console.log(data);
    }
    clearTableChildren();
    OneCycle();
}

function Top2DownZ() {
    for (let n = 0; n < buttonCnt; n++) {
        Addrow(n, n + 1);
        n++;
    }
}

function Top2DownN() {
    for (let n = 0; n < buttonCnt / 2; n++) {
        Addrow(n, n + buttonCnt / 2);
    }
}

function Down2TopZ() {
    for (let n = buttonCnt - 2; n >= 0; n -= 3) {
        Addrow(n, n + 1);
        n++;
    }

}

function Down2TopN() {
    for (let n = buttonCnt / 2 - 1; n >= 0; n--) {
        Addrow(n, n + buttonCnt / 2);
    }
}

function clearTableChildren() {
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
}

function Addrow(num1, num2) {
    let tr = document.createElement('tr');
    let td1 = document.createElement('td');
    let img1 = document.createElement('img');
    img1.setAttribute("src", buttonHrefs[num1]);
    img1.setAttribute("data-floor", num1);
    img1.addEventListener('click', () => { OnButtonClicked(num1) });
    td1.appendChild(img1);
    let td2 = document.createElement('td');
    let img2 = document.createElement('img');
    img2.setAttribute("src", buttonHrefs[num2]);
    img2.setAttribute("data-floor", num2);
    img2.addEventListener('click', () => { OnButtonClicked(num2) });
    td2.appendChild(img2);
    tr.appendChild(td1);
    tr.appendChild(td2);
    table.appendChild(tr);
}