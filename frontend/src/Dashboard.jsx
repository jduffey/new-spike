import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { VictoryBar, VictoryChart } from 'victory';
import Grid from '@mui/material/Grid';

const Dashboard = () => {
  const [playerBalances, setPlayerBalances] = useState([]);
  const [houseBalance, setHouseBalance] = useState(0);
  const [blockNumber, setBlockNumber] = useState(0);
  const [highestPlayerBalanceIndex, setHighestPlayerBalanceIndex] = useState(0);

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

    const intervalId = setInterval(fetchBalances, 150);

    return () => clearInterval(intervalId);
  }, [playerBalances]);

  return (
    <div>
      <h1>Betting Game Dashboard</h1>
      <h2>Block Number: {blockNumber}</h2>
      <Grid item
        style={
          {
            color: "black",
            backgroundColor: "gold",
            paddingLeft: "6px",
            border: "1px solid white",
            width: "300px",
            margin: "5px",
            borderRadius: "8px",
          }
        }
      >
        <h2>House : ${houseBalance}</h2>
      </Grid>
      <h3>Player Balances:</h3>
      {
        playerBalances.length > 0 &&
        <>
          <div
            style={{
              outline: "1px solid red",
              width: "1000px",
              height: "300px",
            }}
          >
            <VictoryChart
            width={1000}
            >
              <VictoryBar
                data={playerBalances.map((balance, index) => ({
                  x: index + 1,
                  y: balance
                }))}
                style={{
                  data: {
                    fill: ({ index }) => index === highestPlayerBalanceIndex ? 'green' : '#aaa',
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
              playerBalances.map((balance, index) => {
                let backgroundColor = balance > 0 ? "black" : "red";
                if (index === highestPlayerBalanceIndex) {
                  backgroundColor = "green";
                }

                return (
                  <Grid item
                    key={index}
                    style={
                      {
                        color: "white",
                        backgroundColor,
                        padding: "6px 6px 6px 12px",
                        border: "1px solid white",
                        width: "200px",
                        margin: "5px",
                        borderRadius: "8px",
                      }
                    }
                  >
                    Player {index}: ${balance}
                  </Grid>
                )
              })
            }
          </Grid>
        </>
      }
    </div>
  );
};

export default Dashboard;
