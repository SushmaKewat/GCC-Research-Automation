'use client';

import { useState, useCallback } from 'react';
import { OutreachForm } from '@/components/draft-generator/OutreachForm';
import {
	GeneratedMessage,
	Message,
	ResponseData,
} from '@/components/draft-generator/GeneratedMessage';
import type { OutreachFormValues } from '@/lib/types';
import useLocalStorage from '@/hooks/use-local-storage';
import axios from 'axios';

const USER_DETAILS_KEY = 'prospectiq-user-details';

export default function OutreachPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [generatedMessage, setGeneratedMessage] = useState<Message | null>({
		subject: '',
		message: '',
	});
	const [data, setData] = useState<ResponseData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [userDetails, setUserDetails] = useLocalStorage<Partial<OutreachFormValues>>(
		USER_DETAILS_KEY,
		{
			client: {
				name: '',
				role: '',
				company: '',
				about_company: '',
			},
		}
	);

	const handleGenerateMessage = useCallback(
		async (values: OutreachFormValues) => {
			setIsLoading(true);
			setGeneratedMessage(null);
			setError(null);

			const currentUserDetails = {
				name: values.client.name,
				role: values.client.role,
				company: values.client.company,
				about_company: values.client.about_company,
			};

			setUserDetails({ client: currentUserDetails });

			try {
				const result = await axios.post(
					`${import.meta.env.VITE_REACT_SERVER_URL}/outreach`,
					values,
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${localStorage.getItem('research_token')}`,
						},
					}
				);
				setIsLoading(false);
				setData(result.data);
				// console.log('RESULT: ', result);

				if (result.statusText != 'OK') {
					setError("Couldn't generate message. Please try again.");
				} else if (result.status == 200) {
					if (result.data.channel == 'email') {
						setGeneratedMessage({
							subject: result.data.subject,
							message: result.data.message,
						});
					} else {
						setGeneratedMessage({
							subject: null,
							message: result.data.message,
						});
					}
				}
			} catch (err) {
				setError("Couldn't generate message. Please try again.");
			}
		},
		[setUserDetails]
	);

	return (
		<div className='flex flex-col min-h-screen text-white'>
			<main className=' p-4 sm:p-6'>
				<div className='mx-auto max-w-3xl space-y-8'>
					<div className='text-center space-y-2'>
						<h2 className='text-3xl font-bold'>Generate Your Outreach Message</h2>
						<p className='text-gray-400'>
							Fill in the details below to create a personalized, AI-powered outreach
							message.
						</p>
						{error && (
							<div className='bg-red-900 border border-red-400 text-red-100 px-4 py-3 rounded-md my-4'>
								<strong className='font-bold'>Error: </strong>
								<span className='block sm:inline'>{error}</span>
							</div>
						)}
					</div>
				</div>
				<div className='mx-auto grid grid-cols-1 lg:grid-cols-2 my-4'>
					<OutreachForm
						isGenerating={isLoading}
						onGenerate={handleGenerateMessage}
						initialValues={userDetails}
					/>
					<GeneratedMessage
						isLoading={isLoading}
						message={generatedMessage}
						data={data}
					/>
				</div>
			</main>
		</div>
	);
}
