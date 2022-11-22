import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";

import OAuth from "../components/OAuth";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";

import formBgImage from "../assets/jpg/user-form-background.jpg";

const SignIn = (props) => {
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const { email, password } = formData;
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
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			if (userCredential.user) {
				navigate("/");
			}
		} catch (error) {
			toast.error("Username or Password is not correct!");
		}
	};

	return (
		<div className="user-form-container">
			<div className="form-wrapper">
				<div className="user-form">
					<header>
						<h2 className="pageHeader">Welcome Back!</h2>
						<p className="-mt-3 mb-8 font-medium">Please Login</p>
					</header>

					<main>
						<form onSubmit={onSubmitHandler}>
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
							<Link to="/forgot-password" className="forgotPasswordLink">
								Forgot Password
							</Link>

							<div className="signInBar">
								<button className="signInButton">
									<p className="signInText">Log In</p>
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
							<p>Do not have an account yet?</p>
							<Link to="/sign-up" className="registerLink">
								Create One
							</Link>
						</div>
					</main>
				</div>
				<div className="bg-container">
					<img src={formBgImage} alt="Property Marketplace" />
				</div>
			</div>
		</div>
	);
};

export default SignIn;
