import React, { createContext } from 'react';


export const GlobalContext = createContext({
	isToast: false,
	setIsToast: () => { },
	updateCategory: false,
    setUpdateCategory: () => { },
    isUpdateTask: false,
    setIsUpdateTask: () => { },
    deleteTask: false,
    setDeleteTask: () => { },
});