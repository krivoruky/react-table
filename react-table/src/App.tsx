import './App.css'
import { useState } from 'react';
import LocationTable from './LocationTable';
import CharacterTable from './CharacterTable';

interface Option {
	value: string;
	label: string;
}

function App() {
	const [selectedOption, setSelectedOption] = useState('');

	const options: Option[] = [
		{ value: 'location', label: 'location' },
		{ value: 'character', label: 'character' },
	];

	const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedOption(event.target.value);
	};

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
					{
						selectedOption === 'location'
							? <LocationTable />
							: selectedOption === 'character'
								? <CharacterTable />
								: null
					}
				</section>
			</main>
		</div>
	)
}

export default App
