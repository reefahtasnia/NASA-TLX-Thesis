import { Link } from 'react-router-dom';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink, Container } from 'reactstrap';

const Menubar = () => {
  return (
    <Navbar color="dark" dark expand="md" className="mb-4">
      <Container fluid>
        <div className="d-flex justify-content-between align-items-center w-100">
          <NavbarBrand tag={Link} to="/" className="mb-0">
            NASA TLX
          </NavbarBrand>
          <Nav navbar>
            <NavItem>
              <NavLink tag={Link} to="/dashboard" className="text-white">
                Admin Dashboard
              </NavLink>
            </NavItem>
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
};

export default Menubar;
