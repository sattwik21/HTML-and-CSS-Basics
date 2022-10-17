import React, { useContext, useEffect, useRef,useState } from 'react'
import { useNavigate } from 'react-router-dom';
import noteContext from '../context/noteContext';
import Addnote from './Addnote';
import NoteItems from './Noteitems';

const Notes = (props) => {
    const context = useContext(noteContext);
    let history= useNavigate();
    const { notes, getNotes,editNote } = context;
    useEffect(() => {
        if(localStorage.getItem('token')){

            getNotes()
            console.log(localStorage.getItem('token'))
        }
        else{
            history.push("/login");
        }
    }, [])
    const ref = useRef(null)
    const refclose = useRef(null)
    const [note, setNote] = useState({id:"",etitle: "", edescrpition: "", etag:""});

    const updateNote = (currentnote) => {
        ref.current.click();
        setNote ({id: currentnote._id, etitle: currentnote.title, edescrpition: currentnote.descrpition, etag: currentnote.tag})
       
    }
    const handleClick = (e)=>{
       
        editNote(note.id, note.etitle,note.edescrpition,note.etag)
        refclose.current.click();
        props.showAlert("updated successfully", "success");
        
    }
    const onChange= (e)=>{
    setNote({ ...note, [e.target.name]:e.target.value})
    }
    return (
        <>
            <Addnote  showAlert={props.showAlert}/>
            <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="etitle" name="etitle" value={note.title} aria-describedby="emailHelp" onChange={onChange} minLength={5} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="descrpition" className="form-label">Description</label>
                                    <input type="text" className="form-control" id="edescrpition" name="edescrpition" value={note.descrpition} onChange={onChange} minLength={5} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="tag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" id="etag" name="etag" value={note.tag} onChange={onChange} minLength={5} required />
                                </div>

                                
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button ref ={refclose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button  type="button" onClick={handleClick} className="btn btn-primary">update Note</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row my-3">
                <h2>your Notes</h2>
                <div className="container">
                {notes.length===0 && 'No notes to display'}
                </div>
                {notes.map((note) => {
                    return <NoteItems key={note._id} updateNote={updateNote} showAlert={props.showAlert} note={note} />
                })}
            </div>
        </>

    )
}

export default Notes
