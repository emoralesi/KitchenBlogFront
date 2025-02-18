import { Box, Grid, Skeleton } from "@mui/material"

export const SkeletonWave = () => {
    return (
        [...Array(6)].map((_, index) => (
            <Box key={index} sx={{ p: 0, border: 1, borderRadius: 2, height: '58vh', display: 'flex', flexDirection: 'column' }}>
                <Skeleton variant="rectangular" height={'50%'} animation="wave"
                    sx={{
                        borderRadius: '8px 8px 0px 0px',
                        animationDuration: '0.5s',
                        '&::after': {
                            background: 'linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.2), transparent)',
                        },
                    }} />
                <Skeleton variant="text" height={40} animation="wave" sx={{
                    borderRadius: '8px 8px 0px 0px',
                    animationDuration: '0.5s',
                    '&::after': {
                        background: 'linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.2), transparent)',
                    },
                }} />
                <Grid container>
                    <Grid item xs={4}>
                        <Skeleton variant="text" height={30} animation="wave" sx={{
                            borderRadius: '8px 8px 0px 0px',
                            animationDuration: '0.5s',
                            '&::after': {
                                background: 'linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.2), transparent)',
                            },
                        }} />
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item xs={4}>
                        <Skeleton variant="text" height={30} animation="wave" sx={{
                            borderRadius: '8px 8px 0px 0px',
                            animationDuration: '0.5s',
                            '&::after': {
                                background: 'linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.2), transparent)',
                            },
                        }} />
                    </Grid>
                    <Grid item xs={4}>
                        <Skeleton variant="text" height={30} animation="wave" sx={{
                            borderRadius: '8px 8px 0px 0px',
                            animationDuration: '0.5s',
                            '&::after': {
                                background: 'linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.2), transparent)',
                            },
                        }} />
                    </Grid>
                    <Grid item xs={4}>
                        <Skeleton variant="text" height={30} animation="wave" sx={{
                            borderRadius: '8px 8px 0px 0px',
                            animationDuration: '0.5s',
                            '&::after': {
                                background: 'linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.2), transparent)',
                            },
                        }} />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={3}>
                        <Skeleton variant="circular" animation="wave" width={50} height={50} sx={{
                            animationDuration: '0.5s',
                            '&::after': {
                                background: 'linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.2), transparent)',
                            },
                        }} />
                    </Grid>
                    <Grid item xs={3}>
                        <Skeleton variant="circular" animation="wave" width={50} height={50} sx={{
                            animationDuration: '0.5s',
                            '&::after': {
                                background: 'linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.2), transparent)',
                            },
                        }} />
                    </Grid>
                    <Grid item xs={3}>
                        <Skeleton variant="circular" animation="wave" width={50} height={50} sx={{
                            animationDuration: '0.5s',
                            '&::after': {
                                background: 'linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.2), transparent)',
                            },
                        }} />
                    </Grid>
                </Grid>
            </Box>
        ))
    )
}