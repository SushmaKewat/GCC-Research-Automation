import { useState } from 'react';

export interface ResponseData {
	confidence_level: string;
	research_summary: string;
	personalization_elements: [string];
}
export interface Message {
	subject: string | null;
	message: string;
}

interface GeneratedMessageProps {
	isLoading: boolean;
	message: Message | null;
	data: ResponseData | null;
}

export function GeneratedMessage({
	isLoading,
	message = {
		subject: '',
		message: '',
	},
	data,
}: GeneratedMessageProps) {
	const [hasCopied, setHasCopied] = useState(false);

	const handleCopy = () => {
		if (message) {
			navigator.clipboard.writeText(message?.subject + '\n\n' + message?.message);
			setHasCopied(true);
			setTimeout(() => setHasCopied(false), 2000);
		}
	};

	const renderMessageContent = (content: string = '') => {
		if (isLoading) {
			return (
				<div className='space-y-3 animate-pulse'>
					<div className='h-4 bg-gray-700 rounded w-4/5'></div>
					<div className='h-4 bg-gray-700 rounded w-full'></div>
					<div className='h-4 bg-gray-700 rounded w-full'></div>
					<div className='h-4 bg-gray-700 rounded w-11/12'></div>
				</div>
			);
		}

		if (!content) {
			return (
				<div className='flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-600 bg-gray-800/50 p-12 text-center'>
					<div className='flex h-16 w-16 items-center justify-center rounded-full bg-purple-900/50 mb-4'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='24'
							height='24'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
							className='h-8 w-8 text-purple-400'>
							<path d='M15 4V2a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2' />
							<path d='M15 20v2a2 2 0 0 1 2 2h-2a2 2 0 0 1 2 2v-2' />
							<path d='M4 9H2a2 2 0 0 0 0 1.2l1.8 1.8a1 1 0 0 1 0 1.2L8 16' />
							<path d='m12 6-3.4 3.4a1 1 0 0 0 0 1.2l1.8 1.8a1 1 0 0 1 0 1.2L8 16' />
							<path d='m12 18 3.4-3.4a1 1 0 0 0 0-1.2l-1.8-1.8a1 1 0 0 1 0-1.2L16 8' />
						</svg>
					</div>
					<h3 className='text-lg font-medium text-gray-400'>
						Your message will appear here
					</h3>
					<p className='text-sm text-gray-500'>Fill out the form above to get started.</p>
				</div>
			);
		}

		return (
			<>
				<textarea
					readOnly
					value={content}
					className='min-h-[300px] hide-scrollbar p-3 border border-gray-600 rounded-lg text-base leading-relaxed bg-transparent w-full focus:ring-0 whitespace-pre-wrap'
				/>
			</>
		);
	};

	return (
		<div className='flex flex-col my-4'>
			<div className=' p-6 bg-gray-800 rounded-lg border border-gray-700'>
				<div className='flex flex-row items-center justify-between mb-4'>
					<div>
						<h3 className='text-xl font-bold'>Your AI-Generated Message</h3>
						<p className='text-sm text-gray-400'>
							Review, and copy your message below.
						</p>
					</div>

					{message?.message && (
						<button
							onClick={handleCopy}
							className='p-2 rounded-md hover:bg-gray-700 transition-colors'>
							{hasCopied ? (
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='24'
									height='24'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
									className='h-5 w-5 text-green-400'>
									<path d='M20 6 9 17l-5-5' />
								</svg>
							) : (
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='24'
									height='24'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
									className='h-5 w-5 text-purple-400'>
									<rect width='14' height='14' x='8' y='8' rx='2' ry='2' />
									<path d='M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' />
								</svg>
							)}
							<span className='sr-only'>Copy message</span>
						</button>
					)}
				</div>
				{message?.subject && (
					<>
						<div className='p-2 font-bold'>Subject</div>
						<div>
							<textarea
								readOnly
								value={message?.subject || ''}
								className='h-auto hide-scrollbar p-3 border border-gray-600 rounded-lg text-base leading-relaxed bg-transparent w-full focus:ring-0 whitespace-pre-wrap'
							/>
						</div>
					</>
				)}
				<>
					<div className='p-2 font-bold'>Message</div>
					<div>{renderMessageContent(message?.message)}</div>
				</>
			</div>

			{data && (
				<div className='bg-gray-800 border border-gray-700 rounded-lg mt-8'>
					<div className='p-6'>
						<h3 className='text-lg font-semibold'>Personalization Details</h3>
						<p className='text-sm text-gray-400'>Insights from the AI</p>
					</div>
					<div className='p-6 pt-0 space-y-4'>
						{data?.confidence_level && (
							<div>
								<h4 className='font-medium text-gray-300'>Confidence Level</h4>
								<p className='text-white whitespace-pre-wrap border border-gray-600 my-1 p-2 rounded-sm'>
									{data?.confidence_level}
								</p>
							</div>
						)}
						{data?.research_summary && (
							<div>
								<h4 className='font-medium text-gray-300'>Research Summary</h4>
								<p className='text-white whitespace-pre-wrap border border-gray-600 my-1 p-3 rounded-sm'>
									{data?.research_summary}
								</p>
							</div>
						)}
						{data?.personalization_elements && (
							<div>
								<h4 className='font-medium text-gray-300'>
									Personalization Elements
								</h4>
								<ul className='list-disc list-inside space-y-1 border border-gray-600 my-1 p-3 rounded-sm'>
									{data?.personalization_elements.map((item, index) => (
										<li key={index} className='text-white whitespace-pre-wrap'>
											{item}
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
