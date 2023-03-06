import React, { createContext } from 'react';


export const GlobalContext = createContext({
	isToast: false,
	setIsToast: () => { },
});