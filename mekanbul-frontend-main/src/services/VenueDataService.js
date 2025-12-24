import http from "./http-common";

class VenueDataService {
    getAllVenues(token) {
        if (token) {
            return http.get("/admin/mekanlar", {
                headers: { Authorization: `Bearer ${token}` }
            });
        }
        return http.get("/mekanlar");
    }

    nearbyVenues(lat, long) {
        return http.get(`/mekanlar?lat=${lat}&long=${long}`);
    }

    getVenue(id) {
        return http.get(`/mekanlar/${id}`);
    }

    addVenue(data, token) {
        return http.post("/mekanlar", data, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    updateVenue(id, data, token) {
        return http.put(`/mekanlar/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    removeVenue(id, token) {
        return http.delete(`/mekanlar/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    addComment(id, data, token) {
        return http.post(`/mekanlar/${id}/yorumlar`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    login(data) {
        return http.post("/login", data);
    }

    register(data) {
        return http.post("/register", data);
    }
}

export default new VenueDataService();
