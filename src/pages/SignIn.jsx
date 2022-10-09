import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";

import OAuth from "../components/OAuth";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";

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
		<>
			<div className="pageContainer">
				<header>
					<p className="pageHeader">Welcome Back!</p>
				</header>

				<main>
					<form onSubmit={onSubmitHandler}>
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

						<div className="signInBar">
							<p className="signInText">Sign In</p>
							<button className="signInButton">
								<ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
							</button>
						</div>
					</form>

					<OAuth />

					<Link to="/sign-up" className="registerLink">
						Sign-up Instead
					</Link>
				</main>
			</div>
		</>
	);
};

export default SignIn;
