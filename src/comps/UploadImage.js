import React, { useState } from "react";
import ProgressBar from "./ProgressBar";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import classes from "./UploadForm.module.css";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const allowedTypes = ['image/png', 'image/jpeg'];
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  
const UploadImage = () => {
    const [file, setFile] = useState(null);
    const [imageTitle, setImageTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [message, setMessage] = useState(null);
    const [open, setOpen] = useState(false);

    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpen(false);
    };

    const saveImageHandler =  (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setImageTitle(data.get('imageTitle'));
        setDescription(data.get('description'));
    };
    
    
    const changeHandler = (event) => {
        let selected = event.target.files[0];

        if (selected && allowedTypes.includes(selected.type))
        {
            setFile(selected);
        }
        else {
            setFile(null);
            setMessage("Please use png/jpeg image file.");
            setOpen(true);
        }   
    };

    return (
        
        <Box sx={{
            display: 'flex',
            flexDirection:"row",
            flexWrap: 'wrap',
            justifyContent: 'center',
            padding: 2,
            height:800
        }}>
            {message && <Snackbar
        anchorOrigin={{ vertical:'top', horizontal:'center' }} 
        open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity='warning' sx={{ width: '100%' }}>
          {message}
        </Alert>
            </Snackbar>}
            
            <Box sx={{
                bgcolor: "#2d3436",
                padding: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems:"center",
                maxHeight: 600,
                marginRight:2
            }}>
                <Box>
                <input type="file"
                    onChange={changeHandler}
                    name="imageFile"
                    id="imageFile"
                    className={classes.inputfile} />
                <label htmlFor="imageFile">
                <FileUploadIcon sx={{
                width: 100,
                height:100
                }}/>
                <h1>Upload an Image.</h1>
                </label>
                </Box>
                <Box>
                    
                    {file && <h1 style={{
                        fontSize: '2vw',
                        textAlign: "center",
                        color: "white",
                        fontWeight: "bold",
                        padding:"20px 0px"
                    }}>{file.name}</h1>}
                    {(file && imageTitle && description) && <ProgressBar
                        file={file}
                        imageTitle={imageTitle}
                        description={description} />}
                </Box>
            </Box>
            <Box component="form" onSubmit={saveImageHandler} sx={{
                bgcolor: "#2d3436",
                padding: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent:"center",
                maxHeight: 600,
                marginRight: 2,
            }}>
               
                <Input id="imageTitle"
                    name="imageTitle"
                    placeholder="Image Title"
                    fullWidth
                    sx={{
                        fontSize: 40,
                        fontWeight:700,
                                marginTop:4
                    }} />
                <Input id="description"
                    name="description"
                    placeholder="Description"
                    multiline
                    fullWidth
                    sx={{
                                fontSize: 20,
                                marginTop:4
                    }} />
                <Box sx={{
                    textAlign: "center",
                margin:3}}>
                <Button type="submit" variant="contained" sx={{
                        fontSize: 20,
                    padding:"10px 30px"
                 }}
        >
            Save
        </Button>
                </Box> 
            </Box>
            </Box>
    );
};

export default UploadImage;