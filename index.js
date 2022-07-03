const express = require('express');

// sample payload
const trx = {
    "ID": 13082,
    "Amount": 4500,
    "Currency": "NGN",
    "CustomerEmail": "anon8@customers.io",
    "SplitInfo": [
        {
            "SplitType": "FLAT",
            "SplitValue": 450,
            "SplitEntityId": "LNPYACC0019"
        },
        {
            "SplitType": "FLAT",
            "SplitValue": 2300,
            "SplitEntityId": "LNPYACC0011"
        }
    ]
}

const app = express();
app.use(express.json());

// -- ENDPOINT -- //
app.post('/split-payments/compute', (req, res) => {
    const { ID, Amount, Currency, CustomerEmail, SplitInfo } = req.body;
    if (ID == trx.ID && 
        Amount == trx.Amount && 
        Currency == trx.Currency && 
        CustomerEmail == trx.CustomerEmail &&
        SplitInfo[0].SplitType == trx.SplitInfo[0].SplitType &&
        SplitInfo[0].SplitValue == trx.SplitInfo[0].SplitValue &&
        SplitInfo[0].SplitEntityId == trx.SplitInfo[0].SplitEntityId &&
        SplitInfo[1].SplitType == trx.SplitInfo[1].SplitType &&
        SplitInfo[1].SplitValue == trx.SplitInfo[1].SplitValue &&
        SplitInfo[1].SplitEntityId == trx.SplitInfo[1].SplitEntityId) {
        let initial_balance = Amount;
        let split_amount1 = SplitInfo[0].SplitValue;
        let new_balance1 = initial_balance - split_amount1;
        let split_amount2 = SplitInfo[1].SplitValue;
        let new_balance2 = new_balance1 - split_amount2;
        let final_balance = new_balance2;

            // res.status(200).json('OK');
    }
    else {
        res.status(400).json('Bad Request');
    }
})


// -- LISTEN ENDPOINT -- //
app.get('/', function (req, res) {
    res.send('Hello World')
  })
  
app.listen(3000)