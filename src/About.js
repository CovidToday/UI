import React, { Component } from 'react';
import { Card } from 'react-bootstrap';

export default class About extends Component {

	render() {
		const layout = window.innerWidth > '1000' ? "home-text" : "text-pages-layout";
		const normalText = window.innerWidth > '1000' ? {} : { fontSize: "smaller" };
		const normalAlignedText = window.innerWidth > '1000' ? { textAlign: "left" } : { textAlign: "left", fontSize: "smaller" };
		const headingText = window.innerWidth > '1000' ? { fontWeight: "bolder", textAlign: "center" } : { fontWeight: "bolder", fontSize: "medium", textAlign: "center" };
		return (
			<div>
				<div className="sub-header-row mt-4">
					<span className="header-bar-text">ABOUT US</span>
				</div>
				<div className={layout}>
					<Card>
						<Card.Body>
							<Card.Title className="top-text-title" style={headingText}><strong>The Covid Today Team at iCART</strong></Card.Title>
							<Card.Text className="titillium">
								<div style={normalAlignedText}>The Covid Today Dashboard was envisaged to fill the gap between reporting raw case numbers
									and what that data actually means. The purpose is to analyse and present the data in a meaningful way that enables citizens,
									leaders, researchers and journalists to have a more insightful grasp of the local situation and respond accordingly. We intend
									to provide a one-stop dashboard where outbreak indicators are calculated with reliable scientific methods, and are updated and
									visualised daily to track each state’s progress in the epidemic.<br/><br/>

									<b>Dr Mohak Gupta, MBBS, AIIMS Delhi.</b><br />
									<i>Interests: Technology and Data-driven Solutions in Healthcare</i><br /><br />

									<b>Saptarshi Mohanta (Rishi), BS-MS, IISER Pune.</b><br />
									<i>Interests: Computational Modelling of Biological Systems, Statistics and Data Science</i><br/><br/>

									<b>Pratik Mandlecha, B.Tech CSE, IIIT Hyderabad. Data & Applied Scientist at Microsoft.</b> <br/>
									<i>Interests: Machine Learning , Deep Learning, Data Applications and  Analytics</i><br/><br/>

										<b>Aditya Garg, B.Tech CSE, VIT Vellore. Software Developer at Barclays.</b><br/>
										<i>Interests: Content Creation, Web and Game Development, Playing Music</i><br/><br/>

										<b>Technical Consulting and IT Support: <br/>
										&nbsp;&nbsp;&nbsp;Abhinav Gupta, CA Inter, B.Com</b><br/>
										&nbsp;&nbsp;&nbsp;<i>Interests: Simplifying Complex Structures with Technology to Make Robust and Cost Effective Systems</i><br/><br/>

										&nbsp;&nbsp;&nbsp;<b>Apurva Thakker, B.Tech CSE, BFCET Bathinda</b> <br/>
										&nbsp;&nbsp;&nbsp;<i>Interests: Solving Problems through Technology, Creating & Designing Music</i><br/><br/>

										&nbsp;&nbsp;&nbsp;<b>Siddharth Jain, Integrated B.Tech-MBA, IIIT Gwalior.</b><br/>
										&nbsp;&nbsp;&nbsp;<i>Interests: Data Analysis, Machine Learning</i><br/>
									</div>
								</Card.Text>
							</Card.Body>

							<Card.Body>
								<Card.Title className="top-text-title" style={headingText}><strong>Active contributors at Covid Today</strong></Card.Title>
								<Card.Text className="titillium">
									<div style={normalAlignedText}>Join hands with us in this effort. Join as an active contributor <a href="https://forms.gle/HDCDVYApfRi319k58">here.</a><br/>
										You can also visit the project's <a href="https://github.com/CovidToday/backend">GitHub</a> (open-sourced) and start contributing right away.
									</div>
								</Card.Text>
							</Card.Body>

				<Card.Body>
					<Card.Title className="top-text-title" style={headingText}><div><strong>Public Health Expert Panel</strong></div></Card.Title>
					<Card.Text className="top-text-body">
						<div style={normalText}>
							<b>Dr Habib Hasan Farooqui
							<br/>Faculty at Indian Institute of Public Health Delhi, Public Health Foundation of India (PHFI)</b>
							<br/>He is currently serving as member of Vaccine Centre at London School of Hygiene and Tropical Medicine,
							BactiVac Network at University of Birmingham, Surveillance and Epidemiology of Drug Resistant
							Infections (SEDRIC) Consortium at Wellcome Trust, and is the lead faculty on Pharmaceutical
							Economics and Infectious Disease Epidemiology at Indian Institute of Public Health – Delhi.
							He has received training as Post Doctoral Fellow (Economic Evaluation) at the London School
							of Hygiene and Tropical Medicine.<a href="www.phfi.org/member/habib-hasan-farooqui/"> Know more.</a>
							<br/><br/>
							<b>Dr Archisman Mohapatra
							<br/>Executive Director at GRID Council (Generating Research Insights for Development)</b>
							<br/>An epidemiologist and social scientist, Dr Mohapatra, is currently coordinating a Pan-India network
							of 85 public health experts (GRID COVID-19 Study Group). Dr Mohapatra has been intensely involved in
							several research projects that have translated into national policy (e.g., RBSK, PSBI guidelines,
							National Research Priority Setting Exercise).<a href="https://www.linkedin.com/in/archisman-mohapatra-40a45529/"> Know more.</a>
							<br/><br/>
							<b>Dr Hemant Deepak Shewade
							<br/>Senior Operational Research Fellow, Center for Operational Research, International Union Against Tuberculosis and Lung Disease (The Union)</b>
							<br/>A community physician by training, his current work focuses on conducting and building capacity for
							operational research in low and middle income countries. He is involved as a senior mentor in the
							Structured Operational Research Training IniTiative (SORT IT).<a href="https://www.researchgate.net/profile/Hemant_Shewade2"> Know more.</a>
						</div>
					</Card.Text>
				</Card.Body>

									<Card.Body>
										<Card.Title className="top-text-title" style={headingText}><strong>Active contributors at Covid Today</strong></Card.Title>
										<Card.Text className="titillium">
											<div style={normalAlignedText}>Join hands with us in this effort. Join as an active contributor <a href="https://forms.gle/HDCDVYApfRi319k58">here.</a><br/>
												You can also visit the project's <a href="https://github.com/CovidToday/backend">GitHub</a> (open-sourced) and start contributing right away.
											</div>
										</Card.Text>
									</Card.Body>

						<Card.Body>
							<Card.Title className="top-text-title" style={headingText}><div><strong>About iCART</strong></div></Card.Title>
							<Card.Text className="top-text-body">
								<div style={normalText}>India COVID Apex Research Team (iCART) is a volunteer research and development group which comprises
									professionals and students from multiple fields. iCART is open to collaboration with any individual or organisation that
									shares our interests and vision. We started as a small group from AIIMS Delhi, and have since grown into a multi-disciplinary
									team of doctors, biomedical researchers, epidemiologists, tech developers and data scientists with the primary focus to act
									as a catalyst for a science driven response to the COVID-19 pandemic. Our team is engaged in clinical and epidemiological
									research at some of the best hospitals in the country. In addition, we have developed a comprehensive digital COVID-19 platform
									spanning across communities, hospitals and laboratories, which is under pilot-testing. You may follow us on <a href="https://twitter.com/icart_india">Twitter </a>
									where we try to engage in meaningful discussions regarding the COVID-19 epidemic with fellow citizens, experts and journalists.<br/><br/>

Dr Giridara Gopal, PhD Scholar, MD Community Medicine, AIIMS Delhi<br/>
Dr Mohak Gupta, Intern Doctor, MBBS, AIIMS Delhi<br/>
Aditi Rao, MBBS student, AIIMS Delhi<br/>
Dev Balaji, M.Tech Bioengineering and Medical Nanotechnology, Former researcher at Harvard Medical School and IISc Bangalore<br/>
Archisman Mazumder, MBBS student, AIIMS Delhi<br/>
Mehak Arora, MBBS student, AIIMS Delhi<br/>
Manraj Singh Sra, MBBS student, AIIMS Delhi<br/>
Saptarshi Mohanta, BS-MS, IISER Pune<br/>
Dr Ayush Lohiya, Assistant Professor, Public Health, Super Specialty Cancer Institute & Hospital, Lucknow<br/>
Dr Priyamadhaba Behera, Assistant Professor , Department of Community Medicine and Family Medicine, AIIMS Bhubaneswar<br/><br/>

<i>All iCART collaborators participate in the team’s activities on a purely volunteer basis and in an individual capacity.
	Their views and opinions under iCART represent their personal views and not that of their institute or employer.</i><br/><br/>

<b>COVID-19 research from iCART:</b><br/>
<a href="https://pubmed.ncbi.nlm.nih.gov/32528664/?from_single_result=SARS-CoV-2+epidemic+in+India%3A+epidemiological+features+and+in+silico+analysis+of+the+effect+of+interventions
">SARS-CoV-2 Epidemic in India: Epidemiological Features and in silico Analysis of the Effect of Interventions</a><br/>
<a href="https://doi.org/10.1101/2020.05.13.20096826">Transmission dynamics of the COVID-19 epidemic in India and modelling optimal lockdown exit strategies</a>

								</div>
							</Card.Text>
						</Card.Body>

							</Card>
							</div>
						  </div>

		);
	}
}
