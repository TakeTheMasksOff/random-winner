const allWinnersStr = 'allWinnersStr';
let fromValue = null,
    toValue = null;

let winners = [];
let num1 = 0,
    num2 = 0,
    num3 = 0,
    num4 = 0;

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function init() {
    console.log('init');
    document.querySelector('#machine1').classList.remove('d-none');
    document.querySelector('#machine2').classList.remove('d-none');
    document.querySelector('#machine3').classList.remove('d-none');
    document.querySelector('#machine4').classList.remove('d-none');

    fromValue = localStorage.getItem('fromValue');
    if (!fromValue) {
        fromValue = '1';
        localStorage.setItem('fromValue', '1');
    }

    toValue = localStorage.getItem('toValue');
    if (!toValue) {
        toValue = '3600';

        localStorage.setItem('toValue', '3600');
    }
    document.querySelector('#range-from').value = fromValue;
    document.querySelector('#range-to').value = toValue;
    fromValue = parseInt(fromValue);
    toValue = parseInt(toValue);

    restorePreviousWinners();
    document.querySelector('#winners-count').innerHTML = winners.length.toString();
    getNextWinner();
}
init();

function restorePreviousWinners() {
    if (!localStorage.getItem(allWinnersStr)) {
        return;
    }
    console.log('restorePreviousWinners');
    let previousWinnersStr = localStorage.getItem(allWinnersStr);
    let winnersStrArr = previousWinnersStr.split(',');

    let element = null;
    let newEl = null;
    for (let i in winnersStrArr) {
        winners.push(parseInt(winnersStrArr[i]));
        element = elementFromStr(winnersStrArr[i]);
        newEl = createElementFromHTML(element);
        document.querySelector('.winners').appendChild(newEl);
    }
}

function getNextWinner() {
    num1 = 0;
    num2 = 0;
    num3 = 0;
    num4 = 0;
    if (winners.length == toValue - fromValue) {
        console.log('winners array is full');
        btn.setAttribute('disabled', 'disabled');
        btn.innerHTML = 'Bütün qaliblər seçildi';
        return;
    }
    let candidate = getRandomIntInclusive(fromValue, toValue);
    while (winners.indexOf(candidate) > -1) {
        console.log(`element ${candidate} already exists in winners array`);
        candidate = getRandomIntInclusive(fromValue, toValue);
    }
    winners.push(candidate);
    console.log('next candidate =', candidate);
    let tmp = candidate;
    num4 = tmp % 10;
    tmp = Math.floor(tmp / 10);
    if (tmp > 0) {
        num3 = tmp % 10;
        tmp = Math.floor(tmp / 10);
    }
    if (tmp > 0) {
        num2 = tmp % 10;
        tmp = Math.floor(tmp / 10);
    }
    if (tmp > 0) {
        num1 = tmp % 10;
        tmp = Math.floor(tmp / 10);
    }

    console.log('next num1 =', num1);
    console.log('next num2 =', num2);
    console.log('next num3 =', num3);
    console.log('next num4 =', num4);
}

function setFromTo() {
    fromValue = document.querySelector('#range-from').value;
    toValue = document.querySelector('#range-to').value;
    if (fromValue) {
        localStorage.setItem('fromValue', fromValue);
    }
    if (toValue) {
        localStorage.setItem('toValue', toValue);
    }
    getNextWinner();
}

const btn = document.querySelector('#randomizeButton');

const el1 = document.querySelector('#machine1');
const el2 = document.querySelector('#machine2');
const el3 = document.querySelector('#machine3');
const el4 = document.querySelector('#machine4');
const machine1 = new SlotMachine(el1, { active: 0, delay: 800, inViewport: false, randomize: () => num1 });
const machine2 = new SlotMachine(el2, { active: 0, delay: 800, inViewport: false, randomize: () => num2 });
const machine3 = new SlotMachine(el3, { active: 0, delay: 800, inViewport: false, randomize: () => num3 });
const machine4 = new SlotMachine(el4, { active: 0, delay: 800, inViewport: false, randomize: () => num4 });

