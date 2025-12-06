import { useState } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import ClientesList from './components/ClientesList';
import ClienteForm from './components/ClienteForm';
import { createCliente, updateCliente } from './Services/api'; 
function App() {
    const [showModal, setShowModal] = useState(false);
    const [clienteEditar, setClienteEditar] = useState(null);
    const [errorForm, setErrorForm] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleOpenCreate = () => {
        setClienteEditar(null);
        setErrorForm(null);
        setShowModal(true);
    };

    const handleOpenEdit = (cliente) => {
        setClienteEditar(cliente);
        setErrorForm(null);
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);

    const handleSave = async (formData) => {
        setErrorForm(null);
        try {
            if (clienteEditar) {
                await updateCliente(clienteEditar.id, formData);
            } else {
                await createCliente(formData);
            }
            setShowModal(false);
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            if (error.response && error.response.data) {
                setErrorForm(typeof error.response.data === 'string' 
                    ? error.response.data 
                    : JSON.stringify(error.response.data));
            } else {
                setErrorForm("Ocurrió un error inesperado al guardar.");
            }
        }
    };

    return (
        <div className="min-vh-100 d-flex flex-column bg-light">
            <Navbar expand="lg" className="navbar-custom" fixed="top">
                <Container fluid className="px-4">
                    <Navbar.Brand href="#home" className="fw-bold d-flex align-items-center" style={{ color: 'var(--intuit-primary)', fontSize: '1.6rem', letterSpacing: '-0.5px' }}>
                        Challenge&nbsp;<span style={{ fontWeight: 300 }}>intuit</span>
                    </Navbar.Brand>
                    
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                        <Nav>
                            <Nav.Link href="#clientes" className="fw-bold text-dark mx-3" style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>
                                CLIENTES
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <div style={{ marginTop: '80px' }}></div>

            <div className="hero-header text-center">
                <Container fluid>
                    <Row className="justify-content-center">
                         <Col md={8}>
                            <h1 className="fw-bold display-5 mb-2">Gestión de Clientes</h1>
                            <p className="lead opacity-75 fw-light">Administración integral de la base de datos</p>
                         </Col>
                    </Row>
                </Container>
            </div>

            <Container fluid className="px-4 pb-5"> 
                <ClientesList 
                    onEdit={handleOpenEdit} 
                    onOpenCreate={handleOpenCreate} 
                    refreshTrigger={refreshTrigger}
                />
            </Container>

            <ClienteForm 
                show={showModal} 
                handleClose={handleClose} 
                handleSave={handleSave} 
                clienteEditar={clienteEditar}
                errorBackend={errorForm}
            />
        </div>
    );
}
import { Row, Col } from 'react-bootstrap'; 

export default App;