import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import { useParams, useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import './EditNote.css';

function EditNote() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    const { id: noteId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await axios.get(`/.netlify/functions/getNote/${noteId}`);
                if(response.data) {
                    setTitle(response.data.title || '');
                    setContent(response.data.content || '');
                } else {
                    setError("Note data is empty");
                }
            } catch (error) {
                setError(`Error fetching note: ${error.message}`);
                console.error('Error fetching note:', error);
            }
        };

        if(noteId) {
            fetchNote();
        } else {
            setError("No note ID provided");
        }
    }, [noteId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const updatedNote = { title, content };
            await axios.put(`/.netlify/functions/updateNote/${noteId}`, updatedNote);
            navigate('/');
        } catch (error) {
            setError(`Error updating note: ${error.message}`);
            console.error('Error updating note:', error);
        }
    };

    if(error) {
        return <div className="error-message">Error: {error}</div>;
    }

    return (
        <div className="edit-note-container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <ReactQuill 
                        value={content}
                        onChange={setContent}
                        // Include the same modules as in AddNote for consistency
                        modules={{
                            toolbar: [
                                [{ 'font': [] }],
                                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                ['bold', 'italic', 'underline', 'strike'],
                                ['blockquote', 'code-block'],
                                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                [{ 'script': 'sub'}, { 'script': 'super' }],
                                [{ 'indent': '-1'}, { 'indent': '+1' }],
                                [{ 'direction': 'rtl' }],
                                [{ 'size': ['small', false, 'large', 'huge'] }],
                                [{ 'color': [] }, { 'background': [] }],
                                [{ 'align': [] }],
                                ['clean'],
                                ['link', 'image', 'video']
                            ]
                        }}
                    />
                </div>
                <button type="submit">Update Note</button>
            </form>
        </div>
    );
}

export default EditNote;
