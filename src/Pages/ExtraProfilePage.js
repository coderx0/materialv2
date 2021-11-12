import * as React from 'react';
import Box from '@mui/material/Box';
import { projectFireStore } from '../firebase/Config';
import { doc, getDoc } from '@firebase/firestore';
import { useParams } from 'react-router';
import { IKImage } from 'imagekitio-react';
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import classes from '../comps/ImgeGrid.module.css';

const urlEndpoint = 'https://ik.imagekit.io/imageDash001/';

export default function ExtraProfilePage() {
  const params = useParams();
  const [userData, setUserData] = React.useState(null);
  const profileImage  = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg';

  React.useEffect(() => {
    (async () => {
      const userRef = doc(projectFireStore, 'users', `${params.userId}`);
      const userData = await getDoc(userRef);
      setUserData(userData.data());
    })();
  }, [params.userId]);

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
        }}>{userData.userName}</h1>
        
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
      <Box m='auto' sx={{ width: '100%', height: 'auto'}}>
  <Box sx={{
    display: 'flex',
  flexWrap: 'wrap',
  justifyContent:'center',
alignContent: 'stretch',
}}>
  {userData.uploadedImages.map((item) => (
  
    <Box key={item.imageId} sx={{
      margin: 2,
      border: '5px solid black',
    }}>
      <Link to={`/images/${item.imageId}`}>
        <motion.div className={classes.container} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          whileHover={{
            scale: 1.1, boxShadow: "10px 12px 21px 5px rgba(0,0,0,0.62)",
          }}>
        <IKImage
          urlEndpoint={urlEndpoint}
          path={`${item.url.slice(71)}`}
          lqip={{active:true}}
          loading="lazy"
          alt="some title"
          style={{
            width: "300px",
            height:"300px",
            objectFit:"cover",
          boxShadow: '8px 9px 19px 3px rgba(0,0,0,0.62)'
            }} />
          </motion.div>
      </Link>
  </Box>
))}
</Box>
</Box>
        {/* <Box sx={{display:"flex",flexWrap:"wrap",justifyContent:"center"}}>
                    {userData.uploadedImages.map((item) => (
                    
                      <Box key={item.imageId}>
                        <IKImage
                          urlEndpoint={urlEndpoint}
                          path={`${item.url.slice(71)}`}
                          alt="some title"
                          lqip={{active:true}}
                    loading="lazy"
                          style={{
                            width:"350px" ,height:"350px",
                    boxShadow: '8px 9px 19px 3px rgba(0,0,0,0.62)',
                    margin: '10px',
                            border: '3px solid black',
                            objectFit:"cover"
                  }}
                />
                      </Box>
                    ))}
                    </Box> */}
</Box>
  );
}