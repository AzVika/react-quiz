import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import Select from '../../components/UI/Select/Select';
import { createControl, validate, validateForm } from '../../form/formFramework';
import Auxiliary from '../../hoc/Auxiliary/Auxiliary';
import { createQuizQuestion, finishCreateQuiz } from '../../store/actions/create';
import classes from './QuizCreator.module.css';

function createOptionControl(number) {
	return createControl({
		label: `Варіант ${number}`,
		errorMessage: 'Значення не може бути порожнім',
		id: number
	}, { required: true })
}

function createFormControls() {
	return {
		question: createControl({
			label: 'Введіть запитання',
			errorMessage: 'Питання не може бути порожнім'
		}, { required: true }),
		option1: createOptionControl(1),
		option2: createOptionControl(2),
		option3: createOptionControl(3),
		option4: createOptionControl(4),
	}
}

class QuizCreator extends Component {

	state = {
		isFormValid: false,
		rightAnswerId: 1,
		formControls: createFormControls()
	}

	submitHangler = event => {
		event.preventDefault();
	}

	addQuestionHangler = event => {
		event.preventDefault();

		const { question, option1, option2, option3, option4 } = this.state.formControls;

		const questionItem = {
			question: question.value,
			id: this.props.quiz.length + 1,
			rightAnswerId: this.state.rightAnswerId,
			answers: [
				{ text: option1.value, id: option1.id },
				{ text: option2.value, id: option2.id },
				{ text: option3.value, id: option3.id },
				{ text: option4.value, id: option4.id }
			]
		};

		this.props.createQuizQuestion(questionItem);

		this.setState({
			isFormValid: false,
			rightAnswerId: 1,
			formControls: createFormControls()
		})
	}

	createQuizHangler = event => {
		event.preventDefault();

		this.setState({
			isFormValid: false,
			rightAnswerId: 1,
			formControls: createFormControls()
		});
		this.props.finishCreateQuiz();

	}

	changeHangler = (value, controlName) => {
		const formControls = { ...this.state.formControls };
		const control = { ...formControls[controlName] };

		control.touched = true;
		control.value = value;
		control.valid = validate(control.value, control.validation);

		formControls[controlName] = control;

		this.setState({
			formControls,
			isFormValid: validateForm(formControls)
		})
	}

	renderControls() {
		return Object.keys(this.state.formControls).map((controlName, index) => {
			const control = this.state.formControls[controlName];

			return (
				<Auxiliary key={controlName + index}>
					<Input
						label={control.label}
						value={control.value}
						valid={control.valid}
						shouldValidate={!!control.validation}
						touched={control.touched}
						errorMessage={control.errorMessage}
						onChange={event => this.changeHangler(event.target.value, controlName)}
					/>
					{index === 0 ? <hr /> : null}
				</Auxiliary>
			)
		});
	}

	selectChangeHangler = event => {
		this.setState({
			rightAnswerId: +event.target.value
		})
	}

	render() {
		const select = <Select
			label="Виберіть правильну відповідь"
			value={this.state.rightAnswerId}
			onChange={this.selectChangeHangler}
			options={[
				{ text: 1, value: 1 },
				{ text: 2, value: 2 },
				{ text: 3, value: 3 },
				{ text: 4, value: 4 }
			]}
		/>

		return (
			<div className={classes.QuizCreator}>
				<div>
					<h1>Створення тесту</h1>

					<form onSubmit={this.submitHangler}>

						{this.renderControls()}

						{select}

						<Button
							type="primary"
							onClick={this.addQuestionHangler}
							disabled={!this.state.isFormValid}
						>
							Додати питання
						</Button>

						<Button
							type="success"
							onClick={this.createQuizHangler}
							disabled={this.props.quiz.length === 0}
						>
							Створити тест
						</Button>
					</form>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		quiz: state.create.quiz
	}
}

function mapDispatchToProps(dispatch) {
	return {
		createQuizQuestion: item => dispatch(createQuizQuestion(item)),
		finishCreateQuiz: () => dispatch(finishCreateQuiz())
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(QuizCreator);