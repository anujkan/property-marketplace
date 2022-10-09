import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "../style/swiper-bundle.min.css";

import { db } from "../firebase.config";
import Spinner from "../components/Spinner";
import shareIcon from "../assets/svg/shareIcon.svg";
import { formatPrice } from "../helper/helperFunctions";

const Listing = () => {
	const [listing, setListing] = useState(null);
	const [loading, setLoading] = useState(true);
	const [shareLinkCopied, setShareLinkCopied] = useState(false);

	const params = useParams();
	const auth = getAuth();

	useEffect(() => {
		const fetchListing = async () => {
			const docRef = doc(db, "listings", params.listingId);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				setListing(docSnap.data());
				setLoading(false);
			}
		};
		fetchListing();
	}, [params.listingId]);

	const shareListingHandler = () => {
		navigator.clipboard.writeText(window.location.href);
		setShareLinkCopied(true);
		setTimeout(() => {
			setShareLinkCopied(false);
		}, 2000);
	};

	if (loading) {
		return <Spinner />;
	}

	return (
		<main>
			<Swiper
				className="swiper-container"
				slidesPerView={1}
				pagination={{ clickable: true }}
				effect={"fade"}
				loop={true}
				navigation={true}
				autoplay={{
					delay: 10000,
					disableOnInteraction: true,
				}}
				modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
			>
				{listing.imgUrls.map((url, index) => (
					<SwiperSlide key={index}>
						<div
							style={{
								background: `url(${listing.imgUrls[index]}) center no-repeat`,
								backgroundSize: "cover",
							}}
							className="swiperSlideDiv"
						></div>
					</SwiperSlide>
				))}
			</Swiper>

			<div className="shareIconDiv" onClick={shareListingHandler}>
				<img src={shareIcon} alt="Share Listing" />
			</div>
			{shareLinkCopied && <p className="linkCopied">Link Copied!</p>}

			<div className="listingDetails">
				<p className="listingName">
					{listing.name} -{" "}
					{listing.offer
						? formatPrice(listing.discountedPrice)
						: formatPrice(listing.regularPrice)}
				</p>
				<p className="listingLocation">{listing.location}</p>
				<p className="listingType">
					For {listing.type === "rent" ? "Rent" : "Sale"}
				</p>
				{listing.offer && (
					<p className="discountPrice">
						{formatPrice(listing.regularPrice - listing.discountedPrice)}{" "}
						discount
					</p>
				)}
				<ul className="listingDetailsList">
					<li>
						{listing.bedrooms > 1
							? `${listing.bedrooms} Bedrooms`
							: "1 Bedroom"}
					</li>
					<li>
						{listing.bathroom > 1
							? `${listing.bathroom} Bathrooms`
							: "1 Bathroom"}
					</li>
					<li>{listing.parking && "Parking Available"}</li>
					<li>{listing.furnished && "Fully Furnished"}</li>
				</ul>
				<p className="listingLocationTitle">Location</p>

				<div className="leafletContainer">
					<MapContainer
						style={{ height: "100%", width: "100%" }}
						center={[listing.geolocation.lat, listing.geolocation.lng]}
						zoom={13}
						scrollWheelZoom={false}
					>
						<TileLayer
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>
						<Marker
							position={[listing.geolocation.lat, listing.geolocation.lng]}
						>
							<Popup>
								<b>{listing.name}</b> <br /> {listing.location}
							</Popup>
						</Marker>
					</MapContainer>
				</div>

				{auth.currentUser?.uid !== listing.userRef && (
					<Link
						to={`/contact/${listing.userRef}?listingName=${listing.name}`}
						className="primaryButton"
					>
						Contact Owner
					</Link>
				)}
			</div>
		</main>
	);
};

export default Listing;
