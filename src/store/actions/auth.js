import axios from 'axios';
import { AUTH_LOGOUT, AUTH_SUCCESS } from './actionTypes';

export function auth(email, password, isLogin) {
	return async dispatch => {

		const authData = {
			email,
			password,
			returnSecureToken: true
		}

		let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDuuHC2KS0r-1Lp0SQfFoxkqMnXaisRB44';

		if (isLogin) {
			url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDuuHC2KS0r-1Lp0SQfFoxkqMnXaisRB44';
		}

		const response = await axios.post(url, authData);
		console.log(response);
		const data = response.data;

		const expirationDate = new Date(new Date().getTime() + data.expiresIn * 1000);

		localStorage.setItem('token', data.idToken);
		localStorage.setItem('userID', data.localId);
		localStorage.setItem('expirationDate', expirationDate);

		dispatch(authSuccess(data.idToken));
		dispatch(autoLogout(data.expiresIn));

	}
}

export function autoLogout(time) {
	return dispatch => {
		setTimeout(() => {
			dispatch(logout())
		}, time * 1000)
	}
}

export function logout() {
	console.log('remove');
	localStorage.removeItem('token');
	localStorage.removeItem('userID');
	localStorage.removeItem('expirationDate');
	console.log(localStorage);

	return {
		type: AUTH_LOGOUT,
	}
}

export function autoLogin() {
	return dispatch => {
		const token = localStorage.getItem('token');
		if (!token) {
			dispatch(logout());
		} else {
			const expirationDate = new Date(localStorage.getItem('expirationDate'));
			if (expirationDate <= new Date()) {
				dispatch(logout())
			} else {
				dispatch(authSuccess(token));
				dispatch(autoLogout((expirationDate.getTime() - new Date().getTime()) / 1000));
			}
		}
	}
}

export function authSuccess(token) {
	return {
		type: AUTH_SUCCESS,
		token
	}
}