import React, { useContext, useState,Suspense } from 'react';
import Navigationbar from './comps/NavigationBar';
import HomePage from './Pages/HomePage';
import { Route, Routes,Navigate } from "react-router-dom";
import AuthContext from './Store/AuthContext';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Loading from './Components/Loading';
import ExtraProfilePage from './Pages/ExtraProfilePage';

const ProfilePage = React.lazy(() => import('./Pages/ProfilePage'));
const ImageDetails = React.lazy(() => import('./Pages/ImageDetails'));
const Authentication = React.lazy(() => import('./Pages/Authentication'));
const UploadImage = React.lazy(() => import('./comps/UploadImage'));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});



export default function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const authCtx = useContext(AuthContext);
  const [open, setOpen] = useState(true);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const UserProfilePage =authCtx.user? authCtx.userName ? <ProfilePage /> : <Navigate replace to="/" />:<Navigate replace to="/"/>;
  const AuthPage =authCtx.user? authCtx.userName  ? <Navigate replace to="/" /> : <Authentication/>:<Authentication/>;
  const UploadPage =authCtx.user ? authCtx.userName  ? <UploadImage /> : <Navigate replace to="/" />:<Navigate replace to="/"/>;
  
  return (
      <ThemeProvider theme = {darkTheme}>
      <Navigationbar />

      {authCtx.message && <Snackbar
        anchorOrigin={{ vertical:'top', horizontal:'center' }} 
        open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity='success' sx={{ width: '100%' }}>
          {authCtx.message}
        </Alert>
      </Snackbar>}

      <Routes>
        
          <Route path="/profile/*"
          element={<Suspense fallback={<Loading/>}>{UserProfilePage}</Suspense>} />
          
          <Route path="/images/:imageId"
            element={<Suspense fallback={<Loading/>}><ImageDetails/></Suspense>} />
          
          <Route path="/authentication"
          element={<Suspense fallback={<Loading/>}>{AuthPage}</Suspense>}/>

          <Route path="/upload"
          element={<Suspense fallback={<Loading />}>{UploadPage}</Suspense>} />
        
        <Route path="/users/:userId" element={<Suspense fallback={<Loading/>}><ExtraProfilePage/></Suspense>}/>
          <Route path="/"
            element={<HomePage />}/>

          <Route path="*" element={ <Navigate replace to="/"/> }/>
         
      </Routes>
      </ThemeProvider>
  );
}

