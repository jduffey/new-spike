const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const numberOfPlayers = 10;
const initialPlayerBalance = 1000;
const initialHouseBalance = 1000;

let playerBalances = new Array(numberOfPlayers).fill(initialPlayerBalance);
let houseBalance = initialHouseBalance;

let blockNumberCounter = 0;

const oddsOfPlayerWinning = 0.49;

const generateRandomNumber = () => Math.random();

app.post('/play', (req, res) => {
    const { wagers, times = 1 } = req.body;
    const results = [];

    for (let i = 0; i < times; i++) {
        let roundResult = { game: i + 1, playerBalances: [...playerBalances], houseBalance };
        wagers.forEach((wager, index) => {
            if (playerBalances[index] === 0) return;
            if (playerBalances[index] < wager) {
                wager = playerBalances[index];
            }
            const randomNumber = generateRandomNumber();
            if (randomNumber < oddsOfPlayerWinning) {
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

    blockNumberCounter++;

    const responseJson = { playerBalances, houseBalance, results, blockNumber: blockNumberCounter };

    res.json(responseJson);
});

app.get('/balances', (req, res) => {
    res.json({ playerBalances, houseBalance, blockNumber: blockNumberCounter });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
