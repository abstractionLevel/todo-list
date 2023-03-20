import './App.css';
import { BrowserRouter, Routes, Route, HashRouter } from 'react-router-dom';
import Home from './page/home';
import React, { useState, useEffect } from 'react';
import { GlobalContext } from './context/globalContext';
import { initDb } from './db/database';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {

	const [isToast, setIsToast] = useState(false);
	const [isUpdateTask, setIsUpdateTask] = useState(false);
	const [isUpdateCategory, setIsUpdateCategory] = useState(false);
	const [isRender, setIsRender] = useState(false);


	useEffect(() => {
		window.addEventListener("openToast", (event) => {
			toast(event.detail.message, {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "light",
			});

		})
		initDb()
			.then((resp) => {
				setIsRender(true);
			})
	}, []);

	return (
		<>
			<ToastContainer />
			{isRender && (
				<GlobalContext.Provider value={{ isToast, setIsToast, isUpdateTask, setIsUpdateTask, setIsUpdateCategory, isUpdateCategory }}>

					<HashRouter>
						<Routes>
							<Route path="/" element={<Home />} />
						</Routes>
					</HashRouter>
				</GlobalContext.Provider>
			)}
		</>

	);
}

export default App;
