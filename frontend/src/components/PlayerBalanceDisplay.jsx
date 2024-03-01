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
                    padding: "6px 6px 6px 12px",
                    border: "1px solid white",
                    width: "200px",
                    margin: "5px",
                    borderRadius: "8px",
                }
            }
        >
            <Typography>
                Player {index}: ${balance}
            </Typography>
        </Grid>
    )
};

export default PlayerBalanceDisplay;
