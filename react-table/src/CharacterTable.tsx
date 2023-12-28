import React, { useEffect, useState } from 'react';
import './Table.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from './store';
import {
	fetchCharacter,
	fetchNextPage,
	fetchPrevPage,
	selectCharactersError,
	selectCharactersLoading,
	selectCharactersPagination,
	selectTableDataCharacters
} from './store/characterSlice';

const CharacterTable: React.FC = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(15);
	const [sortConfig, setSortConfig] = useState<{ key: string, direction: string }>({ key: '', direction: '' });
	const dispatch = useDispatch<AppDispatch>();
	const tableData = useSelector(selectTableDataCharacters);
	const pagination = useSelector(selectCharactersPagination);
	const loading = useSelector(selectCharactersLoading);
	const error = useSelector(selectCharactersError);
	const headers = tableData.length > 0 ? Object.keys(tableData[0]) : [];

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;

	const handleSort = (key: string) => {
		let direction = 'ascending';
		if (sortConfig.key === key && sortConfig.direction === 'ascending') {
			direction = 'descending';
		}
		setSortConfig({ key, direction });
	};

	const sortedData = [...tableData.slice(indexOfFirstItem, indexOfLastItem)].sort((a, b) => {
		if (sortConfig.direction === 'ascending') {
			return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
		}
		if (sortConfig.direction === 'descending') {
			return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
		}
		return 0;
	});

	useEffect(() => {
		dispatch(fetchCharacter());
		setCurrentPage(1)
	}, [dispatch,itemsPerPage]);

	const handleNextPage = () => {
		setCurrentPage(currentPage + 1)
		if (pagination.nextPage) {
			dispatch(fetchNextPage(pagination.nextPage));
		}
	};

	const handlePrevPage = () => {
		setCurrentPage(currentPage - 1)
		if (pagination.prevPage) {
			dispatch(fetchPrevPage(pagination.prevPage));
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div className="table-container">
			<table>
				<thead>
					<tr>
						{headers.map((header) => (
							<th key={header} onClick={() => handleSort(header)}>
								{header}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{sortedData.map((item, index) => (
						<tr key={index}>
							{headers.map((header) => (
								<td key={header}>
									{typeof item[header] === 'object'
										? JSON.stringify(item[header])
										: item[header]}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
			<div className="pagination">
				<div>
					{
						pagination?.count > 1
							? `${(indexOfFirstItem + 1)} - ${indexOfLastItem > pagination?.count
								? pagination?.count
								: indexOfLastItem} of ${pagination?.count}`
							: null
					}
				</div>
				<div>
					{
						pagination?.totalPages > 1
							? <>
								<span>
									Rows per page:
								</span>
								<select
									value={itemsPerPage}
									onChange={(e) => setItemsPerPage(parseInt(e.target.value, 10))}
								>
									<option value={10}>10</option>
									<option value={15}>15</option>
									<option value={20}>20</option>
								</select>
								<button
									onClick={handlePrevPage}
									disabled={currentPage === 1}>
									{'<'}
								</button>
								<span>{`${currentPage} / ${Math.ceil(pagination?.count / itemsPerPage)}`}</span>
								<button
									onClick={handleNextPage}
									disabled={currentPage === Math.ceil(pagination?.count / itemsPerPage)}>
									{'>'}
								</button>
							</>
							: null
					}
				</div>
			</div>
		</div>
	);
};

export default CharacterTable;