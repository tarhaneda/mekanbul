import React, { useState } from "react";
import VenueDataService from "../services/VenueDataService";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const AddVenue = () => {
    const initialVenueState = {
        name: "",
        address: "",
        foodanddrink: "",
        lat: "",
        long: "",
        hours: [
            { days: "", open: "", close: "", isClosed: false }
        ]
    };
    const [venue, setVenue] = useState(initialVenueState);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setVenue({ ...venue, [name]: type === 'checkbox' ? checked : value });
    };

    const handleHourChange = (index, event) => {
        const { name, value, type, checked } = event.target;
        const newHours = [...venue.hours];
        newHours[index][name] = type === 'checkbox' ? checked : value;
        setVenue({ ...venue, hours: newHours });
    };

    const addHourSlot = () => {
        setVenue({
            ...venue,
            hours: [...venue.hours, { days: "", open: "", close: "", isClosed: false }]
        });
    };

    
    const removeHourSlot = (index) => {
        const newHours = venue.hours.filter((_, i) => i !== index);
        setVenue({ ...venue, hours: newHours });
    };

    const saveVenue = (e) => {
        e.preventDefault();
        if (!user || !user.token || user.role !== "admin") {
            navigate("/login");
            return;
        }

        const data = {
            name: venue.name,
            address: venue.address,
            foodanddrink: venue.foodanddrink.split(","),
            coordinates: [parseFloat(venue.long), parseFloat(venue.lat)],
            hours: venue.hours 
        };

        VenueDataService.addVenue(data, user.token)
            .then((response) => {
                navigate("/admin");
            })
            .catch((e) => {
                console.log(e);
            });
    };

    return (
        <>
            <Header headerText="Yeni Mekan Ekle" />
            <div className="container mt-5">
                <h2>Yeni Mekan Ekle</h2>
                <form onSubmit={saveVenue}>
                    <div className="form-group mb-3">
                        <label>Mekan Adı</label>
                        <input type="text" className="form-control" name="name" value={venue.name} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group mb-3">
                        <label>Adres</label>
                        <input type="text" className="form-control" name="address" value={venue.address} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group mb-3">
                        <label>İmkanlar (Virgülle ayırın)</label>
                        <input type="text" className="form-control" name="foodanddrink" value={venue.foodanddrink} onChange={handleInputChange} required />
                    </div>
                    <div className="row mb-3">
                        <div className="col">
                            <label>Enlem</label>
                            <input type="text" className="form-control" name="lat" value={venue.lat} onChange={handleInputChange} required />
                        </div>
                        <div className="col">
                            <label>Boylam</label>
                            <input type="text" className="form-control" name="long" value={venue.long} onChange={handleInputChange} required />
                        </div>
                    </div>

                    <hr />
                    <h4>Çalışma Saatleri</h4>
                    {venue.hours.map((hour, index) => (
                        <div key={index} className="card p-3 mb-3 bg-light" style={{ border: "1px solid #ddd", borderRadius: "5px" }}>
                            <div className="form-group mb-3">
                                <label>Günler (Örn: Pzt-Cum)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="days"
                                    value={hour.days}
                                    onChange={(e) => handleHourChange(index, e)}
                                    required
                                />
                            </div>
                            <div className="row mb-3">
                                <div className="col">
                                    <label>Açılış Saati</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="open"
                                        value={hour.open}
                                        onChange={(e) => handleHourChange(index, e)}
                                        required={!hour.isClosed}
                                    />
                                </div>
                                <div className="col">
                                    <label>Kapanış Saati</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="close"
                                        value={hour.close}
                                        onChange={(e) => handleHourChange(index, e)}
                                        required={!hour.isClosed}
                                    />
                                </div>
                            </div>
                            <div className="form-check mb-2">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    name="isClosed"
                                    checked={hour.isClosed}
                                    onChange={(e) => handleHourChange(index, e)}
                                />
                                <label className="form-check-label">Mekan Kapalı mı?</label>
                            </div>
                            {venue.hours.length > 1 && (
                                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeHourSlot(index)}>Sil</button>
                            )}
                        </div>
                    ))}

                    <button type="button" className="btn btn-secondary mb-3" onClick={addHourSlot}>+ Yeni Saat Aralığı Ekle</button>
                    <br />

                    <button type="submit" className="btn btn-primary">Kaydet</button>
                </form>
            </div>
        </>
    );
};

export default AddVenue;
