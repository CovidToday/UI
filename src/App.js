import React, { Component } from 'react';
import './App.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Line, Chart } from 'react-chartjs-2';
import { Container, Row, Col, Dropdown, Nav } from 'react-bootstrap';
import Header from "./header.jpg"
import Footer from "./footer.jpg"
import informationIcon from "./information_icon.png";

class App extends Component {

	constructor(props) {
		super(props);

		this.state = {
			columnDefs: [
				{
					headerName: '', children: [
						{ headerName: "STATES", field: "state", sortable: true, flex: 2, suppressMovable: true }
					]
				},
				{
					headerName: 'TRANSMISSION', children: [
						{
							headerName: "RT", field: "rt", sortable: true, flex: 1, suppressMovable: true, headerTooltip: "(95% Confidence Interval)", comparator: this.numberSort, cellStyle: function (params) {
								let style;
								let a = true;
								params.data.rtOld.forEach(rt => {
									if (rt > 1) {
										a = false;
									}
								})
								if (params.data.rtCurrent > 1) {
									style = { backgroundColor: '#ff928a' };
								} else if (params.data.rtCurrent < 1 && a === true) {
									style = { backgroundColor: '#a1ffa1' };
								} else if (params.data.rtCurrent < 1 && a === false) {
									style = { backgroundColor: '#f7faa0' };
								}
								return style;
							}
						},
						{ headerName: "CUMULATIVE CASES", field: "cumCases", sortable: true, flex: 1, suppressMovable: true, comparator: this.numberSort },
						{ headerName: "DAILY CASES", field: "dailyCases", sortable: true, flex: 1, suppressMovable: true, headerTooltip: "(7-Day Moving Average)", comparator: this.numberSort }
					]
				},
				{
					headerName: 'TESTING', children: [
						{ headerName: "POSITIVITY RATE", field: "posRate", sortable: true, flex: 1, suppressMovable: true, headerTooltip: "(7-Day Moving Average)", comparator: this.numberSort },
						{ headerName: "CUMULATIVE POSITIVITY RATE", field: "cumPosRate", sortable: true, flex: 1, suppressMovable: true, comparator: this.numberSort },
						{
							headerName: "CORRECTED CASE FATALITY RATE", field: "ccfr", sortable: true, flex: 1, suppressMovable: true, comparator: this.numberSort, cellStyle: function (params) {
								let style;
								if (params.data.ccfr > 10) {
									style = { backgroundColor: '#ff928a' };
								} else if (params.data.ccfr < 5) {
									style = { backgroundColor: '#a1ffa1' };
								} else if (params.data.ccfr < 10 && params.data.ccfr > 5) {
									style = { backgroundColor: '#f7faa0' };
								}
								return style;
							}
						},
						{ headerName: "TESTS PER MILLION", field: "testsPerMil", sortable: true, flex: 1, suppressMovable: true, comparator: this.numberSort }
					]
				}
			],
			rowData: [],
			pinnedTopRowData: [],
			rtDataFromApi: [],
			cfrDataFromApi: [],
			mobilityDataFromApi: [],
			positivityRateDataFromApi: [],
			nationalDataFromApi: [],
			minRtDataPoint: 0,
			maxRtDataPoint: 0,
			lockdownDates: ["03-25-2020", "04-15-2020", "05-04-2020", "05-18-2020"],
			lockdownDatesIndex: [],
			rtPointGraphData: { datasets: [{ data: [] }], labels: [] },
			cfrGraphData: { datasets: [], labels: [] },
			mobilityGraphData: { datsets: [], lables: [] },
			positivityRateGraphData: { datsets: [], lables: [] },
			selectedState: 'India',
			selectedView: 'Home',
			mobileView: false
		}
	}

