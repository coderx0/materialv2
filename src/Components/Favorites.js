import React from "react";
import Box from '@mui/material/Box';
import { IKImage } from "imagekitio-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import classes from '../comps/ImgeGrid.module.css';

const urlEndpoint = 'https://ik.imagekit.io/imageDash001/';


const Favorites = ({favImgs}) => {
 
  if (favImgs.length===0)
  return <Box sx={{
    height: 400, fontSize: 40, color: 'white', fontWeight: 'bold', display: 'flex',
    justifyContent: "center", alignItems: "center",textAlign:"center"
  }}>Add some images to your favorites.</Box>;

return (
  <Box m='auto' sx={{ width: '100%', height: 'auto'}}>
  <Box sx={{
    display: 'flex',
  flexWrap: 'wrap',
  justifyContent:'center',
alignContent: 'stretch',
}}>
  {favImgs.map((item) => (
  
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
  );

  //   return (
  //   <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
          
  //     {favImgs.map((item) => (
  //       <Box key={item.imageId}>
  //         <IKImage
  //           urlEndpoint={urlEndpoint}
  //           path={item.url.slice(71)}
  //                 alt="some title"
  //                 lqip={{active:true}}
  //                   loading="lazy"
  //           style={{
  //             width:"350px", height:"350px",
  //                   boxShadow: '8px 9px 19px 3px rgba(0,0,0,0.62)',
  //                   margin: '10px',
  //             border: '3px solid black',
  //                   objectFit:"cover"
  //                 }}
  //               />
                
  //      </Box>
  // ))}
  // </Box>
  //   );
}

export default Favorites;