import { auth, provider, storage } from "../firebase";
import {
  ACTIVATE_USER,
  SET_USER,
  SET_USER_TOKEN,
  SET_USER_ORDER,
  SET_LOADING_STATUS,
  SET_DISCOUNTS,
  SET_DISCOUNT_PACKAGES,
  SET_DISCOUNT_REVIEWS,
  SET_ORGANIZER,
  SET_ORGANIZER_DISCOUNTS,
  SET_ORGANIZER_NOTIFICATIONS,
  SET_DISCOUNT_MEDIA,
  SET_CATEGORIES,
  SET_CREATE_DISCOUNT_STATUS,
  SET_UPDATE_DISCOUNT_STATUS,
  SET_LOADING_MESSAGE,
  SET_ERRORS,
  SET_PAYMENT,
  SET_PREVIOUS_URL,
  SET_USER_NOTIFICATIONS,
  SET_CART_ITEMS,
  SET_ANALYTICS,
  SET_WISH_LIST
} from "./actionType";
import db from "../firebase";
import { BASE_URL } from "../utils/constants";
import * as messages from "../utils/messages";
import { userData, discountsData, discountReviewsData, categoriesData, discountMediaData } from "../components/Assets/data";


export const setUserActivationStatus = (payload) => ({
  type: ACTIVATE_USER,
  activate: payload,
});

export const setUser = (payload) => ({
  type: SET_USER,
  user: payload,
});

export const setUserToken = (payload) => ({
  type: SET_USER_TOKEN,
  token: payload,
});

export const setUserOrder = (payload) => ({
  type: SET_USER_ORDER,
  order: payload,
});

export const setUserNotifications = (payload) => ({
  type: SET_USER_NOTIFICATIONS,
  notifications: payload,
});

export const setPayment = (payload) => ({
  type: SET_PAYMENT,
  payment: payload,
});

export const setCategories = (payload) => ({
  type: SET_CATEGORIES,
  categories: payload,
});

export const setCreateDiscountStatus = (payload) => ({
  type: SET_CREATE_DISCOUNT_STATUS,
  createDiscountStatus: payload,
});

export const setUpdateDiscountStatus = (payload) => ({
  type: SET_UPDATE_DISCOUNT_STATUS,
  updateDiscountStatus: payload,
});

export const setLoading = (status) => ({
  type: SET_LOADING_STATUS,
  status: status,
});

export const setLoadingMessage = (message) => ({
  type: SET_LOADING_MESSAGE,
  loading_message: message,
});

export const setDiscounts = (payload) => ({
  type: SET_DISCOUNTS,
  discounts: payload,
});

export const setDiscountPackages = (payload) => ({
  type: SET_DISCOUNT_PACKAGES,
  discount_packages: payload,
});

export const setDiscountReviews = (payload) => ({
  type: SET_DISCOUNT_REVIEWS,
  reviews: payload,
});

export const setDiscountMedia = (payload) => ({
  type: SET_DISCOUNT_MEDIA,
  discount_media: payload,
});

export const setOrganizer = (payload) => ({
  type: SET_ORGANIZER,
  organizer: payload,
});

export const setOrganizerDiscounts = (payload) => ({
  type: SET_ORGANIZER_DISCOUNTS,
  discounts: payload,
});

export const setOrganizerNotifications = (payload) => ({
  type: SET_ORGANIZER_NOTIFICATIONS,
  notifications: payload,
});

export const setErrors = (errors) => ({
  type: SET_ERRORS,
  errors: errors,
});

export const setPreviousUrl = (url) => ({
  type: SET_PREVIOUS_URL,
  previous_url: url,
});

export const setCartItems = (payload) => ({
  type: SET_CART_ITEMS,
  cartItems: payload,
});

export const setWishlist = (payload) => ({
  type: SET_WISH_LIST,
  wishlist: payload,
});

export const setAnalytics = (payload) => ({
  type: SET_ANALYTICS,
  analytics: payload,
});

// -----------------------------
// ------ FIREBASE AUTH --------

export function googleAuth() {
  return (dispatch) => {
    auth
      .signInWithPopup(provider)
      .then((payload) => {
        dispatch(setUser(payload.user));
        console.clear();
        console.log(payload.user);
      })
      .catch((error) => {
        alert(error.message);
      });
  };
}

export function getUserAuth() {
  return (dispatch) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        dispatch(setUser(user));
      }
    });
  };
}


