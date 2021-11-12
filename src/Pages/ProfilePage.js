import * as React from 'react';
import Box from '@mui/material/Box';
import AuthContext from '../Store/AuthContext';
import { NavLink,Route,Routes,Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { projectFireStore } from '../firebase/Config';
import { doc, getDoc } from '@firebase/firestore';
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';


const UploadHistory = React.lazy(() => import("../Components/UploadHistory"));
const Favorites = React.lazy(() => import('../Components/Favorites'));

export default function ProfilePage() {
  const authCtx = React.useContext(AuthContext);
  const [displayName, setDisplayName] = React.useState('No user name');
  const [userData, setUserData] = React.useState(null);
  const [profileImage, setProfileImage] = React.useState('https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg');

    React.useEffect(() => {
      if (authCtx.user)
      {
        if(authCtx.user.displayName)
          setDisplayName(authCtx.user.displayName);
        if(authCtx.user.photoURL)
          setProfileImage(authCtx.user.photoURL);
        
        (async () => {
          const userRef = doc(projectFireStore, 'users', `${authCtx.user.uid}`);
          const userData = await getDoc(userRef);
          setUserData(userData.data());
        })();
         }
    }, [authCtx.user]);
  
  if (!userData)
    return <Box sx={{
      height: 400, fontSize: 30, color:'white',fontWeight:'bold',display:'flex',justifyContent:"center",alignItems:"center"
    }}>Loading...</Box>
  
  return (
      <Box sx={{
        display: "flex",
        flexDirection:"column",
    }}>
       

        <Box sx={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${profileImage})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          height: 250,
          color: "white",
        display: "flex",
        justifyContent: "center",
          alignItems:"center",
          fontFamily:"Josefin Sans"
      }}>
        
        <h1 style={{
          textAlign:"center",
          letterSpacing: "10px",
          textTransform: "uppercase",
          fontSize: '10vw',
        fontWeight: "bold",
        }}>{displayName}</h1>
        
      </Box>
      <Box sx={{
        width: "100%",
        padding: 1,
        fontSize: "1rem",
        display: "flex",
        justifyContent: "space-between",
        color:"white"
      }}>
        <span>Followers {userData.followers}</span>
        <span>Image Uploaded {userData.uploadedImages.length}</span>
        </Box>
        <Box>
      <AppBar position="static">
          <Toolbar sx={{
            display: "flex", justifyContent: "space-between"}}>
         
            <Typography fontSize="0.8em">
              <NavLink className={(navData) => navData.isActive ? 'activeNav' : ''}
                to="uploadHistory">Upload History</NavLink>
            </Typography>
            <Typography fontSize="0.8em">
              <NavLink className={(navData) => navData.isActive ? 'activeNav' : ''}
                to="favorites">Favorites</NavLink>
            </Typography>
            <Typography fontSize="0.8em">
              <NavLink className={(navData) => navData.isActive ? 'activeNav' : ''}
                to="following">Following</NavLink>
            </Typography>

        </Toolbar>
      </AppBar>
      </Box>
      
      <Routes>
        <Route path="/following" element={
          <Box sx={{
            display:"flex",flexWrap:"wrap",justifyContent:"center",alignItems:"center"
          }}>
            {userData.following.map(user => <Box key={user.uploader}
            sx={{
              backgroundColor: "black", minWidth: "30%", margin: 2, padding: 2, fontSize: 20, color: "white",
            }}>
              <Link to={`/users/${user.uploaderId}`}>
                <Box sx={{display:"flex",justifyContent:"center"}}>
                <Avatar sx={{ bgcolor: deepOrange[500],marginRight:2 }}>{user.uploader[0]}</Avatar>{user.uploader}
                </Box>
              </Link>
        </Box>)}
          </Box>
        }/>

        <Route path="uploadHistory"
          element={
            <React.Suspense fallback={<Box sx={{textAlign:"center",color:"white",
            fontSize:20,margin:"20px"}}>Loading...</Box>}>
              <UploadHistory uploadedImages={userData.uploadedImages}/>
            </React.Suspense>}
      />
        

      <Route path="favorites"
          element={
          <React.Suspense fallback = {<Box sx={{textAlign:"center",color:"white",
              fontSize: 20, margin: "20px"
            }}>Loading...</Box>}><Favorites favImgs={userData.favorites}/></React.Suspense>
        }
      />
      </Routes>
</Box>
  );
}