import './App.css'
import Table from './Table'
import { useState, useEffect } from 'react';
// import { FetchData } from './utils/FetchData';
import axios from 'axios';

interface Option {
	value: string;
	label: string;
}

function App() {
	const [selectedOption, setSelectedOption] = useState('');
	// const [data, setData] = useState<any>(null);

	const options: Option[] = [
		{ value: 'location', label: 'location' },
		{ value: 'character', label: 'character' },
	];

	const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedOption(event.target.value);
	};

	const [data, setData] = useState([]); // Используем хук useState для создания состояния data
	const [dataInfo, setDataInfo] = useState([]); // Используем хук useState для создания состояния data

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(`https://rickandmortyapi.com/api/${selectedOption}`);
				setData(response.data.results);
				setDataInfo(response.data);
			} catch (error) {
				// Обработка ошибок
			}
		};

		if (selectedOption) {
			fetchData();
		}
	}, [selectedOption]);

	console.log("dataInfo", dataInfo);
	console.log("data", data);

	return (
		<div className='container'>
			<header>
				<select value={selectedOption} onChange={handleSelectChange}>
					<option value="">Select an option</option>
					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</header>
			<main>
				<section>
					{data && <Table data={data} />}
				</section>
			</main>
		</div>
	)
}

export default App
