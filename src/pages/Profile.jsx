import { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import {
	updateDoc,
	doc,
	collection,
	getDocs,
	query,
	orderBy,
	where,
	deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";
import Spinner from "../components/Spinner";
import { ListingItem } from "../components/ListingItem";

const Profile = (props) => {
	const auth = getAuth();
	const [editDetails, setEditDetails] = useState(false);
	const [formData, setFormData] = useState({
		name: auth.currentUser.displayName,
		email: auth.currentUser.email,
	});
	const { name, email } = formData;

	const [loading, setLoading] = useState(true);
	const [listings, setListings] = useState(null);

	const navigate = useNavigate();

	useEffect(() => {
		const fetchUserListings = async () => {
			const listingsRef = collection(db, "listings");
			const q = query(
				listingsRef,
				where("userRef", "==", auth.currentUser.uid),
				orderBy("timestamp", "desc")
			);

			const querySnap = await getDocs(q);

			let listingsArr = [];

			querySnap.forEach((doc) => {
				return listingsArr.push({
					id: doc.id,
					data: doc.data(),
				});
			});
			setListings(listingsArr);
			setLoading(false);
		};
		fetchUserListings();
	}, [auth.currentUser.uid]);

	const logoutHandler = () => {
		auth.signOut();
		navigate("/");
	};

	const editHandler = async () => {
		try {
			if (auth.currentUser.displayName !== name) {
				await updateProfile(auth.currentUser, {
					displayName: name,
				});
				const userRef = doc(db, "users", auth.currentUser.uid);
				await updateDoc(userRef, {
					name,
				});
			}
		} catch (error) {
			toast.error("Could not update profile details");
		}
	};

	const inputChangeHandler = (event) => {
		setFormData((prevState) => ({
			...prevState,
			[event.target.id]: event.target.value,
		}));
	};

	const onDeleteHandler = async (listingId) => {
		if (window.confirm("Are you sure you want to Delete? ")) {
			await deleteDoc(doc(db, "listings", listingId));
			const updatedListings = listings.filter(
				(listing) => listing.id !== listingId
			);
			setListings(updatedListings);
			toast.success("Successfully Deleted Listing!");
		}
	};

	const onEditHandler = (listingId) => navigate(`/edit-listing/${listingId}`);

	if (loading) {
		<Spinner />;
	}

	return (
		<div className="page-wrapper">
			<header className="profileHeader">
				<p className="pageHeader">
					My Profile
					<button
						type="button"
						className="logOut float-right"
						onClick={logoutHandler}
					>
						Logout
					</button>
				</p>
			</header>

			<main>
				<div className="profileDetailsHeader">
					<p className="profileDetailsText">Personal Details</p>
					<p
						className="changePersonalDetails"
						onClick={() => {
							editDetails && editHandler();
							setEditDetails((prevState) => !prevState);
						}}
					>
						{editDetails ? "Done" : "Edit"}
					</p>
				</div>
				<div className="profileCard">
					<form>
						<input
							type="text"
							id="name"
							className={!editDetails ? "profileName" : "profileNameActive"}
							disabled={!editDetails}
							value={name}
							onChange={inputChangeHandler}
						/>
						<input
							type="email"
							id="email"
							className={!editDetails ? "profileEmail" : "profileEmailActive"}
							disabled={!editDetails}
							value={email}
							onChange={inputChangeHandler}
						/>
					</form>
				</div>

				<Link to="/create-listing" className="createListing">
					<img src={homeIcon} alt="Home" />
					<p>Sell or Rent your Property</p>
					<img src={arrowRight} alt="click here" />
				</Link>

				{!loading && listings?.length > 0 && (
					<>
						<p className="listingText">Your Listings</p>
						<ul className="listingsList">
							{listings.map((listing) => (
								<ListingItem
									key={listing.id}
									listing={listing.data}
									id={listing.id}
									onDelete={() => onDeleteHandler(listing.id)}
									onEdit={() => onEditHandler(listing.id)}
								/>
							))}
						</ul>
					</>
				)}
			</main>
		</div>
	);
};

export default Profile;
