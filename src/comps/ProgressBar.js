import React,{useEffect, useState} from "react";
import useStorage from "../hooks/useStorage";
import Box from '@mui/material/Box';
import Progress from "@material-tailwind/react/Progress";
import { collection,serverTimestamp,addDoc,updateDoc,doc,arrayUnion } from "firebase/firestore";
import { projectFireStore } from "../firebase/Config";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router";


const ProgressBar = ({ file, imageTitle, description }) => {

    const navigate = useNavigate();
    const { url, progress } = useStorage(file);
    const [imageId, setImageId] = useState(null);
    const auth = getAuth();
    const user = auth.currentUser;
    
    useEffect(() => {
        if (url)
        {
            if(!imageId)
            (async () => {
                const image = await addDoc(collection(projectFireStore,'images'), {
                    url,
                    createdAt: serverTimestamp(),
                    imageTitle,
                    description,
                    uploaderId: user.uid,
                    creator:user.displayName,
                    likes:0
                });
                setImageId(image.id);
            })();

            if(imageId)
            (async () => {
                const userRef = doc(projectFireStore, 'users', `${user.uid}`);
                await updateDoc(userRef, {
                    uploadedImages: arrayUnion({imageId,url})
                });
                navigate('/', { replace: "true" });
            })();
        }
               
    }, [url,imageTitle,description,user,navigate,imageId]);
    
    return (
        <Box sx={{ width: '100%' }}>
            <Progress color="lightBlue" value={progress} percentage={false} />
        </Box>
    );
};


export default ProgressBar;