// ---------------------
// ------ SIGNUP --------

export function signUpAPI(data) {
  return (dispatch) => {
    dispatch(setLoading(true));
    const url = `${BASE_URL}/users/signup/`;

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json", //vnd.api+
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          dispatch(setUserActivationStatus(true));
          dispatch(setLoadingMessage(messages.SIGNUP_SUCCESS_MESSAGE));
        } else if (data.failed) {
          console.log(data.errors);
          dispatch(setErrors(data.errors));
          dispatch(setLoading(false));
        }
      })
      .catch((errorMessage) => {
        console.log(errorMessage);
        dispatch(setLoadingMessage(messages.SIGNUP_FAILED_MESSAGE));
      });
  };
}


// ------------------------------
// ------ GET USER TOKEN --------

export const getUserTokenAPI = (payload) => (dispatch) => {
  const url = `${BASE_URL}/users/token/`;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.status);
      else return response.json();
    })
    .then((data) => {
      console.log("token data ", data);
      dispatch(setUserToken(data));
      let wishlist = sessionStorage.getItem('wishlist') ? JSON.parse(sessionStorage.getItem('wishlist')) : [];
      if (wishlist && wishlist.length > 0){
        let wishlist_ids = wishlist.filter(discount => discount.id);
        dispatch(addToWishlistAPI({discount_ids: wishlist_ids}))
      }
      dispatch(getOrganizerAPI());
    })
    .catch((error) => {
      alert(error.message);
    });
};


// ---------------------
// ------ LOGIN --------

export function loginAPI(payload) {
  return (dispatch) => {
    dispatch(setLoading(true));
    dispatch(setErrors(null));

    const url = `${BASE_URL}/users/login/`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("login data ", data);        
        if (data.success) {
          dispatch(setUser(data.user_data));
          console.log("user login email ", data.user_data.email);
          dispatch(
            getUserTokenAPI({
              email: data.user_data.email,
              password: payload.password,
            })
            );
            // dispatch(setUserToken(data.data.token));
        } else if (data.failed) {
          console.log(data.errors);
          dispatch(setErrors({ login: data.errors }));
          dispatch(setLoading(false));
        }
      })
      .catch((errorMessage) => {
        // --------TO BE REMOVED---------
        // dispatch(setUser(userData));
        // console.log("user_data ...");
        // ------------------------------
        console.log(errorMessage);
      });
  };
}


// ------------------------------
// ------ SEND MAIL --------

export function sendMail(payload) {
  return (dispatch) => {
    const url = `${BASE_URL}/mail/`;

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then((data) => {
        console.log("Mail Response ", data);
      })
      .catch((errorMessage) => {
        console.log(errorMessage);
      });
  };
}


// -------------------------
// ---- Update User --------

export function userUpdateAPI(payload) {
  return (dispatch, getState) => {
    dispatch(setLoading(true));
    dispatch(setErrors(null));

    const state = getState();
    const authToken = state.userState.token.access;

    const url = `${BASE_URL}/profile/update/`;

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: payload,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          let user = state.userState.user;
          let organizer_detail = user['organizer_detail'];
          let user_data = data.user_data;
          user_data['organizer_detail'] = organizer_detail;
          dispatch(setUser(user_data));
          dispatch(setLoading(false));
        } else if (data.failed) {
          console.log(data.errors);
          dispatch(setErrors({ login: data.errors }));
          dispatch(setLoading(false));
        }
      })
      .catch((errorMessage) => {
        console.log(errorMessage);
      });
  };
}


// ---------------------
// ------ SIGN OUT --------

export function logOutAPI() {
  return (dispatch) => {
    dispatch(setUser(null));
    dispatch(setOrganizer(null));
    dispatch(setWishlist(null));
  };
}

export function signOutAPI() {
  return (dispatch) => {
    auth
      .signOut()
      .then((payload) => {
        dispatch(setUser(null));
      })
      .catch((error) => {
        alert(error.message);
      });
  };
}


// ----------------------------
// ------ CREATE DISCOUNT --------

