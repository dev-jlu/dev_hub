import { useMutation } from "@apollo/client/react";
import { useState, type FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LOGIN } from "../graphql/mutations";
import { setUser } from "../app/slices/userSlice";
import type { LoginMutation, LoginMutationVariables } from "../graphql/types";

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
        <div>
            <h1>Loggin</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required />
                <input 
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required />
                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
            {error && <p style={{ color: "red" }}>Login failed</p>}
        </div>
    );
};

export default LoginPage;