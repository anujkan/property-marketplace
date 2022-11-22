import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { ReactComponent as OfferIcon } from "../assets/svg/localOfferIcon.svg";
import { ReactComponent as ExploreIcon } from "../assets/svg/exploreIcon.svg";
import { ReactComponent as PersonOutlineIcon } from "../assets/svg/personOutlineIcon.svg";

const Navbar = (props) => {
	const navigate = useNavigate();
	const location = useLocation();
	const [loggedIn, setLoggedIn] = useState(false);
	const [isActiveLink, setIsActiveLink] = useState(false);

	useEffect(() => {
		const auth = getAuth();
		onAuthStateChanged(auth, (user) => {
			if (user === null) {
				setLoggedIn(false);
			} else {
				setLoggedIn(true);
			}
		});

		if (
			pathMatchRoute("/profile") ||
			pathMatchRoute("/sign-in") ||
			pathMatchRoute("/sign-up") ||
			pathMatchRoute("/forgot-password")
		) {
			setIsActiveLink(true);
		} else {
			setIsActiveLink(false);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.pathname]);

	const pathMatchRoute = (route) => {
		if (route === location.pathname) {
			return true;
		}
	};

	return (
		<footer className="navbar sm:hidden">
			<nav className="navbarNav">
				<ul className="navbarListItems">
					<li className="navbarListItem" onClick={() => navigate("/")}>
						<ExploreIcon
							className={
								pathMatchRoute("/") ? "fill-[#01bfa1]" : "fill-slate-500"
							}
							width="36px"
							height="36px"
						/>
						<p
							className={
								pathMatchRoute("/")
									? "navbarListItemNameActive"
									: "navbarListItemName"
							}
						>
							Explore
						</p>
					</li>
					<li className="navbarListItem" onClick={() => navigate("/offers")}>
						<OfferIcon
							className={
								pathMatchRoute("/offers") ? "fill-[#01bfa1]" : "fill-slate-500"
							}
							width="36px"
							height="36px"
						/>
						<p
							className={
								pathMatchRoute("/offers")
									? "navbarListItemNameActive"
									: "navbarListItemName"
							}
						>
							Offers
						</p>
					</li>
					<li className="navbarListItem" onClick={() => navigate("/profile")}>
						<PersonOutlineIcon
							className={isActiveLink ? "fill-[#01bfa1]" : "fill-slate-500"}
							width="36px"
							height="36px"
						/>
						<p
							className={
								isActiveLink ? "navbarListItemNameActive" : "navbarListItemName"
							}
						>
							{loggedIn ? "Profile" : "Login"}
						</p>
					</li>
				</ul>
			</nav>
		</footer>
	);
};

export default Navbar;
