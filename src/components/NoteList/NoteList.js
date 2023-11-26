import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NoteItem from '../NoteItem/NoteItem';
import Loader from '../Loader/Loader';
import './NoteList.css';

function NoteList() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await axios.get('/.netlify/functions/getNotes');
                setNotes(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, []);

    const handleEdit = (id) => {
        navigate(`/edit-note/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this note?")) {
            setLoading(true);
            try {
                await axios.delete(`/.netlify/functions/deleteNote/${id}`);
                setNotes(notes.filter(note => note._id !== id));
            } catch (err) {
                setError('Error deleting note: ' + err.message);
                console.error('Error deleting note:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) return <Loader />;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="note-list">
            {notes.map((note) => (
                <NoteItem
                    key={note._id}
                    note={note}
                    onEdit={() => handleEdit(note._id)}
                    onDelete={() => handleDelete(note._id)}
                />
            ))}
        </div>
    );
}

export default NoteList;
