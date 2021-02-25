import React, { Component } from 'react';
import classes from './Quiz.module.css';
import ActiveQuiz from '../../components/ActiveQuiz/ActiveQuiz';
import FinishedQuiz from '../../components/FinishedQuiz/FinishedQuiz';

class Quiz extends Component {
	state = {
		results: {}, // { [id]: 'success' : 'error'}
		isFinished: false,
		activeQuestion: 0,
		answerState: null, // { [id]: 'success' : 'error'}
		quiz: [
			{
				question: 'Какого цвета небо?',
				rigthAnswerId: 3,
				id: 1,
				answers: [
					{text: 'Черный', id: 1},
					{text: 'Красный', id: 2},
					{text: 'Синий', id: 3},
					{text: 'Зеленый', id: 4}
				]
			},
			{
				question: 'В каком году основали Санкт-Петербург?',
				rigthAnswerId: 2,
				id: 2,
				answers: [
					{text: '1700', id: 1},
					{text: '1703', id: 2},
					{text: '1702', id: 3},
					{text: '1803', id: 4}
				]
			}
		]
	}

	isQuizFinished() {
		return this.state.activeQuestion + 1 === this.state.quiz.length;
	}

	onAnswerClickHandler = (answerId) => {
		if(this.state.answerState) {
			const key = Object.keys(this.state.answerState)[0];
			if(this.state.answerState[key] === 'success') {
				return;
			}
		}

		const question = this.state.quiz[this.state.activeQuestion];
		const results = this.state.results;
		if(question.rigthAnswerId === answerId) {
			
			if(!results[question.id]) {
				results[question.id] = 'success';
			}

			this.setState({
				answerState: {[answerId]: 'success'},
				results
			});

			const timeout = window.setTimeout(() => {
				if(this.isQuizFinished()) {
					this.setState({
						isFinished: true
					})
				} else {
					this.setState({
						activeQuestion: this.state.activeQuestion + 1,
						answerState: null
					});
				}

				window.clearTimeout(timeout);
			}, 1000);
			
		} else {
			results[question.id] = 'error';
			this.setState({
				answerState: {[answerId]: 'error'},
				results
			});
		}
	}

	retryHandler = () => {
		this.setState({
			results: {},
			isFinished: false,
			activeQuestion: 0,
			answerState: null, 
		})
	}

	componentDidMount() {
		console.log('Quiz Id: ', this.props.match.params.id);
	}

	render() {
		return(
			<div className={classes.Quiz}>
				<div className={classes.QuizWrapper}>
					<h1>Пройдите небольшой опросник:</h1>

					{
						this.state.isFinished
						? <FinishedQuiz
							results={this.state.results}
							quiz={this.state.quiz}
							onRetry={this.retryHandler}
						/>
						: <ActiveQuiz
							answers={this.state.quiz[this.state.activeQuestion].answers}
							question={this.state.quiz[this.state.activeQuestion].question}
							onAnswerClick={this.onAnswerClickHandler}
							quizLength={this.state.quiz.length}
							answerNumber={this.state.activeQuestion + 1}
							state={this.state.answerState}
					/>
					}

					
				</div>

			</div>
		)
	}
}
export default Quiz;