import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import AddNote from './components/AddNote/AddNote';
import EditNote from './components/EditNote/EditNote';
import NoteList from './components/NoteList/NoteList';
import Login from './components/Login/Login'; // Assuming you have a Login component
import Footer from './components/Footer/Footer';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'; // A component that protects routes
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <ErrorBoundary>
                    <Routes>
                        <Route path="/" element={<NoteList />} />
                        <Route path="/login" element={<Login />} />
                        <Route element={<ProtectedRoute />}>
                            <Route path="/add-note" element={<AddNote />} />
                            <Route path="/edit-note/:id" element={<EditNote />} />
                        </Route>
                        {/* Add additional routes here */}
                    </Routes>
                </ErrorBoundary>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
