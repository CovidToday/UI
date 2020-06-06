import React, { Component } from 'react';
import { Card } from 'react-bootstrap';

export default class Contribute extends Component {

  render() {
	const layout =  window.innerWidth > '1000' ? "home-text" : "text-pages-layout";
	const normalText = window.innerWidth > '1000' ? {} : {fontSize: "smaller"};
	const citationsText = window.innerWidth > '1000' ? {textAlign: "left"} : {textAlign: "left", fontSize: "smaller"};
	const headingText = window.innerWidth > '1000' ? {fontWeight: "bolder", textAlign: "center"} : {fontWeight: "bolder", fontSize: "large", textAlign: "center"}
    return (
      <div>
		<div className="sub-header-row mt-4">
			<span className="header-bar-text">CONTRIBUTE</span>
		</div>
		<div className={layout}>
		<Card>
			<Card.Body>
								<Card.Title className="top-text-title" style={headingText}>{<div>Your Feedback is Valuable. Suggest an Improvement or Addition.<br/> 
									Or Pitch In and Become an Active Contributor. </div>}</Card.Title>
								<Card.Text className="top-text-body">
									<div style={normalText}>Report a bug, suggest an improvement, ask a question, or join as an active contributor- 
									<a href="https://forms.gle/HDCDVYApfRi319k58">here</a>. All contributors will be recognised as part of the Active Contributor 
									Team on the About Us page.<br/><br/> 
										You can also contact us at<br/>
										Email: covidtodayindia@gmail.com<br/>
										Twitter: <a href="https://twitter.com/icart_india">@icart_india</a><br/>
									</div>
								</Card.Text>
							</Card.Body>
							<Card.Body>
								<Card.Title className="top-text-title" style={headingText}>{`Planned updates. Suggestions and contributions welcome.`}</Card.Title>
								<Card.Text>
									<div style={citationsText}>
									<ol>
									<li>Adding more indicators for Transmission and Testing domains. </li>
									<li>Adding a third domain (Healthcare system): We are looking for statewise data sources for the number of total and 
									occupied hospital beds, ICU beds and ventilators. If your state is releasing this data, contact us and join the data 
									curation essential for monitoring the health care capacity and response of each state.</li>
									<li>Expanding the dashboard for hot-spot districts (eg: Mumbai, Thane, Pune, Chennai, Ahmedabad, Indore, etc) and 
									metropolitan districts providing reliable data.</li>
									<li>Improving upon current calculation methodology.</li>
									<li>Comprehensive data visualisation on website: Adding more plots. Statewise detailed visualisation. Inter-state comparison. Inter-variable scatter plots. </li>
									</ol>
									</div>
								</Card.Text>
							</Card.Body>
		</Card>
		</div>
	  </div>
		
    );
  }
}