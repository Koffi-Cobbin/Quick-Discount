import { useReducer } from 'react';

import CartContext from './cart-context';

const defaultCartState = {
  items: sessionStorage.getItem('cartItems') ?  JSON.parse(sessionStorage.getItem('cartItems')) : [],
  totalAmount: sessionStorage.getItem('totalAmount') ?
  +JSON.parse(sessionStorage.getItem('totalAmount')) : 0,
};


const cartReducer = (state = defaultCartState, action)  => {

  if(action.type === 'ADD'){
    const updatedTotalAmount =
      state.totalAmount + action.item.price * action.item.quantity;

    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );

    const existingCartItem = state.items[existingCartItemIndex];
    let updatedItems;

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + action.item.quantity,
      };
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    } 
    else {
      updatedItems = state.items.concat(action.item);
    }

    sessionStorage.setItem('cartItems', JSON.stringify(updatedItems));
    sessionStorage.setItem('totalAmount', JSON.stringify(updatedTotalAmount));
    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }

  if(action.type === 'REMOVE'){  
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );

    const existingItem = state.items[existingCartItemIndex];
    const updatedTotalAmount = state.totalAmount - existingItem.price;
    let updatedItems;
  
    if (existingItem.quantity === 1) {
      updatedItems = state.items.filter(item => item.id !== action.id);
    } else {
      const updatedItem = { ...existingItem, quantity: existingItem.quantity - 1 };
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    }

    sessionStorage.setItem('cartItems', JSON.stringify(updatedItems));
    sessionStorage.setItem('totalAmount', JSON.stringify(updatedTotalAmount));
    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount
    };
  }

  if(action.type === 'CLEAR'){ 
    sessionStorage.setItem('cartItems', []);
    sessionStorage.setItem('totalAmount', 0);
  }
    
  return defaultCartState;
};


const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );

  const addItemToCartHandler = (item) => {
    dispatchCartAction({ type: 'ADD', item: item });
  };

  const removeItemFromCartHandler = (id) => {
    dispatchCartAction({ type: 'REMOVE', id: id });
  };

  const clearCartHandler = () => {
    dispatchCartAction({ type: 'CLEAR'});
  };

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
    clearCart: clearCartHandler
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
