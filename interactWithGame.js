const axios = require('axios');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const playGame = async (times) => {
    try {
        for (let i = 1; i <= times; i++) {

            const wagers = new Array(10);
            for (let i = 0; i < wagers.length; i++) {
                const wagerAmount = 1;
                wagers[i] = wagerAmount;
            }

            const response = await axios.post('http://localhost:3001/play', {
                wagers, times: 1
            });
            const data = response.data;
            console.log('response.data', response.data);
            console.log(`Block number: ${data.blockNumber}; House balance: ${data.results[0].houseBalance}`)
            const result = data.results[0];

            if (result.playerBalances.every(balance => balance === 0)) {
                console.log('All players have gone bankrupt!');
                break;
            }

            await sleep(50);
        }
    } catch (error) {
        console.error('Error interacting with the game:', error);
    }
};

// Check if a CLI argument is provided for the number of times to play
const timesToPlay = process.argv[2] ? parseInt(process.argv[2], 10) : 0;

if (timesToPlay > 0) {
    playGame(timesToPlay);
} else {
    console.log("Please provide the number of times to play as a CLI argument.");
}
