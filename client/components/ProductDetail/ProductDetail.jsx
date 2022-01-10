import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../api';
import { Stars } from '../Shared/Stars';
import { totalRating } from '../../lib/ratingFunctions';
import ProductImage from './ProductImage.jsx';
import StyleSelector from './StyleSelector.jsx';
import ImageGallery from './ImageGallery.jsx';
import UpdateCart from './UpdateCart.jsx';
import RenderPrice from './RenderPrice.jsx';
import { Modal } from '../Shared/Modal';
import ShareButtons from './ShareButtons.jsx';
import ProductDescription from './ProductDescription.jsx';
import ScrollToReviews from './ScrollToReviews.jsx';

const ProductDetail = ({ product, productReviews, addToCart }) => {
  const [style, setStyle] = useState(product.styles.length > 0 ? product.styles[0] : null);
  const [photo, setPhoto] = useState(
    product.styles.length > 0 ? product.styles[0].photos[0] : null
  );

  let rating = productReviews ? totalRating(productReviews.ratings) : 0;
  let allRatings = productReviews ? productReviews.numReviews : 0;

  useEffect(() => {
    if (product.styles.length > 0) {
      setStyle(product.styles.length > 0 ? product.styles[0] : null);
      setPhoto(product.styles.length > 0 ? product.styles[0].photos[0] : null);
    } else {
      setStyle(null);
      setPhoto(null);
    }
  }, [product.id]);

  return (
    <Container id='ProductDetail'>
      <LeftContainer>
        {style && <ImageGallery currentStyle={style} changePhoto={(photo) => setPhoto(photo)} />}
        <ProductImage
          currentPhoto={photo}
          currentStyle={style}
          changePhoto={(photo) => setPhoto(photo)}
        />
      </LeftContainer>
      <RightContainer>
        <ReviewsHeader>
          <Stars number={rating} size={16} />
          <ScrollToReviews allRatings={allRatings} />
        </ReviewsHeader>
        <ProductHeader>
          <h3>{product.category}</h3>
          <h1>{product.name}</h1>
          <RenderPrice currentStyle={style} default_price={product.default_price} />
          {style && (
            <span>
              <b>Style &gt;</b> {style.name}
            </span>
          )}
        </ProductHeader>
        {style && (
          <StyleSelector
            productStyles={product.styles}
            changeStyle={(style) => {
              setStyle(style);
              setPhoto(style.photos[0]);
            }}
          />
        )}
        <CartContainer>
          {product && <UpdateCart style={style} product={product} addToCart={addToCart} />}
        </CartContainer>
        <ShareButtons />
      </RightContainer>
      <DescriptionContainer>
        <ProductDescription currentProduct={product} />
      </DescriptionContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: ${(props) => props.theme.bgLight};
  margin-top: 30px;
  color: ${(props) => props.theme.textLight};
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 65vh;
  margin: 0px;
  width: 55%;

  overflow: hidden;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px;
  width: calc(45% - 25px);
  padding-left: 25px;
`;

const ReviewsHeader = styled.div`
  display: flex;
  flex-direction: row;
  a {
    font-size: 0.7em;
    color: ${(props) => props.theme.graph};
  }
  a:hover {
    opacity: 0.8;
  }
`;

const ProductHeader = styled.div`
  width: 100%;
  h3 {
    font-size: 0.9em;
    margin-top: 20px;
    font-weight: normal;
    text-transform: capitalize;
  }

  h1 {
    font-size: 1.5em;
    margin: 0px;
    color: ${(props) => props.theme.textDark};
  }

  span {
    color: ${(props) => props.theme.textLight};
    font-size: 0.8em;
    text-transform: capitalize;
  }
`;

const CartContainer = styled.div`
  margin: 20px 0px;
`;

const DescriptionContainer = styled.div`
  width: 96%;
  margin-top: 15px;
  font-size: 0.8em;
  padding: 0% 2%;
`;

export default ProductDetail;
