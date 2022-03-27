import React from 'react';
import { Button, DatePicker, version } from 'antd';

export default function App() {
	return (
		<div className='center-text'>
			<h1>antd version: {version}</h1>
			<DatePicker />
			<Button type='primary' style={{ marginLeft: 8 }}>
				Primary Button
			</Button>
		</div>
	);
}