import React from 'react';

const LikesContext = React.createContext({
  localLikes: [],
  addLocalLike: (id) => {},
  removeLocalLike: (id) => {},
});

export default LikesContext;

