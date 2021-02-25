import React, { Component } from 'react';
import classes from './Auth.module.css';
import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';

function validateEmail(email) {
	const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

export default class Auth extends Component {

	state = {
		isFormValid: false,
		formControls: {
			email: {
				value: '',
				type: 'email',
				label: 'Email',
				errorMessage: 'Введите корректный email',
				valid: false,
				touched: false,
				validation: {
					required: true,
					email: true
				}
			},
			password: {
				value: '',
				type: 'password',
				label: 'Пароль',
				errorMessage: 'Введите корректный пароль',
				valid: false,
				touched: false,
				validation: {
					required: true,
					minLength: 6
				}
			}
		}
	}

	loginHangler = () => {

	}

	registerHangler = () => {

	}

	submitHengler = (event) => {
		event.preventDefault();
	}

	validateControl (value, validation) {
		if(!validation) {
			return true;
		}

		let isValid = true;

		if(validation.required) {
			isValid = value.trim() !== '' && isValid;
		}

		if(validation.email) {
			isValid = validateEmail(value) && isValid;
		}

		if(validation.minLength) {
			isValid = value.trim().length >= validation.minLength && isValid;
		}

		return isValid;
	}

	onChangeHangler = (event, controlName) => {

		const formControls = { ...this.state.formControls };
		const control = { ...formControls[controlName] };

		control.value = event.target.value;
		control.touched = true;
		control.valid = this.validateControl(control.value, control.validation);

		formControls[controlName] = control;

		let isFormValid = true;

		Object.keys(formControls).forEach(name => {
			isFormValid = formControls[name].valid && isFormValid;
		});
			console.log(isFormValid);
		this.setState({
			formControls, isFormValid
		});
	}

	renderInputs() {
		return Object.keys(this.state.formControls).map((controlName, index) => {
			const control = this.state.formControls[controlName];
			return (
				<Input
					key={controlName + index}
					type={control.type}
					value={control.value}
					valid={control.valid}
					touched={control.touched}
					label={control.label}
					errorMessage={control.errorMessage}
					shouldValidate={!!control.validation}
					onChange={event=> this.onChangeHangler(event, controlName)}
				/>
			)
		});
	}

	render() {
		return(
			<div className={classes.Auth}>
				<div>
					<h1>Авторизация</h1>

					<form onSubmit={this.submitHengler} className={classes.AuthForm}>
						
						{ this.renderInputs() }

						<Button 
							type="success"
							onClick={this.loginHangler}
							disabled={!this.state.isFormValid}
						>Войти</Button>
						<Button
							type="primary"
							onClick={this.registerHangler}
							disabled={!this.state.isFormValid}
						>Регистрация</Button>
					</form>
				</div>
			</div>
		)
	}
}