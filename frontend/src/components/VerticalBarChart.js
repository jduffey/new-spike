import { Grid } from '@mui/material';

const commonGridStyles = {
    alignSelf: 'stretch',
    display: 'inline-flex',
};

const commonLabelStyles = {
    fontSize: 14,
};

const yAxisLabels = (yAxisLabels, bottomLabel) => (
    <Grid
        style={{
            ...commonGridStyles,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
        }}
    >
        {yAxisLabels.map((label, index, arr) => yAxisIntervalLabelContainer(arr[arr.length - index - 1], label))}
        {yAxisBottomLabelContainer(bottomLabel)}
    </Grid>
);

const yAxisIntervalLabel = (label) => (
    <Grid
        style={{
            ...commonLabelStyles,
            color: '#45464F',
            fontWeight: '400',
            height: '22px',
            lineHeight: '22px',
            letterSpacing: 0.25,
        }}
    >
        {label}
    </Grid>
);

const yAxisIntervalLabelContainer = (label, renderKey) => (
    <Grid
        key={renderKey}
        style={{
            ...commonGridStyles,
            flex: '1 1 0',
            padding: '10px 16px 10px 0',
            justifyContent: 'flex-start',
            alignItems: 'center',
            borderBottom: '1px solid #C5C6D0',
            borderRight: '1px solid #C5C6D0',
        }}
    >
        {yAxisIntervalLabel(label)}
    </Grid>
);

const yAxisBottomLabel = (label) => (
    <Grid
        style={{
            ...commonLabelStyles,
            color: '#45464F',
            fontWeight: '700',
            lineHeight: '16px',
        }}
    >
        {label}
    </Grid>
);

const yAxisBottomLabelContainer = (label) => (
    <Grid
        style={{
            ...commonGridStyles,
            padding: '10px 16px 10px 0',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 10,
            borderBottom: '1px solid #C5C6D0',
            borderRight: '1px solid #C5C6D0',
        }}
    >
        {yAxisBottomLabel(label)}
    </Grid>
);

const verticalBarAndContainerWithXAxisLabel = (
    barPercentage,
    barXAxisLabel,
    renderKey
) => {
    const verticalBar = (barPercentage) => (
        <Grid
            key={`verticalBar-${renderKey}`}
            style={{
                flex: '1 1 0',
                alignSelf: 'end',
                height: barPercentage,
                background: '#000',
            }}
        />
    );

    const verticalBarContainer = (barPercentage) => (
        <Grid
            key={`verticalBarContainer-${renderKey}`}
            style={{
                ...commonGridStyles,
                flex: '1 1 0',
                paddingLeft: 4,
                paddingRight: 4,
                alignItems: 'center',
                borderRight: '1px solid #C5C6D0',
            }}
        >
            {verticalBar(barPercentage)}
        </Grid>
    );

    const verticalBarXAxisLabel = (barXAxisLabelText) => (
        <Grid
            key={`verticalBarXAxisLabel-${renderKey}`}
            style={{
                ...commonLabelStyles,
                color: '#45464F',
                fontWeight: '400',
                letterSpacing: 0.25,
                height: '16px',
                lineHeight: '16px',
            }}
        >
            {barXAxisLabelText}
        </Grid>
    );

    const verticalBarXAxisLabelContainer = (barXAxisLabelText) => (
        <Grid
            key={`verticalBarXAxisLabelContainer-${renderKey}`}
            style={{
                ...commonGridStyles,
                padding: '10px 0 10px 0',
                justifyContent: 'center',
                borderBottom: '1px solid #C5C6D0',
                borderRight: '1px solid #C5C6D0',
                borderTop: '1px solid #C5C6D0',
            }}
        >
            {verticalBarXAxisLabel(barXAxisLabelText)}
        </Grid>
    );

    return (
        <Grid
            key={`verticalBarAndContainerWithXAxisLabel-${renderKey}`}
            style={{
                ...commonGridStyles,
                flex: '1 1 0',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
            }}
        >
            {verticalBarContainer(barPercentage)}
            {verticalBarXAxisLabelContainer(barXAxisLabel)}
        </Grid>
    );
};

const VerticalBarChart = ({
    yAxisIntervalLabels,
    yAxisBottomLabel,
    xAxisLabels,
    lToRBarPercentages,
}) => (
    <Grid
        style={{
            ...commonGridStyles,
            flex: '1 1 0',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            display: 'flex',
        }}
    >
        <Grid
            style={{
                ...commonGridStyles,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
            }}
        >
            {yAxisLabels(yAxisIntervalLabels, yAxisBottomLabel)}
            {lToRBarPercentages.map((percentage, index) => {
                const percentageAsStyle = `${percentage}%`;
                return verticalBarAndContainerWithXAxisLabel(
                    percentageAsStyle,
                    xAxisLabels[index],
                    index.toString()
                );
            })}
        </Grid>
    </Grid>
);

export default VerticalBarChart;
