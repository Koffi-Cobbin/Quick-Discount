import { SET_DISCOUNTS, 
    SET_CATEGORIES, 
    SET_CREATE_DISCOUNT_STATUS, 
    SET_CART_ITEMS,
    SET_WISH_LIST, 
    SET_DISCOUNT_PACKAGES,
    SET_DISCOUNT_MEDIA
 } from "../actions/actionType";

export const initState = {
    discounts: sessionStorage.getItem('discounts') ?
    JSON.parse(sessionStorage.getItem('discounts')) : [], 
    items: sessionStorage.getItem('cartItems') ?
    JSON.parse(sessionStorage.getItem('cartItems')) : [],
    totalAmount: sessionStorage.getItem('totalAmount') ?
    +JSON.parse(sessionStorage.getItem('totalAmount')) : 0,
    categories: sessionStorage.getItem('categories') ?
    JSON.parse(sessionStorage.getItem('categories')) : null,
    createEventStatus: null,
    wishlist: sessionStorage.getItem('wishlist') ?
    JSON.parse(sessionStorage.getItem('wishlist')) : [],    
    discount_packages: sessionStorage.getItem('discount_packages') ?
    JSON.parse(sessionStorage.getItem('discount_packages')) : null,
}

const discountReducer = (state = initState, action) => {
    switch (action.type) {
        case SET_DISCOUNTS:
            sessionStorage.setItem('discounts', JSON.stringify(action.discounts));
            return {
                ...state,
                discounts: action.discounts
            };

        case SET_DISCOUNT_PACKAGES:
            sessionStorage.setItem('discount_packages', JSON.stringify(action.discount_packages));
            return {
                ...state,
                discount_packages: action.discount_packages
            };

        case SET_DISCOUNT_MEDIA:
            sessionStorage.setItem('discount_media', JSON.stringify(action.discount_media));
            return {
                ...state,
                discount_media: action.discount_media
            };

        case SET_CATEGORIES:
            sessionStorage.setItem('categories', JSON.stringify(action.categories));
            return {
                ...state,
                categories: action.categories,
            };

        case SET_CREATE_DISCOUNT_STATUS:
            return {
                ...state,
                createEventStatus: action.createEventStatus,
            };
            
        case SET_CART_ITEMS:
            sessionStorage.setItem('cartItems', JSON.stringify(action.cartItems));
            // sessionStorage.setItem('totalAmount', JSON.stringify(updatedTotalAmount));
            return {
                ...state,
                items: action.cartItems,
                totalAmount: action.totalAmount
            };

        case SET_WISH_LIST:
            sessionStorage.setItem('wishlist', JSON.stringify(action.wishlist));
            return {
                ...state,
                wishlist: action.wishlist
            };

        default:
            return state;
    }
}


export default discountReducer;