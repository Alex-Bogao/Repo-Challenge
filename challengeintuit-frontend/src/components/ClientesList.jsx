import { useEffect, useState } from 'react';
import { getClientes, deleteCliente, buscarClientes } from '../Services/api';
import { Table, Button, Row, Col, Form, Alert, Spinner, Card, Badge } from 'react-bootstrap';
import ActionButton from './ActionButton';
const ClientesList = ({ onEdit, onOpenCreate, refreshTrigger }) => {
    const [clientes, setClientes] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(busqueda) return;
        cargarClientes();
    }, [refreshTrigger]);

    const cargarClientes = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getClientes();
            setClientes(data);
        } catch (err) {
            setError('No se pudo conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    const handleBuscar = async (e) => {
        e.preventDefault();
        if (!busqueda.trim()) {
            cargarClientes();
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await buscarClientes(busqueda);
            setClientes(data);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError(err.response.data || "No se encontraron resultados.");
                setClientes([]);
            } else {
                setError("Ocurrió un error al buscar.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este registro?')) {
            try {
                await deleteCliente(id);
                if (busqueda) {
                   const btn = document.getElementById('btn-buscar-hidden');
                   if(btn) btn.click();
                } else {
                    cargarClientes();
                }
            } catch (err) {
                alert('Error al eliminar.');
            }
        }
    };

    return (
        <Card className="card-custom shadow-sm">
            <Card.Body className="p-4">
                <Row className="mb-4 align-items-center">
                    <Col md={6}>
                        <h4 className="mb-0 text-primary fw-bold" style={{color: 'var(--intuit-dark)'}}>
                            Base de Clientes
                        </h4>
                    </Col>
                    
                    <Col md={6} className="d-flex justify-content-end">
                         <Button variant="success" onClick={onOpenCreate} className="d-flex align-items-center gap-2 px-4 rounded-pill shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2z"/>
                            </svg>
                            Nuevo Cliente
                        </Button>
                    </Col>
                </Row>

                <Form onSubmit={handleBuscar} className="mb-4 p-3 bg-light rounded-3">
                    <Row className="g-2">
                        <Col md={8}>
                            <Form.Control 
                                type="text" 
                                placeholder="Buscar por nombre o apellido..." 
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="border-0 shadow-none bg-white"
                                style={{height: '45px'}}
                            />
                        </Col>
                        <Col md={4} className="d-flex gap-2">
                            <Button type="submit" variant="primary" className="w-100 rounded-pill">Buscar</Button>
                            <button id="btn-buscar-hidden" type="submit" style={{display:'none'}}></button>
                            <Button variant="outline-secondary" className="w-100 rounded-pill" onClick={() => { setBusqueda(''); cargarClientes(); }}>
                                Limpiar
                            </Button>
                        </Col>
                    </Row>
                </Form>

                {error && <Alert variant="warning" className="text-center border-0 shadow-sm">{error}</Alert>}
                {loading && <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>}

                {!loading && clientes.length > 0 && (
                    <Table hover responsive className="align-middle mb-0">
                        <thead style={{backgroundColor: '#f8f9fa'}}>
                            <tr>
                                <th className="border-0 py-3 ps-3 text-secondary">Cliente</th>
                                <th className="border-0 py-3 text-secondary">Contacto</th>
                                <th className="border-0 py-3 text-secondary">ID / CUIT</th>
                                <th className="border-0 py-3 pe-3 text-secondary text-end">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.map((c) => (
                                <tr key={c.id} style={{borderBottom: '1px solid #f0f0f0'}}>
                                    <td className="ps-3">
                                        <div className="fw-bold text-dark">{c.nombre} {c.apellido}</div>
                                        <div className="small text-muted">{c.razonSocial}</div>
                                    </td>
                                    <td>
                                        <div className="text-dark">{c.email}</div>
                                        <div className="small text-muted">{c.telefonoCelular}</div>
                                    </td>
                                    <td>
                                        <Badge bg="white" text="dark" className="border shadow-sm fw-normal px-3 py-2 rounded-pill">
                                            {c.cuit}
                                        </Badge>
                                    </td>
                                    <td className="text-end pe-3">
                                        <div className="d-flex gap-2 justify-content-end">
                                            
                                            <ActionButton 
                                                variant="purple" 
                                                onClick={() => onEdit(c)} 
                                                tooltipText="Editar"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                                                </svg>
                                            </ActionButton>

                                            <ActionButton 
                                                variant="red" 
                                                onClick={() => handleDelete(c.id)} 
                                                tooltipText="Eliminar"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                                </svg>
                                            </ActionButton>

                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
                
                {!loading && clientes.length === 0 && !error && (
                    <div className="text-center py-5 text-muted">
                        <div style={{fontSize: '3rem', opacity: 0.3}}>📂</div>
                        <p className="mt-2">No hay clientes para mostrar.</p>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

export default ClientesList;