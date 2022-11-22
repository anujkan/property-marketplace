import { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import formBgImage from "../assets/jpg/user-form-background.jpg";

const ForgotPassword = (props) => {
	const [email, setEmail] = useState("");

	const onChangeHandler = (e) => {
		setEmail(e.target.value);
	};

	const onSubmitHandler = async (e) => {
		e.preventDefault();

		try {
			const auth = getAuth();
			await sendPasswordResetEmail(auth, email);
			toast.success("Email Sent!");
		} catch (error) {
			toast.error("Something went wrong!");
		}
	};

	return (
		<div className="user-form-container">
			<div className="form-wrapper">
				<div className="user-form">
					<header>
						<h2 className="pageHeader">Retrieve your Password!</h2>
					</header>

					<main className="mt-16">
						<form onSubmit={onSubmitHandler}>
							<input
								type="email"
								className="user-form-input user-email-input"
								placeholder="Email"
								id="email"
								value={email}
								onChange={onChangeHandler}
							/>
							<div className="signInBar mt-0">
								<button type="submit" className="signInButton">
									<p className="signInText">Send Reset Link</p>
									<ArrowRightIcon fill="#ffffff" width="24px" height="24px" />
								</button>
							</div>
						</form>

						<div className="switch-form">
							<p>Remembered your Password?</p>
							<Link to="/sign-in" className="registerLink">
								Back to Login
							</Link>
						</div>
					</main>
				</div>
				<div className="bg-container">
					<img src={formBgImage} alt="Property Marketplace" />
				</div>
			</div>
		</div>

		// <div className="page-wrapper">
		// 	<header>
		// 		<p className="pageHeader">Forgot Password</p>
		// 	</header>

		// 	<main>
		// 		<form onSubmit={onSubmitHandler}>
		// 			<input
		// 				type="email"
		// 				className="emailInput"
		// 				placeholder="Email"
		// 				id="email"
		// 				value={email}
		// 				onChange={onChangeHandler}
		// 			/>
		// 			<Link className="forgotPasswordLink" to="/sign-in">
		// 				Sign-in Instead
		// 			</Link>
		// 			<div className="signInBar">
		// 				<div className="signInText">Send Reset Link</div>
		// 				<button className="signInButton">
		// 					<ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
		// 				</button>
		// 			</div>
		// 		</form>
		// 	</main>
		// </div>
	);
};

export default ForgotPassword;
