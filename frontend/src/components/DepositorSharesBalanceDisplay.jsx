import { Grid, Typography } from "@mui/material";

const DepositorBalanceDisplay = (chips, index) => (
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
            D {index + 1}: {chips.toFixed(4)} (D)
        </Typography>
    </Grid>
);

export default DepositorBalanceDisplay;