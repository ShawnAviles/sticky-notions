import { MdDeleteForever } from 'react-icons/md';

const Note = ({ id, header, text, date, handleDeleteNote }) => {
    let idValue = id;
    return (
        <div className = 'note'>
            <div className = "note-header">{header}</div>
            <span>{text}</span>
            <div className = "note-footer">
                <small>{date}</small>
                <MdDeleteForever 
                    onClick = {() => handleDeleteNote(idValue)} 
                    className = 'delete-icon' 
                    size='1.3em' 
                />
            </div>
        </div>
    );
};

export default Note;