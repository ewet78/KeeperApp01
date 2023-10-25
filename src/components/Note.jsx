import React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Note(props) {
    
    async function handleClick() {
        
       const data = {
            email: props.userData.email,
            title: props.title,
            content: props.content,
            notesId: props.id,
        };
        
        fetch(`http://localhost:4000/deletenote/${data.notesId}`, {
        method: "DELETE",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          "Accept":"application/json",
          "Access-Control-Allow-Origin":"*",
        },
        body: JSON.stringify({ email: data.email }),
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data, "deletedNote");    
            if (data.status === "ok") {
                props.onDelete(props.deleteKey);
                toast.info("Note deleted");
            } else {
                toast.error(data.error);
            }
        });

    }

    return (
        <div className="note">
            <ToastContainer />
            <h1>{props.title}</h1>
            <p>{props.content}</p>
            <button id="deleteButton" onClick={handleClick}><DeleteIcon /></button>
        </div>
    );
}

export default Note;