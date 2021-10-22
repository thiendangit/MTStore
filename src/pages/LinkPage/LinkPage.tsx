import React from 'react';
import { Switch, Route as MyRouter } from 'react-router-dom';
import { HomePage } from '../HomePage/HomePage';
import { ProductDetail } from '../../components/ProductDetail/ProductDetail';

export const LinkPage: React.FC = () => {
  return (
    <Switch>
      <MyRouter
        exact
        path="/"
        // render={() => {
        //   return <Redirect to="/" />;
        // }}
        component={HomePage}
      />
      <MyRouter path="/product" component={ProductDetail} />
    </Switch>
  );
};
