import { useReducer } from 'react';
import WishlistContext from './wishlist-context';


const defaultWishlistState = {
  wishlist: sessionStorage.getItem('wishlist') ?  JSON.parse(sessionStorage.getItem('wishlist')) : [],
};


const wishlistReducer = (state = defaultWishlistState, action)  => {

  if(action.type === 'ADD'){
    console.log("Add Wishlist provider");
    const existingWishItemIndex = state.wishlist.findIndex(
      (item) => item.id === action.item.id
    );

    const existingWishItem = state.wishlist[existingWishItemIndex];
    let updatedItems;

    if (existingWishItem) {
        updatedItems = [...state.wishlist];
    }
    else{
        updatedItems = state.wishlist.concat(action.item);
    } 

    sessionStorage.setItem('wishlist', JSON.stringify(updatedItems));
    return {
      wishlist: updatedItems,
    };
  }

  if(action.type === 'REMOVE'){  
    const existingWishItemIndex = state.wishlist.findIndex(
      (item) => item.id === action.id
    );

    const existingItem = state.wishlist[existingWishItemIndex];
    let updatedItems;
  
    if (existingItem) {
      updatedItems = state.wishlist.filter(item => item.id !== action.id);
    } else {
      updatedItems = [...state.wishlist];
    }

    sessionStorage.setItem('wishlist', JSON.stringify(updatedItems));
    return {
      wishlist: updatedItems,
    };
  }

  if(action.type === 'CLEAR'){ 
    sessionStorage.setItem('wishlist', []);
  }
    
  return defaultWishlistState;
};


const WishlistProvider = (props) => {
  const [wishlistState, dispatchWishlistAction] = useReducer(
    wishlistReducer,
    defaultWishlistState
  );

  const addItemToWishlistHandler = (item) => {
    dispatchWishlistAction({ type: 'ADD', item: item });
  };

  const removeItemFromWishlistHandler = (id) => {
    dispatchWishlistAction({ type: 'REMOVE', id: id });
  };

  const clearWishlistHandler = () => {
    dispatchWishlistAction({ type: 'CLEAR'});
  };

  const wishlistContext = {
    wishlist: wishlistState.wishlist,
    addWishItem: addItemToWishlistHandler,
    removeWishItem: removeItemFromWishlistHandler,
    clearWishlist: clearWishlistHandler
  };

  return (
    <WishlistContext.Provider value={wishlistContext}>
      {props.children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;
