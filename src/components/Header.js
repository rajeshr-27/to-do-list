import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Outlet,Link } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import { logOut } from '../redux/features/loginSlice';

function Header() {
    const dispatch = useDispatch();
    const {isAuth, authUser} = useSelector((state) => state.user);
    const handleLogout = () => {
        dispatch(logOut());
        
    }
  return (
    <>
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#home">To-Do-List</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        { !isAuth &&
                            <>
                              <Link className="nav-link" to="/register">Register</Link>
                              <Link className="nav-link" to="/login">Login</Link>
                            </>
                        }

                        {
                            isAuth &&
                            <NavDropdown title={authUser.name} id="basic-nav-dropdown">
                                <Link className="dropdown-item" to="/task">Tasks</Link> 
                                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item> 
                            </NavDropdown>
                        }
                      
                        
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <Outlet />
    </>
  );
}

export default Header;