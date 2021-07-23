const leftSideButton = document.querySelectorAll('.button-left')
const rightSideButton = document.querySelectorAll('.button-right')

const allSelect = document.querySelectorAll('#select')

const firstSelect = document.querySelector('.currency-right')
const secondSelect = document.querySelector('.right-select')

const leftArea = document.querySelector('#input-left')
const rightArea = document.querySelector('#input-right')

let oneCurrency = 'RUB';
let twoCurrency = 'USD';


const functionDataApi = async () => {
    const respons = await fetch('https://api.exchangerate.host/symbols')
    const data = await respons.json()
    return Object.keys(data.symbols)
}

const getValuePromise = async (firstValue, secondValue) => {
    const respons = await fetch(`https://api.exchangerate.host/latest?base=${firstValue}&symbols=${secondValue}`)
    const data = await respons.json()
    const rate = data.rates[secondValue]

    const oneMoreRate = await fetch(`https://api.exchangerate.host/latest?base=${secondValue}&symbols=${firstValue}`)
    const dataReverse = await oneMoreRate.json()
    const rateReverse = dataReverse.rates[firstValue]

    return [rate, rateReverse]
}

leftSideButton.forEach((btn) => {
    btn.addEventListener('click', () => {
        oneCurrency = btn.innerText
        calculate()
    })
})

rightSideButton.forEach((btn) => {
    btn.addEventListener('click', () => {
        twoCurrency = btn.innerText
        calculate()
    })
})

firstSelect.addEventListener('change', (event) => {
    oneCurrency = event.target.value
    calculate()
})

secondSelect.addEventListener('change', (event) => {
    twoCurrency = event.target.value
    calculate()
})

function calculate() {
    const gettingValueButtonLeft = document.querySelector(`#left-${oneCurrency}`)
    const gettingValueButtonRight = document.querySelector(`#right-${twoCurrency}`)

    getValuePromise(oneCurrency, twoCurrency)
        .then((rates) => {
            console.log(rates);
            console.log(leftArea.value);
            rightArea.value = rates[0] * leftArea.value
        })
}


const loadingPage = () => {
    functionDataApi()
        .then((data) => {
            allSelect.forEach((select) => {
                const newArraySymbolsFilter = data.filter((item) => item !== 'RUB' && item !== 'EUR' && item !== 'USD' && item !== 'GBP')
                for (let i = 0; i < newArraySymbolsFilter.length; i++) {
                    const optionCreate = document.createElement('option')
                    optionCreate.innerText = newArraySymbolsFilter[i]
                    optionCreate.value = newArraySymbolsFilter[i]
                    select.append(optionCreate)
                }
            })
        })
}



loadingPage()

