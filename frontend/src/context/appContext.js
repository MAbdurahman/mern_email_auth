import React, { useReducer, useContext } from 'react';
import axios from 'axios';
import reducer from './reducers'
import { CLEAR_ALERT, DISPLAY_ALERT } from './actions';


const initialState = {
	showAlert: false,
	alertText: '',
	alertType: '',
};


const AppContext = React.createContext();
const AppProvider = ({ children }) => {
	//**************** variables ****************//
	const [state, dispatch] = useReducer(reducer, initialState);
	//**************** functions ****************//
	const displayAlert = () => {
		dispatch({ type: DISPLAY_ALERT });
		clearAlert();
	};

	const clearAlert = () => {
		setTimeout(() => {
			dispatch({ type: CLEAR_ALERT });
		}, 3500);
	};

	return (
		<AppContext.Provider value={{ ...state, displayAlert }}>{children}</AppContext.Provider>
	);
}

const useAppContext = () => {
	return useContext(AppContext);
};

export { AppProvider, initialState, useAppContext };