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
import formBgImage from "../assets/jpg/user-form-background.jpg";

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
			<div className="user-form-container">
				<div className="form-wrapper">
					<div className="user-form">
						<header>
							<h2 className="pageHeader">Welcome!</h2>
							<p className="-mt-3 mb-8 font-medium">Please Register</p>
						</header>

						<main>
							<form onSubmit={onSubmitHandler}>
								<input
									type="text"
									className="user-form-input user-name-input"
									placeholder="Name"
									id="name"
									value={name}
									onChange={onChange}
								/>
								<input
									type="email"
									className="user-form-input user-email-input"
									placeholder="Email"
									id="email"
									value={email}
									onChange={onChange}
									autoComplete="username"
								/>
								<div className="passwordInputDiv">
									<input
										type={showPassword ? "text" : "password"}
										className="user-form-input user-password-input"
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

								<div className="signUpBar">
									<button type="submit" className="signUpButton">
										<p className="signUpText">Create Account</p>
										<ArrowRightIcon fill="#ffffff" width="24px" height="24px" />
									</button>
								</div>
							</form>

							<div className="border-b relative border-slate-200 h-0 my-8 text-center flex justify-center">
								<span className="absolute -top-2 w-auto bg-white px-3 font-bold text-sm">
									OR
								</span>
							</div>

							<OAuth />

							<div className="switch-form">
								<p>Have an account?</p>
								<Link to="/sign-in" className="registerLink">
									Login
								</Link>
							</div>
						</main>
					</div>
					<div className="bg-container">
						<img src={formBgImage} alt="Property Marketplace" />
					</div>
				</div>
			</div>

			{/*<div className="page-wrapper">
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
	</div>*/}
		</>
	);
};

export default SignUp;
