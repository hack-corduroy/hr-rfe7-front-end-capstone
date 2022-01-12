import React, { Component } from 'react';

import { THEMES } from '../settings/colors';
import styled, { ThemeProvider } from 'styled-components';
import { ProductDetail } from './ProductDetail';
import { QuestionsAnswers } from './QuestionsAnswers';
import { RatingsReviews } from './RatingsReviews';
import { RelatedItems } from './RelatedItems';
import { Header } from './Header/Header';
import { Loader } from './Shared/Loader';
import api from '../api';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      currentProduct: null,
      relatedProducts: null,
      questionData: null,
      reviewData: null,
      darkMode: false,
      loading: false,
      cart: [],
    };
  }

  addToCart(obj) {
    if (!this.state.cart.map((x) => x.style_id).includes(obj.style_id)) {
      this.setState({ cart: [...this.state.cart, obj] });
    }
  }

  fetchReviewData({ product_id, page = 1, count = 100, sort = 'newest' }) {
    api.getReviewData({ product_id, page, count, sort }, false).then((res) => {
      this.setState({ reviewData: res });
    });
  }

  fetchQuestionData({ product_id, page = 1, count = 100 }) {
    api.getQuestionData({ product_id, page, count }, false).then((res) => {
      this.setState({ questionData: res });
    });
  }

  componentDidMount() {
    api.getProducts({ count: 25 }).then((products) => {
      this.setState({ products: products }, () => {
        this.updateProduct(products[0].id);
      });
    });
  }

  //Handler to update the main product
  async updateProduct(id) {
    let isCached = await api.isProductCached({ product_id: id });

    if (!isCached) {
      await this.setState({ loading: true });
    }

    let data = await api.getProductData({ product_id: id });
    this.setState({ currentProduct: data });

    this.setState({ loading: false });

    data = await api.getRelatedProductData({ product_id: id });
    this.setState({ relatedProducts: data });

    data = await api.getQuestionData({ product_id: id });
    this.setState({ questionData: data });

    data = await api.getReviewData({ product_id: id });
    this.setState({ reviewData: data });
  }

  render() {
    const {
      products,
      currentProduct,
      relatedProducts,
      questionData,
      reviewData,
      darkMode,
      loading,
      cart,
    } = this.state;
    return (
      <ThemeProvider theme={THEMES[darkMode ? 'darkMode' : 'default']}>
        <Header
          toggleColors={() => this.setState({ darkMode: !darkMode })}
          products={products}
          product={currentProduct}
          updateProduct={(id) => this.updateProduct(id)}
          cart={cart}
          removeItemFromCart={(id) =>
            this.setState({ cart: cart.filter((x) => x.style_id !== id) })
          }
        />
        {loading === true && (
          <Container>
            <Loader />
          </Container>
        )}
        {currentProduct && (
          <Container>
            <ProductDetail
              product={currentProduct}
              updateProduct={(id) => this.updateProduct(id)}
              productReviews={reviewData}
              addToCart={(obj) => this.addToCart(obj)}
            />
            {relatedProducts && reviewData && (
              <RelatedItems
                product={currentProduct}
                related={relatedProducts}
                updateProduct={(id) => this.updateProduct(id)}
                rating={reviewData}
              />
            )}
            {questionData && (
              <QuestionsAnswers
                data={questionData}
                product={currentProduct}
                updateProduct={(id) => this.updateProduct(id)}
                fetchQuestionData={(params) => this.fetchQuestionData(params)}
              />
            )}
            {reviewData && (
              <RatingsReviews
                data={reviewData}
                product={currentProduct}
                fetch={(params) => this.fetchReviewData(params)}
              />
            )}
          </Container>
        )}
      </ThemeProvider>
    );
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background-color: ${(props) => props.theme.bgLight};

  padding-left: 15%;
  padding-right: 15%;

  width: 70%;

  @media (max-width: 880px) {
    padding: 0px 30px 80px 30px;
    width: calc(100% - 60px);
  }
`;

export default App;
