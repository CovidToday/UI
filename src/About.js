import React, { Component } from 'react';
import { Card } from 'react-bootstrap';

export default class About extends Component {

  render() {
	const layout =  window.innerWidth > '1000' ? "home-text" : "text-pages-layout";
	const normalText = window.innerWidth > '1000' ? {} : {fontSize: "smaller"};
	const normalAlignedText = window.innerWidth > '1000' ? {textAlign: "left"} : {textAlign: "left", fontSize: "smaller"};
	const headingText = window.innerWidth > '1000' ? {fontWeight: "bolder", textAlign: "center"} : {fontWeight: "bolder", fontSize: "large", textAlign: "center"};
    return (
      <div>
		<div className="sub-header-row mt-4">
			<span className="header-bar-text">ABOUT US</span>
		</div>
		<div className={layout}>
		<Card>
			<Card.Body>
								<Card.Title className="top-text-title" style={headingText}><div>About iCART</div></Card.Title>
								<Card.Text className="top-text-body">
									<div style={normalText}>India COVID Apex Research Team (iCART) is a volunteer research and development group which comprises 
									professionals and students from multiple fields. We started as a small group from AIIMS Delhi, and have since grown into a 
									multi-disciplinary team of doctors, biomedical researchers, epidemiologists, tech developers and data scientists with the 
									primary focus to act as a catalyst for a science driven response to the COVID-19 pandemic. Our team is engaged in clinical 
									and epidemiological research at some of the best hospitals in the country. In addition, we have developed a comprehensive 
									digital COVID-19 platform spanning across communities, hospitals and laboratories, which is under pilot-testing. The Covid 
									Today Dashboard was planned to fill the gap between reporting raw case numbers and what that data actually means. We intend 
									to provide a one-stop dashboard where outbreak indicators are calculated with reliable scientific methods, and are updated 
									and visualised daily to track each state's progress in the epidemic. <br/>
									</div>
								</Card.Text>
							</Card.Body>
							<Card.Body>
								<Card.Title className="top-text-title" style={headingText}>{`The Covid Today Team at iCART`}</Card.Title>
								<Card.Text>
									<div style={normalAlignedText}><b>Dr Mohak Gupta, MBBS, AIIMS Delhi.</b><br/>
										Interests: Technology and data-driven solutions in healthcare<br/><br/> 
										
										<b>Saptarshi Mohanta (Rishi), BS-MS, IISER Pune.</b><br/>
										Interests: Computational Modelling of Biological systems, Statistics and Data Science<br/><br/>
										
										<b>Pratik Mandlecha, B.Tech CSE, IIIT Hyderabad. Data & Applied Scientist at Microsoft.</b> <br/>
										Interests: Machine Learning , Deep Learning, Data Applications and  Analytics<br/><br/>
										
										<b>Aditya Garg</b><br/>
										<br/><br/>
										<b>Apurva</b> <br/>
										<br/><br/>
										<b>Siddharth Jain, Integrated B.Tech-MBA, IIIT Gwalior.</b><br/>
										Interests: Data Analysis, Machine Learning<br/>
									</div>
								</Card.Text>
							</Card.Body>
							<Card.Body>
								<Card.Title className="top-text-title" style={headingText}>{`Active contributors at Covid Today`}</Card.Title>
								<Card.Text>
									<div style={normalAlignedText}><b>Start contributing <a href="https://forms.gle/HDCDVYApfRi319k58">here</a></b><br/>
									</div>
								</Card.Text>
							</Card.Body>
							</Card>
							</div>
						  </div>
					
					    );
					  }
					}
