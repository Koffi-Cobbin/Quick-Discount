import React from 'react';
import { useState, useContext, useEffect } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import Modal from '../UI/Modal';
import CartItem from './CartItem';
import classes from './Cart.module.css';
import CartContext from '../../store/cart-context';
import { orderAPI, setPreviousUrl } from '../../actions';


const Cart = (props) => {
  const cartCtx = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();

  const totalAmount = `${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;
  const { items } = cartCtx;

  const handleRedirect = (url) => {
    navigate(url);
  };

  // Instead of moving to payment whenever there's an order,
  // lets always handle order and always replace the order obj in the db
  useEffect(() => {
    if (items.length === 0) {
      return;
    }
  }, [items]);
  
  useEffect(() => {
    props.setUrl(location.pathname);
    if (props.order && props.order.amount === totalAmount){
      props.onClose();
      handleRedirect('/payment');
    }
    }, [props.order]);

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const addItemHandler = () => {
    props.onClose();
    handleRedirect('/events');
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem({ ...item, quantity: 1 });
  };

  const orderHandler = (item) => {
    let cartItemsId = cartCtx.items.map((item) => (`${item.id},${item.quantity}`));

    const payload = {
      items: cartItemsId.join(' '),
      totalAmount: totalAmount
    };

    console.log(payload);
    if (props.user){
      props.sendOrder(payload);
    }
    else{
      handleRedirect("/login");
    }
  };

  const cartItems = (
    <ul className={classes['cart-items']}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          quantity={item.quantity}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  return (
    <Modal onClose={props.onClose}>
      {cartCtx.items.length ? (
        <>
        {cartItems}
          <div className={classes.total}>
            <span>Total Amount</span>
            <span>GH&#8373; {totalAmount}</span>
          </div>
        </>
        ) : (
        <>
          <p style={{'textAlign':'center'}}>You have no items in your cart</p>
          <p style={{'textAlign':'center'}} className={classes.actions}>
            <button onClick={addItemHandler} className={classes.button}>Add</button>
          </p>
        </>)
      }
      
      <div className={classes.actions}>
        <button className={classes['button--alt']} onClick={props.onClose}>
          Close
        </button>
        {hasItems && <button onClick={orderHandler} className={classes.button}>Order</button>}
      </div>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
    order: state.userState.order,
  };
};

const mapDispatchToProps = (dispatch) => ({
  sendOrder: (payload) => dispatch(orderAPI(payload)),
  setUrl: (url) => dispatch(setPreviousUrl(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
