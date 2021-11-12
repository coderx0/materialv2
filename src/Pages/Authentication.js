import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useState, useContext } from "react";
import AuthContext from '../Store/AuthContext';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { motion } from 'framer-motion';
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword,updateProfile } from "firebase/auth";
import { doc, setDoc,collection,getDocs,query,addDoc } from "firebase/firestore";
import { projectFireStore } from "../firebase/Config";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Authentication() {
  const [isLogin, setIslogin] = useState(true);
  const [open, setOpen] = useState(false);
  const [isAccountCreated, setIsAccounCreated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const authCtx = useContext(AuthContext);
  const auth = getAuth();
  const [message, setMessage] = useState(null);
  const [usedNames, setUsedNames] = useState([]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

    const submitHandler = (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const eneterdEmail = data.get('email');
      const enteredPassword = data.get('password');
      setIsLoading(true);

//Signup      
      
      if (!isLogin)
      {
        createUserWithEmailAndPassword(auth, eneterdEmail, enteredPassword)
        .then((userCredential) => {
          const userRef = doc(projectFireStore, 'users',`${auth.currentUser.uid}`);
          (async () => {
            await setDoc(userRef, {
              userId:auth.currentUser.uid,
              liked: [],
              favorites:[]
            });
          })();
          setIsLoading(false);
          setIsAccounCreated(true);
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          setMessage(errorCode);
          setOpen(true);
          setIsLoading(false);
        });
      }

      else {
        signInWithEmailAndPassword(auth, eneterdEmail, enteredPassword)
  .then((userCredential) => {
    authCtx.alertMsg('Authenticated successfully!');
  })
  .catch((error) => {
    const errorCode = error.code;
    setMessage(errorCode);
    setOpen(true);
    setIsLoading(false);
  });
      }
  };

  React.useEffect(() => {
    if (!isLogin)
    {
      const q = query(collection(projectFireStore, 'userNames'));
      (async () => {
        let documents = [];
        const docSnapshots = await getDocs(q);
        docSnapshots.forEach(element => {
            documents.push(element.data().name)
        });
        setUsedNames(documents);
      })();
      }
  }, [isLogin]);

  const userNameHandler = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const enteredName = data.get('username');
    if (usedNames.includes(enteredName))
    {
      setMessage("username already exists. Use another name");
      setOpen(true);
    }
    else {
        updateProfile(auth.currentUser, {
          displayName: enteredName,
          }).then(() => {
          // Profile updated!
          // ...
          }).catch((error) => {
          // An error occurred
          // ...
        });
  
      const usernameRef = collection(projectFireStore, 'userNames');
      (async () => {
        await addDoc(usernameRef, { name: enteredName });
      })();
  
      const userRef = doc(projectFireStore, 'users', `${auth.currentUser.uid}`);
      (async () => {
        await setDoc(userRef, {
          userName: enteredName,
          favorites: [],
          uploadedImages:[],
          liked: [],
          following: [],
          followers:0,
          userId:auth.currentUser.uid});
      })();
      authCtx.createName(enteredName);
    }

  }

  const toggleHandler = () => {
    setIslogin(prevState => {
      return !prevState;
    })
  };


  return (
    <motion.div
      initial={{opacity:0}}
      animate={{ opacity: 1 }}>

       <Snackbar
        anchorOrigin={{ vertical:'top', horizontal:'center' }} 
        open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>

      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1635333630128-4af7a5ce517d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1887&q=80)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          />
          
        {!isAccountCreated && <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            >
             
              <Typography component="h1" variant="h5" mb={5}>
              {isLogin && "Welcome Back"}
              {!isLogin && "Create an account"}
            </Typography>
            <Typography component="h1" variant="h5">
                {isLogin && "Sign In"}
                {!isLogin && "Sign Up"}
            </Typography>
              <Box component="form" onSubmit={submitHandler} sx={{ mt: 1 }}>
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {isLogin && "Sign In"}
                {!isLogin && "Sign Up"}
              </Button>
              <Grid container>
                <Grid item>
                  <Button onClick={toggleHandler}>
                    {isLogin && "Don't have an account? Sign Up"}
                    {!isLogin && "Sign In"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>}

        {isAccountCreated && <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            >
             
            <Typography component="h1" variant="h5" mb={5}>
              Create an UserName
            </Typography>
              <Box component="form" onSubmit={userNameHandler} sx={{ mt: 1 }}>
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="User Name"
                name="username"
                autoFocus
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Set UserName
              </Button>
            </Box>
          </Box>
        </Grid>}

      </Grid>
      {isLoading && <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>}
    </motion.div>
  );
}