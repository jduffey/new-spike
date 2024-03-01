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
                width: "200px",
                margin: "2px",
                borderRadius: "8px",
            }
        }
    >
        <Typography>
            D {index + 1} : ${(houseBalance * (chips / totalDepositorChips)).toFixed(4)}
        </Typography>
    </Grid>
);

export default DepositorDollarsBalanceDisplay;
