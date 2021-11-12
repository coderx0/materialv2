import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Loading = () => {
    return <Box sx={{
        display: 'flex',
        justifyContent: "center",
        alignItems:"center",
        width: "100vw",
        height: "100vh",
    }}>
    <CircularProgress />
  </Box>;
}

export default Loading;