	columnDefMobile = [
		{
			headerName: '', children: [
				{ headerName: "STATES", field: "state", sortable: true, suppressMovable: true }
			]
		},
		{
			headerName: 'TRANSMISSION', children: [
				{
					headerName: "RT", field: "rt", width: 100, sortable: true, suppressMovable: true, headerTooltip: "(95% Confidence Interval)", comparator: this.numberSort,
					cellStyle: function (params) {
						let style;
						let a = true;
						params.data.rtOld.forEach(rt => {
							if (rt > 1) {
								a = false;
							}
						})
						if (params.data.rtCurrent > 1) {
							style = { backgroundColor: '#ff928a', fontSize: "x-small" };
						} else if (params.data.rtCurrent < 1 && a === true) {
							style = { backgroundColor: '#a1ffa1', fontSize: "x-small" };
						} else if (params.data.rtCurrent < 1 && a === false) {
							style = { backgroundColor: '#f7faa0', fontSize: "x-small" };
						}
						return style;
					}
				},
				{ headerName: "CUMULATIVE CASES", field: "cumCases", width: 80, sortable: true, suppressMovable: true, comparator: this.numberSort, cellStyle: { fontSize: "x-small" } },
				{ headerName: "DAILY CASES", field: "dailyCases", width: 80, sortable: true, suppressMovable: true, headerTooltip: "(7-Day Moving Average)", comparator: this.numberSort, cellStyle: { fontSize: "x-small" } }
			]
		},
		{
			headerName: 'TESTING', children: [
				{ headerName: "POSITIVITY RATE", field: "posRate", width: 80, sortable: true, suppressMovable: true, headerTooltip: "(7-Day Moving Average)", comparator: this.numberSort, cellStyle: { fontSize: "x-small" } },
				{ headerName: "CUMULATIVE POSITIVITY RATE", field: "cumPosRate", width: 80, sortable: true, suppressMovable: true, comparator: this.numberSort, cellStyle: { fontSize: "x-small" } },
				{
					headerName: "CORRECTED CASE FATALITY RATE", field: "ccfr", width: 80, sortable: true, suppressMovable: true, comparator: this.numberSort, cellStyle: function (params) {
						let style;
						if (params.data.ccfr > 10) {
							style = { backgroundColor: '#ff928a', fontSize: "x-small" };
						} else if (params.data.ccfr < 5) {
							style = { backgroundColor: '#a1ffa1', fontSize: "x-small" };
						} else if (params.data.ccfr < 10 && params.data.ccfr > 5) {
							style = { backgroundColor: '#f7faa0', fontSize: "x-small" };
						}
						return style;
					}
				},
				{ headerName: "TESTS PER MILLION", field: "testsPerMil", width: 80, sortable: true, suppressMovable: true, comparator: this.numberSort, cellStyle: { fontSize: "x-small" } }
			]
		}
	];

	componentDidMount() {
		this.setData();
		if (window.innerWidth <= '1000') {
			this.setState({ columnDefs: this.columnDefMobile });
			this.setState({ mobileView: true });

		}
	}

	componentWillMount() {
		this.configureVerticalLinesPlugin();
	}



	async setData() {
		await axios.get('https://raw.githubusercontent.com/CovidToday/CovidToday_Website/master/backend/jsonfiles/rt.json?token=AK6PV6IG4ZVYXSB3BVP3QUK6Z5F5Q')
			.then(response => {
				this.setState({ rtDataFromApi: response.data });
				this.getRtPointGraphData(this.state.rtDataFromApi.IN);
			});

		await axios.get('https://raw.githubusercontent.com/CovidToday/CovidToday_Website/master/backend/jsonfiles/cfr.json?token=AK6PV6JRLNUDIQKW5T2SMWS6Z5E2Y')
			.then(response => {
				this.setState({ cfrDataFromApi: response.data });
				this.getCfrGraphData(this.state.cfrDataFromApi.India);
			});

		await axios.get('https://raw.githubusercontent.com/CovidToday/CovidToday_Website/master/backend/jsonfiles/india_mobility_indented.json?token=AK6PV6JES2TFKDHBAVRXFA26Z5E6G')
			.then(response => {
				this.setState({ mobilityDataFromApi: response.data });
				this.getMobilityGraphData(this.state.mobilityDataFromApi.India);
			});

		await axios.get('https://raw.githubusercontent.com/CovidToday/CovidToday_Website/master/backend/jsonfiles/positivity_Rate.json')
			.then(response => {
				this.setState({ positivityRateDataFromApi: response.data });
				this.getPositivityRateGraphData(this.state.positivityRateDataFromApi.India);
			});

		await axios.get('https://raw.githubusercontent.com/CovidToday/CovidToday_Website/master/backend/jsonfiles/national.json')
			.then(response => {
				this.setState({ nationalDataFromApi: response.data });
			});

		this.setRowData();
	}

