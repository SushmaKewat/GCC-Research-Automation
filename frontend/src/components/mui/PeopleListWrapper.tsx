import React from 'react';
import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionGroup from '@mui/joy/AccordionGroup';
import AccordionSummary from '@mui/joy/AccordionSummary';
import Table from '@mui/joy/Table';
import DownloadCSV from '../DownloadCSV';

import { Link } from 'react-router-dom';

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
	return (
		<>
			<div className='text-white w-full'>
				{companies.map((c) => (
					<AccordionGroup
						key={c.company_name}
						color='primary'
						variant='soft'
						className='rounded-xl shadow-lg mb-4 overflow-hidden'
						sx={{
							background: 'linear-gradient(135deg, #2c5364, #203a43, #0f2027)',
						}}>
						<Accordion>
							<AccordionSummary>
								<span className='flex w-full text-white text-xl font-semibold hover:text-black'>
									{c.company_name}
								</span>
								<span className='ml-2 flex items-center text-sm text-neutral-500'>
									({c.people_details.length} contacts)
								</span>
							</AccordionSummary>
							<AccordionDetails>
								<Table
									hoverRow
									stickyHeader
									borderAxis='both'
									sx={{
										background: 'rgba(255,255,255,0.05)',
										borderRadius: '0.5rem',
										overflow: 'hidden',
									}}>
									<thead>
										<tr className='bg-gray-700 text-white'>
											<th className='p-3'>Name</th>
											<th className='p-3'>Job Title</th>
											<th className='p-3'>Bio Summary</th>
											<th className='p-3'>Location</th>
											<th className='p-3'>LinkedIn</th>
											<th className='p-3'>Confidence</th>
											<th className='p-3'>Action</th>
										</tr>
									</thead>
									<tbody>
										{c.people_details.map((person) => (
											<tr
												key={person.person_name}
												className='border-b border-gray-600 text-white hover:bg-gray-200 hover:text-black transition'>
												<td>{person.person_name}</td>
												<td>{person.job_title}</td>
												<td>{person.bio_summary}</td>
												<td>
													{person.location?.city} {person.location?.state}{' '}
													{person.location?.country}
												</td>
												<td>
													{person.linkedin_profile ? (
														<a
															href={person.linkedin_profile}
															target='_blank'
															rel='noreferrer'
															className='text-blue-400 hover:underline'>
															Profile
														</a>
													) : (
														'N/A'
													)}
												</td>
												<td>{person.confidence_score}</td>
												<td>
													<Link
														to='/draft'
														state={{
															clientName: person.person_name,
															clientRole: person.job_title,
															clientCompany: c.company_name,
														}}
														className='bg-purple-600 text-white hover:bg-purple-700 px-3 py-1.5 rounded-md text-sm'>
														Outreach
													</Link>
												</td>
											</tr>
										))}
									</tbody>
								</Table>
								{c.extraction_notes && (
									<p className='text-gray-300 text-sm border border-gray-600 p-3 mt-3 rounded-md bg-gray-800'>
										<strong>Note:</strong> {c.extraction_notes}
									</p>
								)}
							</AccordionDetails>
						</Accordion>
					</AccordionGroup>
				))}
			</div>
			{companies.length > 0 && <DownloadCSV data={companies} />}
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
