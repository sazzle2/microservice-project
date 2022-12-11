import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ForgotQuestions(data) {
	// const [username, setUsername]: [username: string | undefined, setUsername: (arg: any) => void] = useState<string | undefined>('');
	const [question, setQuestion]: [question: string | undefined, setQuestion: (arg: any) => void] = useState<string | undefined>('');
	const [password, setPassword]: [password: string | undefined, setPassword: (arg: any) => void] = useState<string | undefined>('');

	const uid = data.uId;

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		console.log(uid);
		console.log(password);
		e.preventDefault();
		await axios.post('http://localhost:4006/verify', {
			uid,
			question,
			password
		});
	};

	return (<div>
			<h1>Forgot Question</h1>
			<form onSubmit={handleSubmit}>
				<label>Security Question</label>
				<input type="question" onChange={e => setQuestion(e.target.value)} value={question} />
				<label>Password</label>
				<input type="password" onChange={e => setPassword(e.target.value)} value={password} />
				<div><button type="submit">Submit</button></div>
			</form>
		</div>
	);
}