	numberSort(a, b) {
		const numA = parseFloat(a);
		const numB = parseFloat(b);

		if (numA === null && numB === null) {
			return 0;
		}
		if (numA === null) {
			return -1;
		}
		if (numB === null) {
			return 1;
		}

		return numA - numB;
	}

	configureVerticalLinesPlugin() {
		const verticalLinePlugin = {
			getLinePosition: function (chart, pointIndex) {
				const meta = chart.getDatasetMeta(0); // first dataset is used to discover X coordinate of a point
				const data = meta.data;
				console.log(data[pointIndex]);
				if (data[pointIndex])
					return data[pointIndex]._model.x;
			},
			renderVerticalLine: function (chartInstance, pointIndex, number) {
				const lineLeftOffset = this.getLinePosition(chartInstance, pointIndex);
				const scale = chartInstance.scales['y-axis-0'];
				const context = chartInstance.chart.ctx;

				// render vertical line
				context.beginPath();
				context.strokeStyle = '#ff0000';
				context.moveTo(lineLeftOffset, scale.top);
				context.lineTo(lineLeftOffset, scale.bottom);
				context.stroke();

				// write label
				context.fillStyle = "#ff0000";
				context.textAlign = 'left';
				context.fillText(' Lockdown ' + number, lineLeftOffset, scale.top);
			},

			afterDatasetsDraw: function (chart, easing) {
				if (chart.config.plugins) {
					chart.config.plugins.verticalLineAtIndex.forEach((pointIndex, index) => this.renderVerticalLine(chart, pointIndex, index + 1));
				}
			}
		};
		Chart.plugins.register(verticalLinePlugin);
	}

	getName = (key) => {
		let name;
		switch (key) {
			case "IN":
				name = "India";
				break;
			case "ap":
				name = "Andhra Pradesh";
				break;
			case "ar":
				name = "Arunachal Pradesh";
				break;
			case "as":
				name = "Assam";
				break;
			case "br":
				name = "Bihar";
				break;
			case "ct":
				name = "Chhattisgarh";
				break;
			case "ga":
				name = "Goa";
				break;
			case "gj":
				name = "Gujarat";
				break;
			case "hr":
				name = "Haryana";
				break;
			case "hp":
				name = "Himachal Pradesh";
				break;
			case "jh":
				name = "Jharkhand";
				break;
			case "ka":
				name = "Karnataka";
				break;
			case "kl":
				name = "Kerala";
				break;
			case "mp":
				name = "Madhya Pradesh";
				break;
			case "mh":
				name = "Maharashtra";
				break;
			case "mn":
				name = "Manipur";
				break;
			case "ml":
				name = "Meghalaya";
				break;
			case "mz":
				name = "Mizoram";
				break;
			case "ng":
				name = "Nagaland";
				break;
			case "or":
				name = "Odisha";
				break;
			case "pb":
				name = "Punjab";
				break;
			case "rj":
				name = "Rajasthan";
				break;
			case "sk":
				name = "Sikkim";
				break;
			case "tn":
				name = "Tamil Nadu";
				break;
			case "tg":
				name = "Telangana";
				break;
			case "tr":
				name = "Tripura";
				break;
			case "up":
				name = "Uttar Pradesh";
				break;
			case "ut":
				name = "Uttarakhand";
				break;
			case "wb":
				name = "West Bengal";
				break;
			case "an":
				name = "Andaman and Nicobar Islands";
				break;
			case "ch":
				name = "Chandigarh";
				break;
			case "dd":
				name = "Dadra and Nagar Haweli";
				break;
			case "dl":
				name = "Delhi";
				break;
			case "jk":
				name = "Jammu & Kashmir";
				break;
			case "la":
				name = "Ladakh";
				break;
			case "lk":
				name = "Lakshadweep";
				break;
			case "py":
				name = "Puducherry";
				break;
		}

		return name;
	}

