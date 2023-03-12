import React, { createContext } from 'react';


export const GlobalContext = createContext({
	isToast: false,
	setIsToast: () => { },
	isUpdateCategory: false,
    setIsUpdateCategory: () => { },
    isUpdateTask: false,
    setIsUpdateTask: () => { },
    deleteTask: false,
    setDeleteTask: () => { },
});