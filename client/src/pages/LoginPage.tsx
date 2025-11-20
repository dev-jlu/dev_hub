import { useMutation } from "@apollo/client/react";
import { useState, type FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LOGIN } from "../graphql/mutations";
import { setUser } from "../app/slices/userSlice";
import type { LoginMutation, LoginMutationVariables } from "../graphql/types";
import styles from '../styles/LoginPage.module.css'

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [login, { loading, error }] = useMutation<LoginMutation, LoginMutationVariables>(LOGIN);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await login({
                variables: {
                    email,
                    password
                }
            });

            if (data?.login?.user) {
                dispatch(setUser(data.login.user));
                navigate("/dashboard"); //dashboard redirect
            }
        } catch(err) {
            console.error(err);
        }
    }

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <h2 className={styles.title}>Welcome Back!</h2>
                <p className={styles.title}>Sign in to continue</p>

                <form className={styles.loginForm} onSubmit={handleSubmit}>
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

                    <button type="submit" disabled={loading} className={styles.submitButton}>
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <div className={styles.footerLink}>
                        <a href="/forgot-password">Forgot Password?</a>
                    </div>
                </form>
                {error && <p style={{ color: "red" }}>Login failed</p>}
            </div>
        </div>
    );
};

export default LoginPage;