const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// -- ENDPOINT -- //
app.post('/split-payments/compute', (req, res) => {
    let { ID, Amount, Currency, CustomerEmail, SplitInfo } = req.body;
    // check if all required fields are present
    if (!ID || !Amount || !Currency || !CustomerEmail || !SplitInfo) {
        res.status(400).send('Missing required fields');
    }
    // check if SplitInfo is an empty or has more than 20 entities
    if (SplitInfo.length === 0 || SplitInfo.length > 20) {
        res.status(400).send('SplitInfo is empty, please provide at least one split');
    }
    // compute in this order:
    // 1. assign a variable to the amount of the transaction
    let balance = Amount;
    // 2. for all FLAT splits, subtract the splitvalue from total amount
    SplitInfo.forEach(split => {
        if (split.SplitType === 'FLAT') {
            balance -= split.SplitValue;
        }
    })
    // 3. for all PERCENTAGE splits, subtract the percentage of the splitvalue from the total amount
    SplitInfo.forEach(split => {
        if (split.SplitType === 'PERCENTAGE') {
            balance -= (split.SplitValue / 100) * balance;
        }
    })
    // 4. for all RATIO splits
    // i. compute the total ratio
    let totalRatio = 0;
    SplitInfo.forEach(split => {
        if (split.SplitType === 'RATIO') {
            totalRatio += split.SplitValue;
        }
    })
    // ii. for all RATIO splits, multiply the ratio of the splitvalue and total ratio with the same total amount
    // then subtract the result from the consecutive total amount
    SplitInfo.forEach(split => {
        if (split.SplitType === 'RATIO') {
            balance -= (split.SplitValue / totalRatio) * balance;
            balance -= balance;
        }
    })
    res.status(200).json(
        {
            ID: ID,
            Balance: balance,
            SplitBreakdown: // exclude the SplitType property from the response
                SplitInfo.map(split => {
                    return {
                        SplitEntityId: split.SplitEntityId,
                        Amount: 
                            split.SplitType === 'FLAT' ? split.SplitValue :
                            split.SplitType === 'PERCENTAGE' ? split.SplitValue:
                            split.SplitValue
                    }
                })

        }
    );
})

// -- ROOT -- //
app.get('/', function (req, res) {
    res.send('Server is running on port 3000');
})

// -- START SERVER -- //
app.listen(process.env.PORT, ()=> {
    console.log(`app is running on port ${process.env.PORT}`);
});