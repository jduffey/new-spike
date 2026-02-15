const axios = require('axios');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const MAX_PLAYERS = 100;

const parsePositiveInteger = (value, defaultValue) => {
    const parsed = parseInt(value, 10);
    if (Number.isNaN(parsed) || parsed < 1) {
        return defaultValue;
    }

    return parsed;
};

const buildWagers = (maxWager) => {
    const normalizedMaxWager = Math.max(1, parseInt(maxWager, 10) || 1);
    const wagers = new Array(MAX_PLAYERS);
    for (let i = 0; i < wagers.length; i++) {
        wagers[i] = Math.floor(Math.random() * normalizedMaxWager) + 1;
    }

    return wagers;
};

const playGame = async (wager, times) => {
    try {
        for (let i = 1; i <= times; i++) {
            // console.log(`\n--- Playing Round ${i} ---`);

            const wagers = buildWagers(wager);
            // console.log(`Wagers: $${wagers.join(', $')}`);

            const response = await axios.post('http://localhost:3001/play', {
                wagers, times: 1
            });
            const data = response.data;
            const result = data.results[0];

            console.log(`Random number generator called ${data.localRandomNumberGeneratorCounter} times.`);

            // console.log(`Block ${data.blockNumber}:`);
            if (result.playerBalances.every(balance => balance === 0)) {
                console.log('All players have gone bankrupt!');
                break;
            }
            // console.log('result', result);

            await sleep(50);
        }
    } catch (error) {
        console.error('Error interacting with the game:', error);
    }
};

// Check if a CLI argument is provided for the number of times to play
const timesToPlay = parsePositiveInteger(process.argv[2], 0);
const maxWager = parsePositiveInteger(process.argv[3], 1);

if (timesToPlay > 0) {
    playGame(maxWager, timesToPlay);
} else {
    console.log("Please provide the number of times to play as a CLI argument.");
}
