import React, { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  cart: {
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {},
    paymentMethod: localStorage.getItem('paymentMethod') || '',
  },
};

function reducer(state, action){
  switch(action.type){
    case 'USER_LOGIN':
      return {...state, userInfo: action.payload};
    case 'USER_LOGOUT':
      return {
        ...state,
        userInfo: null,
        cart: { cartItems: [], shippingAddress: {}, paymentMethod: '' },
      };
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(x => x._id === newItem._id);
      let cartItems;
      if(existItem){
        cartItems = state.cart.cartItems.map(x=>x._id === existItem._id ? newItem : x);
      } else {
        cartItems = [...state.cart.cartItems, newItem];
      }
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return {...state, cart: {...state.cart, cartItems }};
    }
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(x => x._id !== action.payload._id);
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return {...state, cart: {...state.cart, cartItems}};
    }
    case 'CART_CLEAR':
      return {...state, cart: {...state.cart, cartItems: []}};
    case 'SAVE_SHIPPING_ADDRESS':
      return {...state, cart: {...state.cart, shippingAddress: action.payload }};
    case 'SAVE_PAYMENT_METHOD':
      return {...state, cart: {...state.cart, paymentMethod: action.payload }};
    default:
      return state;
  }
}

export function StoreProvider(props){
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}