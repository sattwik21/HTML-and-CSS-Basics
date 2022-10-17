import React,{useContext, useState} from 'react'

import noteContext from '../context/noteContext';

const Addnote = (props) => {
    const context = useContext(noteContext);
    const{addNote} = context;

    const [note, setNote] = useState({title: "", descrpition: "", tag:""});


    const handleClick = (e)=>{
        e.preventDefault();
        addNote(note.title, note.descrpition, note.tag);
        setNote({title: "", descrpition: "", tag:""})
        props.showAlert("added successfully", "success");
    }
    const onChange= (e)=>{
    setNote({ ...note, [e.target.name]:e.target.value})
    }
    return (
        <div>
            <div className="container my-3">
                <h2>Add a note</h2>
                <form>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input type="text" className="form-control" id="title" name="title" aria-describedby="emailHelp" value={note.title} onChange={onChange} minLength={5} required/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="descrpition" className="form-label">Description</label>
                        <input type="text" className="form-control" id="descrpition" name="descrpition" value={note.descrpition} onChange={onChange} minLength={5} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="tag" className="form-label">Tag</label>
                        <input type="text" className="form-control" id="tag" name="tag" value={note.tag} onChange={onChange} minLength={5} required />
                    </div>
                    
                    <button disabled={note.title.length<5 || note.descrpition.length<5} type="submit" className="btn btn-primary" onClick={handleClick}>Add Note</button>
                </form>
            </div>
        </div>
    )
}

export default Addnote
