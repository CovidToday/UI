import React, { Component } from 'react';
import './App.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Line, Chart } from 'react-chartjs-2';
import { Container, Row, Col, Dropdown, Nav, Card, Button, Popover, OverlayTrigger } from 'react-bootstrap';
import Header from "./images/header.png"
import Footer from "./images/footer.jpg"
import informationIcon from "./images/information_icon.png";
import upIcon from "./images/arrow_up.png"
import downIcon from "./images/arrow_down.png"

class App extends Component {

	constructor(props) {
		super(props);
		this.textDivRef = React.createRef()

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
						{
							headerName: "POSITIVITY RATE", field: "posRate", sortable: true, flex: 1, suppressMovable: true, headerTooltip: "(7-Day Moving Average)", comparator: this.numberSort, cellStyle: function (params) {
								let style;
								const posRateNumber = parseFloat(params.data.posRate);
								if (posRateNumber > 10) {
									style = { backgroundColor: '#ff928a' };
								} else if (posRateNumber < 5) {
									style = { backgroundColor: '#a1ffa1' };
								} else if (posRateNumber < 10 && posRateNumber > 5) {
									style = { backgroundColor: '#f7faa0' };
								}
								return style;
							}
						},
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
				{
					headerName: "POSITIVITY RATE", field: "posRate", width: 80, sortable: true, suppressMovable: true, headerTooltip: "(7-Day Moving Average)", comparator: this.numberSort, cellStyle: function (params) {
						let style;
						const posRateNumber = parseFloat(params.data.posRate);
						if (posRateNumber > 10) {
							style = { backgroundColor: '#ff928a', fontSize: "x-small" };
						} else if (posRateNumber < 5) {
							style = { backgroundColor: '#a1ffa1', fontSize: "x-small" };
						} else if (posRateNumber < 10 && posRateNumber > 5) {
							style = { backgroundColor: '#f7faa0', fontSize: "x-small" };
						}
						return style;
					}
				},
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
				console.log(response.data);
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
			case "nl":
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
			case "dn":
				name = "Dadra and Nagar Haveli and Daman and Diu";
				break;
			case "dl":
				name = "Delhi";
				break;
			case "jk":
				name = "Jammu and Kashmir";
				break;
			case "la":
				name = "Ladakh";
				break;
			case "ld":
				name = "Lakshadweep";
				break;
			case "py":
				name = "Puducherry";
				break;
		}

