// Backend: index.js
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let playerBalances = new Array(50).fill(10000);
let houseBalance = 1000;

app.post('/play', (req, res) => {
    const { wagers, times = 1 } = req.body;
    const results = [];

    for (let i = 0; i < times; i++) {
        let roundResult = { game: i + 1, playerBalances: [...playerBalances], houseBalance };
        wagers.forEach((wager, index) => {
            if (playerBalances[index] < wager) {
                return; // Skip if player can't cover the wager
            }
            const randomNumber = Math.random();
            if (randomNumber < 0.49) {
                playerBalances[index] += wager;
                houseBalance -= wager;
            } else {
                playerBalances[index] -= wager;
                houseBalance += wager;
            }
            roundResult.playerBalances[index] = playerBalances[index];
        });
        results.push(roundResult);
    }

    res.json({ playerBalances, houseBalance, results });
});

app.get('/balances', (req, res) => {
    res.json({ playerBalances, houseBalance });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
