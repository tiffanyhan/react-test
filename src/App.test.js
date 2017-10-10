import React from 'react';
import ReactDOM from 'react-dom';
import Store from './App';
import { shallow } from 'enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });



describe('Store', () => {
  let wrapper;
  beforeEach(() => wrapper = shallow(<Store />));

  it('exists', () => {
    expect(Store).toBeDefined();
  });

  it('initializes with an empty cart', () => {
    const actual = wrapper.state().productsInCart;

    expect(actual.length).toBe(0);
  });

  it('finds a product by id', () => {
    const actual = wrapper.instance().findProductById(1);
    const firstProduct = {"id": 1, "title": "iPad 4 Mini", "price": 500.01, "inventory": 2};

    expect(actual).toEqual(firstProduct);
  });

  describe('adding product to cart', () => {
    beforeEach(() => wrapper.instance().handleAddToCart(1));

    it('adds a product to the cart', () => {
      const productInCart = {"id": 1, "title": "iPad 4 Mini", "price": 500.01, "inventory": 1};
      expect(wrapper.state().productsInCart).toContainEqual(productInCart);      
    });

    it('decrements the inventory of product in product list', () => {
      expect(wrapper.state().products[0].inventory).toBe(1);
    });

    it('keeps incrementing inventory of product in cart', () => {
      wrapper.instance().handleAddToCart(1); // testing more than one
      expect(wrapper.state().productsInCart[0].inventory).toBe(2);
    });

    describe('and then checks out', () => {
      it('clears the cart when you check out', () => {
        wrapper.instance().handleCheckout();

        expect(wrapper.state().productsInCart.length).toBe(0);
      });    
    });
  });

  
});

