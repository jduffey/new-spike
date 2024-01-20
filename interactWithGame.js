// interactWithGame.js
const axios = require('axios');

const playGame = async (wager, times) => {
    try {
        const response = await axios.post('http://localhost:3001/play', {
            wager, times
        });
        const data = response.data;

        // Log the result after each game
        data.results.forEach(result => {
            console.log(`Game ${result.game}: Player Balance: $${result.playerBalance}, House Balance: $${result.houseBalance}`);
        });

        // Log the final balances
        console.log('Final Player Balance: $', data.playerBalance);
        console.log('Final House Balance: $', data.houseBalance);
    } catch (error) {
        console.error('Error interacting with the game:', error);
    }
};

// Check if a CLI argument is provided for the number of times to play
const timesToPlay = process.argv[2] ? parseInt(process.argv[2], 10) : 0;

if (timesToPlay > 0) {
    // Run the playGame function that many times
    for (let i = 1; i <= timesToPlay; i++) {
        console.log(`\n--- Playing Round ${i} ---`);
        playGame(1, 1); // Wager is hardcoded to $1, and times is hardcoded to 1 for each game round
    }
} else {
    console.log("Please provide the number of times to play as a CLI argument.");
}
