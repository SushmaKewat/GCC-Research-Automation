import { Button } from '@/components/ui/button';

const DownloadCSV = ({ data }: { data: any[] }) => {
	const convertToCsv = (details: any[]): string => {
		const fileHeaders = [
			'Company Name',
			'Person Name',
			'Job Title',
			'Bio Summary',
			'Location',
			'LinkedIn Profile',
			'Confidence Score',
		];

		const rows: string[][] = [];

		details.forEach((c) => {
			c.people_details.forEach((p: any) => {
				const loc = [p.location?.city, p.location?.state, p.location?.country].filter(
					Boolean
				);
				// console.log(p.job_title);

				rows.push([
					c.company_name,
					p.person_name,
					p.job_title?.toString().replace(/,/g, ' ') || '',
					p.bio_summary || '',
					loc.length === 0 ? '' : loc.join('  '),
					p.linkedin_profile !== null ? p.linkedin_profile : '',
					p.confidence_score !== undefined ? p.confidence_score.toString() : '',
				]);
			});
		});

		// console.log(rows.join('\n'));

		const lines = [
			fileHeaders.join(','),
			...rows.map((row) => row.map((val) => `${val.replace(/"/g, '""')}`).join(',')),
		];

		return lines.join('\n');
	};

	const handleDownload = () => {
		const csvString = convertToCsv(data);
		const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);

		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', 'companies_data.csv');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<div className='text-white w-full border border-white p-3 rounded-2xl m-2'>
			<Button variant={'secondary'} onClick={handleDownload}>
				Download CSV
			</Button>
		</div>
	);
};
export default DownloadCSV;