export function createDiscountAPI(formData) {
  return (dispatch, getState) => {
    dispatch(setLoading(true));
    dispatch(setErrors(null));
    const url = `${BASE_URL}/discounts/`;
    const state = getState();
    const authToken = state.userState.token.access;

    // const formData = new FormData();
    // formData.append("payload", JSON.stringify(payload));
    // formData.append("flyer", files.flyer);
    // formData.append("images_length", files.images.length);
    // for (var i = 0; i < files.images.length; i++) {
    //   formData.append(`image-${i}`, files.images[i].file);
    // };

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          dispatch(setCreateDiscountStatus(true));
          dispatch(setLoadingMessage(messages.CREATE_DISCOUNT_SUCCESS_MESSAGE));
          console.log("DISCOUNT Success mail message ", data.message);
          console.log("FormData ", formData);
          console.log("FormData ", formData.get('payload'));
          console.log("FormData Email ", JSON.parse(formData.get('payload'))['organizer_data']['email']);
          
          dispatch(
            sendMail({            
              "toEmail": "mytestmaillab@gmail.com",
              "fromEmail": JSON.parse(formData.get('payload'))['organizer_data']['email'],
              "username": JSON.parse(formData.get('payload'))['organizer_data']['name'],
              "subject": "Discount Registration", 
              "message": data.message                
            })
            );
        } else if (data.failed) {
          console.log(data.errors);
          dispatch(setCreateDiscountStatus(false));
          let msg = (
            <>
              <img src="/images/icons/error.svg" />
              <p style={{ color: "red" }}>
                Failed to create discount. {data.errors.name ? data.errors.name : data.errors}{" "}
              </p>
            </>
          );
          dispatch(setLoadingMessage(msg));
        }
      })
      .catch((errorMessage) => {
        console.log(errorMessage);
      });
  };
};


// ----------------------------
// ------ UPDATE DISCOUNT --------

export function updateDiscountAPI({formData, discount_id}) {
  return (dispatch, getState) => {
    dispatch(setLoading(true));
    dispatch(setErrors(null));
    const url = `${BASE_URL}/discounts/${discount_id}/`;
    const state = getState();
    const authToken = state.userState.token.access;

    fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          dispatch(setUpdateDiscountStatus(true));
          dispatch(setLoadingMessage(messages.DISCOUNT_UPDATE_SUCCESS_MESSAGE));
          let organizer_id = state.organizerState.organizer.id;
          dispatch(getOrganizerDiscountsAPI(organizer_id));
        } else if (data.failed) {
          console.log(data.errors);
          dispatch(setUpdateDiscountStatus(false));
          let msg = (
            <>
              <img src="/images/icons/error.svg" />
              <p style={{ color: "red" }}>
                Failed to update discount. {data.errors.name}{" "}
              </p>
            </>
          );
          dispatch(setLoadingMessage(msg));
        }
      })
      .catch((errorMessage) => {
        console.log(errorMessage);
      });
  };
};


// ----------------------------
// ------ DELETE DISCOUNT --------

export function deleteDiscountAPI(discount_id) {
  return (dispatch, getState) => {
    dispatch(setLoading(true));
    dispatch(setErrors(null));
    const url = `${BASE_URL}/discounts/${discount_id}/`;
    const state = getState();
    const authToken = state.userState.token.access;

    fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          dispatch(getDiscountsAPI());
          let organizer_id = state.organizerState.organizer.id;
          dispatch(getOrganizerDiscountsAPI(organizer_id));
        } else if (data.failed) {
          console.log(data.errors);
          dispatch(setLoading(false));
        }
      })
      .catch((errorMessage) => {
        console.log(errorMessage);
        dispatch(setLoading(false));
      });
  };
};


// ------------------------------
// ------ GET CATEGORIES --------

export function getCategoriesAPI() {
  return (dispatch) => {
    const url = `${BASE_URL}/discounts/categories/`;

    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then((categories) => {
        dispatch(setCategories(categories));
        console.log("Categories ", categories);
      })
      .catch((errorMessage) => {
        // --------TO BE REMOVED---------
        // dispatch(setCategories(categoriesData));
        // console.log("Categories ...");
        // --------------------------------
        console.log(errorMessage);
      });
  };
}


// ------------------------------
// ------ GET ALL DISCOUNTS --------

export function getDiscountsAPI() {
  return (dispatch) => {
    dispatch(setLoading(true));
    const url = `${BASE_URL}/discounts/`;

    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then((discounts) => {
        dispatch(setDiscounts(discounts));
        console.log("Discounts ", discounts);
        dispatch(setLoading(false));
      })
      .catch((errorMessage) => {
        console.log(errorMessage);
        // --------TO BE REMOVED---------
        // dispatch(setDiscounts(discountsData));
        // console.log("Discounts ...");
        // ------------------------------
        dispatch(setLoading(false));
      });
  };
}


