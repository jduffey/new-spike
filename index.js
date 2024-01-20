// Backend: index.js
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let playerBalance = 100;
let houseBalance = 1000;

app.post('/play', (req, res) => {
    const { wager, times = 1 } = req.body; // Default times to 1 if not provided
    const results = [];

    for (let i = 0; i < times; i++) {
        if (playerBalance < wager) {
            break; // Player can't wager more than their balance
        }

        const randomNumber = Math.random();
        if (randomNumber < 0.45) {
            // Player wins
            playerBalance += wager;
            houseBalance -= wager;
            results.push({ game: i + 1, playerBalance, houseBalance });
        } else {
            // House wins
            playerBalance -= wager;
            houseBalance += wager;
            results.push({ game: i + 1, playerBalance, houseBalance });
        }
    }

    res.json({ playerBalance, houseBalance, results });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
