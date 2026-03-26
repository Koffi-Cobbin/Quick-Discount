import axios from "axios";
import { setUserDiscountLike } from "./index";
import { BASE_URL } from "../utils/constants";

export const likeDiscountAPI = (discount_id) => {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}/discounts/likes/add/`;
    axios.post(url, { discount_id }, {
      headers: {
        'Accept': "application/json",
        "Content-Type": "application/json",
        'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
      }
    })
    .then(response => {
      if (response.data) {
        resolve(response.data);
      } else {
        reject(new Error('No data returned'));
      }
    })
    .catch(error => {
      reject(error);
    });
  });
};

export const unlikeDiscountAPI = (like_id) => {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}/discounts/likes/delete/${like_id}/`;
    axios.delete(url, {
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}` 
      }
    })
    .then(response => {
      resolve(response);
    })
    .catch(error => {
      reject(error);
    });
  });
};

