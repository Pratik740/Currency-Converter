const dropdowns = document.querySelectorAll(".dropdown select");

const final = document.querySelector('#final');

let fromCurr = "usd";
let toCurr = "inr";

for(let select of dropdowns){
    for(let key in countryList){
        const option = document.createElement('option');
        option.setAttribute('value',key);
        option.textContent = key;
        if(select.name == 'from' && key == 'USD') option.selected = true ;
        if(select.name == 'to' && key == 'INR') option.selected = true ;
        select.appendChild(option);
    }
    select.addEventListener('change',(event)=>{   // event is Event object that contains details about event that was triggered.   
        fromCurr = document.querySelector('.from select').value.toLowerCase();
        toCurr = document.querySelector('.to select').value.toLowerCase();
        final.textContent = "";
        updateFlag(event);
        updateMessage();    
    })
} 

// event.target refers to <select> element
// event.target.value refers to particular <option> element
function updateFlag(event){
    newFlag = `https://flagsapi.com/${countryList[event.target.value]}/flat/64.png`;
    let img = event.target.parentElement.querySelector('img');
    img.src = newFlag;
} 

const inputField = document.querySelector('#amount');
inputField.addEventListener('click',(event)=>{
    inputField.value = "";
    final.textContent = "";
})


const baseURL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2024-03-06/v1/currencies" ;
// https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@{date}/v1/{endpoint} then json[fromCurr][toCurr]


async function updateMessage(){
    const URL = `${baseURL}/${fromCurr}.json`; 
    const response = await fetch(URL);
    const json = await response.json();
    const rate = json[fromCurr][toCurr]; 
    const msg = document.querySelector('.msg');
    msg.textContent=`1${fromCurr.toUpperCase()} = ${rate.toFixed(2)}  ${toCurr.toUpperCase()}`;                          
}
 
let btn = document.querySelector('#submit');

btn.addEventListener('click',(event)=>{
    event.preventDefault();

    let input = Number(inputField.value);
    
    if(isNaN(input) || input < 1){
        final.textContent = "Enter a valid amount dumbass...";
        console.log("Invalid Input Detected!!!");
        final.style.color = "red";
        setTimeout(()=>{
            final.textContent = "";
            inputField.value = "";            
        },1500);  
    }
    else{
        fetchExchangeRate(fromCurr,toCurr)
        .then((data)=>{
        final.style.color = "cyan";          
        final.textContent = `Final Exchange Rate is ${(data*input).toFixed(2)}`
        });
    }
})

async function fetchExchangeRate(fromCurr,toCurr){
    const URL = `${baseURL}/${fromCurr}.json`
    try{ 
        const response = await fetch(URL);
        const json = await response.json();
        const rate = json[fromCurr][toCurr];   
        return rate; 
    }catch{
        console.error('Error fetching exchange rate:', error);
        throw error;
    }
}

updateMessage();











