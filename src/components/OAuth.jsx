import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import googleIcon from "../assets/svg/googleIcon.svg";

const OAuth = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const googleAuthHandler = async () => {
		try {
			const auth = getAuth();
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);
			const user = result.user;
			// Check for user
			const docRef = doc(db, "users", user.uid);
			const docSnap = await getDoc(docRef);

			// If user, doesn't exists, create user
			if (!docSnap.exists()) {
				await setDoc(doc(db, "users", user.uid), {
					name: user.displayName,
					email: user.email,
					timestamp: serverTimestamp(),
				});
			}
			navigate("/");
		} catch (error) {
			toast.error("Could not Authorize with Google");
		}
	};

	return (
		<button className="socialLogin" onClick={googleAuthHandler}>
			<img className="socialIconImg" src={googleIcon} alt="Google" />
			{location.pathname === "/sign-up" ? "Sign up" : "Log in"} with Google
		</button>
	);
};

export default OAuth;
