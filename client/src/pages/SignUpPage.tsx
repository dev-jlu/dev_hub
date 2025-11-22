import { useMutation } from "@apollo/client/react";
import { useState, type FormEvent } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { REGISTER } from "../graphql/mutations";
import { setUser } from "../app/slices/userSlice";
import type { RegisterMutation, RegisterMutationVariables } from "../graphql/types";
import styles from '../styles/SignupPage.module.css';

const SignupPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [register, { loading, error }] = useMutation<RegisterMutation, RegisterMutationVariables>(REGISTER);
    const [errors, setErrors] = useState<string[]>([]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrors([]);

        if (password !== passwordConfirmation) {
            setErrors(["Password and confirmation do not match."]);
            return;
        }

        try {
            const { data } = await register({
                variables: {
                    name,
                    email,
                    password,
                    passwordConfirmation
                }
            });

            if (data?.createUser.user) {
                dispatch(setUser(data.createUser.user));
                localStorage.setItem("user", JSON.stringify(data.createUser.user));
                navigate("/dashboard"); // Redirect upon successful registration
                
            } else {
                setErrors(data?.createUser.errors ?? ["Registration failed due to unknown error."]);
            }
        } catch(err) {
            console.error(err);
            setErrors(["An unexpected error occurred during registration."]);
        }
    }

    return (
        <div className={styles.signupContainer}>
            <div className={styles.signupCard}>
                <h2 className={styles.title}>Create Your Account</h2>
                <p className={styles.subtitle}>Get started with a simple registration</p>

                <form className={styles.signupForm} onSubmit={handleSubmit}>
                    
                    {/* Name Input */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="name" className={styles.label}>Full Name</label>
                        <input 
                            className={styles.input}
                            type="text" 
                            placeholder="Jane Doe" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                        />
                    </div>
                    
                    {/* Email Input */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>Email Address</label>
                        <input 
                            className={styles.input}
                            type="email" 
                            placeholder="youremail@example.com" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    
                    {/* Password Input */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>Password</label>
                        <input 
                            className={styles.input}
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>

                    {/* Password Confirmation Input */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="password-confirm" className={styles.label}>Confirm Password</label>
                        <input 
                            className={styles.input}
                            type="password"
                            placeholder="********"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            required 
                        />
                    </div>

                    <button type="submit" disabled={loading} className={styles.submitButton}>
                        {loading ? "Registering..." : "Sign Up"}
                    </button>

                    <div className={styles.footerLink}>
                        <p>Already have an account? <Link to="/login" className={styles.link}>Login</Link></p>
                    </div>
                </form>
                
                {/* Global Error (Apollo) */}
                {error && <p className={styles.errorText}>Registration failed</p>}
                
                {/* Specific Errors (Backend/Validation) */}
                { errors.length > 0 && errors.map((error, index) => (
                     <p key={index} className={styles.errorText}>{error}</p>
                ))}
            </div>
        </div>
    );
};

export default SignupPage;