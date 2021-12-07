import { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import RoomIcon from "@mui/icons-material/Room";
import StarIcon from "@mui/icons-material/Star";
import axios from "axios";
import "./App.css";
import { format } from "timeago.js";

function App() {
  const [currentUser, setCurrentUser] = useState("John"); 
  const [markers, setMarkers] = useState([]);
  const [newPlace, setNewPlace] = useState(null);
  const [popUpId, setPopUpId] = useState(null);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 31.7917,
    longitude: 7.0926,
    zoom: 2,
    markerSize: 10,
  });

  const showPopUp = function(id) {
    setPopUpId(id);
  }

  const handleAddClick = (e)=> {
    const [long, lat] = e.lngLat;
    setNewPlace({
      long,
      lat
    })
  }

  useEffect(() => {
    const getMarkers = async () => {
      try {
        const pointer = await axios.get("/marker");
        setMarkers(pointer.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMarkers();
  }, []);

  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={`${process.env.REACT_APP_MAPBOX}`}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      mapStyle="mapbox://styles/saifali95/ckvgcknrl07s314mlguc7yojt"
      onDblClick = {handleAddClick}
    >
      {markers.map((p) => (
        <>
          <Marker
            latitude={p.lat}
            longitude={p.long}
            offsetLeft={-20}
            offsetTop={-10}
          >
            <RoomIcon
              style={{
                fontSize: 12 * viewport.zoom,
                color: p.username === currentUser ? "tomato":"slateblue",
                cursor : "pointer"
              }}
              onClick = {()=> showPopUp(p._id)}
            />
          </Marker>
          {popUpId === p._id &&
          <Popup
            latitude={p.lat}
            longitude={p.long}
            closeButton={true}
            closeOnClick={false}
            offsetLeft={20}
            offsetTop={10}
            anchor="left"
            onClose={()=> setPopUpId(null)}
          >
            <div className="card">
              <label>Place</label>
              <h4 className="place">{p.title}</h4>
              <label>Review</label>
              <p>{p.desc}</p>
              <label>Rating</label>
              <div className="stars">
                {Array(p.rating).fill(<StarIcon className="star"/>)}
              </div>
              <label>Information</label>
              <span className="username">
                Created by <b>{p.username === currentUser ? "you" : p.username}</b>
              </span>
              <span className="date">{format(p.createdAt)}</span>
            </div>
          </Popup>}
          {newPlace &&
          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.long}
            closeButton={true}
            closeOnClick={false}
            offsetLeft={20}
            offsetTop={10}
            anchor="left"
            onClose={()=> setNewPlace(null)}
          >
            Hello
          </Popup>}
        </>
      ))}
    </ReactMapGL>
  );
}

export default App;
