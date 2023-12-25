import React, { useState } from 'react';
import './Table.css';

type Data = {
	[key: string]: string | number;
};

type DataInfo = {
	count: number;
	next: string;
	pages: number;
	prev: null | string;
};

type TableProps = {
	data: Data[];
	info: DataInfo | undefined;
};

const Table: React.FC<TableProps> = ({ data, info }) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(15);
	const [sortConfig, setSortConfig] = useState<{ key: string, direction: string }>({ key: '', direction: '' });

	const headers = data.length > 0 ? Object.keys(data[0]) : [];

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;

	const handleSort = (key: string) => {
		let direction = 'ascending';
		if (sortConfig.key === key && sortConfig.direction === 'ascending') {
			direction = 'descending';
		}
		setSortConfig({ key, direction });
	};

	const sortedData = [...data.slice(indexOfFirstItem, indexOfLastItem)].sort((a, b) => {
		if (sortConfig.direction === 'ascending') {
			return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
		}
		if (sortConfig.direction === 'descending') {
			return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
		}
		return 0;
	});

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
						info?.count
							? `${(indexOfFirstItem + 1)} - ${indexOfLastItem} of ${info?.count}`
							: null
					}
				</div>
				<div>
					{
						info?.pages
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
									onClick={() => setCurrentPage(currentPage - 1)}
									disabled={currentPage === 1}>
									{'<'}
								</button>
								<span>{`${currentPage} / ${info?.pages}`}</span>
								<button
									onClick={() => setCurrentPage(currentPage + 1)}
									disabled={currentPage >= info?.pages}>
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

export default Table;