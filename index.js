let string = "";
let isExponentMode = false;
let isRootMode = false;
let isDegreeMode = false;
let isLogMode = false;
let isMeanMode = false;
let isPCMode = false;
let isMathMode = false;
let buttons = document.querySelectorAll('.but');
let history = [];

document.getElementById('rad').addEventListener('click', () => {
    isDegreeMode = false;
    var elem = document.getElementById('rad');
    elem.classList.add('rad');
    var elem2 = document.getElementById('deg');
    elem2.classList.remove('rad');
});

document.getElementById('deg').addEventListener('click', () => {
    isDegreeMode = true;
    var elem = document.getElementById('deg');
    elem.classList.add('rad');
    var elem2 = document.getElementById('rad');
    elem2.classList.remove('rad');
});

function check(no) {
    return isDegreeMode ? no * (Math.PI / 180) : no;
}

function handleFunction(func, input) {
    const match = input.match(new RegExp(`${func}\\(([^)]+)\\)`));
    if (match) {
        let no = Number(match[1]);
        if (func !== "log" && func !== "ln")
            no = check(no);
        switch (func) {
            case 'sin':
                return Math.sin(no).toString();
            case 'cos':
                return Math.cos(no).toString();
            case 'tan':
                return Math.tan(no).toString();
            case 'sin-1':
                return Math.asin(no).toString();
            case 'cos-1':
                return Math.acos(no).toString();
            case 'tan-1':
                return Math.atan(no).toString();
            case 'log':
                return Math.log10(no).toString();
            case 'ln':
                return Math.log(no).toString();
            default:
                throw new Error('Invalid trigonometric function');
        }
    } else {
        throw new Error('Invalid input for trigonometric function');
    }
}

function handleMeanFunction(values) {
    let numbers = values.split(',').map(Number);
    let sum = numbers.reduce((acc, val) => acc + val, 0);
    return (sum / numbers.length).toString();
}

function factorial(n) {
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
}

function handlePermutation(n, r) {
    return factorial(n) / factorial(n - r);
}

function handleCombination(n, r) {
    return factorial(n) / (factorial(r) * factorial(n - r));
}

function updateHistory(expression, result) {
    if (history.length >= 5) {
        history.shift();
    }
    history.push(`${expression} = ${result}`);
    const historyDiv = document.getElementById('history');
    historyDiv.innerHTML = history.map(item => `<div>${item}</div>`).join('');
    document.querySelectorAll('#history div').forEach((div, index) => {
        div.addEventListener('click', () => {
            const parts = history[index].split(' = ');
            string = parts[0];
            document.querySelector('input').value = string;
        });
    });
}

function setInputValue(input, value) {
    const start = input.selectionStart;
    const end = input.selectionEnd;
    input.value = value;
    input.setSelectionRange(start, end);
}

function evaluateExpression(expression) {
    const functions = ['sin', 'cos', 'tan', 'sin-1', 'cos-1', 'tan-1', 'log', 'ln', 'mean', 'nPr', 'nCr'];
    functions.forEach(func => {
        const regex = new RegExp(`${func}\\([^\\)]+\\)`);
        while (regex.test(expression)) {
            expression = expression.replace(regex, (match) => {
                if (func === 'mean') {
                    return handleMeanFunction(match.slice(5, -1));
                } else if (func === 'nPr') {
                    const [n, r] = match.slice(4, -1).split(',');
                    return handlePermutation(Number(n), Number(r)).toString();
                } else if (func === 'nCr') {
                    const [n, r] = match.slice(4, -1).split(',');
                    return handleCombination(Number(n), Number(r)).toString();
                } else {
                    return handleFunction(func, match);
                }
            });
        }
    });
    return eval(expression);
}

