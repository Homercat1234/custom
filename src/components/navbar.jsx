import React, {
  useState,
  useEffect,
  useCallback,
} from "react";
import { Link, useLocation } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navb from "react-bootstrap/Navbar";
import Cookies from "universal-cookie";
import Axios from "axios";

export default function Navbar() {
  const [user, setUser] = useState();
  const location = useLocation();

  const getVerification = useCallback(async () => {
    const cookies = new Cookies();
    cookies.get("user");
    if (cookies) {
      Axios.post("http://localhost:5000/account/token", {
        authtoken: cookies["cookies"]["user"],
      }).then(function (result) {
        if (result.data === false) {
          cookies.remove("user");
          return setUser(null);
        }
        if (user != result.data) setUser(result.data);
      });
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    getVerification();
  }, [location]);

  const handleLogout = () => {
    const cookies = new Cookies();
    cookies.remove("user");
    setUser(null);
  };

  return (
    <Navb className="px-3 sticky-top" bg="dark" variant="dark" expand="lg">
      <Navb.Brand as={Link} to="/">
        Custom
      </Navb.Brand>
      <Navb.Toggle />
      <Navb.Collapse>
        <Nav>
          <Nav.Item>
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/blog">
              Blog
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Nav className="ms-auto">
          <Nav.Item>
            {!user && (
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
            )}
            {user && (
              <Nav.Link as={Link} onClick={handleLogout}>
                Logout
              </Nav.Link>
            )}
          </Nav.Item>
        </Nav>
      </Navb.Collapse>
    </Navb>
  );
}
