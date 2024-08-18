import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/users/');
            setUsers(response.data);
        } catch (error) {
            console.error("There was an error fetching the users!", error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isEditing) {
            handleUpdate();
        } else {
            handleCreate();
        }
    };

    const handleCreate = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/users/', formData);
            setUsers([...users, response.data]);
            toast.success("User created successfully!");
            setFormData({ first_name: '', last_name: '', email: '' });
        } catch (error) {
            toast.error("There was an error creating the user.");
        }
    };

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/users/${currentUserId}/`, formData);
            setUsers(users.map(user => (user.id === currentUserId ? response.data : user)));
            toast.success("User updated successfully!");
            setFormData({ first_name: '', last_name: '', email: '' });
            setIsEditing(false);
            setCurrentUserId(null);
        } catch (error) {
            toast.error("There was an error updating the user.");
        }
    };

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/users/${id}/`);
            setUsers(users.filter(user => user.id !== id));
            toast.success("User deleted successfully!");
        } catch (error) {
            toast.error("There was an error deleting the user.");
        }
    };

    const handleEdit = (user) => {
        setFormData({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email
        });
        setIsEditing(true);
        setCurrentUserId(user.id);
    };

    return (
        <div className="appPadding">
            <h1>User CRUD App</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <button type="submit">{isEditing ? 'Update User' : 'Create User'}</button>
            </form>
            <div className="grid">
                {users.map(user => (
                    <div className="card" key={user.id}>
                        <h2>{user.first_name} {user.last_name}</h2>
                        <p>{user.email}</p>
                        <button onClick={() => handleEdit(user)} className='editButton'>Edit</button>
                        <button onClick={() => handleDelete(user.id)} className='deleteButton'>Delete</button>
                    </div>
                ))}
            </div>
            <ToastContainer />
        </div>
    );
}

export default App;
