import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { outreachFormSchema, type OutreachFormValues } from '@/lib/types';

interface OutreachFormProps {
	isGenerating: boolean;
	onGenerate: (values: OutreachFormValues) => void;
	initialValues: Partial<OutreachFormValues> | null;
}

const toneOptions = [
	{ value: 'professional', label: 'Professional' },
	{ value: 'casual', label: 'Casual' },
	{ value: 'consultative', label: 'Consultative' },
	{ value: 'cold', label: 'Cold' },
];

export function OutreachForm({
	isGenerating = false,
	onGenerate = () => {},
	initialValues = null,
}: OutreachFormProps) {
	const location = useLocation();
	const { clientName, clientRole, clientCompany } = location.state || {};
	const form = useForm<OutreachFormValues>({
		resolver: zodResolver(outreachFormSchema),
		defaultValues: {
			lead: {
				name: clientName,
				role: clientRole,
				company: clientCompany,
				company_website: '',
				additional_info: '',
			},
			channel: 'email',
			additionalInfo: '',
			tone: 'professional',
			...initialValues,
		},
	});

	useEffect(() => {
		if (initialValues) {
			form.reset({
				...form.getValues(),
				...initialValues,
			});
		}
	}, [initialValues, form]);

	const handleFormSubmit = (values: OutreachFormValues) => {
		onGenerate(values);
	};

	return (
		<form
			onSubmit={form.handleSubmit(handleFormSubmit)}
			className='space-y-8 items-center justify-center lg:mr-6 my-4'>
			<div className='p-6 rounded-lg border border-gray-700'>
				<h3 className='text-xl font-bold mb-4'>Lead Details</h3>
				<div className='space-y-4'>
					<div className='grid sm:grid-cols-2 gap-4'>
						<div>
							<label htmlFor='leadName' className='block text-sm font-medium mb-1.5'>
								Lead Name
							</label>
							<input
								id='leadName'
								type='text'
								{...form.register('lead.name')}
								className='w-full bg-input/20 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500'
							/>
							{form.formState.errors.lead?.name && (
								<p className='text-red-400 text-sm mt-1'>
									{form.formState.errors.lead?.name.message}
								</p>
							)}
						</div>
						<div>
							<label htmlFor='leadRole' className='block text-sm font-medium mb-1.5'>
								Lead Role
							</label>
							<input
								id='leadRole'
								type='text'
								{...form.register('lead.role')}
								className='w-full bg-input/20 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500'
							/>
							{form.formState.errors.lead?.role && (
								<p className='text-red-400 text-sm mt-1'>
									{form.formState.errors.lead?.role.message}
								</p>
							)}
						</div>
					</div>
					<div>
						<label htmlFor='leadCompany' className='block text-sm font-medium mb-1.5'>
							Lead Company
						</label>
						<input
							id='leadCompany'
							type='text'
							{...form.register('lead.company')}
							className='w-full bg-input/20 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500'
						/>
						{form.formState.errors.lead?.company && (
							<p className='text-red-400 text-sm mt-1'>
								{form.formState.errors.lead?.company.message}
							</p>
						)}
					</div>
					<div>
						<label
							htmlFor='leadCompanyWebsite'
							className='block text-sm font-medium mb-1.5'>
							Company Website
						</label>
						<input
							id='leadCompanyWebsite'
							type='text'
							{...form.register('lead.company_website')}
							className='w-full bg-input/20 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500'
						/>
						{form.formState.errors.lead?.company_website && (
							<p className='text-red-400 text-sm mt-1'>
								{form.formState.errors.lead?.company_website.message}
							</p>
						)}
					</div>
					<div>
						<label
							htmlFor='leadCompanyInfo'
							className='block text-sm font-medium mb-1.5'>
							Additional Details about Lead
						</label>
						<textarea
							id='leadCompanyInfo'
							{...form.register('lead.additional_info')}
							className='w-full bg-input/20 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500'
						/>
						{form.formState.errors.lead?.additional_info && (
							<p className='text-red-400 text-sm mt-1'>
								{form.formState.errors.lead?.additional_info.message}
							</p>
						)}
					</div>
				</div>
			</div>

			<div className='p-6 rounded-lg border border-gray-700'>
				<h3 className='text-xl font-bold mb-4'>Your Details</h3>
				<div className='space-y-4'>
					<div className='grid sm:grid-cols-2 gap-4'>
						<div>
							<label htmlFor='userName' className='block text-sm font-medium mb-1.5'>
								Your Name
							</label>
							<input
								id='userName'
								type='text'
								{...form.register('client.name')}
								className='w-full bg-input/20 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500'
							/>
							{form.formState.errors.client?.name && (
								<p className='text-red-400 text-sm mt-1'>
									{form.formState.errors.client?.name.message}
								</p>
							)}
						</div>
						<div>
							<label htmlFor='userRole' className='block text-sm font-medium mb-1.5'>
								Your Role
							</label>
							<input
								id='userRole'
								type='text'
								{...form.register('client.role')}
								className='w-full bg-input/20 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500'
							/>
							{form.formState.errors.client?.role && (
								<p className='text-red-400 text-sm mt-1'>
									{form.formState.errors.client?.role.message}
								</p>
							)}
						</div>
					</div>
					<div>
						<label htmlFor='userCompany' className='block text-sm font-medium mb-1.5'>
							Your Company
						</label>
						<input
							id='userCompany'
							type='text'
							{...form.register('client.company')}
							className='w-full bg-input/20 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500'
						/>
						{form.formState.errors.client?.company && (
							<p className='text-red-400 text-sm mt-1'>
								{form.formState.errors.client?.company.message}
							</p>
						)}
					</div>
					<div>
						<label
							htmlFor='userCompanyInfo'
							className='block text-sm font-medium mb-1.5'>
							About Your Company
						</label>
						<textarea
							id='userCompanyInfo'
							{...form.register('client.about_company')}
							className='w-full bg-input/20 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500'
						/>
						{form.formState.errors.client?.about_company && (
							<p className='text-red-400 text-sm mt-1'>
								{form.formState.errors.client?.about_company.message}
							</p>
						)}
					</div>
				</div>
			</div>

			<div className='p-6 rounded-lg border border-gray-700'>
				<h3 className='text-xl font-bold mb-4'>Message Customization</h3>
				<div className='space-y-6'>
					<div>
						<label
							htmlFor='additionalInfo'
							className='block text-sm font-medium mb-1.5'>
							Additional Context
						</label>
						<textarea
							id='additionalInfo'
							{...form.register('additionalInfo')}
							className='w-full bg-input/20 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500'
						/>
						{form.formState.errors.additionalInfo && (
							<p className='text-red-400 text-sm mt-1'>
								{form.formState.errors.additionalInfo.message}
							</p>
						)}
					</div>
					<div className='grid sm:grid-cols-2 gap-6'>
						<div>
							<label
								htmlFor='communicationChannel'
								className='block text-sm font-medium mb-1.5'>
								Channel
							</label>
							<select
								id='communicationChannel'
								{...form.register('channel')}
								className='w-full bg-input/20 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500'>
								<option value='email'>Email</option>
								<option value='linkedin'>LinkedIn</option>
							</select>
							{form.formState.errors.channel && (
								<p className='text-red-400 text-sm mt-1'>
									{form.formState.errors.channel.message}
								</p>
							)}
						</div>
						<div>
							<label className='block text-sm font-medium mb-1.5'>Tone</label>
							<div className='grid grid-cols-2 sm:grid-cols-2 gap-4'>
								{toneOptions.map((option) => (
									<div key={option.value}>
										<input
											type='radio'
											id={option.value}
											value={option.value}
											{...form.register('tone')}
											className='sr-only peer'
										/>
										<label
											htmlFor={option.value}
											className='flex items-center justify-center p-3 text-sm rounded-md border-2 border-gray-600 bg-gray-800 hover:bg-gray-700 peer-checked:border-purple-500 peer-checked:bg-purple-900 peer-checked:text-white cursor-pointer transition-colors w-full'>
											{option.label}
										</label>
									</div>
								))}
							</div>
							{form.formState.errors.tone && (
								<p className='text-red-400 text-sm mt-1'>
									{form.formState.errors.tone.message}
								</p>
							)}
						</div>
					</div>
				</div>
			</div>

			<button
				type='submit'
				disabled={isGenerating}
				className='w-full text-lg py-3 px-6 font-bold bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 rounded-md transition-colors flex items-center justify-center'>
				{isGenerating && (
					<svg
						className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'>
						<circle
							className='opacity-25'
							cx='12'
							cy='12'
							r='10'
							stroke='currentColor'
							strokeWidth='4'></circle>
						<path
							className='opacity-75'
							fill='currentColor'
							d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
					</svg>
				)}
				{isGenerating ? 'Generating...' : 'Generate Message'}
			</button>
		</form>
	);
}
