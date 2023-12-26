import './App.css'
// import Table from './Table'
import { useState, useEffect } from 'react';
// import { FetchData } from './utils/FetchData';
// import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLocations } from './store/locationSlice';
import { fetchCharacter, selectLocationsError, selectLocationsLoading, selectLocationsPagination, selectTableDataLocations } from './store/characterSlice';
import { AppDispatch } from './store';

interface Option {
	value: string;
	label: string;
}

function App() {
	const [selectedOption, setSelectedOption] = useState('');
	const dispatch = useDispatch<AppDispatch>();
	const tableData = useSelector(selectTableDataLocations);
	const pagination = useSelector(selectLocationsPagination);
	const loading = useSelector(selectLocationsLoading);
	const error = useSelector(selectLocationsError);

	const options: Option[] = [
		{ value: 'location', label: 'location' },
		{ value: 'character', label: 'character' },
	];
	console.log("tableData", tableData);
	console.log("pagination", pagination);
	console.log("loading", loading);
	console.log("error", error);

	const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedOption(event.target.value);
	};

	// const [data, setData] = useState([]);
	// const [dataInfo, setDataInfo] = useState();

	useEffect(() => {
		// const fetchData = async () => {
		// 	try {
		// 		const response = await axios.get(`https://rickandmortyapi.com/api/${selectedOption}`);
		// 		setData(response.data.results);
		// 		setDataInfo(response.data.info);
		// 		console.log(response.data,"response.data");

		// 	} catch (error) {
		// 		// Обработка ошибок
		// 	}
		// };

		if (selectedOption === 'location') {
			dispatch(fetchLocations());

		}
		if (selectedOption === 'character') {
			dispatch(fetchCharacter());
		}
	}, [selectedOption, dispatch]);

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
					{/* {<Table data={locations} info={dataInfo} />} */}
				</section>
			</main>
		</div>
	)
}

export default App
