import SignUpForm from '@/features/auth/SignUpForm';
import Logo from '@/ui/Logo';

const SignUp = () => {
	return (
		<main className='flex min-h-[100vh] items-center justify-center flex-col gap-3'>
			<Logo />
			<div className='min-w-[300px] md:min-w-[400px] bg-[#fffdf4] rounded-md p-5'>
				<h1 className='text-center heading text-2xl'>Sign Up</h1>
				<SignUpForm />
			</div>
		</main>
	);
};
export default SignUp;
