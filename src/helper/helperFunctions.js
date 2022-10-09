import Numeral from "react-numeral";

export const formatPrice = (value, format = "$ 0,0.00") => {
	return <Numeral value={value} format={format} />;
};
