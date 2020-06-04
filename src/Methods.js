import React, { Component } from 'react';
import { Card, Table } from 'react-bootstrap';

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
									<div style={{textAlign: "left"}}><b>Raw data for cases and tests</b>- <a href="http://www.covid19india.org">www.covid19india.org</a><br/>
										 <b>Data for mobility index</b>- <a href="http://www.google.com/covid19/mobility">www.google.com/covid19/mobility</a><br/>
										 <b>Distribution of delay from symptom onset to confirmation</b>- <a href="http://www.medrxiv.org/content/10.1101/2020.05.13.20096826v2">www.medrxiv.org/content/10.1101/2020.05.13.20096826v2</a> (53 patients from Delhi NCR)<br/>
										 <b>Distribution of serial interval</b>- <a href="http://wwwnc.cdc.gov/eid/article/26/6/20-0357_article">wwwnc.cdc.gov/eid/article/26/6/20-0357_article</a> (468 patients from China; no local data available)<br/>
										 <b>Distribution of delay from hospitalisation to death</b>- <a href="http://www.mdpi.com/2077-0383/9/2/538/htm">www.mdpi.com/2077-0383/9/2/538/htm</a><br/>
										 <b>Population data</b>- <a href="http://uidai.gov.in/images/state-wise-aadhaar-saturation.pdf">uidai.gov.in/images/state-wise-aadhaar-saturation.pdf</a><br/>
									</div>
								</Card.Text>
							</Card.Body>
							<Card.Body>
								<Card.Title className="top-text-title" style={{ fontWeight: "bold" }}>{`Effective Reproduction Number (Rt)`}</Card.Title>
								<Card.Text className="top-text-body">
									<div><b>Adjusting for the delay from symptom onset to case confirmation:</b><br/>
									A variable delay occurs from symptom onset to case confirmation (reporting lag) which is attributed to multiple factors including 
									time taken to seek care (patient dependent) and time taken to detect and test the case (healthcare-system dependent). The daily 
									raw data gives us the ‘incidence by confirmation’. We transform this incidence by confirmation into incidence by symptom onset,
									 using the delay from symptom onset to confirmation estimated in a study which included 53 symptomatic COVID+ patients in Delhi. 
									(1) The delay had a mean of 3·40 days (95% CI 2·87–3·96) with SD of 2·09 days (95% CI 1·52–2·56) and a median of 2·68 days 
									(95% CI 2·00–3·00) with IQR of 2.03 days (95% CI 1.00-3.00). The gamma distribution with shape parameter 3·45 (95% CI 2·42–5·19) 
									and rate parameter 1·02 (95% CI 0·70–1·60) was the best fit to the distribution. 1000 samples of the delay 
									distribution parameters (φi) were drawn taking into account the uncertainty in the distribution parameters ie. 
									shape and scale for the gamma distribution to serve as the posterior distribution of the delay. For each of the 1000 
									samples of fitted parameters, the reporting dates (ri) were transformed to give the symptom onset date (oi) by the formula:<br/>
									oi = ri - di<br/>
									where di (delay from onset to confirmation) ~ Gamma(φi) resulting in 1000 lag adjusted datasets. This process was applied to the 
									incidence by confirmation data for the nation and different states.<br/><br/>
									
									<b>Adjusting for yet unconfirmed cases in order to estimate recent onsets:</b><br/>
									The above method can only estimate symptom onsets till dmax days before today, where dmax is the maximum possible reporting lag. 
									The onsets that would have already occurred in these recent days have not yet been confirmed. In order to account for this right 
									truncation of case confirmations, we used a process of binomial upscaling. Consider 't' is the latest date for which the cases 
									have been adjusted. We model the number of onsets on 'l' days before the latest date, o(t-l) with Bernoulli trials with the 
									probability equal to the proportion of the cases that have been confirmed since onset in the following l days. This probability 
									is given by F( l | f i) ie. the CDF (F( x | fi )) of the reporting lag distribution at x = l days. Thus, the number of missed 
									onset dates would be given by:<br/>
									o*(t-l) ~ Negbin( n = o(t-l) + 1, p = F( l | fi ) )<br/>
									Thus, the total number of onsets on date 'x' is given by o(x)+o*(x). One important point to consider is that this 
									method is prone to high bias when the probability 'p' approaches low values at dates very close to the latest date. 
									Since we were not able to adjust for this bias, the last few dates were dropped when the variability across trials for 
									estimates started increasing due to the high bias.<br/><br/>
									
									<b>Estimating the Effective Reproduction Number at time t</b><br/> 
									From the daily number of symptom onsets, the time-varying Rt was calculated using EpiEstim package in R 3·6·3 which uses the Time 
									Dependent Maximum Likelihood approach.(2,3) Serial interval is the time interval between symptom onsets in a primary and a secondary 
									case, and is thus appropriate to calculate Rt from symptom onset based incidence data. Due to lack of serial interval estimates from 
									India, we used the best available estimate from a study including 468 patients in China (4)  as a gamma distributed serial interval 
									with a mean of 3·96 days (95% CI 3·53–4·39) and a SD of 4·75 days (95% CI 4·46–5·07). which was in agreement with several other 
									studies.(5–7) We use 7-day sliding windows. The estimates of Rt for each day were combined for the 1000 lag adjusted datasets by 
									calculating pooled mean and pooled standard deviation and a net estimate for 50% and 95% confidence intervals were calculated.<br/><br/> 
									
									<span style={{fontWeight: "bold", fontStyle: "italic"}}>Limitations/Scope for improvement:</span><br/>
									Since we do not know the true number of infections (irrespective of detection), Rt calculation is based on reported cases. The 
									estimated Rt is unaffected if the ascertainment rate (percent of true infections that are detected) remains fairly constant across 
									time. Any fluctuations in ascertainment due to testing coverage variation will affect the Rt estimates until such time that the 
									ascertainment stabilises at the new level.<br/> 
									Any government in India does not report the symptom onset dates currently, so a true epicurve can not be made. We have used the 
									best available data from India to project the probability distribution of the delay from symptom onset to confirmation, however this 
									delay can be vastly different for various areas, especially where there is a backlog of tests prolonging it. Putting this data in 
									public domain even in a limited manner will greatly increase the accuracy of Rt estimation over time and better guide public health 
									policy.<br/> 
									Changes in the assumed serial interval affects the estimated Rt. Lack of a local serial interval estimate will impact the accuracy. 
									Also, serial interval changes over the course of the epidemic (shortens near the peak and due to impact of control measures) which 
									we do not take into account. Again, data from contact tracing programs can address all these challenges in real-time. 
									</div>
								</Card.Text>
							</Card.Body>
							
							<Card.Body>
								<Card.Title className="top-text-title" style={{ fontWeight: "bold" }}>{`Mobility`}</Card.Title>
								<Card.Text className="top-text-body">
									<div>The data for mobility is sourced from Google Community mobility Reports. Detailed documentation is available 
									<a href="https://support.google.com/covid19-mobility?hl=en#topic=9822927"> here. </a> 
									Google mobility data shows how visits and length of stay at different places change compared to a baseline (changes for each day are 
									compared to a baseline value for the corresponding day of the week, during the 5-week period Jan 3 to Feb 6, 2020). Google calculates 
									these changes using aggregated and anonymized location data. </div><br/>
									<div className="methods-table">
									<Table striped bordered hover>
									  <thead>
									    <tr>
									      <th>Mobility Index</th>
									      <th>Places covered under the index</th>
									    </tr>
									  </thead>
									  <tbody>
									    <tr>
									      <td>Grocery & pharmacy</td>
									      <td>Grocery markets, food warehouses, farmers markets, specialty food shops, drug stores, and pharmacies.</td>
									    </tr>
									    <tr>
									      <td>Parks</td>
									      <td>Local parks, national parks, public beaches, marinas, dog parks, plazas, and public gardens.</td>
									    </tr>
									    <tr>
									      <td>Transit stations</td>
									      <td>Public transport hubs such as subway, bus, and train stations</td>
									    </tr>
										<tr>
									      <td>Retail & recreation</td>
									      <td>Restaurants, cafes, shopping centers, theme parks, museums, libraries, and movie theaters.</td>
									    </tr>
										<tr>
									      <td>Residential</td>
									      <td>Places of residence.</td>
									    </tr>
										<tr>
									      <td>Workplaces</td>
									      <td>Places of work.</td>
									    </tr>
										<tr>
									      <td>Average Mobility</td>
									      <td>Includes all above domains except parks and residential.</td>
									    </tr>
									  </tbody>
									</Table>
									</div>
								</Card.Text>
							</Card.Body>
							<Card.Body>
								<Card.Text className="top-text-body">
									<div><b>Calculating Average Mobility from the data</b><br/>
									We calculate the Average Mobility by aggregating data for <span style={{fontStyle: "italic"}}>Grocery and pharmacy, Transit stations, 
									Workplaces, and Retail and recreation</span>. We do not include <span style={{fontStyle: "italic"}}>Parks</span> because mobility in 
									parks is highly influenced in short-term by day-to-day weather changes and in long-term by seasonal changes compared to the baseline 
									in January. We do not include <span style={{fontStyle: "italic"}}>Residential</span> because the residential category shows a change 
									in duration-the other categories measure a change in total visitors , and Google recommends not  comparing the change in residential 
									with other categories because they have different units of measurement. We intend to improve the Average Mobility by creating a 
									composite metric that best correlates with transmission changes.<br/><br/> 
									
									<b>Smoothening baseline bias for better interpretation</b><br/> 
									Since the data shows relative and not absolute mobility change, it is affected by mobility levels at the  baseline. This causes a 
									nearer-to-baseline value to appear at weekends as the current weekend mobility does not change much 
									<span style={{fontStyle: "italic"}}>relative</span> to pre-lockdown weekends. We smoothen these changes to aid interpretation by 
									continuing the last working day value over the weekends. Note that the raw data reflects the statistical truth, but<br/><br/>  
									
									
									<span style={{fontStyle: "italic", fontWeight: "bold"}}>Limitations:</span><br/>
									The data represents a sample of Google's users, and may or may not represent the exact behavior of a wider population.<br/> 
									Location accuracy and the understanding of categorized places varies from region to region, so Google cautions against using this 
									data to compare changes between regions with different characteristics (e.g. rural versus urban areas).<br/>
									What data is included in the calculation depends on user settings, connectivity, and whether it meets Google's privacy threshold. 
									If the privacy threshold isn't met (when somewhere isn't busy enough to ensure anonymity) Google doesn't show a change for the day. 
									As a result, you may encounter empty fields for certain places and dates.
									</div>
								</Card.Text>
							</Card.Body>
						</Card>
						</div>
	  </div>
		
    );
  }
}