function handleInput(value) {
    const input = document.querySelector('input');
    const cursorPosition = input.selectionStart;
    if (value === '=') {
        try {
            let originalExpression = string;
            string = evaluateExpression(string).toString();
            input.value = string;
            updateHistory(originalExpression, string);
        } catch {
            input.value = "Error";
        }
    } else if (value === "Dark") {
        document.body.classList.add('dark-theme');
        document.getElementById("theme").innerHTML = "Light";
        document.getElementById("theme").classList.remove("darktheme");
        document.getElementById("theme").classList.add("lighttheme");
    } else if (value === "Light") {
        document.body.classList.remove('dark-theme');
        document.getElementById("theme").textContent = "Dark";
        document.getElementById("theme").classList.remove("lighttheme");
        document.getElementById("theme").classList.add("darktheme");
    } else if (value === "C") {
        string = string.slice(0, -1);
        setInputValue(input, string);
        isExponentMode = false;
        isRootMode = false;
    } else if (value === "AC") {
        string = "";
        setInputValue(input, string);
        isExponentMode = false;
        isRootMode = false;
    } else if (value === 'main') {
        document.querySelector('.keypadno1').style.display = 'flex';
        document.querySelector('.keypadno2').style.display = 'none';
        document.querySelector('.keypadno3').style.display = 'none';
    } else if (value === 'abc') {
        document.querySelector('.keypadno1').style.display = 'none';
        document.querySelector('.keypadno2').style.display = 'flex';
        document.querySelector('.keypadno3').style.display = 'none';
    } else if (value === 'func') {
        document.querySelector('.keypadno1').style.display = 'none';
        document.querySelector('.keypadno2').style.display = 'none';
        document.querySelector('.keypadno3').style.display = 'flex';
    } else if (value === 'a^2') {
        let no = Number(string);
        string = (no * no).toString();
        setInputValue(input, string);
    } else if (value === 'sqrt') {
        let no = Number(string);
        string = Math.sqrt(no).toString();
        setInputValue(input, string);
    } else if (value === '|a|') {
        let no = Number(string);
        string = Math.abs(no).toString();
        setInputValue(input, string);
    } else if (value === 'PI') {
        string += Math.PI.toString();
        setInputValue(input, string);
    } else if (value === 'e') {
        string += Math.E.toString();
        setInputValue(input, string);
    } else if (value === 'a^b') {
        string += '^';
        setInputValue(input, string);
        isExponentMode = true;
    } else if (value === 'root') {
        string += '√';
        setInputValue(input, string);
        isRootMode = true;
    } else if (value === "rad" || value === "deg") {
        string = "";
        setInputValue(input, string);
    } else if (['sin', 'cos', 'tan', 'log', 'ln'].includes(value)) {
        string += `${value}(`;
        setInputValue(input, string);
        isMathMode = true;
    } else if (['sin-1', 'cos-1', 'tan-1'].includes(value)) {
        string += `${value}(`;
        setInputValue(input, string);
        isMathMode = true;
    } else if (value === "round") {
        let no = Number(string);
        string = Math.round(no).toString();
        setInputValue(input, string);
    } else if (value === "floor") {
        let no = Number(string);
        string = Math.floor(no).toString();
        setInputValue(input, string);
    } else if (value === "ceil") {
        let no = Number(string);
        string = Math.ceil(no).toString();
        setInputValue(input, string);
    } else if (value === 'mean') {
        string += 'mean(';
        setInputValue(input, string);
        isMeanMode = true;
    } else if (['nPr', 'nCr'].includes(value)) {
        string += `${value}(`;
        setInputValue(input, string);
        isPCMode = true;
    } else if (value === '?') {
        string = "";
    } else {
        string += value;
        setInputValue(input, string);
    }
    input.setSelectionRange(cursorPosition + value.length, cursorPosition + value.length);
}

Array.from(buttons).forEach((button) => {
    button.addEventListener('click', (e) => {
        const value = e.target.value || e.target.innerHTML;
        handleInput(value);
    });
});

document.addEventListener('keydown', (e) => {
    const key = e.key;
    const inputKeys = {
        'Enter': '=',
        'Backspace': 'C',
        'Escape': 'AC',
        '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '0': '0',
        '.': '.', '+': '+', '-': '-', '*': '*', '/': '/', '(': '(', ')': ')', '^': 'a^b', 'r': 'sqrt', '=': '='
    };
    if (inputKeys[key] !== undefined) {
        handleInput(inputKeys[key]);
    }
});

document.getElementById('info-btn').addEventListener('click', () => {
    const infoDiv = document.getElementById('info-div');
    if (infoDiv.classList.contains('hidden')) {
        infoDiv.classList.remove('hidden');
        infoDiv.style.display = 'block';
    } else {
        infoDiv.classList.add('hidden');
        infoDiv.style.display = 'none';
    }
});

document.addEventListener('click', (event) => {
    const infoDiv = document.getElementById('info-div');
    const infoBtn = document.getElementById('info-btn');
    if (!infoDiv.contains(event.target) && event.target !== infoBtn) {
        infoDiv.classList.add('hidden');
        infoDiv.style.display = 'none';
    }
});
