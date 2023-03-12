import './App.css';
import { BrowserRouter, Routes, Route, HashRouter } from 'react-router-dom';
import Home from './page/home';
import React, { useState } from 'react';
import { GlobalContext } from './context/globalContext';



function App() {

	const [isToast, setIsToast] = useState(false);
	const [isUpdateTask, setIsUpdateTask] = useState(false);
	const [isUpdateCategory,setIsUpdateCategory] = useState(false)

	return (
		<GlobalContext.Provider value={{ isToast, setIsToast, isUpdateTask, setIsUpdateTask ,setIsUpdateCategory,isUpdateCategory}}>
			<HashRouter>
				<Routes>
					<Route path="/" element={<Home />} />
				</Routes>
			</HashRouter>
		</GlobalContext.Provider>
	);
}

export default App;
