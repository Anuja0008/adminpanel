import React, { useState } from 'react';
import { Navigate,  } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import './login.css'; // Import the CSS file

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [redirect, setRedirect] = useState(false);

    const db = getFirestore(); // Initialize Firestore

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isSigningIn) { 
            setIsSigningIn(true);
            try {
                const userRef = doc(db, 'admin', 'login');
                const docSnap = await getDoc(userRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    // Check if email and password match
                    if (data.e_mail === email && data.pass === password) {
                        setRedirect(true); // Set redirect state to true on successful login
                    } else {
                        setErrorMessage('Invalid email or password.');
                    }
                } else {
                    setErrorMessage('No user data found.');
                }
            } catch (error) {
                setErrorMessage('Failed to sign in. Please try again.');
            } finally {
                setIsSigningIn(false);
            }
        }
    };

    if (redirect) {
        return <Navigate to='/home' replace />;
    }

    return (
        <div className="login-container">
            <main className="login-main">
                <div className="login-card">
                    <div className="login-header">
                        <h3 className="login-title">
                            <span className="login-title-part">KDU_</span>
                            <span className="login-title-green">g</span>
                            <span className="login-title-orange">o</span>
                        </h3>
                    </div>
                    <form onSubmit={onSubmit} className="login-form">
                        <div>
                           <label className="login-label">Email</label>
                            <input
                                type="email"
                                autoComplete='email'
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="login-input"
                            />
                        </div>

                        <div>
                            <label className="login-label">Password</label>
                            <input
                                type="password"
                                autoComplete='current-password'
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="login-input"
                            />
                        </div>

                        {errorMessage && (
                            <span className='login-error'>{errorMessage}</span>
                        )}

                        <button
                            type="submit"
                            disabled={isSigningIn}
                            className={`login-submit-btn ${isSigningIn ? 'disabled' : 'active'}`}
                        >
                            {isSigningIn ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                    {/* <p className="login-signup-text">
                        Don't have an account? <Link to='' className="login-signup-link">Sign up</Link>
                    </p> */}
                </div>
            </main>
        </div>
    );
};

export default Login;



// this code for login with google sign in


/*


import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../../../firebase/auth';
import { useAuth } from '../../../contexts/authContext';
import './login.css'; // Import the CSS file

const Login = () => {
    const { userLoggedIn } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isSigningIn) { 
            setIsSigningIn(true);
            try {
                await doSignInWithEmailAndPassword(email, password);
            } catch (error) {
                setErrorMessage('Failed to sign in. Please check your credentials.');
            } finally {
                setIsSigningIn(false);
            }
        }
    };

    const onGoogleSignIn = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            try {
                await doSignInWithGoogle();
            } catch (error) {
                setErrorMessage('Failed to sign in with Google. Please try again.');
            } finally {
                setIsSigningIn(false);
            }
        }
    };

    return (
        <div className="login-container">
            {userLoggedIn && (<Navigate to='/home' replace />)}

            <main className="login-main">
                <div className="login-card">
                    <div className="login-header">
                        <h3 className="login-title">
                            <span className="login-title-part">KDU_</span>
                            <span className="login-title-green">g</span>
                            <span className="login-title-orange">o</span>
                        </h3>
                    </div>
                    <form onSubmit={onSubmit} className="login-form">
                        <div>
                           <label className="login-label">Email</label>
                            <input
                                type="email"
                                autoComplete='email'
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="login-input"
                            />
                        </div>

                        <div>
                            <label className="login-label">Password</label>
                            <input
                                type="password"
                                autoComplete='current-password'
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="login-input"
                            />
                        </div>

                        {errorMessage && (
                            <span className='login-error'>{errorMessage}</span>
                        )}

                        <button
                            type="submit"
                            disabled={isSigningIn}
                            className={`login-submit-btn ${isSigningIn ? 'disabled' : 'active'}`}
                        >
                            {isSigningIn ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                    <p className="login-signup-text">
                        Don't have an account? <Link to='/register' className="login-signup-link">Sign up</Link>
                    </p>
                    <div className='login-divider'>
                        <div className='login-divider-line'></div>
                        <div className='login-divider-text'>OR</div>
                        <div className='login-divider-line'></div>
                    </div>
                    <button
                        disabled={isSigningIn}
                        onClick={onGoogleSignIn}
                        className={`login-google-btn ${isSigningIn ? 'disabled' : 'active'}`}
                    >
                        <svg className="login-google-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_17_40)">
                                <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4" />
                                <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853" />
                                <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z" fill="#FBBC04" />
                                <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335" />
                            </g>
                            <defs>
                                <clipPath id="clip0_17_40">
                                    <rect width="48" height="48" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                        {isSigningIn ? 'Signing In...' : 'Continue with Google'}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Login;

*/
