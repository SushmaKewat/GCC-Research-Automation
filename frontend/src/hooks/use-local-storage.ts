import { useState, useEffect, Dispatch, SetStateAction } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
	const [storedValue, setStoredValue] = useState<T>(initialValue);

	useEffect(() => {
		// This effect runs once on mount on the client side
		// to read the value from localStorage and update the state.
		try {
			const item = window.localStorage.getItem(key);
			if (item) {
				setStoredValue(JSON.parse(item));
			}
		} catch (error) {
			console.error(`Error reading localStorage key “${key}”:`, error);
		}
	}, [key]);

	const setValue: Dispatch<SetStateAction<T>> = (value) => {
		try {
			const valueToStore = value instanceof Function ? value(storedValue) : value;
			setStoredValue(valueToStore);
			if (typeof window !== 'undefined') {
				window.localStorage.setItem(key, JSON.stringify(valueToStore));
			}
		} catch (error) {
			console.error(`Error setting localStorage key “${key}”:`, error);
		}
	};

	return [storedValue, setValue];
}

export default useLocalStorage;