		return name;
	}

	setRowData = () => {
		const allstates = [];
		this.state.nationalDataFromApi && this.state.nationalDataFromApi.statewise.forEach(i => {
			allstates.push(i.statecode.toLowerCase());
		});
		const states = allstates.filter(s => s !== "tt" && s !== "un" && s !== "ld");
		const data = [];
		const pinnedData = [];
		if (this.state.rtDataFromApi && this.state.cfrDataFromApi && this.state.nationalDataFromApi && this.state.positivityRateDataFromApi) {
			states && states.forEach(s => {
				const name = this.getName(s);

				//rt
				const rtIndex = this.state.rtDataFromApi[s] ? this.state.rtDataFromApi[s].rt_point.length - 1 : -1;
				const rtPoint = rtIndex > 0 ? (this.state.rtDataFromApi[s].rt_point[rtIndex]).toFixed(2) : "NA";
				const rtl95 = rtIndex > 0 ? (this.state.rtDataFromApi[s].rt_l95[rtIndex]).toFixed(2) : "NA";
				const rtu95 = rtIndex > 0 ? (this.state.rtDataFromApi[s].rt_u95[rtIndex]).toFixed(2) : "NA";
				const rtToCompare = [];
				if (rtIndex > 13) {
					for (let i = rtIndex - 13; i <= rtIndex; i++) {
						rtToCompare.push((this.state.rtDataFromApi[s].rt_point[i]).toFixed(2));
					};
				}
				const rtData = rtPoint === "NA" ? "NA" : `${rtPoint} (${rtl95}-${rtu95})`;

				//cfr
				const cfrIndex = this.state.cfrDataFromApi[name] ? this.state.cfrDataFromApi[name].cfr3_point.length - 1 : -1;
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
						const indexCum = data[1].positivity_rate_cumulative.slice().reverse().findIndex(i => i !== "");
						const countCum = data[1].positivity_rate_cumulative.length - 1;
						const cumPosRateIndex = indexCum >= 0 ? countCum - indexCum : indexCum;
						const cumulativePosRateFloat = data[1].positivity_rate_cumulative[cumPosRateIndex];
						cumulativePosRate = cumulativePosRateFloat && cumulativePosRateFloat !== "" ? cumulativePosRateFloat : "NA";
					}
				});
				let maCases;
				posRateArr.forEach(data => {
					if (data[0] === name) {
						const indexMACases = data[1].daily_positive_cases_ma.slice().reverse().findIndex(i => i !== "");
						const countMACases = data[1].daily_positive_cases_ma.length - 1;
						const MACasesIndex = indexMACases >= 0 ? countMACases - indexMACases : indexMACases;
						const maCasesFloat = data[1].daily_positive_cases_ma[MACasesIndex];
						maCases = maCasesFloat && maCasesFloat !== "" ? maCasesFloat.toFixed(2) : "NA";
					}
				});
				let maPosRate;
				posRateArr.forEach(data => {
					if (data[0] === name) {
						const indexPosRateMa = data[1].daily_positivity_rate_ma.slice().reverse().findIndex(i => i !== "");
						const countPosRateMa = data[1].daily_positivity_rate_ma.length - 1;
						const posRateMaIndex = indexPosRateMa >= 0 ? countPosRateMa - indexPosRateMa : indexPosRateMa;
						const maPosRateFloat = (data[1].daily_positivity_rate_ma[posRateMaIndex]);
						maPosRate = maPosRateFloat && maPosRateFloat !== "" ? (maPosRateFloat * 100).toFixed(2) : "NA";
					}
				});


				data.push({
					key: s, state: name, rt: rtData, cumCases: confirmedCases, dailyCases: maCases, posRate: maPosRate, cumPosRate: cumulativePosRate,
					ccfr: cfrPoint, rtCurrent: rtPoint, rtOld: rtToCompare
				});
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

		const indexIndPosRateMa = posRateArrInd.daily_positivity_rate_ma.slice().reverse().findIndex(i => i !== "");
		const countIndPosRateMa = posRateArrInd.daily_positivity_rate_ma.length - 1;
		const posRateMaIndexInd = indexIndPosRateMa >= 0 ? countIndPosRateMa - indexIndPosRateMa : indexIndPosRateMa;
		const PosRateMaInd = (posRateArrInd.daily_positivity_rate_ma[posRateMaIndexInd] * 100).toFixed(2);

		const indexIndcasesMa = posRateArrInd.daily_positive_cases_ma.slice().reverse().findIndex(i => i !== "");
		const countIndcasesMa = posRateArrInd.daily_positive_cases_ma.length - 1;
		const casesMaIndexInd = indexInd >= 0 ? countIndcasesMa - indexIndcasesMa : indexIndcasesMa;
		const casesMaInd = (posRateArrInd.daily_positive_cases_ma[casesMaIndexInd]).toFixed(2);

		pinnedData.push({
			key: "IN", state: "India", rt: rtDataInd, cumCases: cumCasesInd, dailyCases: casesMaInd, posRate: PosRateMaInd, cumPosRate: cumulativePosRateInd,
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
				radius: 1,
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
				radius: 1,
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
				label: 'Mobility Average',
				data: dataFromApi.average_mobility.slice(),
				borderColor: 'black',
				borderWidth: 3,
				radius: 1,
				fill: false
			},{
				label: 'Grocery',
				data: dataFromApi.grocery.slice(),
				borderColor: 'blue',
				borderWidth: 1,
				radius: 0,
				fill: false
			},{
				label: 'Parks',
				data: dataFromApi.parks.slice(),
				borderColor: 'green',
				borderWidth: 1,
				radius: 0,
				fill: false
			}, {
				label: 'Residential',
				data: dataFromApi.residential.slice(),
				borderColor: 'purple',
				borderWidth: 1,
				radius: 0,
				fill: false
			},{
				label: 'Retail',
				data: dataFromApi.retail.slice(),
				borderColor: 'gray',
				borderWidth: 1,
				radius: 0,
				fill: false
			}, {
				label: 'Transit',
				data: dataFromApi.transit.slice(),
				borderColor: 'violet',
				borderWidth: 1,
				radius: 0,
				fill: false
			}, {
				label: 'Workplace',
				data: dataFromApi.workplace.slice(),
				borderColor: 'yellow',
				borderWidth: 1,
				radius: 0,
				fill: false
			}];
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
			const positivityRateDataSet = dataFromApi.daily_positivity_rate_ma.map(d => {
				return d * 100;
			});

			// Main data
			let mainData = [{
				label: 'Positive Rate',
				data: positivityRateDataSet,
				borderColor: 'black',
				radius: 1,
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
				tooltips: {
					filter: function (tooltipItem) {
						return tooltipItem.datasetIndex === 3;
					}
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

	handleDivScroll = (event) => {
		if (this.textDivRef.current) {
			this.textDivRef.current.scrollIntoView({
				behavior: "smooth",
				block: "nearest"
			})
		}
	}

	render() {
		const { mobilityGraphData, cfrGraphData, positivityRateGraphData, selectedView, mobileView } = this.state;
		const rtPopover = (
			<Popover id="rt-popover">
				<Popover.Title as="h3">Effective Reproduction Number (Rt)</Popover.Title>
				<Popover.Content>
					And here's some <strong>amazing</strong> content. It's very engaging.
				right?
				</Popover.Content>
			</Popover>
		);

		const cfrPopover = (
			<Popover id="cfr-popover">
				<Popover.Title as="h3">Corrected Case Fatality Rate (CFR)</Popover.Title>
				<Popover.Content>
					And here's some <strong>amazing</strong> content. It's very engaging.
				right?
				</Popover.Content>
			</Popover>
		);

		const mobilityPopover = (
			<Popover id="mobility-popover">
				<Popover.Title as="h3">Mobility Index</Popover.Title>
				<Popover.Content>
					And here's some <strong>amazing</strong> content. It's very engaging.
				right?
				</Popover.Content>
			</Popover>
		);

		const positivityPopover = (
			<Popover id="positivity-popover">
				<Popover.Title as="h3">Positivity Rate</Popover.Title>
				<Popover.Content>
					And here's some <strong>amazing</strong> content. It's very engaging.
				right?
				</Popover.Content>
			</Popover>
		);

		return (
			<div>
				<div>
				<span className={mobileView ? "header-pic-mobile" : "header-pic-container"}>
					<img src={Header} className="header-pic" />
				</span>
				{<span className={mobileView ? "nav-button-group-mobile" : "nav-button-group"}>
						<span className={mobileView ? "nav-bar-mobile" : "nav-bar"}>
							<Button variant="outline-primary" className="nav-button" onClick={() => this.setState({ selectedView: "Home" })}>Dashboard</Button>
						</span>
						<span className={mobileView ? "nav-bar-mobile" : "nav-bar"}>
							<Button variant="outline-primary" className="nav-button" onClick={() => this.setState({ selectedView: "Methods" })}>Methods</Button>
						</span>
						<span className={mobileView ? "nav-bar-mobile" : "nav-bar"}>
							<Button variant="outline-primary" className="nav-button" onClick={() => this.setState({ selectedView: "Contribute" })}>Contribute</Button>
						</span>
						<span className={mobileView ? "nav-bar-mobile" : "nav-bar"}>
							<Button variant="outline-primary" className="nav-button" onClick={() => this.setState({ selectedView: "Team" })}>About Us</Button>
						</span>
					</span>}
					
				</div>
				
				<br />
				{selectedView === "Home" && <>
					<div className="App">

						<div className="home-text">
							<Card>
								<Card.Body>
									<Card.Title className="top-text-title" style={{ fontWeight: "bold" }}>{`Tracking India\'s Progress Through The Coronavirus Pandemic`}</Card.Title>
									<Card.Text className="top-text-body">
										{`The number of confirmed cases, recoveries, deaths and tests which are routinely reported in dashboards are useful, 
										but can give deeper insights into the progress of the epidemic if analysed and interpreted into scientific outbreak 
										indicators for each state in real-time. As lockdown is relaxed across India, it is essential to monitor these 
										indicators and adapt the response accordingly. You need not be adept at epidemiology and statistics to grasp the 
										data we present, and we will assist you along the way.`}
									</Card.Text>
								</Card.Body>
								<Card.Body>
									<Card.Title className="top-text-title" style={{ fontWeight: "bold" }}>{`Reliable Scientific Data for Policymakers, Researchers, Journalists and Citizens`}</Card.Title>
									<Card.Text className="top-text-body">
										<div>We do the hard work for you, so you can focus on what the data means. <br />
										Collating data from multiple sources <br />
										Analysing the data using robust statistical methods to estimate scientific indicators <br />
										Utilising latest scientific evidence and advisories to inform estimation and interpretation <br />
										Accounting for known biases in estimation to give a truer picture of the outbreak <br />
										Updated daily for all states of India (where data is available) <br />
										Enabling understanding of outbreak indicators through explanation and visualisation</div>
									</Card.Text>
									<Button variant="outline-primary" onClick={this.handleDivScroll}>Know more about the indicators before diving in</Button>
								</Card.Body>
							</Card>
						</div>

						<this.DropdownRenderer />


						<Container>
							<Row>
								<Col lg="6">
									{/* RT Graph */}
									<Row>
										<Col>
											<h5 className="mb-0 mt-2">Effective Reproduction Number (Rt)
												<OverlayTrigger  placement="right" overlay={rtPopover}>
													<img src={informationIcon} className="ml-1 information-icon" alt="information png" />
												</OverlayTrigger>
											</h5>
											<div className="rtgraph">
												<this.RtChartRender />
											</div>
										</Col>
									</Row>
									<div className="mt-2"></div>
									{/* Mobility Graph */}
									<Row>
										<Col>
											<h5 className="mb-0 mt-2">Mobility Index
												<OverlayTrigger  placement="right" overlay={mobilityPopover}>
													<img src={informationIcon} className="ml-1 information-icon" alt="information png" />
												</OverlayTrigger>
											</h5>
											<div className="mobilityGraph">
												<Line
													data={mobilityGraphData}
													height={300}
													options={{
														maintainAspectRatio: false,
														legend: {
															display: true,
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
											<h5 className="mb-0 mt-2">Corrected Case Fatality Rate (CFR)
												<OverlayTrigger placement="left" overlay={cfrPopover}>
													<img src={informationIcon} className="ml-1 information-icon" alt="information png" />
												</OverlayTrigger>
											</h5>
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
															display: false,
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
											<h5 className="mb-0 mt-2">Positivity Rate 
												<OverlayTrigger  placement="left" overlay={positivityPopover}>
													<img src={informationIcon} className="ml-1 information-icon" alt="information png" />
												</OverlayTrigger>
											</h5>
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

					<div className="home-text" ref={this.textDivRef}>
						<Card>
							<Card.Body>
								<Card.Title className="top-text-title" style={{ fontWeight: "bold", fontStyle: "italic" }}>{`How fast is the spread? (Transmission indicators)`}</Card.Title>
							</Card.Body>
							<Card.Body>
								<Card.Title className="top-text-title" style={{ fontWeight: "bold" }}>{`Effective Reproduction Number (Rt)`}</Card.Title>
								<Card.Text className="top-text-body">
									<div><span style={{ fontStyle: "italic" }}>Rt is the average number of people infected by a single case, at a particular time t during the outbreak.</span> It shows us
										the rate of spread of the virus. When Rt reaches below 1 (epidemic threshold), we can say that the outbreak has been brought
										under control. Serial monitoring of Rt for each state tells us the severity of the outbreak in an area, and guides administrators
										to fine-tune the level of control measures required to bring the Rt under 1. As changes in transmission correlate with
										control measures, we can assess the efficacy of different interventions by comparing the change in Rt after their implementation. <br />
										Green: Below 1 <br />
										Red: Above 1</div>
							    	</Card.Text>
								</Card.Body>
								<Card.Body>	
									<Card.Title className="top-text-title" style={{fontWeight: "bold"}}>{`Mobility Index`}</Card.Title>
							    	<Card.Text className="top-text-body">
							      		<div><span style={{fontStyle: "italic"}}>This indicates the change in frequency and length of visits at different places compared to a baseline level from 
										Jan 3 to Feb 6, 2020.</span> It shows us the effect of lockdown and behavioural change on the movement of people, reflecting the 
										strictness and enforcement of social distancing in different states. We have introduced this parameter experimentally 
										considering that mobility has a direct effect on disease spread, however there is no evidence yet that this specific mobility 
										index is correlated with local transmission. <br/> Data Source: Google COVID19 Community Mobility Reports</div>
							    	</Card.Text>
							  	</Card.Body>
								<Card.Body></Card.Body>
								<Card.Body>
							    	<Card.Title className="top-text-title" style={{fontWeight: "bold", fontStyle: "italic"}}>{`Are we testing enough? (Testing indicators)`}</Card.Title>
								</Card.Body>
								<Card.Body>
								<Card.Title className="top-text-title" style={{fontWeight: "bold"}}>{`Test Positivity Rate`}</Card.Title>
							    	<Card.Text className="top-text-body">
							      		<div><span style={{fontStyle: "italic"}}>It is the percent of COVID-19 tests done that come back positive.</span> A low positivity rate may mean that testing levels 
										are sufficient for the scale of the epidemic and surveillance is penetrating the community enough to detect any resurgence. 
										In contrast, a high positivity rate indicates that testing is relatively limited to people with high suspicion of COVID-19 and 
										may miss new chains of transmission in the community. Test Positivity Rate is a better indicator of testing adequacy than Tests 
										Per Million, as testing coverage should be seen relative to the size of the epidemic rather than the size of the population. 
										(https://coronavirus.jhu.edu/testing/international-comparison) The WHO has recommended that the daily positivity rate be below 
										5% for atleast two weeks before relaxing public health measures. We report daily positivity rate (as 7-day moving averages) and 
										cumulative positivity rate (which includes all tests done till date). <br/>
										Red: More than 10% <br/> Yellow: Between 5% and 10% <br/> Green: Less than 5% (based on WHO criteria)</div>
							    	</Card.Text>
								</Card.Body>
								<Card.Body>	
									<Card.Title className="top-text-title" style={{fontWeight: "bold"}}>{`Corrected Case Fatality Rate (CFR)`}</Card.Title>
							    	<Card.Text className="top-text-body">
							      		<div>The Crude CFR is equal to the deaths till date divided by the cases till date. This naive estimate of CFR is known to be 
										biased in ongoing outbreaks, primarily due to two factors- the delay between time of case confirmation and time of death, and 
										the under-reporting of cases due to limitations in testing coverage. The Corrected CFR presented here corrects for the first bias, 
										by adjusting the denominator to reflect the number of cases where death would have been reported if it had occurred, based on 
										known estimates of delay from confirmation to death. The variation in Corrected CFR across states would then reflect the degree 
										of under-reporting or testing adequacy in a particular state. <br/>
										Red: More than 10% <br/> Yellow: Between 5% and 10% <br/> Green: Less than 5% </div>
							    	</Card.Text>
							  	</Card.Body>
								<Card.Body>	
									<Card.Title className="top-text-title" style={{fontWeight: "bold"}}>{`Tests Per Million`}</Card.Title>
							    	<Card.Text className="top-text-body">
							      		<div style={{fontStyle: "italic"}}>It is the total number of tests done per 10,00,000 people.</div>
							    	</Card.Text>
							  	</Card.Body>
								<Card.Body>	
									<Card.Title className="top-text-title" style={{fontWeight: "bold"}}>{`For The People, By The People`}</Card.Title>
							    	<Card.Text className="top-text-body">
							      		<div>COVID TODAY is an initiative by iCART, a multidisciplinary volunteer team of passionate doctors, researchers, coders, 
										and public health experts from institutes across India. <span style={{fontWeight: "bold", fontStyle: "italic"}}>Anyone can contribute to this project</span> - 
										<a className="link-text" onClick={() => this.setState({ selectedView: "Contribute" })}>click here if you want to pitch in.</a></div>
							    	</Card.Text>
							  	</Card.Body>
							</Card>
						</div>
				</>}
				{selectedView === "Methods" && <div className="App">Methods</div>}
				{selectedView === "Contribute" && <div className="App">Contribute</div>}
				{selectedView === "Team" && <div className="App">ABOUT US</div>}
				<div className="footer-pic-container">
					<img src={Footer} className="footer-pic" />
				</div>
			</div>
		);
	}
}

export default App;
