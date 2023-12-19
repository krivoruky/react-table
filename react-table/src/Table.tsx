import React, { useState, useEffect } from 'react';
import './Table.css';

type TableProps = { data: [] };


const Table = ({ data }: TableProps) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(15);
	const [sortConfig, setSortConfig] = useState(null);

	const headers = data?.result?.length > 0 ? Object.keys(data[0]) : [];

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = data?.result?.slice(indexOfFirstItem, indexOfLastItem);

	const handleSort = (key) => {
		let direction = 'ascending';
		if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
			direction = 'descending';
		}
		setSortConfig({ key, direction });
	};
	console.log("data?.result?", data?.result);
	console.log("data", data);
	console.log("currentPage", currentPage);
	console.log("itemsPerPage", itemsPerPage);
	console.log("sortConfig", sortConfig);
	console.log("indexOfLastItem", indexOfLastItem);
	console.log("indexOfFirstItem", indexOfFirstItem);
	console.log("currentItems", currentItems);

	useEffect(() => {
		if (sortConfig !== null) {
			currentItems.sort((a, b) => {
				if (a[sortConfig.key] < b[sortConfig.key]) {
					return sortConfig.direction === 'ascending' ? -1 : 1;
				}
				if (a[sortConfig.key] > b[sortConfig.key]) {
					return sortConfig.direction === 'ascending' ? 1 : -1;
				}
				return 0;
			});
		}
	}, [sortConfig, currentItems]);

	return (
		<div className="table-container">
			<table>
				<thead>
					<tr>
						{headers?.map((header) => (
							<th key={header} onClick={() => handleSort(header)}>
								{header}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{currentItems?.map((item, index) => (
						<tr key={index}>
							{headers?.map((header) => (
								<td key={header}>{item[header]}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
			<div className="pagination">
				<select
					value={itemsPerPage}
					onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
				>
					<option value={10}>10</option>
					<option value={15}>15</option>
					<option value={20}>20</option>
				</select>
				{Array.from({ length: Math.ceil(data?.result?.length / itemsPerPage) }, (_, i) => (
					<button key={i} onClick={() => setCurrentPage(i + 1)}>
						{i + 1}
					</button>
				))}
			</div>
		</div>
	);
};

export default Table;