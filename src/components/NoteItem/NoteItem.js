import React from 'react';
import PropTypes from 'prop-types';
import './NoteItem.css';

function truncateHtmlContent(htmlContent, maxLength) {
    const div = document.createElement('div');
    div.innerHTML = htmlContent;
    const textContent = div.textContent || div.innerText || "";
    return textContent.length > maxLength ? textContent.substring(0, maxLength) + '...' : textContent;
}

function NoteItem({ note, onEdit, onDelete }) {
    const truncatedContent = truncateHtmlContent(note.content, 100); // Truncate to 100 characters

    return (
        <div className="note-item">
            <h3 className="note-title">{note.title}</h3>
            <p className="note-content">{truncatedContent}</p>
            {note.imageBase64 && (
                <img src={`data:image/jpeg;base64,${note.imageBase64}`} alt={note.title} className="note-image" />
            )}
            <div className="note-actions">
                <button onClick={() => onEdit(note._id)}>Edit</button>
                <button onClick={() => onDelete(note._id)}>Delete</button>
            </div>
        </div>
    );
}

NoteItem.propTypes = {
    note: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        imageBase64: PropTypes.string // imageBase64 is optional
    }).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};

export default NoteItem;
