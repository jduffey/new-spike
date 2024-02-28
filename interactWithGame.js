const axios = require('axios');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const playGame = async (wager, times) => {
    try {
        for (let i = 1; i <= times; i++) {
            console.log(`\n--- Playing Round ${i} ---`);

            const wagers = new Array(1000);
            for (let i = 0; i < wagers.length; i++) {
                // const wagerAmount = Math.floor(Math.random() * 50) + 1;
                const wagerAmount = 1;
                wagers[i] = wagerAmount;
            }
            console.log(`Wagers: $${wagers.join(', $')}`);

            const response = await axios.post('http://localhost:3001/play', {
                wagers, times: 1
            });
            const data = response.data;
            const result = data.results[0];

            console.log(`Block ${data.blockNumber}:`);
            if (result.playerBalances.every(balance => balance === 0)) {
                console.log('All players have gone bankrupt!');
                break;
            }
            console.log('result', result);

            await sleep(100);
        }
    } catch (error) {
        console.error('Error interacting with the game:', error);
    }
};

// Check if a CLI argument is provided for the number of times to play
const timesToPlay = process.argv[2] ? parseInt(process.argv[2], 10) : 0;

if (timesToPlay > 0) {
    playGame(1, timesToPlay);
} else {
    console.log("Please provide the number of times to play as a CLI argument.");
}
