const express = require('express');

// sample payload
const trx = {
    "ID": 1308,
    "Amount": 12580,
    "Currency": "NGN",
    "CustomerEmail": "anon8@customers.io",
    "SplitInfo": [
        {
            "SplitType": "FLAT",
            "SplitValue": 45,
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
        }
    ]
}

const app = express();
app.use(express.json());

// -- ENDPOINT -- //
app.post('/split-payments/compute', (req, res) => {
    const { ID, Amount, Currency, CustomerEmail, SplitInfo } = req.body;

})


// -- LISTEN ENDPOINT -- //
app.get('/', function (req, res) {
    res.send('Hello World')
  })
  
app.listen(3000)