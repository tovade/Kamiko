import { Button, Image, Nav, Navbar } from 'react-bootstrap';
import { FaDiscord } from 'react-icons/fa';

export default function Index() {
    return (
        <div className="App-Main">
            <div className="Navbar">
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                    <Navbar.Brand href="#home">
                        <span>Dashboard</span>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link>
                                <span>Home</span>
                            </Nav.Link>
                            <Nav.Link>
                                <span>Dashboard</span>
                            </Nav.Link>
                        </Nav>
                        <Nav>
                            <Nav.Link>
                                <span>
                                    Sign In &nbsp; <FaDiscord />{' '}
                                </span>
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
            <div className="App-Hero">
                <p
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: '70px'
                    }}
                >
                    <Image
                        height={150}
                        draggable={false}
                        className="Hero-Img"
                        src="https://cdn.discordapp.com/avatars/904321999302717500/873b59c903fb625e925b33b1ddd62de6.png?size=128"
                        roundedCircle
                    />
                </p>
                <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <span className="Hero-Title">Kamiko</span>
                </p>
                <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button>
                        <span style={{ fontFamily: 'Balsamiq Sans' }}>Invite Me</span>
                    </Button>
                    &nbsp; &nbsp; &nbsp;
                    <Button variant="danger" disabled>
                        <span style={{ fontFamily: 'Balsamiq Sans' }}>Dashboard</span>
                    </Button>
                </p>
            </div>
        </div>
    )
}
