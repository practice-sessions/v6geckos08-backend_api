import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

import { GET_ERRORS, SET_CURRENT_CLIENT } from './types';

// Register Client
export const registerClient = (clientData, history) => (dispatch) => {
	axios.post('/api/clients/register', clientData).then((res) => history.push('/login')).catch((err) =>
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		})
	);
};

// Login - Get Client Token
export const loginClient = (clientData) => (dispatch) => {
	axios
		.post('/api/clients/login', clientData)
		.then((res) => {
			// Save to localStorage
			const { token } = res.data;

			// Set token to localStorage
			localStorage.setItem('jwtToken', token);

			// Set token to Auth header
			setAuthToken(token);

			// Decode token to get client data
			const decoded = jwt_decode(token);

			// Set current client
			dispatch(setCurrentClient(decoded));
		})
		.catch((err) =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};

// Set logged in client
export const setCurrentClient = (decoded) => {
	return {
		type: SET_CURRENT_CLIENT,
		payload: decoded
	};
};

// Log client out
export const logoutClient = () => (dispatch) => {
	// Remove token from localStorage
	localStorage.removeItem('jwtToken');

	// Remove auth header, reject future requests
	setAuthToken(false);

	// Set current client to {}, set isAuthenticated to false
	dispatch(setCurrentClient({}));
};