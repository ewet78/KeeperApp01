import React, { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import Zoom from '@mui/material/Zoom';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function CreateArea(props) {

    const [isExpanded, setExpanded] = useState(false);

    const [note, setNote] = useState({
        title: "",
        content: "",
        _id: "",
    });

    function handleChange(event) {
        const {name, value} = event.target;

        setNote(prevNote => {
            return {
                ...prevNote,
                [name]: value
            };
        });
    }

    function submitNote(event) {
               
        const data = {
            email: props.userData.email,
            title: note.title,
            content: note.content
        };

        fetch("http://localhost:4000/addnote", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          "Accept":"application/json",
          "Access-Control-Allow-Origin":"*",
        },
        body:JSON.stringify(data),
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data, "addedNote");
            note._id = data.notesId;
            props.onAdd(note);
            toast.success("Note added");
    
        if ("error") {
          toast.error(data.error);
        }
        });


        setNote({
            title: "",
            content: "",
            _id: "",
        });
        event.preventDefault();
    }

    function expand() {
        setExpanded(true);
    }

    return (
        <div>
        <ToastContainer />
        <form className="create-note">
            {isExpanded && (<input name="title" onChange={handleChange} value={note.title} placeholder="Title" />)}
            <textarea 
                name="content" 
                onClick={expand} 
                onChange={handleChange} 
                value={note.content} 
                placeholder="Take a note..." 
                rows={isExpanded ? 3 : 1}
             />
            <Zoom in={isExpanded}><Fab onClick={submitNote}><AddIcon /></Fab></Zoom>
        </form>
        </div>
    );
}

export default CreateArea;
