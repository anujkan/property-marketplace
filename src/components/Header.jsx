import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import logo from "../assets/jpg/logo-home.png";
import { ReactComponent as OfferIcon } from "../assets/svg/localOfferIcon.svg";
import { ReactComponent as ExploreIcon } from "../assets/svg/exploreIcon.svg";
import { ReactComponent as PersonOutlineIcon } from "../assets/svg/personOutlineIcon.svg";
import classes from "./Header.module.scss";

const Header = () => {
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
		<header className={classes.pageHeader}>
			<div className={`group ${classes.logo}`} onClick={() => navigate("/")}>
				<img
					className="duration-500 group-hover:opacity-50"
					src={logo}
					alt="Property Marketplace"
				/>
				<h4>Property Marketplace</h4>
			</div>
			<div className={classes["page-navigation"]}>
				<nav>
					<ul>
						<li className="group" onClick={() => navigate("/")}>
							<ExploreIcon
								className={`w-5 h-5 mr-2 ${
									pathMatchRoute("/") ? "fill-[#01bfa1]" : "fill-slate-500"
								}`}
							/>
							<p
								className={`${classes["link-text"]} group-hover: ${
									pathMatchRoute("/")
										? "text-slate-800 decoration-[#01bfa1]"
										: "text-slate-500 decoration-white"
								}`}
							>
								Explore
							</p>
						</li>
						<li className="group" onClick={() => navigate("/offers")}>
							<OfferIcon
								className={`w-4 h-4 mr-2 ${
									pathMatchRoute("/offers")
										? "fill-[#01bfa1]"
										: "fill-slate-500"
								}`}
							/>
							<p
								className={`${classes["link-text"]} group-hover: ${
									pathMatchRoute("/offers")
										? "text-slate-800 decoration-[#01bfa1]"
										: "text-slate-500 decoration-white"
								}`}
							>
								Offers
							</p>
						</li>
						<li className="group" onClick={() => navigate("/profile")}>
							<PersonOutlineIcon
								className={`w-5 h-5 mr-2 ${
									isActiveLink ? "fill-[#01bfa1]" : "fill-slate-500"
								}`}
							/>
							<p
								className={`${classes["link-text"]} group-hover: ${
									isActiveLink
										? "text-slate-800 decoration-[#01bfa1]"
										: "text-slate-500 decoration-white"
								}`}
							>
								{loggedIn ? "Profile" : "Login"}
							</p>
						</li>
					</ul>
				</nav>
			</div>
		</header>
	);
};

export default Header;
