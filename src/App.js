import React, { Component } from 'react';
import './App.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Container, Row, Col, Dropdown, Nav } from 'react-bootstrap';
import Header from "./header.jpg"
import Footer from "./footer.jpg"

class App extends Component {

	constructor(props) {
		super(props);

		this.state = {
			columnDefs: [
			    {
					headerName: '', children: [
						{headerName: "STATES", field: "state", sortable: true, flex: 2}
					]
				},
				{
			        headerName: 'TRANSMISSION', children: [
			            {headerName: "RT", field: "rt", sortable: true, flex: 1, cellStyle: function(params) {
							let style;
							let a = true;
							params.data.rtOld.forEach(rt => {
								if(rt > 1) {
									a = false;
								}
							})
							if(params.data.rtCurrent > 1){
								style = {backgroundColor: '#ff928a'};
							} else if(params.data.rtCurrent < 1 && a === true) {
								style = {backgroundColor: '#a1ffa1'};
							} else if(params.data.rtCurrent < 1 && a === false) {
								style = {backgroundColor: '#f7faa0'};
							}
							return style;
						}},
			            {headerName: "CUMULATIVE CASES", field: "cumCases", sortable: true, flex: 1},
			            {headerName: "DAILY CASES", field: "dailyCases", sortable: true, flex: 1}
			        ]
			    },
			    {
			        headerName: 'TESTING', children: [
			            {headerName: "POSITIVITY RATE", field: "posRate", sortable: true, flex: 1},
			            {headerName: "CUMULATIVE POSITIVITY RATE", field: "cumPosRate", sortable: true, flex: 1},
			            {headerName: "CORRECTED CASE FATALITY RATE", field: "ccfr", sortable: true, flex: 1, cellStyle: function(params) {
							let style;
							if(params.data.ccfr > 10){
								style = {backgroundColor: '#ff928a'};
							} else if(params.data.ccfr < 5) {
								style = {backgroundColor: '#a1ffa1'};
							} else if(params.data.ccfr < 10 && params.data.ccfr > 5) {
								style = {backgroundColor: '#f7faa0'};
							}
							return style;
						}},
			            {headerName: "TESTS PER MILLION", field: "testsPerMil", sortable: true, flex: 1}
			        ]
			    }
			],
			rowData: [],
			rtDataFromApi: [],
			cfrDataFromApi: [],
			minRtDataPoint: 0,
			maxRtDataPoint: 0,
			lockdownDates: ["03-25-2020", "04-15-2020","05-04-2020","05-18-2020"],
			rtPointGraphData: { datasets: [], labels: [] },
			cfrGraphData: { datasets: [], labels: [] },
			selectedState: 'India',
			selectedView: 'Home'
		}
	}
	
	columnDefMobile = [
			    {
					headerName: '', children: [
						{headerName: "STATES", field: "state", sortable: true}
					]
				},
				{
			        headerName: 'TRANSMISSION', children: [
			            {headerName: "RT", field: "rt", sortable: true},
			            {headerName: "CUMULATIVE CASES", field: "cumCases", sortable: true},
			            {headerName: "DAILY CASES", field: "dailyCases", sortable: true}
			        ]
			    },
			    {
			        headerName: 'TESTING', children: [
			            {headerName: "POSITIVITY RATE", field: "posRate", sortable: true},
			            {headerName: "CUMULATIVE POSITIVITY RATE", field: "cumPosRate", sortable: true},
			            {headerName: "CORRECTED CASE FATALITY RATE", field: "ccfr", sortable: true},
			            {headerName: "TESTS PER MILLION", field: "testsPerMil", sortable: true}
			        ]
			    }
			];

