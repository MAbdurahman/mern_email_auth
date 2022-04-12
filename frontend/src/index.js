import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/appContext'
import './styles/index.less';
import App from './app/App';


ReactDOM.render(
	<AppProvider>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</AppProvider>,
	document.getElementById('root')
);


