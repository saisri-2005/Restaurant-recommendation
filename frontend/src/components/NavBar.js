// src/components/Navbar.js
import { Navbar as BSNavbar, Container } from 'react-bootstrap';

const NavBar = () => (
  <BSNavbar bg="dark" variant="dark">
    <Container>
      <BSNavbar.Brand href="#">Restaurant Recommendation</BSNavbar.Brand>
    </Container>
  </BSNavbar>
);

export default NavBar;