import { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import RoomIcon from "@mui/icons-material/Room";
import StarIcon from "@mui/icons-material/Star";
import axios from "axios";
import "./App.css";
import { format } from "timeago.js";

function App() {
  const [markers, setMarkers] = useState([]);
  const [popUpId, setPopUpId] = useState(null);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 31.7917,
    longitude: 7.0926,
    zoom: 2,
    markerSize: 20,
  });

  const showPopUp = function(id) {
    setPopUpId(id);
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
                fontSize: viewport.markerSize * viewport.zoom,
                color: "slateblue",
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
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
              </div>
              <label>Information</label>
              <span className="username">
                Created by <b>{p.username}</b>
              </span>
              <span className="date">{format(p.createdAt)}</span>
            </div>
          </Popup>}
        </>
      ))}
    </ReactMapGL>
  );
}

export default App;
