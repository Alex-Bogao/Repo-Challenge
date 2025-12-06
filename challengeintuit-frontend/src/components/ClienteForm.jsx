import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';

const ClienteForm = ({ show, handleClose, handleSave, clienteEditar, errorBackend }) => {
    const initialState = {
        nombre: '',
        apellido: '',
        razonSocial: '',
        cuit: '',
        fechaNacimiento: '',
        telefonoCelular: '',
        email: ''
    };

    const [formData, setFormData] = useState(initialState);
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        if (clienteEditar) {
            const fechaFormateada = clienteEditar.fechaNacimiento.split('T')[0];
            setFormData({ ...clienteEditar, fechaNacimiento: fechaFormateada });
        } else {
            setFormData(initialState);
        }
        setValidated(false);
    }, [clienteEditar, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'cuit') {
            let soloNumeros = value.replace(/\D/g, '');

            if (soloNumeros.length > 11) {
                soloNumeros = soloNumeros.slice(0, 11);
            }

            let cuitFormateado = soloNumeros;
            
            if (soloNumeros.length > 2) {
                cuitFormateado = `${soloNumeros.slice(0, 2)}-${soloNumeros.slice(2)}`;
            }
            if (soloNumeros.length > 10) {
                cuitFormateado = `${soloNumeros.slice(0, 2)}-${soloNumeros.slice(2, 10)}-${soloNumeros.slice(10)}`;
            }

            setFormData({ ...formData, cuit: cuitFormateado });
            return;
        }

        if (name === 'telefonoCelular') {
            const soloNumeros = value.replace(/\D/g, '');
            setFormData({ ...formData, telefonoCelular: soloNumeros });
            return;
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        e.stopPropagation();

        setValidated(true);

        if (form.checkValidity() === false) {
            return;
        }

        handleSave(formData);
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size="lg">
            <Modal.Header closeButton className="modal-header-intuit">
                <Modal.Title className="fw-bold">
                    {clienteEditar ? 'Editar Cliente' : 'Nuevo Cliente'}
                </Modal.Title>
            </Modal.Header>
            
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Modal.Body className="p-4">
                    {errorBackend && <Alert variant="danger">{errorBackend}</Alert>}

                    <Row className="mb-3">
                        <Form.Group as={Col} md="6">
                            <Form.Label className="fw-semibold">Nombre</Form.Label>
                            <Form.Control required type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: Juan" />
                            <Form.Control.Feedback type="invalid">El nombre es obligatorio.</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="6">
                            <Form.Label className="fw-semibold">Apellido</Form.Label>
                            <Form.Control required type="text" name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Ej: Pérez" />
                            <Form.Control.Feedback type="invalid">El apellido es obligatorio.</Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} md="12">
                            <Form.Label className="fw-semibold">Razón Social</Form.Label>
                            <Form.Control required type="text" name="razonSocial" value={formData.razonSocial} onChange={handleChange} placeholder="Ej: JP Servicios SRL" />
                            <Form.Control.Feedback type="invalid">La razón social es obligatoria.</Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} md="6">
                            <Form.Label className="fw-semibold">CUIT</Form.Label>
                            <Form.Control 
                                required 
                                type="text" 
                                name="cuit" 
                                value={formData.cuit} 
                                onChange={handleChange} 
                                placeholder="20123456789"
                                pattern="^\d{2}-\d{8}-\d{1}$" 
                                maxLength={13}
                            />
                            <Form.Control.Feedback type="invalid">
                                Debe ingresar los 11 números del CUIT.
                            </Form.Control.Feedback>
                        </Form.Group>
                        
                        <Form.Group as={Col} md="6">
                            <Form.Label className="fw-semibold">Fecha de Nacimiento</Form.Label>
                            <Form.Control required type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} />
                            <Form.Control.Feedback type="invalid">Seleccione una fecha válida.</Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} md="6">
                            <Form.Label className="fw-semibold">Email</Form.Label>
                            <Form.Control required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="juan@ejemplo.com" />
                            <Form.Control.Feedback type="invalid">Ingrese un email válido.</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} md="6">
                            <Form.Label className="fw-semibold">Teléfono Celular</Form.Label>
                            <Form.Control 
                                required 
                                type="text" 
                                name="telefonoCelular" 
                                value={formData.telefonoCelular} 
                                onChange={handleChange} 
                                placeholder="1112345678" 
                            />
                            <Form.Control.Feedback type="invalid">Solo se permiten números.</Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleClose}>Cancelar</Button>
                    <Button className="btn-intuit-primary px-4" type="submit">
                        {clienteEditar ? 'Guardar Cambios' : 'Crear Cliente'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ClienteForm;