	setRowData = () => {
		const states = Object.keys(this.state.rtDataFromApi);
		const data = [];
		const pinnedData = [];
		states.shift();
		if (this.state.rtDataFromApi && this.state.cfrDataFromApi && this.state.nationalDataFromApi && this.state.positivityRateDataFromApi) {
			states && states.forEach(s => {
				const name = this.getName(s);
				if (this.state.rtDataFromApi[s] && this.state.cfrDataFromApi[name]) {
					//rt
					const rtIndex = this.state.rtDataFromApi[s].rt_point.length - 1;
					const rtPoint = rtIndex > 0 ? (this.state.rtDataFromApi[s].rt_point[rtIndex]).toFixed(2) : "NA";
					const rtl95 = rtIndex > 0 ? (this.state.rtDataFromApi[s].rt_l95[rtIndex]).toFixed(2) : "NA";
					const rtu95 = rtIndex > 0 ? (this.state.rtDataFromApi[s].rt_u95[rtIndex]).toFixed(2) : "NA";
					const rtToCompare = [];
					if (rtIndex > 13) {
						for (let i = rtIndex - 13; i <= rtIndex; i++) {
							rtToCompare.push((this.state.rtDataFromApi[s].rt_point[i]).toFixed(2));
						};
					}
					const rtData = `${rtPoint} (${rtl95}-${rtu95})`

					//cfr
					const cfrIndex = this.state.cfrDataFromApi[name].cfr3_point.length - 1;
					const cfrPoint = cfrIndex > 0 ? (this.state.cfrDataFromApi[name].cfr3_point[cfrIndex] * 100).toFixed(2) : "NA";

					//national
					let confirmedCases;
					this.state.nationalDataFromApi.statewise.forEach(item => {
						if (item.state === name) {
							confirmedCases = item.confirmed;
						}
					});

					//posRate
					const posRateArr = Object.entries(this.state.positivityRateDataFromApi);
					let cumulativePosRate;
					posRateArr.forEach(data => {
						if (data[0] === name) {
							const index = data[1].positivity_rate_cumulative.slice().reverse().findIndex(i => i !== "");
							const count = data[1].positivity_rate_cumulative.length - 1;
							const posRateIndex = index >= 0 ? count - index : index;
							cumulativePosRate = data[1].positivity_rate_cumulative[posRateIndex];
						}
					});


					data.push({
						key: s, state: name, rt: rtData, cumCases: confirmedCases, cumPosRate: cumulativePosRate,
						ccfr: cfrPoint, rtCurrent: rtPoint, rtOld: rtToCompare
					});
				}
			});
			data.sort(function (a, b) {
				return (a.rt > b.rt) ? 1 : -1
			});
			this.setState({ rowData: data })
		}

		const rtIndexInd = this.state.rtDataFromApi["IN"].rt_point.length - 1;
		const rtPointInd = rtIndexInd > 0 ? (this.state.rtDataFromApi["IN"].rt_point[rtIndexInd]).toFixed(2) : "NA";
		const rtl95Ind = rtIndexInd > 0 ? (this.state.rtDataFromApi["IN"].rt_l95[rtIndexInd]).toFixed(2) : "NA";
		const rtu95Ind = rtIndexInd > 0 ? (this.state.rtDataFromApi["IN"].rt_u95[rtIndexInd]).toFixed(2) : "NA";
		const rtToCompareInd = [];
		if (rtIndexInd > 13) {
			for (let i = rtIndexInd - 13; i <= rtIndexInd; i++) {
				rtToCompareInd.push((this.state.rtDataFromApi["IN"].rt_point[i]).toFixed(2));
			};
		}
		const rtDataInd = `${rtPointInd} (${rtl95Ind}-${rtu95Ind})`
		const cfrIndexInd = this.state.cfrDataFromApi["India"].cfr3_point.length - 1;
		const cfrPointInd = cfrIndexInd > 0 ? (this.state.cfrDataFromApi["India"].cfr3_point[cfrIndexInd] * 100).toFixed(2) : "NA";

		const cumConfirmedIndIndex = this.state.nationalDataFromApi.cases_time_series.length - 1;
		const cumCasesInd = this.state.nationalDataFromApi.cases_time_series[cumConfirmedIndIndex].totalconfirmed;

		const posRateArrInd = this.state.positivityRateDataFromApi.India;
		const indexInd = posRateArrInd.positivity_rate_cumulative.slice().reverse().findIndex(i => i !== "");
		const countInd = posRateArrInd.positivity_rate_cumulative.length - 1;
		const posRateIndexInd = indexInd >= 0 ? countInd - indexInd : indexInd;
		const cumulativePosRateInd = (posRateArrInd.positivity_rate_cumulative[posRateIndexInd] * 100).toFixed(2);

		pinnedData.push({
			key: "IN", state: "India", rt: rtDataInd, cumCases: cumCasesInd, cumPosRate: cumulativePosRateInd,
			ccfr: cfrPointInd, rtCurrent: rtPointInd, rtOld: rtToCompareInd
		})
		this.setState({ pinnedTopRowData: pinnedData })
	}

