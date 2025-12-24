import React, { useState } from "react";
import VenueDataService from "../services/VenueDataService";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await VenueDataService.register({ name, email, password });
            navigate("/login");
        } catch (error) {
            console.log(error); // Konsola da detaylı bas
            if (error.response && error.response.data) {
                // Backend'den gelen hata (nested)
                if (error.response.data.error && error.response.data.error.code === 11000) {
                    setMessage("Bu e-posta adresi zaten kullanımda.");
                }
                else if (error.response.data.message) {
                    // Ana mesajı ve varsa detayını göster
                    let detailedMsg = error.response.data.message;
                    if (error.response.data.error && error.response.data.error.message) {
                        detailedMsg += " (" + error.response.data.error.message + ")";
                    }
                    setMessage(detailedMsg);
                }
                else {
                    setMessage("Hata: " + JSON.stringify(error.response.data));
                }
            } else {
                setMessage("Kayıt başarısız. Sunucu hatası veya bağlantı sorunu.");
            }
        }
    };

    return (
        <>
            <Header headerText="Kayıt Ol" />
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <h2 className="text-center mt-5 mb-3">Kayıt Ol</h2>
                        {message && <div className="alert alert-danger">{message}</div>}
                        <form onSubmit={handleRegister}>
                            <div className="form-group mb-3">
                                <label>Ad Soyad</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
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
                            <button type="submit" className="btn btn-primary w-100">Kayıt Ol</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;
