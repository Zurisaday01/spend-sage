import UpdatePasswordForm from '@/features/auth/UpdatePasswordForm';
import UpdateUserDataForm from '@/features/auth/UpdateUserDataForm';

const Account = () => {
	return (
		<section className='flex flex-col space-y-6'>
			<h1 className='heading text-2xl'>Update your account</h1>

			<div className='bg-white rounded-md p-4 w-full flex flex-col space-y-4'>
				<h2 className='heading !text-xl'>Update user data</h2>
				<UpdateUserDataForm />
			</div>
			<div className='bg-white rounded-md p-4 w-full flex flex-col space-y-4'>
				<h2 className='heading !text-xl'>Update password</h2>
				<UpdatePasswordForm />
			</div>
		</section>
	);
};
export default Account;