	getRtPointGraphData = (dataFromApi) => {
		if (dataFromApi) {
			let data = {
				datasets: [],
				labels: []
			};
			let lockdownDatesIndex = [];
			data.labels = dataFromApi.dates;

			this.state.lockdownDates.forEach(date => {
				let index = dataFromApi.dates.indexOf(date);
				if (index > 0) {
					lockdownDatesIndex.push(index);
				}
			});
			console.log(lockdownDatesIndex);

			const maxRtDataPoint = Math.ceil(Math.max(...dataFromApi.rt_u95));
			const minRtDataPoint = Math.floor(Math.min(...dataFromApi.rt_l95, 0));

			//Horizontal line
			let horizontalLineData = [];
			for (let i = 0; i < dataFromApi.dates.length; i++) {
				horizontalLineData.push(1);
			}
			data.datasets.push({
				label: 'fixed value',
				data: horizontalLineData,
				borderColor: 'rgba(0,255,0,0.5)',
				fill: false,
				radius: 0,
				hoverRadius: 0,
			});

			//The vertical lines data logic
			// let verticalLineData = [];
			// const lockdownDates = this.state.lockdownDates;
			// for (let j = 0; j < lockdownDates.length; j++) {
			// 	let obj = {
			// 		//type: 'line',
			// 		label: 'Lockdown ' + (j + 1),
			// 		backgroundColor: 'red',
			// 		borderColor: 'red',
			// 		radius: 0,
			// 		hoverRadius: 0,
			// 		data: []
			// 	};
			// 	for (let i = minRtDataPoint; i <= maxRtDataPoint; i++) {
			// 		obj.data.push({
			// 			x: lockdownDates[j],
			// 			y: i
			// 		});
			// 	}
			// 	verticalLineData.push(obj);
			// }
			// data.datasets.push(...verticalLineData);

			// Main data
			let mainData = [{
				label: 'Rt l95',
				data: dataFromApi.rt_l95.slice(),
				fill: '2',// + (verticalLineData.length + 2),
				backgroundColor: 'lightblue',
				radius: 0,
				hoverRadius: 0,
			}, {
				label: 'Rt l50',
				data: dataFromApi.rt_l50.slice(),
				fill: '1',// + (verticalLineData.length + 3),
				backgroundColor: 'blue',
				radius: 0,
				hoverRadius: 0,
			}, {
				label: 'Rt Point',
				data: dataFromApi.rt_point.slice(),
				borderColor: 'black',
				fill: false
			}, {
				label: 'Rt u50',
				data: dataFromApi.rt_u50.slice(),
				fill: '-2',
				backgroundColor: 'blue',
				radius: 0,
				hoverRadius: 0,
			}, {
				label: 'Rt u95',
				data: dataFromApi.rt_u95.slice(),
				fill: '-4',
				backgroundColor: 'lightblue',
				radius: 0,
				hoverRadius: 0,
			}];
			data.datasets.push(...mainData);
			this.setState({
				rtPointGraphData: data,
				maxRtDataPoint: maxRtDataPoint,
				minRtDataPoint: minRtDataPoint,
				lockdownDatesIndex: lockdownDatesIndex
			}, this.RtChartRender);
		}
	}

