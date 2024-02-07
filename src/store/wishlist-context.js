import React from 'react';

const WishlistContext = React.createContext({
  wishlist: [],
  addWishItem: (item) => {},
  removeWishItem: (id) => {},
  clearWishlist: () => {}
});

export default WishlistContext;