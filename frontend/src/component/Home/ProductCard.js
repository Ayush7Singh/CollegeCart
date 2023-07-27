import React from "react";
import { Link } from "react-router-dom";
import { Rating } from "@mui/lab";

const ProductCard = ({ product }) => {
  const options = {
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  };
  return (
    <Link className="productCard" to={`/product/${product._id}`}>
      <img src={product.images[0].url} alt={product.name} />
      <p>{product.name}</p>
      <span>{`₹${product.price}`}</span>
      <div>
        
        <span className="productCardSpan">
          {product.description}
        </span>
      </div>
      
    </Link>
  );
};

export default ProductCard;
