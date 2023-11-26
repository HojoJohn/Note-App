import React, { useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './AddNote.css';

function AddNote() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const modules = {
        toolbar: [
            [{ 'font': [] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],

            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction

            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'align': [] }],

            ['clean'],                                        // remove formatting button

            ['link', 'image', 'video']                        // link and image, video
        ]
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Sending data as JSON
            const noteData = {
                title: title,
                content: content,
                // Optional: Add Base64 encoded image string here if needed
            };

            await axios.post('/.netlify/functions/createNote', noteData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            setTitle('');
            setContent('');
        } catch (error) {
            console.error('Error adding note:', error);
        }
    };

    return (
        <div className="add-note-container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <ReactQuill 
                        value={content} 
                        onChange={setContent} 
                        modules={modules} 
                    />
                </div>
                <button type="submit">Add Note</button>
            </form>
        </div>
    );
}

export default AddNote;
