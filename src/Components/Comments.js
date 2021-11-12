import { useContext } from "react";
import { useParams } from "react-router";
import AuthContext from "../Store/AuthContext";
import { doc,collection,query,onSnapshot,setDoc } from "@firebase/firestore";
import { projectFireStore } from "../firebase/Config";
import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import { Input } from "@mui/material";
import { useNavigate } from "react-router";

const Comments = () => {
  const params = useParams();
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const commentHandler = (event) => {
        event.preventDefault();
        if (authCtx.user)
        {

          const commentRef = doc(collection(projectFireStore, 'commentSection',`${params.imageId}Comments`,'comments'));
          const data = new FormData(event.currentTarget);
          const enteredComment = data.get('comment');
         
          (async () => {
            await setDoc(commentRef, {
              userName: authCtx.user.displayName,
              comment:enteredComment
            });
        })();
        }
        else {
          navigate("/authentication");
        }
    };
    
    const [comments, setComments] = useState([]);
    
  useEffect(() => {
    const commentRef = query(collection(projectFireStore, 'commentSection', `${params.imageId}Comments`, 'comments'));
    const unsub = onSnapshot(commentRef, (doc) => {
      let documents = [];
            doc.forEach(element => {
                documents.push({...element.data(),id:element.id})
            });
            setComments(documents);
    });
    return () => unsub();
  }, [params.imageId]);
    
  return (
      
        <Box sx={{
            display: 'flex',
            flexDirection:'column',
            justifyContent:"center",
            bgcolor: "#535c68",
            color:"white",
            p: 2,
    marginTop: 3,
    borderRadius:"10px",
            boxShadow:"5px 10px 5px 1px #2f3640"
  }}>
    <Box sx={{
      bgcolor: "#34495e",
      padding: 2,
      boxShadow:"5px 5px 5px 1px #2c3e50"
    }}>
            <form style={{
                display: "flex",
                justifyContent:'flex-start'
            }} onSubmit={commentHandler}>
      <Input
        margin="dense"
        required
        sx={{width:600,marginRight:2}}
        id="comment"
        label="Add Comment"
        name="comment"
        />
        <button>Comment</button>
      </form>
      </Box>
      <ul style={{marginTop:"20px"}}>
      {comments && comments.map((item) => (
        <Box key={item.id} sx={{
          bgcolor: "#34495e",
          padding: '1vh',
          margin: '1vh',
          boxShadow: "2px 2px 5px 1px #2c3e50",
        }}>
          <li key={item.id} style={{margin:"10px",fontSize:"2.5vh"}}>
            <span style={{marginRight:"8px" ,color:"#95a5a6"}}>{item.userName}</span>
            <span>{item.comment}</span>
          </li>
          </Box>)
        )}
            </ul>
            
        </Box>
    );  
};


export default Comments;