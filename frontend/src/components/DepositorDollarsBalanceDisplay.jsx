import { Grid } from "@mui/material";

const DepositorDollarsBalanceDisplay = (chips, index, houseBalance, totalDepositorChips) => (
  <Grid item
    key={index}
    style={
      {
        color: "black",
        backgroundColor: "gold",
        paddingLeft: "6px",
        border: "1px solid white",
        width: "400px",
        margin: "5px",
        borderRadius: "8px",
      }
    }
  >
    <h2>Depositor {index + 1} : ${(houseBalance * (chips / totalDepositorChips)).toFixed(4)}</h2>
  </Grid>
);

export default DepositorDollarsBalanceDisplay;
