import { z } from 'zod';

export const outreachFormSchema = z.object({
	lead: z.object({
		name: z.string().min(2, 'Lead name must be at least 2 characters.'),
		role: z.string().min(2, 'Lead role must be at least 2 characters.'),
		company: z.string().min(2, 'Lead company must be at least 2 characters.'),
		company_website: z.string().optional(),
		additional_info: z.string().optional(),
	}),
	client: z.object({
		name: z.string().min(2, 'Client name must be at least 2 characters.'),
		role: z.string().min(2, 'Client role must be at least 2 characters.'),
		company: z.string().min(2, 'Client company must be at least 2 characters.'),
		about_company: z
			.string()
			.min(
				10,
				'Please provide some information about your company (at least 10 characters).'
			),
	}),
	channel: z.enum(['email', 'linkedin']),
	additionalInfo: z.string().optional(),
	tone: z.enum(['professional', 'cold', 'casual', 'consultative']).optional(),
});

export type OutreachFormValues = z.infer<typeof outreachFormSchema>;
