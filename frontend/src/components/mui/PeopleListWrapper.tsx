import React from 'react';
import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionGroup from '@mui/joy/AccordionGroup';
import AccordionSummary from '@mui/joy/AccordionSummary';
import Table from '@mui/joy/Table';
import DownloadCSV from '../DownloadCSV';

// import { useStreamContext } from '@langchain/langgraph-sdk/react-ui';

export interface PersonDetailProps {
	person_name: string;
	job_title?: string;
	bio_summary?: string;
	location?: {
		city?: string;
		state?: string;
		country?: string;
	};
	linkedin_profile?: string;
	confidence_score: number;
}

export type PeopleExtractionResultProps = {
	companies: {
		people_details: PersonDetailProps[];
		company_name: string;
		extraction_notes?: string;
	}[];
};
export const PeopleList: React.FC<PeopleExtractionResultProps> = ({ companies }) => {
	console.log(companies);
	return (
		<>
			<div className='text-white w-full'>
				{companies.map((c) => (
					<AccordionGroup
						key={c.company_name}
						color='primary'
						variant='soft'
						sx={{
							background: 'linear-gradient(135deg, #2c5364, #203a43, #0f2027)',
						}}>
						<Accordion>
							<AccordionSummary>
								<span className='w-full text-white text-xl hover:text-black'>
									{c.company_name}
								</span>
							</AccordionSummary>
							<AccordionDetails>
								<Table
									hoverRow
									stickyHeader
									sx={{
										color: 'white',
									}}>
									<thead>
										<tr>
											<th>Name</th>
											<th>Job Title</th>
											<th>Bio Summary</th>
											<th>Location</th>
											<th>LinkedIn Profile</th>
											<th>Confidence Score</th>
										</tr>
									</thead>
									<tbody>
										{c.people_details.map((person) => (
											<tr
												key={person.person_name}
												className='hover:text-black'>
												<td>{person.person_name}</td>
												<td>{person.job_title}</td>
												<td>{person.bio_summary}</td>
												<td>
													{person.location?.city} {person.location?.state}{' '}
													{person.location?.country}
												</td>
												<td>{person.linkedin_profile}</td>
												<td>{person.confidence_score}</td>
											</tr>
										))}
									</tbody>
								</Table>
								{c.extraction_notes && (
									<p className='text-white text-sm border border-white p-2'>
										NOTE: {c.extraction_notes}
									</p>
								)}
							</AccordionDetails>
						</Accordion>
					</AccordionGroup>
				))}
			</div>
			<DownloadCSV data={companies} />
		</>
	);
};

const PeopleListWrapper: React.FC<any> = ({ companies }) => {
	return (
		<>
			<PeopleList companies={companies} />
		</>
	);
};

export default PeopleListWrapper;
