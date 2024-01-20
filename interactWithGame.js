// interactWithGame.js
const axios = require('axios');

const drawBarChart = (playerBalances, houseBalance, initialBalance) => {
    const maxBarLength = 100; // Maximum length of the balance bar
    playerBalances.forEach((playerBalance, index) => {
        const playerBarLength = Math.round((playerBalance / initialBalance) * maxBarLength);
        const playerBar = '█'.repeat(playerBarLength);
        console.log(`Player ${index} Balance Bar: |${playerBar}| $${playerBalance}`);
    });

    const houseBarLength = Math.round((houseBalance / initialBalance) * maxBarLength);
    const houseBar = '█'.repeat(houseBarLength);
    console.log(`House Balance Bar:    |${houseBar}| $${houseBalance}`);
};

const playGame = async (wager, times, initialBalance) => {
    try {
        for (let i = 1; i <= times; i++) {
            console.log(`\n--- Playing Round ${i} ---`);
            // const wagers = new Array(5).fill(wager); // Same wager for each of the 5 players

            const wagers = new Array(10);
            for (let i = 0; i < wagers.length; i++) {
                wagers[i] = Math.floor(Math.random() * 10) + 1;
            }
            console.log(`Wagers: $${wagers.join(', $')}`);

            const response = await axios.post('http://localhost:3001/play', {
                wagers, times: 1 // Play one round at a time
            });
            const data = response.data;
            const result = data.results[0];

            console.log(`Game ${result.game}:`);
            // result.playerBalances.forEach((balance, index) => {
            //     console.log(`Player ${index + 1} Balance: $${balance}`);
            // });
            // console.log(`House Balance: $${result.houseBalance}`);

            // Draw CLI graphical representation of the balance changes
            if (result.playerBalances.every(balance => balance === 0)) {
                console.log('All players have gone bankrupt!');
                break;
            }
        }
        drawBarChart(result.playerBalances, result.houseBalance, initialBalance);
    } catch (error) {
        console.error('Error interacting with the game:', error);
    }
};

// Check if a CLI argument is provided for the number of times to play
const timesToPlay = process.argv[2] ? parseInt(process.argv[2], 10) : 0;

if (timesToPlay > 0) {
    const initialBalance = 100000; // Starting balance for both player and house
    playGame(1, timesToPlay, initialBalance); // Wager is hardcoded to $1
} else {
    console.log("Please provide the number of times to play as a CLI argument.");
}
