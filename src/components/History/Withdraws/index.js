import React, { Fragment, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Icon, Select } from 'antd';
import { useSelector } from 'react-redux';
import getSymbol from '../../funtions/getSymbol';
import getSymbolImg from '../../funtions/getSymbolImg';
import compareValues from '../../funtions/compareValues';
import moment from 'moment';
import ReactPaginate from 'react-paginate';

const { Option } = Select;

export default function Withdraws() {
	const { mode } = useSelector((state) => state.general);
	const { withdrawls } = useSelector((state) => state.history);
	const [ withdrawsRender, setWithdrawsRender ] = useState([]);
	const [ withs, setWiths ] = useState([]);
	const [ startDateA, setStartDateA ] = useState(new Date());
	const [ startDateB, setStartDateB ] = useState(new Date());
	const [ classes, setClasses ] = useState({
		date: 'fa-angle-down',
		asset: 'fa-angle-down',
		amount: 'fa-angle-down',
		status: 'fa-angle-down'
	});
	const [ offset, setOffset ] = useState(0);
	const [ elements, setElements ] = useState([]);
	const [ currentPage, setCurrentPage ] = useState(0);
	const [ pageCount, setPageCount ] = useState(0);
	const perPage = 10;

	const handleSort = (type) => {
		let newClasses = {};
		let sortType = 'asc';
		for (let e in classes) {
			if (e === type) {
				if (classes[e] === 'fa-angle-down') {
					newClasses[e] = 'fa-angle-up';
				} else {
					newClasses[e] = 'fa-angle-down';
					sortType = 'desc';
				}
			} else {
				newClasses[e] = 'fa-angle-down';
			}
		}
		setClasses(newClasses);
		let sortKey = '';
		let withsSorted = [];
		switch (type) {
			case 'date':
				sortKey = 'created_at';
				withsSorted = withs.sort(compareValues(sortKey, sortType));
				setWiths([ ...withsSorted ]);
				break;
			case 'asset':
				sortKey = 'asset';
				withsSorted = withs.sort(compareValues(sortKey, sortType));
				setWiths([ ...withsSorted ]);
				break;
			case 'amount':
				sortKey = 'amount';
				withsSorted = withs.sort(compareValues(sortKey, sortType));
				setWiths([ ...withsSorted ]);
				break;
			default:
				break;
		}
	};

	useEffect(
		(_) => {
			// console.log(deposits);
			setWiths(withdrawls);
		},
		//eslint-disable-next-line react-hooks/exhaustive-deps
		[ withdrawls ]
	);

	useEffect(
		(_) => {
			setPageCount(Math.ceil(withs.length / perPage));
			setWithdrawsRender(
				withs.map((e, i) => {
					const date = moment(e.created_at).utc(false).format('DD.MM.YYYY HH:mm:ss');
					return (
						<Fragment key={i + 'sk'}>
							<div className="line">
								<span className="cell time">{date}</span>
								<div className="cell short emp btc">
									<img
										src={getSymbolImg(getSymbol(e.asset))}
										alt="hist"
										style={{ width: '20px', height: '20px' }}
									/>
									<span>{getSymbol(e.asset)}</span>
								</div>
								<span className="cell amount">
									<span className="title-m">Amount</span> <span>{e.amount}</span>
								</span>
								<span className="cell filled status">Filled</span>
							</div>
						</Fragment>
					);
				})
			);
		},
		//eslint-disable-next-line react-hooks/exhaustive-deps
		[ withs ]
	);

	useEffect(
		(_) => {
			// console.log('length ', depositsRender.length)
			if (withdrawsRender.length > 0) {
				setElementsForCurrentPage();
			}
		},
		//eslint-disable-next-line react-hooks/exhaustive-deps
		[ withdrawsRender ]
	);

	useEffect(
		(_) => {
			let newTime = moment(startDateA).unix();
			let timeB = moment(startDateB).unix();

			let newWiths = withdrawls.filter((e) => {
				const time = moment(e.created_at).unix();
				return time >= newTime && time <= timeB;
			});

			setWiths(newWiths);
		},
		//eslint-disable-next-line react-hooks/exhaustive-deps
		[ startDateA ]
	);

	useEffect(
		(_) => {
			let newTime = moment(startDateB).unix();
			let timeA = moment(startDateA).unix();

			let newWiths = withdrawls.filter((e) => {
				const time = moment(e.created_at).unix();
				return time <= newTime && time >= timeA;
			});

			setWiths(newWiths);
		},
		//eslint-disable-next-line react-hooks/exhaustive-deps
		[ startDateB ]
	);

	const handleDateChangeRaw = (e) => {
		e.preventDefault();
	};

	const handleAsset = (asset) => {
		if (asset === 'ALL') {
			setWiths(withdrawls);
		} else {
			let newWiths = withdrawls.filter((e) => {
				const symbol = getSymbol(e.asset);
				return symbol === asset;
			});

			setWiths(newWiths);
		}
	};

	const optsClass = mode === 'Light' ? 'option-select emp' : 'dark-mode option-select emp';

	const setElementsForCurrentPage = () => {
		let elements = withdrawsRender.slice(offset, offset + perPage);
		setElements(elements);
	};

	useEffect(
		(_) => {
			setElementsForCurrentPage();
		},
		//eslint-disable-next-line react-hooks/exhaustive-deps
		[ currentPage, offset ]
	);

	const handlePageClick = (data) => {
		const selectedPage = data.selected;
		const offset = selectedPage * perPage;
		setCurrentPage(selectedPage);
		setOffset(offset);
	};

	return (
		<div className="history-table">
			<p className="heading">Withdraw History</p>
			<div className="table-wrapper">
				<div className="top">
					<div className="date">
						<div className="date-1">
							<DatePicker
								selected={startDateA}
								onChange={(date) => setStartDateA(date)}
								calendarClassName="date"
								dateFormat="dd.MM.Y"
								onChangeRaw={handleDateChangeRaw}
							/>
							<span className="date-icon">
								<Icon type="calendar" />
							</span>
						</div>
						<span className="hr" />
						<div className="date-1">
							<DatePicker
								selected={startDateB}
								onChange={(date) => setStartDateB(date)}
								calendarClassName="date"
								dateFormat="dd.MM.Y"
								onChangeRaw={handleDateChangeRaw}
							/>
							<span className="date-icon">
								<Icon type="calendar" />
							</span>
						</div>
					</div>
					<div className="all">
						<Select
							className="price-card-selector emp"
							defaultValue="BTC"
							style={{ width: 80, padding: 0, border: 'none' }}
							onChange={handleAsset}
						>
							<Option value="BTC" className={optsClass}>
								BTC
							</Option>
							<Option value="ETH" className={optsClass}>
								ETH
							</Option>
							<Option value="XRP" className={optsClass}>
								XRP
							</Option>
							<Option value="ALL" className={optsClass}>
								ALL
							</Option>
						</Select>
					</div>
					<div className="all status">
						<Select
							className="price-card-selector emp"
							defaultValue="Filled"
							style={{ width: 100, padding: 0, border: 'none' }}
							// onChange={handleChangeA}
						>
							<Option value="filled" className={optsClass}>
								Filled
							</Option>
							<Option value="open" className={optsClass}>
								Open
							</Option>
							<Option value="cancel" className={optsClass}>
								Cancel
							</Option>
						</Select>
					</div>
				</div>
				<div className="table-content">
					<div className="titles">
						<div className="title" onClick={(_) => handleSort('date')}>
							<span>Date</span>
							<i className={`fa ${classes.date}`} aria-hidden="true" />
						</div>
						<div className="title short" onClick={(_) => handleSort('asset')}>
							<span className="short">Asset</span>
							<i className={`fa ${classes.asset}`} aria-hidden="true" />
						</div>
						<div className="title" onClick={(_) => handleSort('amount')}>
							<span>Amount</span>
							<i className={`fa ${classes.amount}`} aria-hidden="true" />
						</div>
						<div className="title status">
							<span>Status</span>
							<i className={`fa ${classes.status}`} aria-hidden="true" />
						</div>
					</div>
					<div className="lines">
						{/* {withdrawsRender} */}
						{elements}
					</div>
				</div>
				<div className="pagination">
					{withdrawsRender.length > 0 && (
						<ReactPaginate
							previousLabel={<i className="fa fa-angle-left arrow-prev" aria-hidden="true" />}
							nextLabel={<i className="fa fa-angle-right arrow-next" aria-hidden="true" />}
							breakLabel={<span className="gap">...</span>}
							pageCount={pageCount}
							onPageChange={handlePageClick}
							forcePage={currentPage}
							containerClassName={'pagination'}
							disabledClassName={'disabled'}
							activeClassName={'num active'}
							pageLinkClassName="num"
						/>
					)}
					{/* <i className="fa fa-angle-left arrow-prev" aria-hidden="true" />
					<span className="num">1</span>
					<span className="num active">2</span>
					<span className="num">3</span>
					<span className="num">...</span>
					<span className="num">8</span>
					<i className="fa fa-angle-right arrow-next" aria-hidden="true" /> */}
				</div>
			</div>
		</div>
	);
}