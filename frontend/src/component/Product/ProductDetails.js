import React, { Fragment, useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProductDetails, newReview} from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";
import { useParams } from 'react-router-dom';
import ReviewCard from "./ReviewCard.js";
import { useAlert } from "react-alert";
import { Rating } from "@mui/lab";
import { addItemsToCart } from "../../actions/cartAction";
import {Dialog,DialogActions,DialogContent,DialogTitle,Button} from "@mui/material";
import { NEW_REVIEW_RESET } from "../../constants/productConstants";



const ProductDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const alert = useAlert();
  const { product,user,loading, error } = useSelector((state) => state.productDetails
  );


 

  const [quantity, setQuantity] = useState(1);
  


  const increaseQuantity = () => {
    if (product.Stock <= quantity) return;

    const qty = quantity + 1;
    setQuantity(qty);
  };

  const decreaseQuantity = () => {
    if (1 >= quantity) return;

    const qty = quantity - 1;
    setQuantity(qty);
  };

  const addToCartHandler = () => {
    dispatch(addItemsToCart(id, quantity));
    alert.success("Item Added To Cart");
  };

  
  
  useEffect(() => {
    if (error) {
        alert.error(error);
        dispatch(clearErrors());
      }
     
  
      
    dispatch(getProductDetails(id));
  }, [dispatch,id, error, alert]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={`${product.name} -- ECOMMERCE`} />
          
          <div className="ProductDetails">
            <div>
              <Carousel>
                {product.images &&
                  product.images.map((item, i) => (
                    <img
                      className="CarouselImage"
                      key={i}
                      src={item.url}
                      alt={`${i} Slide`}
                    />
                  ))}
              </Carousel>
            </div>
            <div>
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product # {product._id}</p>
              </div>
             
              <div className="detailsBlock-3">
                <h1>{`₹${product.price}`}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQuantity}>-</button>
                    <input readOnly type="number"  value={quantity}/>
                    <button onClick={increaseQuantity}>+</button>
                  </div>
                  <button
                    disabled={product.Stock < 1 ? true : false}
                    onClick={addToCartHandler}
                  >
                    Add to Cart
                  </button>
                  
              </div>
              <p>
                  Status:
                  <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                    {product.Stock < 1 ? "OutOfStock" : "InStock"}
                  </b>
                </p>
              <div className="detailsBlock-4">
                Description : <p>{product.description}</p>
              </div>
            </div>
          </div>
         
            </div>
            <h3 className="reviewsHeading">SELLER</h3>
            <div className="ProductDetails" id="ProductDetails2">
         
                    <div className="detailsBlock-11"><h2><span className="bad">Name - </span>{user.name}</h2>
                      <h2 className="abc"><span className="bad">Email - </span>{user.email}</h2>
                      <h2 className="abc"><span className="bad">PhoneNo - </span>{user.phoneno}</h2>
                      <h2><span className="bad">RegistrationNo - </span>{user.regno}</h2></div>
                   
                    </div>
           

            
          
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetails;
