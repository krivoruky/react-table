import './App.css'
import Table from './Table'
import { useState } from 'react';
import { FetchData } from './utils/FetchData';

function App() {
	const [selectedFetchData, setSelectedFetchData] = useState(0);
	console.log("123", FetchData(selectedFetchData).then(function (data) { return data }));

	return (
		<div className='container'>
			<header>
				<select
					value={selectedFetchData}
					onChange={(e) => setSelectedFetchData(parseInt(e.target.value))}
				>
					<option value={0}>Select API</option>
					<option value={1}>fetchLocations</option>
					<option value={2}>fetchCharacters</option>
				</select>
			</header>
			<main>
				<section>
					<Table data={FetchData(selectedFetchData)} />
				</section>
			</main>
		</div>
	)
}

export default App
