import React, { useEffect, useState,Suspense } from "react";
import Box from '@mui/material/Box';
import {doc,updateDoc,getDoc ,increment,arrayUnion } from "firebase/firestore";
import { projectFireStore } from "../firebase/Config";
import { useContext } from "react";
import AuthContext from "../Store/AuthContext";
import Button from '@mui/material/Button';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useParams } from "react-router-dom";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { IKImage } from "imagekitio-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
const Comments = React.lazy(() => import('../Components/Comments'));

const urlEndpoint = 'https://ik.imagekit.io/imageDash001/';

const ImageDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const [likebuttonDisable, setLikeButtonDisable] = useState(false);
  const [favbuttonDisable, setFavButtonDisable] = useState(false);
  const [uploader, setUploader] = useState('');
  const [uploaderId, setUploaderId] = useState('');
  const [selectedImage, setSelectedImage] = useState();
  const [imageFound, setImageFound] = useState(true);
  const [followDisable, setFollowDisable] = useState(false);
  const [userData, setUserData] = useState(null);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    (async () => {
      const imageRef = doc(projectFireStore, 'images', `${params.imageId}`);
      const imageData = await getDoc(imageRef);
      if (imageData.data()) {
        setSelectedImage(imageData.data());
        setUploader(imageData.data().creator);
        setUploaderId(imageData.data().uploaderId);
        setLikesCount(imageData.data().likes);
      }
      else
        setImageFound(false);
    })();
  }, [params.imageId]);

  useEffect(() => {
    if (authCtx.user)
    {
      const userRef = doc(projectFireStore, 'users', `${authCtx.user.uid}`);

      (async () => {
        const userData = await getDoc(userRef);
        setUserData(userData.data());
      })();
    }
  //   else
  //   {
  //     setLikeButtonDisable(true);
  //     setFavButtonDisable(true);
  //     setFollowDisable(true);
  // }
  }, [authCtx.user]);
  
  useEffect(() => {
     if(selectedImage && authCtx.user) {
        if (selectedImage.uploaderId === authCtx.user.uid)
        {
          setLikeButtonDisable(true);
          setFavButtonDisable(true);
          setFollowDisable(true);
        }
    }
  }, [authCtx.user,selectedImage]);
  
  
  useEffect(() => {
    if (userData && selectedImage) {
      if (userData.liked.includes(params.imageId))
        setLikeButtonDisable(true);
      if (userData.favorites.findIndex(item => item.imageId === params.imageId)!==-1)
        setFavButtonDisable(true);
      if (userData.following.findIndex(item => item.uploaderId === selectedImage.uploaderId)!==-1)
        setFollowDisable(true);
    }
  }, [userData, selectedImage,params.imageId]);
  
const likeHandler = () => {
  if (authCtx.user)
  {
  const userRef = doc(projectFireStore, 'users', `${authCtx.user.uid}`);
  const imageRef = doc(projectFireStore, "images", `${params.imageId}`);
      (async () => {
      await updateDoc(imageRef, {
        likes:increment(1)
      });
      })();

      (async () => {
        await updateDoc(userRef, {
          liked: arrayUnion(params.imageId)
        });
      })();
    setLikeButtonDisable(true);
    setLikesCount(likes => likes + 1);
  }
  else
  {
    navigate("/authentication");
  }
};

    
const handleFavorite = () => {
  if (authCtx.user && selectedImage)
  {
    const userRef = doc(projectFireStore, 'users', `${authCtx.user.uid}`);
  
    (async () => {
      await updateDoc(userRef, {
        favorites: arrayUnion({imageId:params.imageId,url:selectedImage.url})
      });
    })();
    setFavButtonDisable(true);
  }
  else
  {
    navigate("/authentication");
    }
};
  
const followHandler = () => {
  if (authCtx.user)
  {
    const userRef = doc(projectFireStore, 'users', `${authCtx.user.uid}`);
      (async () => {
        await updateDoc(userRef, {
          following: arrayUnion({uploaderId,uploader})
        });
    })();

    const uploaderRef = doc(projectFireStore, 'users', `${uploaderId}`);
    (async () => {
      await updateDoc(uploaderRef, {
        followers: increment(1)
      });
    })();
    
    setFollowDisable(true);
  }
  else
  {
    navigate("/authentication");
    }
};

  if (!selectedImage && imageFound)
    return (<Box sx={{
      height: 400, fontSize: 30, color:'white',fontWeight:'bold',display:'flex',justifyContent:"center",alignItems:"center"
    }}>Loading...</Box>);
  if (!imageFound)
    return (<Box sx={{
      height: 400, fontSize: 40, color:'white',fontWeight:'bold',display:'flex',justifyContent:"center",alignItems:"center"
    }}>No Image Found.</Box>);
  
    return (
        <React.Fragment>
            <Box sx={{
                display: 'flex',
                padding: 1,
                flexDirection:'column',
                width: "98%",
                justifyContent: 'center',
          margin: 'auto',
          bgcolor: "#353b48",
                color:'white'
        }}>
            <Box sx={{
            textAlign: "center",
            marginBottom: 1,
            padding: 1,
            fontWeight:"bold",
            fontSize: "20px",
            bgcolor: "#535c68",
            borderRadius:"10px",
                    boxShadow:"10px 10px 5px 1px #2f3640"
            
          }}>
            <h1>{selectedImage.imageTitle}</h1>
          </Box>
                <Box>
            <IKImage
              urlEndpoint={urlEndpoint}
              path={`${selectedImage.url.slice(71)}`}
              alt="sometitle"
              lqip={{active:true}}
                    loading="lazy"
              style={{
                width: '100%',
                maxWidth:"100%",
                height: "auto",
              }}
                />
          </Box>
          <Box sx={{
            textAlign: "center",
            marginTop:2
          }}>
            <h1>{selectedImage.description}</h1>
          </Box>
                <Box sx={{
                    display: 'grid',
                    gap: 1,
                    marginTop:2,
            gridTemplateColumns: 'repeat(3, 1fr)',
            bgcolor: "#535c68",
            borderRadius:"10px",
                    boxShadow:"10px 10px 5px 1px #2f3640"
                }}>
            
            <Box sx={{
              margin: 'auto', padding: 1,
              width: "100%", display: "flex",flexDirection:"column", alignItems: "center"
            }}>
              <Box><Link to={`/users/${uploaderId}`}> @{uploader} </Link></Box>
              <Button disabled={followDisable} onClick={followHandler}>Follow</Button>
            </Box>
                
                <Box sx={{
                    display: 'flex',
                    margin: 'auto',
                    fontSize:20
                }}>
                    <h6 style={{marginRight:"10px"}}>{likesCount}</h6>
              <button onClick={likeHandler} disabled={likebuttonDisable}>
              { !likebuttonDisable && <FavoriteBorderIcon/>}
                    {likebuttonDisable && <FavoriteIcon/>}</button>
                </Box>
                
                <Box sx={{margin:'auto'}}>
                <Button variant="contained"
                        sx={{ margin:2 }}
                  color="success"
                  disabled={favbuttonDisable}
                  onClick={handleFavorite}
                >Save</Button>
                </Box>
                    
            </Box>
              <Suspense fallback={<Box sx={{textAlign:"center"}}>Loading...</Box>}><Comments/></Suspense>
            </Box>
        </React.Fragment>
    );
}

export default ImageDetails;