	getCfrGraphData = (dataFromApi) => {
		if (dataFromApi) {
			let data = {
				datasets: [],
				labels: []
			};
			data.labels = dataFromApi.dates;

			// Horizontal line
			let horizontalLineData = [];
			for (let i = 0; i < dataFromApi.dates.length; i++) {
				horizontalLineData.push(10);
			}
			data.datasets.push({
				label: 'upper limit',
				data: horizontalLineData,
				borderColor: 'rgba(255,0,0,0.5)',
				fill: false,
				radius: 0,
				hoverRadius: 0,
			});
			horizontalLineData = [];
			for (let i = 0; i < dataFromApi.dates.length; i++) {
				horizontalLineData.push(5);
			}
			data.datasets.push({
				label: 'lower limit',
				data: horizontalLineData,
				borderColor: 'rgba(0,255,0,0.5)',
				fill: false,
				radius: 0,
				hoverRadius: 0,
			});
			const cfrDataSet = dataFromApi.cfr3_point.map(d => {
				return d * 100;
			});

			// Main data
			let mainData = [{
				label: 'CFR',
				data: cfrDataSet,
				borderColor: 'black',
				fill: false
			},];
			data.datasets.push(...mainData);
			this.setState({
				cfrGraphData: data,
			});
		}
	}
	getMobilityGraphData = (dataFromApi) => {
		if (dataFromApi) {
			let data = {
				datasets: [],
				labels: []
			};
			data.labels = dataFromApi.dates;
			const mobilityDataSet = dataFromApi.average_mobility.slice();

			// Main data
			let mainData = [{
				label: 'Mobility',
				data: mobilityDataSet,
				borderColor: 'black',
				fill: false
			},];
			data.datasets.push(...mainData);
			this.setState({
				mobilityGraphData: data,
			});
		}
	}

	getPositivityRateGraphData = (dataFromApi) => {
		if (dataFromApi) {
			let data = {
				datasets: [],
				labels: []
			};
			data.labels = dataFromApi.dates;

			// Horizontal line
			let horizontalLineData = [];
			for (let i = 0; i < dataFromApi.dates.length; i++) {
				horizontalLineData.push(10);
			}
			data.datasets.push({
				label: 'upper limit',
				data: horizontalLineData,
				borderColor: 'rgba(255,0,0,0.5)',
				fill: false,
				radius: 0,
				hoverRadius: 0,
			});
			horizontalLineData = [];
			for (let i = 0; i < dataFromApi.dates.length; i++) {
				horizontalLineData.push(5);
			}
			data.datasets.push({
				label: 'lower limit',
				data: horizontalLineData,
				borderColor: 'rgba(0,255,0,0.5)',
				fill: false,
				radius: 0,
				hoverRadius: 0,
			});
			const positivityRateDataSet = dataFromApi.daily_positivity_rate.map(d => {
				return d * 100;
			});

			// Main data
			let mainData = [{
				label: 'Positive Rate',
				data: positivityRateDataSet,
				borderColor: 'black',
				fill: false
			},];
			data.datasets.push(...mainData);
			this.setState({
				positivityRateGraphData: data,
			});
		}
	}

