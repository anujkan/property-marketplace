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
import bedIcon from "../assets/svg/bedIcon.svg";
import parkingIcon from "../assets/svg/square-parking-solid.svg";
import furnitureIcon from "../assets/svg/furniture-icon.svg";
import bathroomIcon from "../assets/svg/bathroom-icon.svg";

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
		<main className="page-wrapper relative">
			<Swiper
				className="swiper-container rounded-lg mb-6"
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
					{listing.name}
					<span className="hidden sm:inline-block">&nbsp; - &nbsp;</span>
					<span className="priceColor block sm:inline-block">
						{listing.offer
							? formatPrice(listing.discountedPrice)
							: formatPrice(listing.regularPrice)}
					</span>
				</p>
				<p className="listingType">
					For {listing.type === "rent" ? "Rent" : "Sale"}
				</p>
				{listing.offer && (
					<p className="discountPrice">
						{formatPrice(listing.regularPrice - listing.discountedPrice)}{" "}
						discount
					</p>
				)}
				<p className="listingLocation">{listing.location}</p>
				<ul className="listingDetailsList">
					{listing.bedrooms && (
						<li className="flex flex-row items-center">
							<img
								src={bedIcon}
								alt="Bedrooms"
								className="mr-2 opacity-50 w-5"
							/>
							{listing.bedrooms > 1
								? `${listing.bedrooms} Bedrooms`
								: "1 Bedroom"}
						</li>
					)}
					{console.log(listing)}
					{listing.bathrooms && (
						<li className="flex flex-row items-center">
							<img
								src={bathroomIcon}
								alt="Bedrooms"
								className="mr-2 opacity-50 w-4"
							/>
							{listing.bathrooms > 1
								? `${listing.bathrooms} Bathrooms`
								: "1 Bathroom"}
						</li>
					)}
					{listing.parking && (
						<li className="flex flex-row items-center">
							<img
								src={parkingIcon}
								alt="Parking"
								className="mr-2 opacity-50 w-4"
							/>
							Parking Available
						</li>
					)}
					{listing.furnished && (
						<li className="flex flex-row items-center">
							<img
								src={furnitureIcon}
								alt="Fully Furnished"
								className="mr-2 opacity-50 w-5"
							/>
							Fully Furnished
						</li>
					)}
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
