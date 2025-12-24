import React, { useState } from "react";
import VenueDataService from "../services/VenueDataService";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await VenueDataService.login({ email, password });
            if (response.data.token) {
                localStorage.setItem("user", JSON.stringify(response.data));
                if (response.data.role === "admin") {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            }
        } catch (error) {
            setMessage("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
        }
    };

    return (
        <>
            <Header headerText="Giriş Yap" />
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <h2 className="text-center mt-5 mb-3">Giriş Yap</h2>
                        {message && <div className="alert alert-danger">{message}</div>}
                        <form onSubmit={handleLogin}>
                            <div className="form-group mb-3">
                                <label>E-posta</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label>Şifre</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Giriş Yap</button>
                        </form>
                        <div className="text-center mt-3">
                            <p>Hesabınız yok mu? <a href="/register">Kayıt Ol</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
