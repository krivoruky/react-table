import React, { useState } from 'react';

interface TableProps {
	data: any[];
}

const TableComponent: React.FC<TableProps> = ({ data }) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [rowsPerPage] = useState(15); // Количество строк на странице
	const [sortConfig, setSortConfig] = useState<{ key: string, direction: string }>({ key: '', direction: '' });

	// Функция для сортировки данных
	const sortData = (key: string) => {
		let direction = 'ascending';
		if (sortConfig.key === key && sortConfig.direction === 'ascending') {
			direction = 'descending';
		}
		setSortConfig({ key, direction });
	};

	// Получение отсортированных данных
	const sortedData = [...data].sort((a, b) => {
		if (sortConfig.direction === 'ascending') {
			return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
		}
		if (sortConfig.direction === 'descending') {
			return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
		}
		return 0;
	});

	// Вычисление индексов начала и конца отображаемых строк
	const indexOfLastRow = currentPage * rowsPerPage;
	const indexOfFirstRow = indexOfLastRow - rowsPerPage;
	const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow);

	return (
		<div>
			<table>
				<thead>
					<tr>
						<th onClick={() => sortData('id')}>ID</th>
						<th onClick={() => sortData('name')}>Name</th>
						<th onClick={() => sortData('age')}>Age</th>
					</tr>
				</thead>
				<tbody>
					{currentRows.map((row) => (
						<tr key={row.id}>
							<td>{row.id}</td>
							<td>{row.name}</td>
							<td>{row.age}</td>
						</tr>
					))}
				</tbody>
			</table>

			{/* Пагинация */}
			<div>
				<button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
				<span>{currentPage}</span>
				<button onClick={() => setCurrentPage(currentPage + 1)} disabled={indexOfLastRow >= sortedData.length}>Next</button>
			</div>
		</div>
	);
};

export default TableComponent;