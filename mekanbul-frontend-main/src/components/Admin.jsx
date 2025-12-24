import React, { useState, useEffect } from "react";
import VenueDataService from "../services/VenueDataService";
import { useNavigate, Link } from "react-router-dom";
import Header from "./Header";

const Admin = () => {
    const [venues, setVenues] = useState([]);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!user || !user.token || user.role !== "admin") {
            navigate("/login");
            return;
        }

        retrieveVenues();

        let timeout;
        const resetTimer = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                localStorage.removeItem("user");
                navigate("/login");
            }, 10000);
        };

        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("keypress", resetTimer);

        resetTimer();

        return () => {
            clearTimeout(timeout);
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keypress", resetTimer);
        };
    }, [navigate]);

    const retrieveVenues = () => {
        VenueDataService.getAllVenues(user.token)
            .then((response) => {
                setVenues(response.data);
            })
            .catch((e) => {
                console.log(e);
                if (e.response && (e.response.status === 401 || e.response.status === 403)) {
                    navigate("/login");
                }
            });
    };

    const deleteVenue = (id) => {
        VenueDataService.removeVenue(id, user.token)
            .then((response) => {
                setVenues(venues.filter(v => v._id !== id));
            })
            .catch((e) => {
                console.log(e);
            });
    };

    return (
        <>
            <Header headerText="Yönetici Paneli" />
            <div className="container mt-5">
                <h2 className="mb-4">Yönetici Paneli</h2>
                <Link to="/admin/add" className="btn btn-success mb-3">Yeni Mekan Ekle</Link>
                <div className="list-group">
                    {venues.map((venue) => (
                        <div key={venue._id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <h5>{venue.name}</h5>
                                <p>{venue.address}</p>
                            </div>
                            <div>
                                <Link to={`/admin/update/${venue._id}`} className="btn btn-warning me-2">Güncelle</Link>
                                <button onClick={() => deleteVenue(venue._id)} className="btn btn-danger">Sil</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Admin;
