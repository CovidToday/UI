import React, { Component } from 'react';
import { Card } from 'react-bootstrap';

export default class Methods extends Component {

  render() {
    return (
      <div>
		<div className="sub-header-row mt-4">
			<span className="header-bar-text">KNOW ABOUT THE INDICATORS</span>
		</div>
		<div className="home-text">
							<Card>
							<Card.Body>
								<Card.Title className="top-text-title" style={{ fontWeight: "bold", fontSize: "medium" }}>{`Did we miss something? Get in touch here`}</Card.Title>
							</Card.Body>
							<Card.Body>
								<Card.Title className="top-text-title" style={{ fontWeight: "bold" }}>{`Data Sources`}</Card.Title>
								<Card.Text className="top-text-body">
									<div><b>Raw data for cases and tests</b>- <a href="www.covid19india.org">www.covid19india.org</a><br/>
										 <b>Data for mobility index</b>- <a href="www.google.com/covid19/mobility">www.google.com/covid19/mobility</a><br/>
										 <b>Distribution of delay from symptom onset to confirmation</b>- <a href="www.medrxiv.org/content/10.1101/2020.05.13.20096826v2">www.medrxiv.org/content/10.1101/2020.05.13.20096826v2</a> (53 patients from Delhi NCR)<br/>
										 <b>Distribution of serial interval</b>- <a href="wwwnc.cdc.gov/eid/article/26/6/20-0357_article">wwwnc.cdc.gov/eid/article/26/6/20-0357_article</a> (468 patients from China; no local data available)<br/>
										 <b>Distribution of delay from hospitalisation to death</b>- <a href="www.mdpi.com/2077-0383/9/2/538/htm">www.mdpi.com/2077-0383/9/2/538/htm</a><br/>
										 <b>Population data</b>- <a href="uidai.gov.in/images/state-wise-aadhaar-saturation.pdf">uidai.gov.in/images/state-wise-aadhaar-saturation.pdf</a><br/>
									</div>
								</Card.Text>
							</Card.Body>
							
						</Card>
						</div>
	  </div>
		
    );
  }
}