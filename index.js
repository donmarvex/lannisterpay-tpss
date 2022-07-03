const express = require('express');

// sample payload
const trx = {
    "ID": 13092,
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
            "SplitType": "RATIO",
            "SplitValue": 3,
            "SplitEntityId": "LNPYACC0011"
        },
        {
            "SplitType": "PERCENTAGE",
            "SplitValue": 3,
            "SplitEntityId": "LNPYACC0015"
        },
        {
            "SplitType": "RATIO",
            "SplitValue": 2,
            "SplitEntityId": "LNPYACC0016"
        },
        {
            "SplitType": "FLAT",
            "SplitValue": 2450,
            "SplitEntityId": "LNPYACC0029"
        },
        {
            "SplitType": "PERCENTAGE",
            "SplitValue": 10,
            "SplitEntityId": "LNPYACC0215"
        }
    ]
}

const app = express();
app.use(express.json());

// -- ENDPOINT -- //
app.post('/split-payments/compute', (req, res) => {
    const { ID, Amount, Currency, CustomerEmail, SplitInfo } = req.body;
    // check if all required fields are present
    if (!ID || !Amount || !Currency || !CustomerEmail || !SplitInfo) {
        res.status(400).send('Missing required fields');
    }
    else {
        // for all FLAT SplitTypes, compute Amount - SplitValue at each index
        // using the difference of this value as the amount for the next SplitValue
        // and the remaining amount as the amount for the next SplitValue
        let remainingAmount = Amount;
        for (let i = 0; i < SplitInfo.length; i++) {
            if (SplitInfo[i].SplitType === 'FLAT') {
                SplitInfo[i].SplitValue = remainingAmount - SplitInfo[i].SplitValue;
                remainingAmount = SplitInfo[i].SplitValue;
            }
            // else if SplitType is PERCENTAGE, compute the percentage of the remaining amount
            // and use this value as the amount for the next SplitValue
            else if (SplitInfo[i].SplitType === 'PERCENTAGE') {
                SplitInfo[i].SplitValue = remainingAmount - SplitInfo[i].SplitValue / 100;
                remainingAmount = SplitInfo[i].SplitValue;
            }
        }
    }
})


// -- LISTEN ENDPOINT -- //
app.get('/', function (req, res) {
    res.send('Hello World')
  })
  
app.listen(3000)