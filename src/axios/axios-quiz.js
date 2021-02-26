import axios from 'axios';

export default axios.create({
	baseURL: 'https://react-quiz-ad107-default-rtdb.europe-west1.firebasedatabase.app'
});