	onSelectionChanged = (data) => {
		const selectedRows = data.api.getSelectedRows();
		const selectedState = selectedRows[0].key;
		const state = this.getName(selectedState);
		this.getRtPointGraphData(this.state.rtDataFromApi[selectedState]);
		this.getCfrGraphData(this.state.cfrDataFromApi[state]);
		this.getMobilityGraphData(this.state.mobilityDataFromApi[state]);
		this.getPositivityRateGraphData(this.state.positivityRateDataFromApi[state]);
		this.setState({ selectedState: state });
	}

	onStateSelect(key) {
		const stateName = this.getName(key);
		this.setState({ selectedState: stateName });
		this.getRtPointGraphData(this.state.rtDataFromApi[key]);
		this.getMobilityGraphData(this.state.mobilityDataFromApi[stateName]);
		this.getPositivityRateGraphData(this.state.positivityRateDataFromApi[stateName]);
		this.getCfrGraphData(this.state.cfrDataFromApi[stateName]);
	}

	DropdownItems(props) {
		const name = this.getName(props.key);
		return <Dropdown.Item onSelect={() => this.onStateSelect(props.key)}>{name}</Dropdown.Item>
	}

	DropdownRenderer = () => {
		return <div className="sub-header-row">
			<span className="header-bar-text"> </span>
			{!this.state.mobileView && <span className="header-bar-text">TRANSMISSION</span>}
			<span className="header-bar-dropdown">
				<Dropdown>
					<Dropdown.Toggle variant="success" id="dropdown-basic" style={{ backgroundColor: "#1167b1", borderColor: "black" }}>
						{this.state.selectedState}
					</Dropdown.Toggle>

					<Dropdown.Menu>
						{Object.entries(this.state.rtDataFromApi).map((item) => {
							return <Dropdown.Item onSelect={() => this.onStateSelect(item[0])}>{this.getName(item[0])}</Dropdown.Item>
						})}
					</Dropdown.Menu>
				</Dropdown>
			</span>
			{!this.state.mobileView && <span className="header-bar-text">TESTING</span>}
			<span className="header-bar-text"> </span>
		</div>
	}

	RtChartRender = () => {
		const { minRtDataPoint, maxRtDataPoint, rtPointGraphData, lockdownDatesIndex } = this.state;
		return <Line
			data={rtPointGraphData}
			height={300}
			plugins={{
				verticalLineAtIndex: [3, 24, 43]//lockdownDatesIndex//[3, 24, 43]
			}}
			options={{
				maintainAspectRatio: false,
				legend: {
					display: false,
					// labels: {
					// 	filter: function (item, chart) {
					// 		return item.text.includes('Lockdown');
					// 	}
					// }
				},
				title: {
					display: true,
				},
				scales: {
					yAxes: [{
						display: true,
						ticks: {
							suggestedMin: minRtDataPoint,
							suggestedMax: maxRtDataPoint,
							stepSize: 1
						},
					}],
					xAxes: [{
						gridLines: {
							display: false,
						},
						// ticks: {
						// 	type: 'time',
						// 	maxTicksLimit: 53,
						// 	sampleSize: 55,
						// },
					}]
				},
			}}
		/>
	}

