import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { VictoryBar, VictoryChart } from 'victory';
import Grid from '@mui/material/Grid';
import PlayerBalanceDisplay from './components/PlayerBalanceDisplay';
import DepositorSharesBalanceDisplay from './components/DepositorSharesBalanceDisplay';
import DepositorDollarsBalanceDisplay from './components/DepositorDollarsBalanceDisplay';

const Dashboard = () => {
    const [playerBalances, setPlayerBalances] = useState([]);
    const [houseBalance, setHouseBalance] = useState(0);
    const [blockNumber, setBlockNumber] = useState(0);
    const [highestPlayerBalanceIndex, setHighestPlayerBalanceIndex] = useState(0);

    const depositorChips = [75, 25, 25, 34];

    const totalDepositorChips = depositorChips.reduce((total, chips) => total + chips, 0);

    useEffect(() => {
        const fetchBalances = async () => {
            try {
                const response = await axios.get('http://localhost:3001/balances');
                setPlayerBalances(response.data.playerBalances);
                setHouseBalance(response.data.houseBalance);
                setBlockNumber(response.data.blockNumber);
            } catch (error) {
                console.error('Error fetching balances:', error);
            }
        };

        fetchBalances();

        const highestBalanceIndex = playerBalances.reduce((highestBalanceIndex, balance, index) => {
            if (balance > playerBalances[highestBalanceIndex]) {
                return index;
            }

            return highestBalanceIndex;
        }, 0);

        setHighestPlayerBalanceIndex(highestBalanceIndex);

        const intervalId = setInterval(fetchBalances, 117);

        return () => clearInterval(intervalId);
    }, [playerBalances]);

    return (
        <div>
            <h2>Block Number: {blockNumber}</h2>
            <Grid item
                style={
                    {
                        color: "black",
                        backgroundColor: "gold",
                        paddingLeft: "6px",
                        border: "1px solid white",
                        width: "1070px",
                        margin: "5px",
                        borderRadius: "8px",
                        fontSize: "12px",
                    }
                }
            >
                <h2>House : ${houseBalance}</h2>
            </Grid>
            <Grid
                container
                display='flex'
            >
                {depositorChips.map((chips, index) => DepositorDollarsBalanceDisplay(chips, index, houseBalance, totalDepositorChips))}
            </Grid>
            <Grid
                container
                display='flex'
            >
                {depositorChips.map((chips, index) => DepositorSharesBalanceDisplay(chips, index))}
            </Grid>
            <h3>Player Balances:</h3>
            <h3>Player with balance above buy-in: {playerBalances.filter(balance => balance >= 10000).length} ({playerBalances.filter(balance => balance >= 10000).length / playerBalances.length * 100}%) </h3>
            <h3>Players bankrupt: {playerBalances.filter(balance => balance <= 0).length} ({playerBalances.filter(balance => balance <= 0).length / playerBalances.length * 100}%) </h3>
            {
                playerBalances.length > 0 &&
                <>
                    <div
                        style={{
                            outline: "1px solid red",
                            width: "1400px",
                            height: "300px",
                        }}
                    >
                        <VictoryChart
                            width={3000}
                        >
                            <VictoryBar
                                data={playerBalances.map((balance, index) => ({
                                    x: index + 1,
                                    y: balance
                                }))}
                                style={{
                                    data: {
                                        fill: (localProps) => {
                                            return localProps.index === highestPlayerBalanceIndex ?
                                                'green'
                                                : localProps.datum.y >= 10000
                                                    ? 'rebeccapurple'
                                                    : '#aaa';
                                        },
                                        width: 12,
                                    }
                                }}
                            />
                        </VictoryChart>
                    </div>
                    <Grid
                        container
                        display="flex"
                    >
                        {
                            playerBalances.map((balance, index) => PlayerBalanceDisplay(balance, index, highestPlayerBalanceIndex))
                        }
                    </Grid>
                </>
            }
        </div>
    );
};

export default Dashboard;
