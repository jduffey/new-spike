import { Grid, Typography } from "@mui/material";

const PlayerBalanceDisplay = (balance, index, highestPlayerBalanceIndex) => {
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
                    paddingLeft: "6px",
                    border: "1px solid white",
                    width: "200px",
                    margin: "2px",
                    borderRadius: "8px",
                }
            }
        >
            <Typography>
                P {index}: ${balance}
            </Typography>
        </Grid>
    )
};

export default PlayerBalanceDisplay;
