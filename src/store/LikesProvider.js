import { useReducer } from 'react';
import LikesContext from './likes-context';

const defaultLikesState = {
  localLikes: sessionStorage.getItem('localLikes') ? JSON.parse(sessionStorage.getItem('localLikes')) : [],
};

const likesReducer = (state = defaultLikesState, action) => {
  if (action.type === 'ADD') {
    const existingLikeIndex = state.localLikes.findIndex(
      (id) => id === action.id
    );

    let updatedLikes;
    if (existingLikeIndex >= 0) {
      updatedLikes = [...state.localLikes];
    } else {
      updatedLikes = state.localLikes.concat(action.id);
      sessionStorage.setItem('localLikes', JSON.stringify(updatedLikes));
    }

    return {
      localLikes: updatedLikes,
    };
  }

  if (action.type === 'REMOVE') {
    const updatedLikes = state.localLikes.filter(id => id !== action.id);
    sessionStorage.setItem('localLikes', JSON.stringify(updatedLikes));
    return {
      localLikes: updatedLikes,
    };
  }

  return defaultLikesState;
};

const LikesProvider = (props) => {
  const [likesState, dispatchLikesAction] = useReducer(
    likesReducer,
    defaultLikesState
  );

  const addLocalLikeHandler = (id) => {
    dispatchLikesAction({ type: 'ADD', id: id });
  };

  const removeLocalLikeHandler = (id) => {
    dispatchLikesAction({ type: 'REMOVE', id: id });
  };

  const likesContext = {
    localLikes: likesState.localLikes,
    addLocalLike: addLocalLikeHandler,
    removeLocalLike: removeLocalLikeHandler,
  };

  return (
    <LikesContext.Provider value={likesContext}>
      {props.children}
    </LikesContext.Provider>
  );
};

export default LikesProvider;

