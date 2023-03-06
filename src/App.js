import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './page/home';
import React, { useState } from 'react';
import { GlobalContext } from './context/globalContext';



function App() {

	const [ isToast, setIsToast] = useState(false);

	return (
		<GlobalContext.Provider value={{  isToast, setIsToast }}>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
				</Routes>
			</BrowserRouter>
		</GlobalContext.Provider>
	);
}

export default App;
