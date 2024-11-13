import React, { useState, useEffect } from 'react';

const UserManagement = ({ setShowDashboard }) => {
    const [users, setUsers] = useState([]); // State to store users
    const [username, setUsername] = useState(''); // State for storing username input
    const [password, setPassword] = useState(''); // State for storing password input
    const [editingUserName, setEditingUserName] = useState(null); // State to track which user is being edited
    const [message, setMessage] = useState(''); // State to store feedback messages

    useEffect(() => {
        // Check if the user is logged in before loading users
        const loggedIn = localStorage.getItem('loggedIn');
        if (loggedIn !== 'true') {
            alert('You need to log in first.');
            setShowDashboard(false); // Redirect to login page if not logged in
        } else {
            loadUsers(); // Load users if logged in
        }
    }, [setShowDashboard]);

    const loadUsers = async () => {
        // Fetch users from the backend
        try {
            const response = await fetch('http://localhost:5000/api/users');
            if (!response.ok) throw new Error('Failed to load users.');
            const data = await response.json();
            setUsers(data); // Set users in state
        } catch (error) {
            console.error(error);
            setMessage('Error loading users.'); // Show error message if fetching fails
        }
    };

    const saveUser = async (e) => {
        // Handle saving or updating a user
        e.preventDefault();
        if (!username || !password) {
            alert('Please fill out all fields.'); // Ensure both fields are filled
            return;
        }

        try {
            const user = { username, password };
            const response = editingUserName
                ? await fetch(`http://localhost:5000/api/users/${editingUserName}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(user),
                  })
                : await fetch('http://localhost:5000/api/users', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(user),
                  });

            if (!response.ok) throw new Error('Failed to save user.'); // Handle error if saving fails
            setMessage(editingUserName ? 'User updated successfully!' : 'User added successfully!'); // Show success message
            loadUsers(); // Reload users list
            clearForm(); // Reset form fields
            setTimeout(() => setMessage(''), 3000); // Clear success message after 3 seconds
        } catch (error) {
            console.error(error);
            setMessage('Error saving user.'); // Show error message if saving fails
        }
    };

    const editUser = (username) => {
        console.log("Edit button clicked for user:", username); // Debug log
        // Set form fields to the user data for editing
        const user = users.find((u) => u.username === username);
        if (user) {
            setUsername(user.username);
            setPassword(user.password);
            setEditingUserName(username); // Set the user currently being edited
        }
    };

    const deleteUser = async (username) => {
        console.log("Delete button clicked for user:", username); // Debug log
        // Handle deleting a user
        try {
            const response = await fetch(`http://localhost:5000/api/users/${username}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete user.');
            setMessage('User deleted successfully!'); // Show success message
            loadUsers(); // Reload users list
            setTimeout(() => setMessage(''), 3000); // Clear success message after 3 seconds
        } catch (error) {
            console.error(error);
            setMessage('Error deleting user.'); // Show error message if deleting fails
        }
    };

    const clearForm = () => {
        // Reset the form fields after saving or canceling
        setUsername('');
        setPassword('');
        setEditingUserName(null); // Reset the editing state
    };

    return (
        <div>
            <header>
                <h1>Wings Cafe Inventory System</h1>
            </header>
            <h1>User Management</h1>

            <form id="userForm" onSubmit={saveUser}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                <br />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <br />
                <button type="submit">{editingUserName ? 'Update User' : 'Save User'}</button>
                {message && <p>{message}</p>} {/* Display message */}
            </form>

            <h2>User List</h2>
            <table id="userTable">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.username}>
                            <td>{user.username}</td>
                            <td className="action-buttons">
                                <button onClick={() => editUser(user.username)}>Edit</button>
                                <button onClick={() => deleteUser(user.username)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;
