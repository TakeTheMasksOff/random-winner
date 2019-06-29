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
    getNextWinner();
}
init();

function getNextWinner() {
    num1 = 0;
    num2 = 0;
    num3 = 0;
    num4 = 0;
    let candidate = getRandomIntInclusive(fromValue, toValue);
    if (winners.length == toValue - fromValue) {
        console.log('winners array is full');
        return;
    }
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
const machine1 = new SlotMachine(el1, { active: 0, delay: 800, randomize: () => num1 });
const machine2 = new SlotMachine(el2, { active: 0, delay: 800, randomize: () => num2 });
const machine3 = new SlotMachine(el3, { active: 0, delay: 800, randomize: () => num3 });
const machine4 = new SlotMachine(el4, { active: 0, delay: 800, randomize: () => num4 });

function addWinner() {
    let strWinner = num1.toString() + num2.toString() + num3.toString() + num4.toString();
    let el = `<div class="odometer-container px-2 mr-5 mb-4">
                    <span>${strWinner}</span>
                </div>`;
    let newEl = createElementFromHTML(el);
    document.querySelector('.winners').appendChild(newEl);

    btn.removeAttribute('disabled');
    getNextWinner();
}

btn.addEventListener('click', () => {
    btn.setAttribute('disabled', 'disabled');
    setTimeout(() => machine1.shuffle(getRandomIntInclusive(5, 10)), getRandomIntInclusive(200, 999));
    setTimeout(() => machine2.shuffle(getRandomIntInclusive(5, 10)), getRandomIntInclusive(200, 999));
    setTimeout(() => machine3.shuffle(getRandomIntInclusive(5, 10)), getRandomIntInclusive(200, 999));
    setTimeout(() => machine4.shuffle(getRandomIntInclusive(5, 10)), getRandomIntInclusive(200, 999));
    setTimeout(() => addWinner(), 8500);
});

function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
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
