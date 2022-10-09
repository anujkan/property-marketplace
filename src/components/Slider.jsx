import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase.config";
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "../style/swiper-bundle.min.css";
import Spinner from "./Spinner";
import { formatPrice } from "../helper/helperFunctions";

function Slider() {
	const [loading, setLoading] = useState(true);
	const [listings, setListings] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchListing = async () => {
			const listingsRef = collection(db, "listings");
			const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
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
		fetchListing();
	}, []);

	if (loading) {
		return <Spinner />;
	}

	if (listings.length < 1) {
		return <></>;
	}

	return (
		listings && (
			<>
				<p className="exploreHeading">Recommended</p>

				<Swiper
					className="swiper-container recommended"
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
					{listings.map(({ data, id }) => (
						<SwiperSlide
							className="clickableSlider"
							key={id}
							onClick={() => navigate(`/category/${data.type}/${id}`)}
						>
							<div
								className="swiperSlideDiv"
								style={{
									background: `url(${data.imgUrls[0]}) center no-repeat`,
									backgroundSize: "cover",
								}}
							>
								<p className="swiperSlideText">{data.name}</p>
								<p className="swiperSlidePrice">
									{data.offer
										? formatPrice(data.discountedPrice)
										: formatPrice(data.regularPrice)}
									{data.type === "rent" && " / month"}
								</p>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</>
		)
	);
}

export default Slider;
