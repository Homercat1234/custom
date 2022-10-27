import React, {useState, useEffect} from "react";
import { Link, useLocation  } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navb from "react-bootstrap/Navbar";

export default function Navbar() {

  const [user, setUser] = useState()
  const location = useLocation();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, [location, user]);

  const handleLogout = () => {
    setUser(null);;
    localStorage.clear();
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
            { !user && <Nav.Link as={Link} to="/login">
              Login
            </Nav.Link> }
            { user && <Nav.Link as={Link} onClick={handleLogout}>Logout</Nav.Link>}
          </Nav.Item>
        </Nav>
      </Navb.Collapse>
    </Navb>
  );
}
