// src/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { VictoryBar, VictoryChart } from 'victory';

const Dashboard = () => {
    const [playerBalances, setPlayerBalances] = useState([]);
    const [houseBalance, setHouseBalance] = useState(0);

    useEffect(() => {
        const fetchBalances = async () => {
            try {
                const response = await axios.get('http://localhost:3001/balances'); // Adjust URL as needed
                setPlayerBalances(response.data.playerBalances);
                setHouseBalance(response.data.houseBalance);
            } catch (error) {
                console.error('Error fetching balances:', error);
            }
        };

        fetchBalances();
    }, []);

    return (
        <div>
            <h1>Betting Game Dashboard</h1>
            <h2>House Balance: ${houseBalance}</h2>
            <h3>Player Balances:</h3>
            {/* <ul>
                {playerBalances.map((balance, index) => (
                    <li key={index}>Player {index + 1}: ${balance}</li>
                ))}
            </ul> */}
            {
                playerBalances.length > 0 &&
                <div
                    style={{
                        // display: "grid",
                        // gridTemplateColumns: `repeat(${playerBalances.length}, 1fr)`,
                        // gridGap: "1em",
                        outline: "1px solid red",
                        width: "80%",
                    }}
                >
                    <VictoryChart                >
                        <VictoryBar
                            style={{ data: { fill: "#c43a31" } }}
                            data={
                                playerBalances.map((balance, index) => ({
                                    x: index + 1,
                                    y: balance
                                }))
                            }
                        />
                    </VictoryChart>
                </div>
            }
        </div>
    );
};

export default Dashboard;
