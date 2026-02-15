import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { VictoryBar, VictoryChart } from 'victory';
import Grid from '@mui/material/Grid';
import PlayerBalanceDisplay from './components/PlayerBalanceDisplay';
import DepositorSharesBalanceDisplay from './components/DepositorSharesBalanceDisplay';
import DepositorDollarsBalanceDisplay from './components/DepositorDollarsBalanceDisplay';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const Dashboard = () => {
  const [playerBalances, setPlayerBalances] = useState([]);
  const [houseBalance, setHouseBalance] = useState(0);
  const [blockNumber, setBlockNumber] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const depositorChips = useMemo(() => [75, 25, 25, 34], []);
  const totalDepositorChips = useMemo(() => depositorChips.reduce((total, chips) => total + chips, 0), [depositorChips]);

  const fetchBalances = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/balances`);
      const data = response.data || {};
      setPlayerBalances(Array.isArray(data.playerBalances) ? data.playerBalances : []);
      setHouseBalance(typeof data.houseBalance === 'number' ? data.houseBalance : 0);
      setBlockNumber(typeof data.blockNumber === 'number' ? data.blockNumber : 0);
      setError('');
    } catch (fetchError) {
      setError('Unable to load balances from API.');
      console.error('Error fetching balances:', fetchError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalances();

    const intervalId = setInterval(fetchBalances, 117);
    return () => clearInterval(intervalId);
  }, []);

  const highestPlayerBalanceIndex = useMemo(() => {
    if (playerBalances.length === 0) {
      return -1;
    }

    return playerBalances.reduce((highestIndex, balance, index) => {
      if (balance > playerBalances[highestIndex]) {
        return index;
      }
      return highestIndex;
    }, 0);
  }, [playerBalances]);

  const playerCount = playerBalances.length;
  const playersAboveBuyIn = useMemo(() => playerBalances.filter((balance) => balance >= 10000).length, [playerBalances]);
  const bankruptPlayers = useMemo(() => playerBalances.filter((balance) => balance <= 0).length, [playerBalances]);

  const percentage = useMemo(() => {
    const safeCount = playerCount || 1;
    return {
      aboveBuyIn: (playersAboveBuyIn / safeCount) * 100,
      bankrupt: (bankruptPlayers / safeCount) * 100,
    };
  }, [playersAboveBuyIn, bankruptPlayers, playerCount]);

  return (
    <div>
      <h1>Betting Game Dashboard</h1>
      <h2>Block Number: {blockNumber}</h2>
      <Grid
        item
        style={{
          color: 'black',
          backgroundColor: 'gold',
          paddingLeft: '6px',
          border: '1px solid white',
          width: '1070px',
          margin: '5px',
          borderRadius: '8px',
          fontSize: '12px',
        }}
      >
        <h2>House : ${houseBalance}</h2>
      </Grid>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? (
        <p>Loading balances...</p>
      ) : (
        <>
          <Grid container display="flex">
            {depositorChips.map((chips, index) => (
              <Grid
                item
                key={index}
                style={{
                  color: 'black',
                  backgroundColor: 'gold',
                  paddingLeft: '6px',
                  border: '1px solid white',
                  width: '260px',
                  margin: '5px',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              >
                <h2>Depositor {index + 1} : ${(houseBalance * (chips / totalDepositorChips)).toFixed(4)}</h2>
              </Grid>
            ))}
          </Grid>
          <Grid container display="flex">
            {depositorChips.map((chips, index) => (
              <Grid
                item
                key={index}
                style={{
                  color: 'black',
                  backgroundColor: 'gold',
                  paddingLeft: '6px',
                  border: '1px solid white',
                  width: '260px',
                  margin: '5px',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              >
                <h2>Depositor {index + 1}: {chips.toFixed(4)} (D)</h2>
              </Grid>
            ))}
          </Grid>
          <h3>Player Balances:</h3>
          <h3>
            Player with balance above buy-in: {playersAboveBuyIn} ({percentage.aboveBuyIn.toFixed(2)}%)
          </h3>
          <h3>
            Players bankrupt: {bankruptPlayers} ({percentage.bankrupt.toFixed(2)}%)
          </h3>
          {playerBalances.length > 0 && (
            <>
              <div
                style={{
                  outline: '1px solid red',
                  width: '1400px',
                  height: '300px',
                }}
              >
                <VictoryChart width={3000}>
                  <VictoryBar
                    data={playerBalances.map((balance, index) => ({
                      x: index + 1,
                      y: balance,
                    }))}
                    style={{
                      data: {
                        fill: (localProps) => {
                          const index = localProps.datum.x - 1;
                          return index === highestPlayerBalanceIndex
                            ? 'green'
                            : localProps.datum.y >= 10000
                              ? 'rebeccapurple'
                              : '#aaa';
                        },
                        width: 12,
                      },
                    }}
                  />
                </VictoryChart>
              </div>
              <Grid container display="flex">
                {playerBalances.map((balance, index) => {
                  let backgroundColor = balance > 0 ? 'black' : 'red';
                  if (balance >= 10000) {
                    backgroundColor = 'rebeccapurple';
                  }
                  if (index === highestPlayerBalanceIndex) {
                    backgroundColor = 'green';
                  }

                  return (
                    <Grid
                      item
                      key={index}
                      style={{
                        color: 'white',
                        backgroundColor,
                        padding: '6px 6px 6px 12px',
                        border: '1px solid white',
                        width: '140px',
                        margin: '2px',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    >
                      Player {index + 1}: ${balance}
                    </Grid>
                  );
                })}
              </Grid>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
