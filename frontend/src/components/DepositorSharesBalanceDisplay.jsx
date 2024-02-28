import { Grid } from "@mui/material";

const DepositorBalanceDisplay = (chips, index) => (
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
    <h2>Depositor {index + 1}: {chips.toFixed(4)} (D)</h2>
  </Grid>
);

export default DepositorBalanceDisplay;