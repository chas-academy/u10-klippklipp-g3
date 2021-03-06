import React, { useContext, useEffect } from 'react';
// import { useHistory } from 'react-router-dom';
import StoreContext from '../../context/StoreContext';
import jwt from 'jwt-decode';

// Layout
import { Header, Footer } from '../';

// Page component routes
import PageRoutes from '../../routes';

// import { LoginForm } from '../../components/auth';
import Modal from '../../components/modal';

// Style
import './style.scss';

const MainLayout = () => {
	// By deconstructing our store context
	// we now have access to our global states
	// and can set/update/mutate them as needed
	const {
		store: {
			lsin,
			layouts: { layout },
			user: { setAuth, unAuth },
			// modals: { updateModal, toggleModal },
		},
	} = useContext(StoreContext);

	const token = localStorage.getItem(lsin);
	// const history = useHistory();

	useEffect(() => {
		if (token) {
			const payload = jwt(token);
			const time = new Date().getTime();
			const expTime = payload.exp;
			const isValid = expTime > time;

			// Handle expired token
			if (isValid) {
				setAuth(true);
			} else {
				setAuth(false);
				unAuth();
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token]);

	// useEffect(() => {
	// 	// Check history. We might have been
	// 	// sent here from another component
	// 	// or page with a login directive
	// 	const historyState = typeof history.location.state !== 'undefined';
	// 	const loginDirective = historyState
	// 		? typeof history.location.state.loginDirective !== 'undefined'
	// 		: false;

	// 	// If there is a login directive
	// 	if (loginDirective) {
	// 		// Reset history to prevent infinite loop
	// 		history.push('/', undefined);

	// 		// Open modal
	// 		toggleModal();
	// 		// Set modal content to login form
	// 		updateModal({
	// 			title: 'Login',
	// 			body: <LoginForm />,
	// 		});
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [history]);

	return (
		<>
			<Header />

			<main
				className='container'
				style={{
					paddingBottom: `calc(${layout.footer.height}px + 2rem)`,
				}}
			>
				<PageRoutes />
			</main>

			<Footer />
			<Modal />
		</>
	);
};

export default MainLayout;
