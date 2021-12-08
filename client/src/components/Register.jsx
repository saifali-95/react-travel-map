import { Cancel, Room } from "@material-ui/icons";
import axios from "axios";
import { useRef, useState } from "react";
import "./Register.css";

export default function Register({ setShowRegister }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="registerContainer">
      <div className="logo">
        <Room className="logoIcon" />
        <span>Travel Marker</span>
      </div>
      <form>
        <input autoFocus placeholder="username" />
        <input type="email" placeholder="email" />
        <input
          type="password"
          min="6"
          placeholder="password"
        />
        <button className="registerBtn" type="submit">
          Register
        </button>
        {success && (
          <span className="success">Successfull. You can login now!</span>
        )}
        {error && <span className="failure">Something went wrong!</span>}
      </form>
      <Cancel
        className="registerCancel"
        onClick={() => setShowRegister(false)}
      />
    </div>
  );
}