import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	getAuth,
	createUserWithEmailAndPassword,
	updateProfile,
} from "firebase/auth";
import { db } from "../firebase.config";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

import OAuth from "../components/OAuth";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import { toast } from "react-toastify";

const SignUp = (props) => {
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});
	const { name, email, password } = formData;
	const navigate = useNavigate();

	const handleVisibilityIconClick = () =>
		setShowPassword((prevState) => !prevState);

	const onChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value,
		}));
	};

	const onSubmitHandler = async (event) => {
		event.preventDefault();
		try {
			const auth = getAuth();
			const userCredentials = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredentials.user;
			updateProfile(auth.currentUser, {
				displayName: name,
			});

			const formDataCopy = { ...formData };
			delete formDataCopy.password;
			formDataCopy.timestamp = serverTimestamp();

			await setDoc(doc(db, "users", user.uid), formDataCopy);

			navigate("/");
		} catch (error) {
			toast.error("Something went wrong! Please try again.");
		}
	};

	return (
		<>
			<div className="pageContainer">
				<header>
					<p className="pageHeader">Welcome!</p>
				</header>

				<main>
					<form onSubmit={onSubmitHandler}>
						<input
							type="text"
							className="nameInput"
							placeholder="Name"
							id="name"
							value={name}
							onChange={onChange}
						/>
						<input
							type="email"
							className="emailInput"
							placeholder="Email"
							id="email"
							value={email}
							onChange={onChange}
							autoComplete="username"
						/>
						<div className="passwordInputDiv">
							<input
								type={showPassword ? "text" : "password"}
								className="passwordInput"
								id="password"
								placeholder="Password"
								value={password}
								onChange={onChange}
								autoComplete="current-password"
							/>
							<img
								src={visibilityIcon}
								alt="show password"
								className="showPassword"
								onClick={handleVisibilityIconClick}
							/>
						</div>
						<Link to="/forgot-password" className="forgotPasswordLink">
							Forgot Password
						</Link>

						<div className="signUpBar">
							<p className="signUpText">Sign Up</p>
							<button type="submit" className="signUpButton">
								<ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
							</button>
						</div>
					</form>

					<OAuth />

					<Link to="/sign-in" className="registerLink">
						Sign-In Instead
					</Link>
				</main>
			</div>
		</>
	);
};

export default SignUp;
