

fetch('https://api.exchangerate.host/latest')
    .then((response) => response.json())
    .then((operations) => {
        console.log(operations)
    })