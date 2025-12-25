import InputWithLabel from "./InputWithLabel"; 
import VenueList from "./VenueList"; 
import Header from "./Header";
import React, { useState } from "react"; 
import venuesData from "../data/venues.json"; 
import {useSelector,useDispatch} from "react-redux";
import VenueDataService from "../services/VenueDataService";
const Home = () => {
  const [coordinate,setCoordinate] = useState({lat:37,long:35});
  const dispatch = useDispatch();

  
  const venues = useSelector((state) => state.data);
  
  const [searchVenue, setSearchVenue] = useState("");
  
  const search = (event) => {
    setSearchVenue(event.target.value);
  };
  
  
  React.useEffect(() => {
    if("geolocation" in navigator){
      navigator.geolocation.getCurrentPosition(function(position){
        setCoordinate({lat:position.coords.latitude,long:position.coords.longitude});
      });
    }
  }, []);

  React.useEffect(() => {
    dispatch({type:"FETCH_INIT"});
    VenueDataService.nearbyVenues(coordinate.lat,coordinate.long)
    .then((response)=>{
      dispatch({type:"FETCH_SUCCESS",payload:response.data});
    }).catch(()=>{
      dispatch({type:"FETCH_FAILURE"});
    });
  }, [coordinate.lat,coordinate.long]);

  
  const filteredVenues = Array.isArray(venues) ? venues.filter((venue) => {
    return venue.name.toLowerCase().includes(searchVenue.toLowerCase());
  }) : [];
  
  return (
    <div>
      <Header
        headerText="Mekanbul"
        motto="Civarınızdaki Mekanlarınızı Keşfedin!"
      />
      
      <InputWithLabel
        id="arama"
        label="Mekan Ara:"
        type="text"
        isFocused
        onInputChange={search}
        value={searchVenue}
      />
      
      <hr />
      
      <div className="row">
        <div className="row">
          <VenueList venues={filteredVenues} />
        </div>
      </div>
    </div>
  );
};

export default Home;
