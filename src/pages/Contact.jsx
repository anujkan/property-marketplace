import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

const Contact = () => {
	const [message, setMessage] = useState("");
	const [owner, setOwner] = useState(null);
	// eslint-disable-next-line no-unused-vars
	const [searchParams, setSearchParams] = useSearchParams();
	const [loading, setLoading] = useState(true);
	const params = useParams();

	useEffect(() => {
		const getOwner = async () => {
			const docRef = doc(db, "users", params.ownerId);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				setOwner(docSnap.data());
			} else {
				toast.error("Could not get the Owner details");
			}
			setLoading(false);
		};
		getOwner();
	}, [params.ownerId]);

	const navigate = useNavigate();

	const handleGoBack = () => {
		navigate(-1);
	};

	const handleMessageToOwner = (e) => {
		setMessage(e.target.value);
	};

	if (loading) {
		return <Spinner />;
	}

	return (
		<div className="pageContainer">
			<header>
				<p className="pageHeader">Contact Owner</p>
			</header>
			{owner !== null && (
				<main>
					<div className="contactLandlord">
						<p className="landlordName">Contact {owner?.name}</p>
					</div>
					<form className="messageForm">
						<div className="messageDiv">
							<label htmlFor="message" className="messageLabel">
								Message
							</label>
							<textarea
								name="message"
								id="message"
								className="textarea mb-2"
								value={message}
								onChange={handleMessageToOwner}
							></textarea>
							<a
								href={`mailto:${owner.email}?Subject=${searchParams.get(
									"listingName"
								)}&body=${message}`}
							>
								<button type="button" className="primaryButton">
									Send Message
								</button>
							</a>
						</div>
					</form>
				</main>
			)}
			{owner === null && !loading && (
				<button onClick={handleGoBack} className="primaryButton">
					Back to the Listing Details
				</button>
			)}
		</div>
	);
};

export default Contact;
