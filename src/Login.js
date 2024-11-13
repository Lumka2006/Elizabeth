import React, { useState } from 'react';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState(''); // For login username
    const [password, setPassword] = useState(''); // For login password
    const [newUsername, setNewUsername] = useState(''); // For sign-up username
    const [newPassword, setNewPassword] = useState(''); // For sign-up password
    const [isSignUp, setIsSignUp] = useState(false); // Switch between login and sign-up
    const [errorMessage, setErrorMessage] = useState(''); // Store any errors

    // Handle login submission
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/users');
            const users = await response.json();

            const user = users.find((u) => u.username === username && u.password === password);

            if (user) {
                localStorage.setItem('loggedIn', 'true');
                onLogin(); // Trigger onLogin callback to change state
            } else {
                setErrorMessage('Invalid username or password.');
            }
        } catch (error) {
            setErrorMessage('Error during login.');
            console.error(error);
        }
    };

    // Handle sign-up submission
    const handleSignUp = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: newUsername, password: newPassword }),
            });

            if (response.ok) {
                alert('Sign-up successful! You can now log in.');
                setIsSignUp(false); // Switch to login mode
            } else {
                setErrorMessage('Error during sign-up.');
            }
        } catch (error) {
            setErrorMessage('Error during sign-up.');
            console.error(error);
        }
    };

    return (
        <div>
            <h1>{isSignUp ? 'Sign Up' : 'Login'} to Wings Cafe Inventory System</h1>
            {isSignUp ? (
                <form onSubmit={handleSignUp}>
                    <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="New Username"
                        required
                    />
                    <br />
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New Password"
                        required
                    />
                    <br />
                    <button type="submit">Sign Up</button>
                    <p className="error">{errorMessage}</p>
                </form>
            ) : (
                <form onSubmit={handleLogin}>
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
                    <button type="submit">Login</button>
                    <p className="error">{errorMessage}</p>
                </form>
            )}
            <button onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? 'Already a user? Log in here' : 'New user? Sign Up here'}
            </button>
        </div>
    );
};

export default Login;
