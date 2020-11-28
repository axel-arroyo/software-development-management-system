import React, { useState } from 'react';
import axios from 'axios';
import {Form, Button, Alert} from 'react-bootstrap';
import User from './User';

function Register(props) {

	const user = User();
	const accountType = user ? user.type : undefined;
	const hasPermission = accountType === 'Manager' || accountType === 'Analyst' ? true : false
	const [email, setEmail] = useState('');
	const [pass, setPass] = useState('');
	const [name, setName] = useState('');
	const [type, setType] = useState('Manager');
	const [estado, setEstado] = useState('');

	const handleEmail = (e) => {
		setEmail(e.target.value);
	}

	const handlePass = (e) => {
		setPass(e.target.value);
	}

	const handleType = (e) => {
		setType(e.target.value);
	}

	const handleName = (e) => {
		setName(e.target.value);
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		axios.post('http://localhost:8080/auth/register', {
			email: email,
			pass: pass,
			name: name,
			type: type
		}, {
			headers: {
				"auth-token": localStorage.getItem("token"),
			}
		}).then((data) => {
			setEstado('Usuario registrado');
		}).catch((error) => {
			setEstado('El correo ya está en uso')
		});
	}

	return hasPermission ? (
		<Form>
			{estado !== '' && (
				<Alert variant={estado === 'Usuario registrado' ? 'success' : 'danger'}>
					{estado}
				</Alert>	
			)}
		<Form.Group controlId="formBasicEmail">
			<Form.Label>Email address</Form.Label>
			<div class="row">
    		<div class="col-md-4 col-md-offset-3"></div>
		    <Form.Control onChange={handleEmail} type="email" placeholder="Enter email" />
			</div>
		</Form.Group>

		<Form.Group>
		    <Form.Label>Name</Form.Label>
			<div class="row">
    		<div class="col-md-4 col-md-offset-3"></div>
		    <Form.Control onChange={handleName} type="text" placeholder="Enter name" />
			</div>
		</Form.Group>

		<Form.Group controlId="exampleForm.ControlSelect1">
			<Form.Label>Account Type</Form.Label>
			<div class="row">
    		<div class="col-md-4 col-md-offset-3"></div>
			<Form.Control onChange={handleType} as="select">
				<option value="Manager">Manager</option>
				<option value="Analyst">Analyst</option>
				<option value="Client">Client</option>
			</Form.Control>
			</div>
		</Form.Group>

		<Form.Group controlId="formBasicPassword">
		<Form.Label>Password</Form.Label>
		<div class="row">
    		<div class="col-md-4 col-md-offset-3"></div>
		    <Form.Control onChange={handlePass} type="password" placeholder="Password" />
			</div>
		</Form.Group>

		<Button onClick={handleSubmit} variant="primary" type="submit">
		    Enviar
		</Button>
		</Form>
	) : (
		<Alert variant="danger">Acceso Restringido</Alert>
	);
}

export default Register;
