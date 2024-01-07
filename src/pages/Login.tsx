import LoginForm from '@/features/auth/LoginForm';
import Logo from '@/ui/Logo';

const Login = () => {
	return (
		<main className='flex min-h-[100vh] items-center justify-center flex-col gap-3'>
			<Logo />
			<div className='min-w-[300px] md:min-w-[400px] bg-[#fffdf4] rounded-md p-5'>
				<h1 className='text-center heading text-2xl'>Log In</h1>
				<LoginForm />
			</div>
		</main>
	);
};
export default Login;