// ------------------------------------
// ------ GET ORGANIZER DISCOUNTS --------

export function getOrganizerDiscountsAPI(organizer_id) {
  return (dispatch) => {
    dispatch(setLoading(true));
    const url = `${BASE_URL}/discounts/organizer-discounts/${organizer_id}`;

    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then((discounts) => {
        dispatch(setOrganizerDiscounts(discounts));
        console.log("Organizer Discounts ", discounts);
        dispatch(setLoading(false));
      })
      .catch((errorMessage) => {
        console.log(errorMessage);
        dispatch(setLoading(false));
      });
  };
}


// ------------------------------
// ------ GET DISCOUNT REVIEWS --------

export function getDiscountReviewsAPI(discount_id) {
  return (dispatch) => {
    dispatch(setLoading(true));
    const url = `${BASE_URL}/discounts/reviews/discount/${discount_id}/`;

    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then((reviews) => {
        dispatch(setDiscountReviews(reviews));
        console.log("Discount Reviews ", reviews);
        dispatch(setLoading(false));
      })
      .catch((errorMessage) => {
        console.log(errorMessage);
        // --------TO BE REMOVED---------
        // dispatch(setDiscountReviews(discountReviewsData));
        // console.log("Discounts Reviews ...");
        // ------------------------------
        dispatch(setLoading(false));
      });
  };
}


// ------------------------------
// ------ LIKE REVIEW --------

export function likeAndDislikeReviewAPI(data) {
  return (dispatch, getState) => {
    const url = `${BASE_URL}/discounts/reviews/update/${data.id}/`;
    const state = getState();
    const authToken = state.userState.token.access;

    fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then((review) => {
        console.log("Updated Review 1", review);
        // Get local reviews and update with new review data
        let reviews = state.discountState.reviews;
        console.log("Discount Reviews ", reviews);
        const updatedReviews = reviews.results.map(obj => obj.id === review.id? {...obj, ...review} : obj);
        console.log("Updated Reviews 2", updatedReviews);
        setDiscountReviews({...reviews, results: updatedReviews});
      })
      .catch((errorMessage) => {
        console.log(errorMessage);
      });
  };
}


// ---------------------
// ------ ORDER --------

export function orderAPI(data) {
  return (dispatch, getState) => {
    dispatch(setLoading(true));
    const url = `${BASE_URL}/order/`;

    const state = getState();
    const authToken = state.userState.token.access;

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json", 
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        else if (response.status === 404) {
          // If the response status is 404 (Not Found)
          throw new Error('Data not found');
        } else {
          // For any other non-success status code
          throw new Error('An error occurred');
        }
      })
      .then((data) => {
        if (data.failed) {
          console.log(data.errors);
          throw new Error('An error occurred');
        }
        else {
          console.log(data);
          dispatch(setUserOrder(data));
          dispatch(setLoading(false));
        }  
      })
      .catch((error) => {
        console.error(error.message);
        dispatch(setLoadingMessage(error.message));
      });
  };
}

// --------------------------------------
// -------------- Checkout --------------

export function checkoutAPI(data) {
  return (dispatch, getState) => {
    dispatch(setLoading(true));
    const url = `${BASE_URL}/order/checkout/`;

    const state = getState();
    const authToken = state.userState.token.access;
    const payment_address = {
      username: data.username,
      email: data.email,
      contact: data.contact
    };

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json", 
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => { 
        if (response.ok) {
          return response.json();
        }
        else if (response.status === 404) {
          // If the response status is 404 (Not Found)
          throw new Error('Data not found');
        } else {
          // For any other non-success status code
          throw new Error('An error occurred');
        }
      })
      .then((data) => {
        if (data.failed) {
          console.log(data.errors);
          dispatch(setErrors(data.errors));
          dispatch(setLoading(false));
        }
        else {
          console.log(data);
          console.log("payment_address", payment_address);
          let new_payment = {...payment_address,...data};
          console.log("new_payment", new_payment);
          dispatch(setPayment(new_payment));
          dispatch(setLoading(false));
        }  
      })
      .catch((error) => {
        console.log(error.message);
        dispatch(setLoadingMessage(error.message));
      });
  };
}


// ----------------------------
//---- Verify payment API -----

