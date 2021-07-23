const leftSideButton = document.querySelectorAll('.button-left')
const rightSideButton = document.querySelectorAll('.button-right')

const allSelect = document.querySelectorAll('#select')

const firstSelect = document.querySelector('.currensy-left')
const secondSelect = document.querySelector('.currency-right')


const leftArea = document.querySelector('#input-left')
const rightArea = document.querySelector('#input-right')

const reversArrow = document.querySelector('#arrow')

const paragrafLeft = document.querySelector('.data-entery-paragraf-left')
const paragrafRight = document.querySelector('.data-entery-paragraf-right')



const variable = []
const variableRevers = []

let oneCurrency = 'RUB';
let twoCurrency = 'USD';
let loadTime = null;


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
    console.log(event.target);
    oneCurrency = event.target.value
    calculate()
})

secondSelect.addEventListener('change', (event) => {
    twoCurrency = event.target.value
    calculate()
})

reversArrow.addEventListener('click', () => {
    const variableStorage = oneCurrency
    oneCurrency = twoCurrency
    twoCurrency = variableStorage
    calculate()
})

leftArea.addEventListener('keyup', () => {
    calculateKeyUpLeft()

})

rightArea.addEventListener('keyup', () => {
    calculateKeyUpRight()
})

const loaingStyle = () => {
    loadTime = setTimeout(() => {
        document.querySelector('.overlay').classList.remove('hidden')
        loadTime = null
    }, 500)
}

const loadStyleRemove = () => {
    if (loadTime !== null) {
        clearTimeout(loadTime)
        loadTime = null
    }
    document.querySelector('.overlay').classList.add('hidden')
}


function calculate() {
    const gettingValueButtonLeft = document.querySelector(`#left-${oneCurrency}`)
    const gettingValueButtonRight = document.querySelector(`#right-${twoCurrency}`)

    const removeClassLeftSide = document.querySelector('.btn-list-left .colorActive')
    if (removeClassLeftSide) {
        removeClassLeftSide.classList.remove('colorActive')
    }

    if (gettingValueButtonLeft) {
        gettingValueButtonLeft.classList.add('colorActive')
    }
    else {
        firstSelect.classList.add('colorActive')
    }

    const removeClassRightSide = document.querySelector('.btn-list-right .colorActive')
    if (removeClassRightSide) {
        removeClassRightSide.classList.remove('colorActive')
    }
    if (gettingValueButtonRight) {
        gettingValueButtonRight.classList.add('colorActive')
    }
    else {
        secondSelect.classList.add('colorActive')
    }
    loaingStyle()
    getValuePromise(oneCurrency, twoCurrency)
        .then((rates) => {
            variable.push(rates[0], rates[1])
            variableRevers.push(rates[1], rates[0])
            rightArea.value = rates[0] * leftArea.value

            paragrafLeft.innerText = `1 ${oneCurrency} = ${rates[0]} ${twoCurrency}`
            paragrafRight.innerText = `1 ${twoCurrency} = ${rates[1]} ${oneCurrency}`
            loadStyleRemove()
        })
}

const calculateKeyUpLeft = () => {
    const valueInputLeft = leftArea.value
    rightArea.value = variableRevers[1] * valueInputLeft
}

const calculateKeyUpRight = () => {
    const valueInputRight = rightArea.value
    leftArea.value = variableRevers[0] * valueInputRight
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
    calculate()
}

loadingPage()

