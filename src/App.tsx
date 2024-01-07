import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
// Pages
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Expenses from './pages/Expenses';
import Incomes from './pages/Incomes';
import Account from './pages/Account';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import PageNotFound from './pages/PageNotFound';

// persist the store and store
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store';
import { Provider } from 'react-redux';
import AppLayout from './ui/AppLayout';
import ProtectedRoute from './ui/ProtectedRoute';

function App() {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<BrowserRouter>
					<Routes>
						<Route
							element={
								<ProtectedRoute>
									<AppLayout />
								</ProtectedRoute>
							}>
							<Route index element={<Navigate replace to='dashboard' />} />
							<Route path='dashboard' element={<Dashboard />} />
							<Route path='categories' element={<Categories />} />
							<Route path='expenses' element={<Expenses />} />
							<Route path='incomes' element={<Incomes />} />
							<Route path='profile' element={<Account />} />
						</Route>
						<Route path='login' element={<Login />} />
						<Route path='signup' element={<SignUp />} />
						<Route path='*' element={<PageNotFound />} />
					</Routes>
				</BrowserRouter>
				<Toaster
					position='top-center'
					gutter={12}
					containerStyle={{ margin: '8px' }}
					toastOptions={{
						success: {
							duration: 3000,
						},
						error: {
							duration: 5000,
						},
						style: {
							fontSize: '16px',
							maxWidth: '500px',
							padding: '16px 34px',
							backgroundColor: '#FFFDF4',
							color: 'var(--text-foreground)',
						},
					}}></Toaster>
			</PersistGate>
		</Provider>
	);
}

export default App;
{
	/*index = default child route that should be rendered when the parent route is matched */
}
