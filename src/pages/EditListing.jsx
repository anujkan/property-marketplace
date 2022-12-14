import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage";
import { doc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import Spinner from "../components/Spinner";

const EditListings = () => {
	// eslint-disable-next-line no-unused-vars
	const [geolocationEnabled, setGeolocationEnabled] = useState(false);
	const [loading, setLoading] = useState(true);
	const [listing, setListing] = useState(false);
	const [formData, setFormData] = useState({
		type: "rent",
		name: "",
		bedrooms: 1,
		bathrooms: 1,
		parking: false,
		furnished: false,
		address: "",
		offer: false,
		regularPrice: 0,
		discountedPrice: 0,
		images: {},
		latitude: 0,
		longitude: 0,
	});

	const {
		type,
		name,
		bedrooms,
		bathrooms,
		parking,
		furnished,
		address,
		offer,
		regularPrice,
		discountedPrice,
		images,
		latitude,
		longitude,
	} = formData;

	const auth = getAuth();
	const navigate = useNavigate();
	const params = useParams();
	const isMounted = useRef(true);

	// redirect if listing is not belong to user

	useEffect(() => {
		if (
			listing &&
			listing !== undefined &&
			listing.useRef !== auth.currentUser.uid
		) {
			toast.error("You cannot Edit the Listing");
			navigate("/");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [auth.currentUser.uid, listing.useRef, navigate]);

	//  Fetching listing details to edit
	useEffect(() => {
		const fetchListing = async () => {
			const docRef = doc(db, "listings", params.listingId);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				setListing(docSnap.data());
				setFormData({ ...docSnap.data(), address: docSnap.data().location });
				setLoading(false);
			} else {
				navigate("/profile");
				toast.error("Listing does not exists!");
			}
		};
		fetchListing();
	}, [navigate, params.listingId]);

	// Check for Logged in user
	useEffect(() => {
		if (isMounted) {
			onAuthStateChanged(auth, (user) => {
				if (user) {
					setFormData({ ...formData, userRef: user.uid });
				} else {
					navigate("/sign-in");
				}
			});
		}

		return () => {
			isMounted.current = false;
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isMounted]);

	const onSubmitHandler = async (e) => {
		e.preventDefault();

		setLoading(true);

		if (discountedPrice >= regularPrice) {
			setLoading(false);
			toast.error("Discounted price should be less than Regular price");
			return;
		}

		if (images.length > 6) {
			setLoading(false);
			toast.error("You can upload maximum 6 Images");
			return;
		}

		let geolocation = {};
		let location;
		geolocation.lat = latitude;
		geolocation.lng = longitude;
		location = address;

		// Store images in Firebase

		const storeImage = async (image) => {
			return new Promise((resolve, reject) => {
				const storage = getStorage();
				const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
				const storageRef = ref(storage, "images/" + fileName);

				const uploadTask = uploadBytesResumable(storageRef, image);

				// Register three observers:
				// 1. 'state_changed' observer, called any time the state changes
				// 2. Error observer, called on failure
				// 3. Completion observer, called on successful completion
				uploadTask.on(
					"state_changed",
					(snapshot) => {
						// Observe state change events such as progress, pause, and resume
						// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
						// eslint-disable-next-line no-unused-vars
						const progress =
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						// eslint-disable-next-line default-case
						switch (snapshot.state) {
							case "paused":
								break;
							case "running":
								break;
						}
					},
					(error) => {
						// Handle unsuccessful uploads
						reject(error);
					},
					() => {
						// Handle successful uploads on complete
						// For instance, get the download URL: https://firebasestorage.googleapis.com/...
						getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
							resolve(downloadURL);
						});
					}
				);
			});
		};

		const imgUrls = await Promise.all(
			[...images].map((image) => storeImage(image))
		).catch(() => {
			setLoading(false);
			toast.error("Images not uploaded");
		});

		const formDataCopy = {
			...formData,
			imgUrls,
			geolocation,
			timestamp: serverTimestamp(),
		};

		delete formDataCopy.images;
		delete formDataCopy.address;
		formDataCopy.location = location;
		!formDataCopy.offer && delete formDataCopy.discountedPrice;

		// Update listing
		const docRef = doc(db, "listings", params.listingId);
		setLoading(true);
		await updateDoc(docRef, formDataCopy);

		setLoading(false);
		toast.success("Listing Edited Successfully!");
		navigate(`/category/${formDataCopy.type}/${docRef.id}`);

		setLoading(false);
	};

	const onMutate = (e) => {
		let boolean = null;

		if (e.target.value === "true") boolean = true;
		if (e.target.value === "false") boolean = false;

		//  Files
		if (e.target.files) {
			setFormData((prevState) => ({
				...prevState,
				images: e.target.files,
			}));
		}

		// Text/Booleans/Number
		if (!e.target.files) {
			setFormData((prevState) => ({
				...prevState,
				[e.target.id]: boolean ?? e.target.value,
			}));
		}
	};

	if (loading) {
		return <Spinner />;
	}

	return (
		<div className="page-wrapper">
			<header>
				<p className="pageHeader">Edit Listing</p>
			</header>
			<main>
				<form onSubmit={onSubmitHandler}>
					<label className="formLabel">Sell / Rent</label>
					<div className="formButtons">
						<button
							type="button"
							className={type === "sale" ? "formButtonActive" : "formButton"}
							id="type"
							value="sale"
							onClick={onMutate}
						>
							Sell
						</button>
						<button
							type="button"
							className={type === "rent" ? "formButtonActive" : "formButton"}
							id="type"
							value="rent"
							onClick={onMutate}
						>
							Rent
						</button>
					</div>
					<label className="formLabel">Name</label>
					<input
						className="formInputName"
						type="text"
						id="name"
						value={name}
						onChange={onMutate}
						maxLength="32"
						minLength="2"
						required
					/>

					<div className="formRooms flex">
						<div>
							<label className="formLabel">Bedrooms</label>
							<input
								className="formInputSmall"
								type="number"
								id="bedrooms"
								value={bedrooms}
								onChange={onMutate}
								min="1"
								max="50"
								required
							/>
						</div>
						<div>
							<label className="formLabel">Bathrooms</label>
							<input
								className="formInputSmall"
								type="number"
								id="bathrooms"
								value={bathrooms}
								onChange={onMutate}
								min="1"
								max="50"
								required
							/>
						</div>
					</div>

					<label className="formLabel">Parking spot</label>
					<div className="formButtons">
						<button
							className={parking ? "formButtonActive" : "formButton"}
							type="button"
							id="parking"
							value={true}
							onClick={onMutate}
							min="1"
							max="50"
						>
							Yes
						</button>
						<button
							className={
								!parking && parking !== null ? "formButtonActive" : "formButton"
							}
							type="button"
							id="parking"
							value={false}
							onClick={onMutate}
						>
							No
						</button>
					</div>

					<label className="formLabel">Furnished</label>
					<div className="formButtons">
						<button
							className={furnished ? "formButtonActive" : "formButton"}
							type="button"
							id="furnished"
							value={true}
							onClick={onMutate}
						>
							Yes
						</button>
						<button
							className={
								!furnished && furnished !== null
									? "formButtonActive"
									: "formButton"
							}
							type="button"
							id="furnished"
							value={false}
							onClick={onMutate}
						>
							No
						</button>
					</div>

					<label className="formLabel">Address</label>
					<textarea
						className="formInputAddress"
						type="text"
						id="address"
						value={address}
						onChange={onMutate}
						required
					/>

					{!geolocationEnabled && (
						<div className="formLatLng flex">
							<div>
								<label className="formLabel">Latitude</label>
								<input
									className="formInputSmall"
									type="number"
									id="latitude"
									value={latitude}
									onChange={onMutate}
									required
								/>
							</div>
							<div>
								<label className="formLabel">Longitude</label>
								<input
									className="formInputSmall"
									type="number"
									id="longitude"
									value={longitude}
									onChange={onMutate}
									required
								/>
							</div>
						</div>
					)}

					<label className="formLabel">Offer</label>
					<div className="formButtons">
						<button
							className={offer ? "formButtonActive" : "formButton"}
							type="button"
							id="offer"
							value={true}
							onClick={onMutate}
						>
							Yes
						</button>
						<button
							className={
								!offer && offer !== null ? "formButtonActive" : "formButton"
							}
							type="button"
							id="offer"
							value={false}
							onClick={onMutate}
						>
							No
						</button>
					</div>

					<label className="formLabel">Regular Price</label>
					<div className="formPriceDiv">
						<input
							className="formInputSmall"
							type="number"
							id="regularPrice"
							value={regularPrice}
							onChange={onMutate}
							min="50"
							max="750000000"
							required
						/>
						{type === "rent" && <p className="formPriceText">$ / Month</p>}
					</div>

					{offer && (
						<>
							<label className="formLabel">Discounted Price</label>
							<input
								className="formInputSmall"
								type="number"
								id="discountedPrice"
								value={discountedPrice}
								onChange={onMutate}
								min="50"
								max="750000000"
								required={offer}
							/>
						</>
					)}

					<label className="formLabel">Images</label>
					<p className="imagesInfo">
						The first image will be the cover (max 6).
					</p>
					<input
						className="formInputFile"
						type="file"
						id="images"
						onChange={onMutate}
						max="6"
						accept=".jpg,.png,.jpeg"
						multiple
						required
					/>
					<button type="submit" className="primaryButton editListingButton">
						Edit Listing
					</button>
				</form>
			</main>
		</div>
	);
};

export default EditListings;
