import { useState, useEffect, useRef } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import RoomIcon from "@mui/icons-material/Room";
import StarIcon from "@mui/icons-material/Star";
import axios from "axios";
import "./App.css";
import { format } from "timeago.js";
import Register from "./components/Register";
import Login from "./components/Login"

function App() {
  
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [markers, setMarkers] = useState([]);
  const [newPlace, setNewPlace] = useState(null);
  const [popUpId, setPopUpId] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [star, setStar] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const citynameRef = useRef()
  
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 31.7917,
    longitude: 7.0926,
    zoom: 2,
    markerSize: 10,
  });

  const showPopUp = function (id) {
    setPopUpId(id);
  };

  const handleAddClick = (e) => {
    const [long, lat] = e.lngLat;
    setNewPlace({
      long,
      lat,
    });
  };

  const displayLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  }


  const displayRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newMarker = {
      username: currentUser,
      title,
      desc,
      rating: star,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axios.post("/marker", newMarker);
      setMarkers([...markers, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${citynameRef.current.value}.json?access_token=${process.env.REACT_APP_MAPBOX}`);
      const [long, lat] = res.data.features[0].center;
      console.log('citname', citynameRef.current.value);
      console.log(res);
      setViewport({...viewport, longitude:long, latitude:lat, zoom:4})
  

    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = ()=> {
    myStorage.removeItem("user");
    setCurrentUser(null);
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
      onDblClick={handleAddClick}
    >
      {markers.map((p) => (
        <>
          <Marker
            latitude={p.lat}
            longitude={p.long}
            offsetLeft={-viewport.zoom * 5}
            offsetTop={-viewport.zoom * 10}
          >
            <RoomIcon
              style={{
                fontSize: 12 * viewport.zoom,
                color: p.username === currentUser ? "tomato" : "slateblue",
                cursor: "pointer",
              }}
              onClick={() => showPopUp(p._id)}
            />
          </Marker>
          {popUpId === p._id && (
            <Popup
              latitude={p.lat}
              longitude={p.long}
              closeButton={true}
              closeOnClick={false}
              offsetLeft={15}
              offsetTop={-10}
              anchor="left"
              onClose={() => setPopUpId(null)}
            >
              <div className="card">
                <label>Place</label>
                <h4 className="place">{p.title}</h4>
                <label>Review</label>
                <p>{p.desc}</p>
                <label>Rating</label>
                <div className="stars">
                  {Array(p.rating).fill(<StarIcon className="star" />)}
                </div>
                <label>Information</label>
                <span className="username">
                  Created by{" "}
                  <b>{p.username}</b>
                </span>
                <span className="date">{format(p.createdAt)}</span>
              </div>
            </Popup>
          )}
          {currentUser && newPlace && (
            <>
              <Marker
                latitude={newPlace.lat}
                longitude={newPlace.long}
                offsetLeft={-3.5 * viewport.zoom}
                offsetTop={-7 * viewport.zoom}
              >
                <RoomIcon
                  style={{
                    fontSize: 7 * viewport.zoom,
                    color: "tomato",
                    cursor: "pointer",
                  }}
                />
              </Marker>
              <Popup
                latitude={newPlace.lat}
                longitude={newPlace.long}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setNewPlace(null)}
                anchor="left"
              >
                <div>
                  <form onSubmit={handleSubmit}>
                    <label>Title</label>
                    <input
                      placeholder="Enter a title"
                      autoFocus
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <label>Description</label>
                    <textarea
                      placeholder="Say us something about this place."
                      onChange={(e) => setDesc(e.target.value)}
                    />
                    <label>Rating</label>
                    <select onChange={(e) => setStar(e.target.value)}>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                    <button type="submit" className="submitButton">
                      Add Pin
                    </button>
                  </form>
                </div>
              </Popup>
            </>
          )}
        </>
      ))}
      {currentUser ? (
        <>
        <div className="button">
          <input type="text" ref={citynameRef}/>
          <button className="button search" onClick={handleSearch}>Search</button>
          <button className="button logout" onClick={handleLogout}>Logout</button>
        </div>
        </>
      ) : (
        <div className="button">
          <button className="button login" onClick={displayLogin}>Login</button>
          <button className="button register" onClick={displayRegister}>Register</button>
        </div>
      )}
      {showRegister && <Register setShowRegister={setShowRegister}/>}
      {showLogin && <Login setShowLogin={setShowLogin} setCurrentUser={setCurrentUser} myStorage = {myStorage} />}
    </ReactMapGL>
  );
}

export default App;
