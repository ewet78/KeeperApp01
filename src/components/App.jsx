import React, { useEffect, useState } from "react";
import Header from "./Header";
import Note from "./Note";
import Footer from "./Footer";
import CreateArea from "./CreateArea";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {

    const [ notes, setNotes ] = useState([]);
    const [userData, setUserData] = useState({data: null});
     

    useEffect(() => {
        const fetchData = async () => {
          const token = window.localStorage.getItem("token");
          const userDataResponse = await fetch("http://localhost:4000/app", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ token }),
          });
      
          if (userDataResponse.ok) {
            const userData = await userDataResponse.json();
            setUserData(userData.data);
      
            const notesData = await Promise.all(
              userData.data.notes.map(async (noteId) => {
                const noteResponse = await fetch(`http://localhost:4000/notes/${noteId}`, {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Access-Control-Allow-Origin": "*",
                  },
                });
                if (noteResponse.ok) {
                  return noteResponse.json();
                } else {
                  return { error: "Failed to fetch note" };
                }
              })
            );
            setNotes(notesData);
          } else {
            console.error("Failed to fetch user data");
          }
        };
      
        fetchData();
      }, []);
      

    async function addNote(newNote) { 
        setNotes(prevNotes => {
            return [...prevNotes, newNote];
          });     

      }

      function deleteNote(deleteKey) {
        setNotes(prevNotes => {
          return prevNotes.filter((noteItem, index) => {
            return index !== deleteKey;
          });
        });
      }

    return (
        <div>
            <Header userData={userData} />
            <CreateArea 
                onAdd={addNote}
                userData={userData}
            />
            {notes.map((noteItem, index) => {
                return  (<Note 
                    key={index}
                    deleteKey={index}
                    id={noteItem._id}
                    title={noteItem.title}
                    content={noteItem.content}
                    onDelete={deleteNote}
                    userData={userData}
                />);
            })} 
            <ToastContainer />          
            <Footer /> 
        </div>
    );
    
}

export default App;