import Note from './Note';
import AddNote from './AddNote'
import { GridLoader } from 'react-spinners';

const NotesList = ({ loadingStatus, errorStatus, keyValue, notes, handleAddNote, handleDeleteNote}) => {
    return (
        <div key = {keyValue}>
            { loadingStatus ||  errorStatus ? 
                <div className = 'loading'>
                    <GridLoader color={'#bbbbbb'} loading = {true} size = {30} />
                    { errorStatus ? <div></div> : <div></div> }
                </div>
                :
                <div className = "notes-list" >
                    { notes.map((note)=> (
                        <Note 
                            key={note.id}       // repeteitive to bypass error
                            id = {note.id} 
                            header = {note.header}
                            text = {note.text} 
                            date = {note.date}
                            handleDeleteNote = {handleDeleteNote}
                        />
                    ))}
                    <AddNote handleAddNote = {handleAddNote}/>
                </div>
            }
        </div>
    );
};

export default NotesList;