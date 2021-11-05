import React, { ChangeEvent, useEffect } from 'react';
import './CartPage.css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  actionsCart,
  addOneToCart,
  CartProduct,
  clearCart,
  decreaseOneCart,
  getCartState,
  getTotals,
  removeFromCart,
  selectedAllToCart,
  selectedOneToCart,
} from '@store/reducers/cartSlice';
import { Product } from 'WooCommerce';
import { images } from '@public/image';
import { handleProductPrice } from '@utils/handleProductPrice';
import { Clear, KeyboardBackspaceOutlined, RemoveShoppingCartOutlined } from '@material-ui/icons';
import { Checkbox, FormControlLabel, TextField } from '@material-ui/core';

export const CartPage = () => {
  const cart = useSelector(getCartState);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTotals());
  }, [cart]);

  const handleRemoveFromCart = (cartItem: Product) => {
    dispatch(removeFromCart(cartItem));
  };
  const handleDecreaseCart = (cartItem: Product) => {
    dispatch(decreaseOneCart(cartItem));
  };
  const handleIncreaseCart = (cartItem: Product) => {
    dispatch(addOneToCart(cartItem));
  };
  const handleClearCart = () => {
    dispatch(clearCart());
  };
  const handleSelectedProduct = (cartItem: Product) => {
    dispatch(
      selectedOneToCart({
        product: cartItem,
      }),
    );
  };
  const handleSelectedAllProduct = () => {
    dispatch(selectedAllToCart());
  };

  const onChangeQuantity = (quantity: number, product: CartProduct) => {
    dispatch(actionsCart.addOneToCartWithQty({ product, quantity }));
  };

  const onClickAll = () => handleSelectedAllProduct();

  const cartList = () => {
    return (
      <>
        {cart.cartItems.length === 0 ? (
          <div className="cart-empty">
            <h3>Your cart is currently empty</h3>
            <div className="start-shopping">
              <Link to="/">
                <span>
                  {' '}
                  <KeyboardBackspaceOutlined fontSize={'large'} /> Start Shopping
                </span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="cart-items">
            {cart.cartItems?.map((cartItem) => {
              const { sale_price } = handleProductPrice(cartItem);
              const onClickDecreaseCart = () => handleDecreaseCart(cartItem);
              const onClickIncreaseCart = () => handleIncreaseCart(cartItem);
              const onClickSelectedProduct = () => handleSelectedProduct(cartItem);
              const onClickRemoveFromCart = () => handleRemoveFromCart(cartItem);
              const _onChangeQuantity = (onChangeProps: ChangeEvent<HTMLInputElement>) => {
                onChangeQuantity(parseInt(onChangeProps?.target?.value ? onChangeProps?.target?.value : '0'), cartItem);
              };
              return (
                <div key={cartItem?.id} className="cart-item">
                  <div className="cart-product">
                    <FormControlLabel
                      control={
                        <Checkbox
                          onClick={onClickSelectedProduct}
                          size={'medium'}
                          style={{ color: 'var(--orange)' }}
                          checked={!!cartItem?.cartInf?.is_selected}
                        />
                      }
                      label={''}
                    />
                    <img
                      src={cartItem?.images?.[0]?.src ? cartItem?.images?.[0]?.src : `${images.noImg}`}
                      alt={cartItem?.name}
                    />
                    <div>
                      <h4>{cartItem?.name}</h4>
                      {/*<div*/}
                      {/*  dangerouslySetInnerHTML={{ __html: cartItem?.description }}*/}
                      {/*  className="product__list-item-desc mt-auto w-full truncate break-all"*/}
                      {/*/>*/}
                      <button onClick={onClickRemoveFromCart}>
                        {' '}
                        <Clear fontSize={'medium'} /> Remove
                      </button>
                    </div>
                  </div>
                  <div className="cart-product-price">$ {sale_price ? sale_price : 0}</div>
                  <div className="cart-product-quantity">
                    <button onClick={onClickDecreaseCart}>-</button>
                    {/*<div className="count">{cartItem?.cartInf.quantity}</div>*/}
                    <TextField
                      defaultValue={cartItem?.cartInf.quantity}
                      value={cartItem?.cartInf.quantity}
                      onChange={_onChangeQuantity}
                      inputProps={{ style: { textAlign: 'center', fontSize: 15 } }}
                      style={{
                        maxWidth: '20%',
                      }}
                    />
                    <button onClick={onClickIncreaseCart}>+</button>
                  </div>
                  <div className="cart-product-total-price">$ {sale_price * cartItem?.cartInf.quantity}</div>
                </div>
              );
            })}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">Shopping Cart</h2>
      <div>
        <div className="titles">
          <h4>Product</h4>
          <h4>Price</h4>
          <h4>Quantity</h4>
          <h4>Total</h4>
        </div>
        {cartList()}
        <div className="cart-summary">
          <div>
            <FormControlLabel
              control={
                <Checkbox onClick={onClickAll} style={{ color: 'var(--orange)', fontSize: '2rem !important' }} />
              }
              label={''}
            />
            <span className="cart-checkbox">Select All( {cart.cartTotalQuantity.toString()} )</span>
            <button className="clear-cart" onClick={() => handleClearCart()}>
              {' '}
              <RemoveShoppingCartOutlined fontSize={'medium'} /> Clear cart
            </button>
          </div>
          <div className="cart-checkout">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span className="amount">$ {cart.cartTotalAmount}</span>
            </div>
            <p>Taxes and shipping calculated at checkout</p>
            <button>Checkout</button>
            <div className="continue-shopping">
              <Link to="/">
                <span>
                  {' '}
                  <KeyboardBackspaceOutlined fontSize={'large'} /> Continue Shopping
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
