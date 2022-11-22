import { Link } from "react-router-dom";
import rentCategoryImg from "../assets/jpg/rentCategoryImage.jpg";
import sellCategoryImg from "../assets/jpg/sellCategoryImage.jpg";
import Slider from "../components/Slider";

const Explore = (props) => {
	return (
		<div className="page-wrapper">
			<header>
				<p className="pageHeader">Explore</p>
			</header>

			<main>
				<Slider />
				<p className="exploreCategoryHeading">Categories</p>
				<div className="exploreCategories">
					<Link to="/category/rent">
						<img
							src={rentCategoryImg}
							alt="Rent"
							className="exploreCategoryImg"
						/>
						<p className="exploreCategoryName">Places for Rent</p>
					</Link>
					<Link to="/category/sale">
						<img
							src={sellCategoryImg}
							alt="Sell"
							className="exploreCategoryImg"
						/>
						<p className="exploreCategoryName">Places for Sale</p>
					</Link>
				</div>
			</main>
		</div>
	);
};

export default Explore;
