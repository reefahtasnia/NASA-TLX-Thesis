import { Link } from 'react-router-dom';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink, Container } from 'reactstrap';

const Menubar = () => {
  return (
    <Navbar color="dark" dark expand="md" className="mb-4">
      <Container fluid>
        <div className="d-flex justify-content-between align-items-center w-100">
          <NavbarBrand tag={Link} to="/" className="mb-0">
            Player Feedback
          </NavbarBrand>
          <Nav navbar className="flex-row">
            <NavItem className="me-3">
              <NavLink tag={Link} to="/dashboard" className="text-white">
                NASA TLX Dashboard
              </NavLink>
            </NavItem>
            <NavItem className="me-3">
              <NavLink tag={Link} to="/germane-load-form" className="text-white">
                Germane Load Form
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/germane-load-dashboard" className="text-white">
                Germane Load Dashboard
              </NavLink>
            </NavItem>
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
};

export default Menubar;
