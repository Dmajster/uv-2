let typesDOM = document.getElementById("type");
let typeDOM;
let inputDOM = document.getElementById("input");
let unitDOM = document.getElementById("unit-selection");
let hintDOM = document.getElementById("hint");
let conversionsDOM = document.getElementById("conversions");

let units = null;

let inputType;

let inputUnit;
let inputNumber;

let defaultUnit;
let defaultType;

let activeTypeDOM;

inputDOM.addEventListener("input", event => onInputChange(event));
unitDOM.addEventListener("change", event => onUnitChange(event));

function loadTypes() {
    for (let types in units) {
        let container = document.createElement("div");
        container.classList.add("type--container");
        container.innerText = types;
        container.value = types;
        container.setAttribute('name', 'type');
        container.setAttribute('active', false);
        container.addEventListener('click', event => {
            activeTypeDOM.setAttribute('active', false);
            activeTypeDOM = event.target
            activeTypeDOM.setAttribute('active', true);
            onTypeChange(event)
        });
        typesDOM.appendChild(container);
    }
    typeDOM = document.getElementsByName("type")
    activeTypeDOM = typeDOM[0];
    activeTypeDOM.setAttribute('active', true);
}

function onTypeChange(event) {
    inputType = getActiveTypeName();

    //inputDOM.value = "";
    //inputNumber = 0;ž
    let unitSystem = Object.keys(units[inputType])[0];
    inputUnit = Object.keys(units[inputType][unitSystem])[0];

    loadConversions(inputType);
    loadUnits(inputType);
}

function getActiveTypeName() {
    for (let type of document.getElementsByName("type")) {
        if (type.getAttribute("active") == 'true') {
            return type.value;
        }
    }
    return -1;
}

function loadUnits(type) {
    unitDOM.innerText = "";
    for (let unitSystem in units[type]) {
        for (let unit in units[type][unitSystem]) {
            let option = document.createElement("option");
            option.text = unit;
            option.value = unit;
            unitDOM.appendChild(option);
        }
    }
}

function loadConversions(type) {
    conversionsDOM.innerHTML = "";
    for (let unitSystem in units[type]) {
        let container = document.createElement("div");
        container.classList.add("conversions-table");

        let header = document.createElement("div");
        header.innerText = unitSystem;
        header.classList.add("conversions-table--header");
        container.appendChild(header);

        let body = document.createElement("div");
        body.classList.add("conversions-table--body");
        container.appendChild(body);
        for (let unit in units[type][unitSystem]) {
            if (inputUnit == unit) {
                continue;
            }

            let unitValue = document.createElement("div");
            let text = unit + ": ";

            if (inputNumber != 0) {
                let conversion = Converter.convert(inputType, inputUnit, inputNumber, unit).toFixed(5);
                conversion = parseFloat(conversion);
                text += conversion;
            }

            unitValue.innerText = text;
            unitValue.classList.add("conversions-table--unit");
            body.appendChild(unitValue)
        }

        conversionsDOM.appendChild(container);
    }
}

function onInputChange(event) {
    let input = inputDOM.value;
    let inputWords = input.split(" ");

    if (inputWords.length > 1) {
        return;
    }
    if (isNaN(inputWords[0])) {
        return;
    }
    inputNumber = inputWords[0];

    loadConversions(inputType);
}

function onUnitChange() {
    inputUnit = unitDOM.value;
    loadConversions(inputType);
    console.log("selected unit: ", inputUnit)
}

document.addEventListener('DOMContentLoaded', () => {



    ipcRenderer.on('get-units', (event, arg) => {
        units = JSON.parse(arg);
        console.log("units", units);

        loadTypes();
        inputType = getActiveTypeName();

        loadUnits(inputType);
        inputUnit = unitDOM.value;
        inputNumber = 0;

        loadConversions(inputType);

    })

    ipcRenderer.send('get-units');
    console.log("send ipc");



}, false);