export function verifyPaymentAPI(payload) {
  return (dispatch, getState) => {
    const url = `${BASE_URL}/payment/verify/`;

    const state = getState();
    const authToken = state.userState.token.access;

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json", 
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(payload),
    })
  .then((response) => { 
    if (response.ok) {
      return response.json();
    }
    else if (response.status === 404) {
      // If the response status is 404 (Not Found)
      throw new Error('Data not found');
    } else {
      // For any other non-success status code
      throw new Error('An error occurred');
    }
  })
  .then((data) => {
    console.log(data);
    dispatch(setPayment(data));
  })
  .catch((error) => {
    console.log(error.message);
    dispatch(setUserOrder(null));
    dispatch(setPayment(null));
    // dispatch(setLoadingMessage(error.message));
  });
};
}


// ------------------------------
// ------ GET CART ITEMS --------

export function getCartItemsAPI() {
  return (dispatch) => {
    const url = `${BASE_URL}/order/cart/`;

    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then((cartItems) => {
        dispatch(setCartItems(cartItems));
        console.log("Categories ", cartItems);
      })
      .catch((errorMessage) => {
        console.log(errorMessage);
      });
  };
}


// --------------------------------------
// ------ GET USER NOTIFICATIONS --------

export function getUserNotificationsAPI() {
  return (dispatch) => {
    const url = `${BASE_URL}/messages/`;

    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then((notifications) => {
        dispatch(setUserNotifications(notifications));
        console.log("Notifications ", notifications);
      })
      .catch((errorMessage) => {
        console.log(errorMessage);
      });
  };
}


// -------------------------------
//---- GET WISH LISTS API --------

export function getWishlistAPI() {
  return (dispatch, getState) => {
    const url = `${BASE_URL}/discounts/get-wishlist/`;

    const state = getState();
    const authToken = state.userState.token.access;

    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json", 
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
  .then((response) => { 
    if (response.ok) {
      return response.json();
    }
    else if (response.status === 404) {
      // If the response status is 404 (Not Found)
      throw new Error('An error occurred');
    } else {
      // For any other non-success status code
      throw new Error('An error occurred');
    }
  })
  .then((wishlist) => {
    console.log("Wishlist ", wishlist);
    dispatch(setWishlist(wishlist));
  })
  .catch((error) => {
    console.log(error.message);
  });
};
}


// ------------------------------
//---- ADD TO WISH LIST API -----

export function addToWishlistAPI(payload) {
  return (dispatch, getState) => {
    const url = `${BASE_URL}/discounts/add-to-wishlist/`;

    const state = getState();
    const authToken = state.userState.token.access;

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json", 
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(payload),
    })
  .then((response) => { 
    if (response.ok) {
      return response.json();
    }
    else if (response.status === 404) {
      // If the response status is 404 (Not Found)
      throw new Error('An error occurred');
    } else {
      // For any other non-success status code
      throw new Error('An error occurred');
    }
  })
  .then((data) => {
    console.log(data);
    dispatch(setWishlist(data));
  })
  .catch((error) => {
    console.log(error.message);
  });
};
}


// -----------------------------------
//---- REMOVE FROM WISH LIST API -----

export function removeFromWishlistAPI(payload) {
  return (dispatch, getState) => {
    const url = `${BASE_URL}/discounts/remove-from-wishlist/`;

    const state = getState();
    const authToken = state.userState.token.access;

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json", 
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(payload),
    })
  .then((response) => { 
    if (response.ok) {
      return response.json();
    }
    else if (response.status === 404) {
      // If the response status is 404 (Not Found)
      throw new Error('An error occurred');
    } else {
      // For any other non-success status code
      throw new Error('An error occurred');
    }
  })
  .then((data) => {
    console.log(data);
    dispatch(setWishlist(data));
  })
  .catch((error) => {
    console.log(error.message);
  });
};
}


// ------------------------------
// ------ GET DISCOUNT PACKAGES -------

export function getDiscountPackagesAPI() {
  return (dispatch) => {
    dispatch(setLoading(true));
    const url = `${BASE_URL}/discounts/packages/`;

    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then((discount_packages) => {
        dispatch(setDiscountPackages(discount_packages));
        console.log("Discount Packages ", discount_packages);
        dispatch(setLoading(false));
      })
      .catch((errorMessage) => {
        console.log(errorMessage);
        dispatch(setLoading(false));
      });
  };
}


// ------------------------------
// ------ GET DISCOUNT MEDIA -------

