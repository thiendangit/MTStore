import React from 'react';
import './ProductList.css';
import { ProductItems } from './ProductItems/ProductItems';
import { ButtonBase } from '@material-ui/core';
import { ChevronRight } from '@material-ui/icons';

export const ProductList: React.FC = () => {
  return (
    <>
      <div className="product">
        <div className="product__title">
          <h2>Best selling products</h2>
          <ButtonBase className="product__btn">
            More products
            <ChevronRight fontSize={'large'} />
          </ButtonBase>
        </div>
        <ProductItems />
      </div>
      <div className="recommence">
        <div className="product__title">
          <h2>Recommence for you</h2>
          <ButtonBase className="product__btn">
            More products
            <ChevronRight fontSize={'large'} />
          </ButtonBase>
        </div>
        <ProductItems />
      </div>
    </>
  );
};
