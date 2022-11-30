import { useState } from 'react';

const AddNote = ({ handleAddNote }) => {
    const [noteText, setNoteText] = useState('');
    const [noteHeader, setNoteHeader] = useState('');
    const characterLimitText = 200;
    const characterLimitHeader = 30;

    const handleChangeText = (event) => {
        if (characterLimitText - event.target.value.length >= 0) {
            setNoteText(event.target.value);
        }
    }

    const handleChangeHeader = (event) => {
        if (characterLimitHeader - event.target.value.length >= 0) {
            setNoteHeader(event.target.value);
        }
    }

    const handleSaveClick = () => {
        if (noteText.trim().length > 0 && noteHeader.trim().length > 0) {
            handleAddNote(noteText, noteHeader);
            setNoteText('');
            setNoteHeader('');
        }
    }

    return (
        <div className = "note new">
            <textarea className="header-new" 
                rows = "1" 
                cols = "10" 
                placeholder = "Type to add a header..."
                value = {noteHeader}
                onChange = {handleChangeHeader}
            ></textarea>
            <textarea 
                rows = "8" 
                cols = "10" 
                placeholder = "Type to add a note..."
                value = {noteText}
                onChange = {handleChangeText}
            ></textarea>
            <div className = "note-footer">
                <small>{characterLimitText - noteText.length} Remaining</small>
                <button className = "save" onClick={handleSaveClick}>Save</button>
            </div>
        </div>
    );
};

export default AddNote;