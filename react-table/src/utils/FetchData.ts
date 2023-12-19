import axios from 'axios';

export const FetchData = async (value: number) => {
	if (value === 1) {
		try {
			const response = await axios.get('https://rickandmortyapi.com/api/location')
			console.log("response.data", response.data)
			return response.data.json();
		} catch (error) {
			console.error('Error fetching locations:', error);
			return null;
		}
	}
	if (value === 2) {
		try {
			const response = await axios.get('https://rickandmortyapi.com/api/character');
			console.log("response.data", response.data)
			return response.data.json();

		} catch (error) {
			console.error('Error fetching characters:', error);
			return null;
		}
	} else return
};