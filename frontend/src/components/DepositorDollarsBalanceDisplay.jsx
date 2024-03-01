import { Grid, Typography } from "@mui/material";

const DepositorDollarsBalanceDisplay = (chips, index, houseBalance, totalDepositorChips) => (
    <Grid item
        key={index}
        style={
            {
                color: "black",
                backgroundColor: "gold",
                paddingLeft: "6px",
                border: "1px solid white",
                width: "240px",
                margin: "5px",
                borderRadius: "8px",
            }
        }
    >
        <Typography>
            Depositor {index + 1} : ${(houseBalance * (chips / totalDepositorChips)).toFixed(4)}
        </Typography>
    </Grid>
);

export default DepositorDollarsBalanceDisplay;
