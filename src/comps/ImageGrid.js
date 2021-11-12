import React, { useEffect, useState } from "react";
import useFireStore from "../hooks/useFireStore";
import Box from '@mui/material/Box';
import { Link } from "react-router-dom";
import { projectFireStore } from "../firebase/Config";
import { query, collection, orderBy, startAfter, limit } from "@firebase/firestore";
import Button from '@mui/material/Button';
import { IKImage } from 'imagekitio-react';
import { motion } from "framer-motion";
import classes from './ImgeGrid.module.css';
import Skeleton from '@mui/material/Skeleton';

const skeleton = [1,2,3,4,5,6,7,8,9,10,11,12];


const ImageGrid = () => {
  const [docs, setDocs] = useState([]);
  const [butotnDisable, setButtonDisable] = useState(false);
  const urlEndpoint = 'https://ik.imagekit.io/imageDash001/';
  
  const [q, setQ] = useState(query(collection(projectFireStore, 'images'),
    orderBy('createdAt', 'desc'), limit(12)));

  
  let { docs: documents, docSnap } = useFireStore(q);
 
  const loadImageHandler = () => {
    if (docSnap.docs.length < 12) {
      setButtonDisable(true);
    }
    else {
      
    const last = docSnap.docs[docSnap.docs.length - 1];

    if (last)
    {
      const next = query(collection(projectFireStore, 'images'),
      orderBy('createdAt', 'desc'),
      startAfter(last)
      , limit(12));
      setQ(next);
    }
    }
  };

  
  useEffect(() => {
    if(documents)
      setDocs(prevDocs => prevDocs.concat(documents));
  }, [documents]);

  if (docs.length === 0)
    return (<Box m='auto' sx={{ width: '100%', height: 'auto' }}>
       <Box sx={{
              display: 'flex',
            flexWrap: 'wrap',
            justifyContent:'center',
          alignContent: 'stretch',
      }}>
       
          {skeleton.map(item=> <Box key={item} sx={{
                margin: 2,
          }}>
             <Skeleton variant="rectangular" animation="wave" width={300} height={300} />
        </Box>)}
              
      </Box>
    </Box>);
  
  return (
      <Box m='auto' sx={{ width: '100%', height: 'auto'}}>
            <Box sx={{
              display: 'flex',
            flexWrap: 'wrap',
            justifyContent:'center',
          alignContent: 'stretch',
      }}>
            {docs && docs.map((item) => (
            
              <Box key={item.id} sx={{
                margin: 2,
                border: '5px solid black',
              }}>
                <Link to={`/images/${item.id}`}>
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
                    <motion.div className={classes.overlay}>{item.imageTitle}</motion.div>
                    </motion.div>
                </Link>
            </Box>
        ))}
        </Box>
        <Box sx={{
          padidng: 2,
          bgcolor: "#34495e",
          margin:2,
          textAlign:"center"
        }}>
        <Button disabled={butotnDisable} variant="contained" onClick={loadImageHandler}>Load more</Button>
        </Box>
      </Box>
    );
};


export default ImageGrid;