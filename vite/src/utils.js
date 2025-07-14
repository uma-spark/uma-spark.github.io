import { useState } from "react";

export function useLocalStorage(key, defaultValue) {
	const initial = JSON.parse(localStorage.getItem(key)) || defaultValue;
	const [stateValue, setStateValue] = useState(initial);
	function setValue(value) {
		localStorage.setItem(key, JSON.stringify(value));
		setStateValue(value);
	}
	return [stateValue, setValue];
}
