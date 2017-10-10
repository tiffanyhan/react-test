import React from 'react';
import ReactDOM from 'react-dom';
import Store from './App';
import { shallow } from 'enzyme';

describe('Store', () => {
  it('exists', () => {
    expect(Store).toBeDefined();
  });

  it('initializes with an empty cart', () => {
    const wrapper = shallow(<Store />);
    const actual = wrapper.instance().isProductInCart(1);

    expect(actual).toBe(false);
  });
});