	componentDidMount() {
		this.setData();
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
				this.getCfrGraphData(this.state.cfrDataFromApi.IN);
			});
			
		this.setRowData();
		if(window.innerWidth <= '1000') {
			this.setState({columnDefs: this.columnDefMobile});
		}
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
			case "cg":
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
			case "ja":
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
			case "mg":
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
		states.shift();
		if(this.state.cfrDataFromApi && this.state.cfrDataFromApi) {
			states && states.forEach(s => {
				if(this.state.cfrDataFromApi[s] && this.state.cfrDataFromApi[s]) {
					const name = this.getName(s);
					const rtIndex = this.state.rtDataFromApi[s].rt_point.length-1;
					const rtPoint = rtIndex > 0 ? (this.state.rtDataFromApi[s].rt_point[rtIndex]).toFixed(2) : "NA";
					const rtl95 = rtIndex > 0 ? (this.state.rtDataFromApi[s].rt_l95[rtIndex]).toFixed(2) : "NA";
					const rtu95 = rtIndex > 0 ? (this.state.rtDataFromApi[s].rt_u95[rtIndex]).toFixed(2) : "NA";
					const rtToCompare = [];
					if(rtIndex>13){
						for(let i=rtIndex-13; i<=rtIndex; i++){
							rtToCompare.push((this.state.rtDataFromApi[s].rt_point[i]).toFixed(2));
						};
					}
					const rtData = `${rtPoint} (${rtl95}-${rtu95})`
					const cfrIndex = this.state.cfrDataFromApi[s].cfr3_point.length-1;
					const cfrPoint = cfrIndex > 0 ? (this.state.cfrDataFromApi[s].cfr3_point[cfrIndex]*100).toFixed(2) : "NA";
					data.push({ key: s, state: name, rt: rtData, rtOld: rtToCompare, ccfr: cfrPoint, rtCurrent: rtPoint});
				}
			});
		data.sort(function(a, b) {
			return (a.rt > b.rt) ? 1 : -1
		});	
		this.setState({ rowData: data })
		}
	}

	getRtPointGraphData = (dataFromApi) => {
		if (dataFromApi) {
			let data = {
				datasets: [],
				labels: []
			};
			data.labels = dataFromApi.dates;

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
				borderColor: 'yellow',
				fill: false,
				radius: 0,
				hoverRadius: 0,
			});

			//The vertical lines data logic
			let verticalLineData = [];
			const lockdownDates = this.state.lockdownDates;
			for (let j = 0; j < lockdownDates.length; j++) {
				let obj = {
					//type: 'line',
					label: 'Lockdown ' + (j + 1),
					borderColor: 'red',
					radius: 0,
					hoverRadius: 0,
					data: []
				};
				for (let i = minRtDataPoint; i <= maxRtDataPoint; i++) {
					obj.data.push({
						x: lockdownDates[j],
						y: i
					});
				}
				verticalLineData.push(obj);
			}
			data.datasets.push(...verticalLineData);

			// Main data
			let mainData = [{
				label: 'Rt l95',
				data: dataFromApi.rt_l95,
				fill: '' + (verticalLineData.length + 2),
				backgroundColor: 'lightblue',
				radius: 0,
				hoverRadius: 0,
			}, {
				label: 'Rt l50',
				data: dataFromApi.rt_l50,
				fill: '' + (verticalLineData.length + 3),
				backgroundColor: 'blue',
				radius: 0,
				hoverRadius: 0,
			}, {
				label: 'Rt Point',
				data: dataFromApi.rt_point,
				borderColor: 'black',
				fill: false
			}, {
				label: 'Rt u50',
				data: dataFromApi.rt_u50,
				fill: '-2',
				backgroundColor: 'blue',
				radius: 0,
				hoverRadius: 0,
			}, {
				label: 'Rt u95',
				data: dataFromApi.rt_u95,
				fill: '-4',
				backgroundColor: 'lightblue',
				radius: 0,
				hoverRadius: 0,
			}];
			data.datasets.push(...mainData);
			this.setState({
				rtPointGraphData: data,
				maxRtDataPoint: maxRtDataPoint,
				minRtDataPoint: minRtDataPoint
			});
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
			// let horizontalLineData = [];
			// for (let i = 0; i < dataFromApi.dates.length; i++) {
			// 	horizontalLineData.push(6);
			// }
			// data.datasets.push({
			// 	label: 'fixed value',
			// 	data: horizontalLineData,
			// 	borderColor: 'red',
			// 	fill: false,
			// 	radius: 0,
			// 	hoverRadius: 0,
			// });
			// horizontalLineData = [];
			// for (let i = 0; i < dataFromApi.dates.length; i++) {
			// 	horizontalLineData.push(3);
			// }
			// data.datasets.push({
			// 	label: 'fixed value',
			// 	data: horizontalLineData,
			// 	borderColor: 'green',
			// 	fill: false,
			// 	radius: 0,
			// 	hoverRadius: 0,
			// });

			// Main data
			let mainData = [{
				label: 'Rt Point',
				data: dataFromApi.cfr3_point,
				borderColor: 'black',
				fill: false
			},];
			data.datasets.push(...mainData);
			this.setState({
				cfrGraphData: data,
			});
		}
	}

	onSelectionChanged = (data) => {
		const selectedRows = data.api.getSelectedRows();
		const selectedState = selectedRows[0].key;
		this.getRtPointGraphData(this.state.rtDataFromApi[selectedState]);
		this.getCfrGraphData(this.state.cfrDataFromApi[selectedState]);
		const state = this.getName(selectedState);
		this.setState({selectedState: state});
	}
	
	onStateSelect (key) {
		const stateName = this.getName(key);
		this.setState({selectedState: stateName});
		this.getRtPointGraphData(this.state.rtDataFromApi[key]);
		this.getCfrGraphData(this.state.cfrDataFromApi[key]);
	}
	
	DropdownRenderer = () => {
		return 		<div className="sub-header-row"><span className="header-bar-text"> </span>
					<span className="header-bar-text">TRANSMISSION</span>
					<span className="header-bar-dropdown">
					<Dropdown>
					  <Dropdown.Toggle variant="success" id="dropdown-basic" style={{backgroundColor: "#1167b1", borderColor: "black"}}>
					    {this.state.selectedState}
					  </Dropdown.Toggle>
					
					  <Dropdown.Menu>
					    <Dropdown.Item onSelect={() => this.onStateSelect("IN")}>India</Dropdown.Item>
					    <Dropdown.Item onSelect={() => this.onStateSelect("ap")}>Andhra Pradesh</Dropdown.Item>
					    <Dropdown.Item onSelect={() => this.onStateSelect("br")}>Bihar</Dropdown.Item>
						<Dropdown.Item onSelect={() => this.onStateSelect("dl")}>Delhi</Dropdown.Item>
						<Dropdown.Item onSelect={() => this.onStateSelect("gj")}>Gujarat</Dropdown.Item>
						<Dropdown.Item onSelect={() => this.onStateSelect("hr")}>Haryana</Dropdown.Item>
						<Dropdown.Item onSelect={() => this.onStateSelect("jk")}>Jammu & Kashmir</Dropdown.Item>
						<Dropdown.Item onSelect={() => this.onStateSelect("ka")}>Karnataka</Dropdown.Item>
						<Dropdown.Item onSelect={() => this.onStateSelect("kl")}>Kerala</Dropdown.Item>
						<Dropdown.Item onSelect={() => this.onStateSelect("mp")}>Madhya Pradesh</Dropdown.Item>
						<Dropdown.Item onSelect={() => this.onStateSelect("mh")}>Maharashtra</Dropdown.Item>
						<Dropdown.Item onSelect={() => this.onStateSelect("or")}>Odisha</Dropdown.Item>
						<Dropdown.Item onSelect={() => this.onStateSelect("pb")}>Punjab</Dropdown.Item>
						<Dropdown.Item onSelect={() => this.onStateSelect("rj")}>Rajasthan</Dropdown.Item>
						<Dropdown.Item onSelect={() => this.onStateSelect("tn")}>Tamil Nadu</Dropdown.Item>
						<Dropdown.Item onSelect={() => this.onStateSelect("tg")}>Telangana</Dropdown.Item>
						<Dropdown.Item onSelect={() => this.onStateSelect("up")}>Uttar Pradesh</Dropdown.Item>
						<Dropdown.Item onSelect={() => this.onStateSelect("wb")}>West Bengal</Dropdown.Item>
					  </Dropdown.Menu>
					</Dropdown>
					</span>
					<span className="header-bar-text">TESTING</span>
					<span className="header-bar-text"> </span>
					</div>
	}

	render() {
		const { minRtDataPoint, maxRtDataPoint, rtPointGraphData, cfrGraphData, selectedView } = this.state;
		return (
			<div>
			<div className = "header-pic-container">
				<img src={Header} className = "header-pic"/>
			</div>
			<div>
				<Nav fill="true" justify="true" variant="tabs" className="nav-tabs">
				  <Nav.Item>
				    <Nav.Link onClick={() => this.setState({selectedView: "Home"})}>
						<span className="nav-text">HOME</span></Nav.Link>
				  </Nav.Item>
				  <Nav.Item>
				    <Nav.Link onClick={() => this.setState({selectedView: "Methods"})}>
						<span className="nav-text">METHODS</span></Nav.Link>
				  </Nav.Item>
				  <Nav.Item>
				    <Nav.Link onClick={() => this.setState({selectedView: "Team"})}>
						<span className="nav-text">TEAM</span></Nav.Link>
				  </Nav.Item>
				</Nav>
			</div>
					<br/>
					{selectedView === "Home" && <>
					<div className="App">
					<this.DropdownRenderer />
			

				<Container>
					<Row>
						<Col lg="6">
							{/* RT Graph */}
							<Row>
								<Col>
									<Line
										data={rtPointGraphData}
										height={300}
										options={{
											maintainAspectRatio: false,
											legend: {
												display: false,
											},
											title: {
												display: true,
												text: 'Rt Graph'
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
													}
												}]
											},
										}}
									/>
								</Col>
							</Row>
						</Col>
						<Col>
							{/* CFR Graph */}
							<Row>
								<Col>
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
												text: 'CFR Graph'
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
								</Col>
							</Row>
							{/* Pos Rate Graph */}
							<Row>
								<Col>
									<Line
										data={rtPointGraphData}
										height={300}
										options={{
											maintainAspectRatio: false,
											legend: {
												display: false,
											},
											title: {
												display: true,
												text: 'POS Rate Graph'
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
													}
												}]
											},
										}}
									/>
								</Col>
							</Row>
						</Col>
					</Row>
				</Container>


				<div className="sub-header-row">
					<span className="header-bar-text">LATEST STATEWISE DATA</span>
				</div>

				<Container>
					<div
						id="myTable"
						className="ag-theme-balham"
						style={{
							padding: '20px'
						}}
					>
						<AgGridReact
							columnDefs={this.state.columnDefs}
							rowData={this.state.rowData}
							rowSelection={"single"}
							headerHeight =  '48'
							domLayout='autoHeight'
							onSelectionChanged={this.onSelectionChanged.bind(this)} />
					</div>
				</Container>
				</div>
				</>}
				{selectedView === "Methods" && <div className="App">Methods</div>}
				{selectedView === "Team" && <div className="App">ABOUT US</div>}
				<div className = "footer-pic-container">
					<img src={Footer} className = "footer-pic"/>
				</div>
			</div>
		);
	}
}

export default App;
