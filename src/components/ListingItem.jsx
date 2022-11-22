import { Link } from "react-router-dom";
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";
import { ReactComponent as EditIcon } from "../assets/svg/editIcon.svg";
import bedIcon from "../assets/svg/bedIcon.svg";
import bathtubIcon from "../assets/svg/bathtubIcon.svg";
import { formatPrice } from "../helper/helperFunctions";

export const ListingItem = ({ listing, id, onDelete, onEdit }) => {
	return (
		<li className="categoryListing">
			<Link
				to={`/category/${listing.type}/${id}`}
				className="categoryListingLink"
			>
				<img
					src={listing.imgUrls[0]}
					alt={listing.name}
					className="categoryListingImg"
				/>
				<div className="categoryListingDetails">
					<p className="categoryListingLocation">{listing.location}</p>
					<p className="categoryListingName">{listing.name}</p>
					<p className="categoryListingPrice">
						{/* More CSS required */}
						{listing.offer
							? formatPrice(listing.discountedPrice)
							: formatPrice(listing.regularPrice)}
						{listing.type === "rent" && " / Month"}
					</p>
					<div className="categoryListingInfoDiv">
						<img src={bedIcon} alt="Bedrooms" className="w-5" />
						<p className="categoryListingInfoText">
							{listing.bedrooms > 1
								? `${listing.bedrooms} Bedrooms`
								: "1 Bedroom"}
						</p>
						<img src={bathtubIcon} alt="Bathrooms" className="w-5" />
						<p className="categoryListingInfoText">
							{listing.bathrooms > 1
								? `${listing.bathrooms} Bathrooms`
								: "1 Bathroom"}
						</p>
					</div>
				</div>
			</Link>
			{(onDelete || onEdit) && (
				<div className="actionIcons">
					{onDelete && (
						<DeleteIcon
							className="removeIcon"
							fill="rgb(231, 76, 60)"
							onClick={() => onDelete(listing.id, listing.name)}
						/>
					)}
					{onEdit && (
						<EditIcon
							className="editIcon"
							fill="rgb(9, 34, 54)"
							onClick={() => onEdit(id)}
						/>
					)}
				</div>
			)}
		</li>
	);
};