function addWinner() {
    let strWinner = num1.toString() + num2.toString() + num3.toString() + num4.toString();

    let element = elementFromStr(strWinner);
    let newEl = createElementFromHTML(element);
    document.querySelector('.winners').appendChild(newEl);
    document.querySelector('#winners-count').innerHTML = winners.length.toString();

    btn.removeAttribute('disabled');
    getNextWinner();

    let previousWinnersStr = null;
    if (localStorage.getItem(allWinnersStr)) previousWinnersStr = localStorage.getItem(allWinnersStr) + ',' + strWinner;
    else previousWinnersStr = strWinner;
    localStorage.setItem(allWinnersStr, previousWinnersStr);
}

btn.addEventListener('click', () => {
    btn.setAttribute('disabled', 'disabled');
    setTimeout(() => machine1.shuffle(getRandomIntInclusive(5, 10)), getRandomIntInclusive(200, 999));
    setTimeout(() => machine2.shuffle(getRandomIntInclusive(5, 10)), getRandomIntInclusive(200, 999));
    setTimeout(() => machine3.shuffle(getRandomIntInclusive(5, 10)), getRandomIntInclusive(200, 999));
    setTimeout(() => machine4.shuffle(getRandomIntInclusive(5, 10)), getRandomIntInclusive(200, 999));
    setTimeout(() => addWinner(), 9000);
});

function createElementFromHTML(htmlString) {
    let div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild;
}

function closeAdmin() {
    document.querySelector('.admin-panel').classList.add('d-none');
}

document.onkeydown = function(e) {
    e = e || window.event;
    if (e.altKey && e.keyCode == 79) {
        document.querySelector('.admin-panel').classList.toggle('d-none');
    }
    return true;
};

function clearWinners() {
    winners = [];
    document.querySelector('.winners').innerHTML = '';
    document.querySelector('#winners-count').innerHTML = winners.length.toString();

    localStorage.removeItem(allWinnersStr);
    getNextWinner();
}

function elementFromStr(str) {
    return `<div class="odometer-container px-2 mx-3 text-center">
               <span>${str}</span>
           </div>`;
}

function createExportHeader(dataSource, separator) {
    let headerRow = '',
        columns = dataSource.columns,
        newLine = '\r\n';

    for (let i = 0; i < columns.length; i++) {
        headerRow += (i > 0 ? separator : '') + columns[i].displayName;
    }
    return headerRow + newLine;
}

function createExportRows(dataSource, separator) {
    let content = '',
        columns = dataSource.columns,
        data = dataSource.data,
        newLine = '\r\n',
        dataField;

    for (let j = 0; j < data.length; j++) {
        for (let i = 0; i < columns.length; i++) {
            dataField = columns[i].dataField;
            content += (i > 0 ? separator : '') + data[j][dataField];
        }
        content += newLine;
    }
    return content;
}

function excelExport() {
    let data = [];
    let dataRaw = {};
    let previousWinnersStr = localStorage.getItem(allWinnersStr);
    let winnersStrArr = previousWinnersStr.split(',');
    for (let i = 0; i < winnersStrArr.length; i++) {
        dataRaw = {
            number: i + 1,
            winner: '\t' + winnersStrArr[i]
        };
        data.push(dataRaw);
    }

    let separator = ',',
        dataSource = {
            data: data,
            columns: [
                {
                    dataField: 'number',
                    displayName: 'Nömrə'
                },
                {
                    dataField: 'winner',
                    displayName: 'Qalib'
                }
            ]
        };
    let content = createExportHeader(dataSource, separator);
    content += createExportRows(dataSource, separator);

    //an anchor html element on the page (or create dynamically one)
    //to use its download attribute to set filename
    let a = document.getElementById('csv');
    a.textContent = 'download';
    a.download = 'BDU_2019_loto_winners.csv';
    a.href = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(content);
    a.click();
}

function testAddAllWinners() {
    let element = null;
    let newEl = null;
    for (let i = 0; i < 100; i++) {
        element = elementFromStr('0000');
        newEl = createElementFromHTML(element);
        document.querySelector('.winners').appendChild(newEl);
    }
}
