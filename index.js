const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const MAX_PLAYERS = 100;
const MAX_TIMES_PER_REQUEST = 1000;

const gameState = {
    playerBalances: new Array(MAX_PLAYERS).fill(10000),
    houseBalance: 1000,
    blockNumber: 0,
};

let randomNumberGeneratorCounter = 0;
let playRequestChain = Promise.resolve();

const validationError = (message) => {
    const error = new Error(message);
    error.statusCode = 400;
    return error;
};

const parseTimes = (times = 1) => {
    const parsed = Number(times);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > MAX_TIMES_PER_REQUEST) {
        throw validationError(`times must be an integer between 1 and ${MAX_TIMES_PER_REQUEST}`);
    }

    return parsed;
};

const parseWagers = (wagers = []) => {
    if (!Array.isArray(wagers)) {
        throw validationError('wagers must be an array');
    }

    if (wagers.length > MAX_PLAYERS) {
        throw validationError(`wagers array must not exceed ${MAX_PLAYERS} players`);
    }

    return new Array(MAX_PLAYERS).fill(0).map((_, index) => {
        const wager = wagers[index];
        if (wager === undefined) {
            return 0;
        }

        const parsed = Number(wager);
        if (!Number.isInteger(parsed) || parsed < 0) {
            throw validationError(`wager at index ${index} must be a non-negative integer`);
        }

        return parsed;
    });
};

const withGameLock = (fn) => {
    const run = playRequestChain.then(fn);
    playRequestChain = run.catch(() => {});
    return run;
};

const generateRandomNumber = () => {
    randomNumberGeneratorCounter++;
    return {
        randomNumberGeneratorCounter,
        randomNumber: Math.random(),
    };
};

const runPlayRound = (wagers, times) => {
    const results = [];
    let localRandomNumberGeneratorCounter = 0;

    for (let i = 0; i < times; i++) {
        const roundResult = {
            game: i + 1,
            playerBalances: [...gameState.playerBalances],
            houseBalance: gameState.houseBalance,
        };

        wagers.forEach((wager, index) => {
            if (gameState.playerBalances[index] <= 0 || wager === 0) {
                return;
            }
            let adjustedWager = wager;
            if (gameState.playerBalances[index] < adjustedWager) {
                adjustedWager = gameState.playerBalances[index];
            }

            const { randomNumber, randomNumberGeneratorCounter } = generateRandomNumber();
            localRandomNumberGeneratorCounter = randomNumberGeneratorCounter;

            if (randomNumber < 0.49) {
                gameState.playerBalances[index] += adjustedWager;
                gameState.houseBalance -= adjustedWager;
            } else {
                gameState.playerBalances[index] -= adjustedWager;
                gameState.houseBalance += adjustedWager;
            }

            roundResult.playerBalances[index] = gameState.playerBalances[index];
        });

        results.push(roundResult);
    }

    gameState.blockNumber++;

    return {
        playerBalances: [...gameState.playerBalances],
        houseBalance: gameState.houseBalance,
        results,
        blockNumber: gameState.blockNumber,
        localRandomNumberGeneratorCounter,
    };
};

app.post('/play', (req, res) => {
    let parsedWagers;
    let parsedTimes;

    try {
        parsedWagers = parseWagers(req.body?.wagers);
        parsedTimes = parseTimes(req.body?.times);
    } catch (error) {
        return res.status(error.statusCode || 400).json({ error: error.message });
    }

    withGameLock(() => runPlayRound(parsedWagers, parsedTimes))
        .then((responseJson) => {
            res.json(responseJson);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Failed to run play simulation.' });
        });
});

app.get('/balances', (req, res) => {
    res.json({
        playerBalances: [...gameState.playerBalances],
        houseBalance: gameState.houseBalance,
        blockNumber: gameState.blockNumber,
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