export function getDiscountMediaAPI(discount_id) {
  return (dispatch) => {
    const url = `${BASE_URL}/discounts/media/files/${discount_id}/`;

    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then((discount_media) => {
        dispatch(setDiscountMedia(discount_media));
        console.log("Discount Media ", discount_media);
      })
      .catch((errorMessage) => {
        console.log(errorMessage);
        // --------TO BE REMOVED---------
        // dispatch(setDiscountMedia(discountMediaData.results));
        // console.log("Discounts Media ...");
        // ------------------------------
      });
  };
};


// ---------------------------------
// ------ DELETE DISCOUNT MEDIA--------

export function deleteDiscountMediaAPI(media_id) {
  return (dispatch, getState) => {
    const url = `${BASE_URL}/discounts/media/${media_id}/`;
    const state = getState();
    const authToken = state.userState.token.access;

    fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
  };
};


// ---------------------------------
// ------ DELETE DISCOUNT PACKAGE--------

export function deleteDiscountPackageAPI(package_id) {
  return (dispatch, getState) => {
    const url = `${BASE_URL}/packages/${package_id}/`;
    const state = getState();
    const authToken = state.userState.token.access;

    fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    })
      .then((response) => response.json())
      .then((data) => {
          console.log(data);
      })
      .catch((errorMessage) => {
        console.log(errorMessage);
      });
  };
};

// -------------------------------------------------------
// ------ GET USER ORGANIZER DATA (If user is organizer) -------

export function getOrganizerAPI(organizer_id=null) {
  return (dispatch, getState) => {
    let url;

    if (organizer_id){
      // Get organizer given organizer ID
      url = `${BASE_URL}/discounts/organizers/${organizer_id}/`;
    }
    else{
      // Get organizer given user
      url = `${BASE_URL}/discounts/user/organizer/`;
    }
    
    const state = getState();
    const authToken = state.userState.token.access;

    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json", 
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      }
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
        // return response.json();
      })
      .then((data) => {
        // let user = state.userState.user;
        if (data.failed){
          console.log("Get organizer failed!");
        }
        else{
          console.log("New organizer ", data);
          dispatch(setOrganizer(data));
        }
      })
      .catch((errorMessage) => {
        console.log(errorMessage);
      });
  };
}


// -------------------------
// ---- Update Organizer --------

export function updateOrganizerAPI(payload) {
  return (dispatch, getState) => {
    dispatch(setLoading(true));
    dispatch(setErrors(null));

    const state = getState();
    const authToken = state.userState.token.access;

    const url = `${BASE_URL}/profile/update/`;

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: payload,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          let user = state.userState.user;
          let organizer_detail = user['organizer_detail'];
          let user_data = data.user_data;
          user_data['organizer_detail'] = organizer_detail;
          dispatch(setUser(user_data));
          dispatch(setLoading(false));
        } else if (data.failed) {
          console.log(data.errors);
          dispatch(setErrors({ login: data.errors }));
          dispatch(setLoading(false));
        }
      })
      .catch((errorMessage) => {
        console.log(errorMessage);
      });
  };
}


// ------------------------------
// ------ GET ANALYTICS ---------

export function getAnalyticsAPI(organizer_id) {
  return (dispatch, getState) => {
    dispatch(setLoading(true));
    dispatch(setErrors(null));

    const state = getState();
    const authToken = state.userState.token.access;

    const url = `${BASE_URL}/discounts/analytics/${organizer_id}/`;

    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then((data) => {
        dispatch(setAnalytics(data));
        console.log("Analytics ", data);
        dispatch(setLoading(false));
      })
      .catch((errorMessage) => {
        console.log(errorMessage);
        dispatch(setLoading(false));
      });
  };
}


// ------------------------------
// ------ FORGET PASSWORD -------

export function forgetPasswordAPI(payload) {
  return (dispatch) => {
    dispatch(setLoading(true));
    dispatch(setErrors(null));

    const url = `${BASE_URL}/users/forgetpassword/`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("login data ", data);        
        if (data.success) {
          dispatch(setUser(data.user_data));
          console.log("user login email ", data.user_data.email);
        } else if (data.failed) {
          console.log(data.errors);
          dispatch(setErrors({ forget_password: data.errors }));
          dispatch(setLoading(false));
        }
      })
      .catch((errorMessage) => {
        // --------TO BE REMOVED---------
        // dispatch(setUser(userData));
        // console.log("Forget password failed ...");
        // ------------------------------
        console.log(errorMessage);
      });
  };
}