	render() {
		const { mobilityGraphData, cfrGraphData, positivityRateGraphData, selectedView } = this.state;
		return (
			<div>
				<div className="header-pic-container">
					<img src={Header} className="header-pic" />
				</div>
				<div>
					<Nav fill="true" justify="true" variant="tabs" className="nav-tabs">
						<Nav.Item>
							<Nav.Link onClick={() => this.setState({ selectedView: "Home" })}>
								<span className="nav-text">HOME</span></Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link onClick={() => this.setState({ selectedView: "Methods" })}>
								<span className="nav-text">METHODS</span></Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link onClick={() => this.setState({ selectedView: "Team" })}>
								<span className="nav-text">TEAM</span></Nav.Link>
						</Nav.Item>
					</Nav>
				</div>
				<br />
				{selectedView === "Home" && <>
					<div className="App">
						<this.DropdownRenderer />


						<Container>
							<Row>
								<Col lg="6">
									{/* RT Graph */}
									<Row>
										<Col>
											<h5 className="mb-0 mt-2">Effective Reproduction Number (Rt) <img src={informationIcon} className="information-icon" alt="information png" /></h5>
											<div className="rtgraph">
												<this.RtChartRender />
											</div>
										</Col>
									</Row>
									<div className="mt-2"></div>
									{/* Mobility Graph */}
									<Row>
										<Col>
											<h5 className="mb-0 mt-2">Mobility Index <img src={informationIcon} className="information-icon" alt="information png" /></h5>
											<div className="mobilityGraph">
												<Line
													data={mobilityGraphData}
													height={300}
													options={{
														maintainAspectRatio: false,
														legend: {
															display: false,
														},
														title: {
															display: true,
														},
														scales: {
															yAxes: [{
																display: true,
															}],
															xAxes: [{
																gridLines: {
																	display: false,
																}
															}]
														},
													}}
												/>
											</div>
										</Col>
									</Row>
								</Col>
								<Col>
									{/* CFR Graph */}
									<Row>
										<Col>
											<h5 className="mb-0 mt-2">Corrected Case Fatality Rate (CFR) <img src={informationIcon} className="information-icon" alt="information png" /></h5>
											<div className="cfr-graph">
												<Line
													data={cfrGraphData}
													height={300}
													options={{
														maintainAspectRatio: false,
														legend: {
															display: false,
														},
														title: {
															display: true,
														},
														scales: {
															yAxes: [{
																display: true,
															}],
															xAxes: [{
																gridLines: {
																	display: false,
																}
															}]
														},
													}}
												/>
											</div>
										</Col>
									</Row>
									<div className="mt-2"></div>
									{/* Pos Rate Graph */}
									<Row>
										<Col>
											<h5 className="mb-0 mt-2">Positivity Rate <img src={informationIcon} className="information-icon" alt="information png" /></h5>
											<div className="positivityrate-graph">
												<Line
													data={positivityRateGraphData}
													height={300}
													options={{
														maintainAspectRatio: false,
														legend: {
															display: false,
														},
														title: {
															display: true,
														},
														scales: {
															yAxes: [{
																display: true,
															}],
															xAxes: [{
																gridLines: {
																	display: false,
																}
															}]
														},
													}}
												/>
											</div>
										</Col>
									</Row>
								</Col>
							</Row>
						</Container>

								
						<div className="sub-header-row mt-4">
							<span className="header-bar-text">LATEST STATEWISE DATA</span>
						</div>
						<Container>
							<div
								id="myTable"
								className="ag-theme-balham"
								style={!this.state.mobileView ? {
									padding: '20px'
								} : { paddingTop: '20px' }}
							>
								<AgGridReact
									columnDefs={this.state.columnDefs}
									rowData={this.state.rowData}
									rowSelection={"single"}
									headerHeight='48'
									domLayout='autoHeight'
									pinnedTopRowData={this.state.pinnedTopRowData}
									onSelectionChanged={this.onSelectionChanged.bind(this)} />
							</div>
						</Container>
					</div>
				</>}
				{selectedView === "Methods" && <div className="App">Methods</div>}
				{selectedView === "Team" && <div className="App">ABOUT US</div>}
				<div className="footer-pic-container">
					<img src={Footer} className="footer-pic" />
				</div>
			</div>
		);
	}
}

export default App;
