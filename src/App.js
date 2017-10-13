import React, { Component } from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import logo from './logo.svg';
import './App.css';

const products = [
  {"id": 1, "title": "iPad 4 Mini", "price": 500.01, "inventory": 2},
  {"id": 2, "title": "H&M T-Shirt White", "price": 10.99, "inventory": 10},
  {"id": 3, "title": "Charli XCX - Sucker CD", "price": 19.99, "inventory": 5}
];

const findProductById = (products, id) => (
  products.find(product => product.id === id)
);

function productsReducer(state=products, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const id = action.id;

      state.map((product) => {
        if (product.id === id) {
          return Object.assign({}, product, {
            inventory: product.inventory - 1
          });
        } else {
          return product;
        }      });
    }

    case 'ADD_PRODUCT': {
      const nextId = () => {
        return Math.max(...state.map((product) => product.id)) + 1;
      }
      const product = Object.assign({}, action.product, {id: nextId()});

      return [...state, product]
    }

    case 'UPDATE_PRODUCT': {
      return state.map((product) => {
        if (product.id === action.product.id) {
// for form add the id when we're editing TODO TODO TODO BAGUETTE TODO TODO TODO
          return Object.assign({}, action.product);
        } else {
          return product;
        }
      });
    }

    case 'REMOVE_PRODUCT': {
      return state.filter((product) => (
        product.id !== action.id
      ));
    }

    default: {
      return state;
    }
  }
}

function productsInCartReducer(state=[], action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const id = action.id;
      const isProductInCart = (id) => (
        state.some(product => product.id === id)
      );
      let freshCart;

      if (!isProductInCart(id)) {
        const productToAdd = Object.assign(
          {}, findProductById(state, id), {inventory: 0}
        );
        freshCart = state.concat(productToAdd);
      }

      return freshCart.map((product) => {
        if (product.id === id) {
          return Object.assign({}, product, {
            inventory: product.inventory + 1
          });
        } else {
          return product;
        }
      });
    }

    case 'CHECKOUT': {
      return [];
    }

    case 'REMOVE_PRODUCT': {
      return state.filter((product) => (
        product.id !== action.id
      ));
    }

    default: {
      return state;
    }
  }
}

function productBeingEditedIdReducer(state=0, action) {
  switch (action.type) {
    case 'EDIT_PRODUCT':
      return action.id;
    default: {
      return state;
    }
  }
}

function addToCart(id) {
  return {
    type: 'ADD_TO_CART',
    id,
  };
}

function addProduct(product) {
  return {
    type: 'ADD_PRODUCT',
    product,
  };
}

function editProduct(id) {
  return {
    type: 'EDIT_PRODUCT',
    id,
  };
}

function updateProduct(product) {
  return {
    type: 'UPDATE_PRODUCT',
    product,
  };
}

function removeProduct(id) {
  return {
    type: 'REMOVE_PRODUCT',
    id,
  };
}

function checkout() {
  return {
    type: 'CHECKOUT'
  };
}

const reducer = combineReducers({
  products: productsReducer,
  productsInCart: productsInCartReducer,
  productBeingEditedId: productBeingEditedIdReducer,
});

const store = createStore(reducer);

const App = () => (
  <div>
    <ProductsContainer />
    {/*}<Cart />{*/}
  </div>
);

const mapStateToProductsProps = (state) => {
  return {
    products: state.products,
    productBeingEditedId: state.productBeingEditedId,
  }
}

const mapDispatchToProductsProps = (dispatch) => (
  {
    addToCart: (id) => (
      dispatch(addToCart(id))
    ),
    addProduct: (product) => (
      dispatch(addProduct(product))
    ),
    editProduct: (id) => (
      dispatch(editProduct(id))
    ),
    updateProduct: (product) => (
      dispatch(updateProduct(product))
    ),
    removeProduct: (id) => (
      dispatch(removeProduct(id))
    ),
  }
);

const Products = (props) => {
  const productForm = props.productBeingEditedId ?
    <ProductForm 
      product={findProductById(props.products, props.productBeingEditedId)}
      onFormSubmit={props.updateProduct}
    />
  :
    <ProductForm
      product={{}}
      onFormSubmit={props.addProduct}
    />
  ;
  // seems against some sorta style guide out there
    
  return (
    <div>
      <ProductList
        products={props.products}
        addToCart={props.addToCart}
        editProduct={props.editProduct}
        removeProduct={props.removeProduct}
      />
      {productForm}
    </div>
  );
};

const ProductList = (props) => {
  const products = props.products.map((product) => (
    <Product
      key={product.id}
      title={product.title}
      price={product.price}
      inventory={product.inventory}
      addToCart={() => props.addToCart(product.id)}
      editProduct={() => props.editProduct(product.id)}
      removeProduct={() => props.removeProduct(product.id)}
    />
  ));

  return (
    <div>
      <h2>Products</h2>
      {products}
    </div>
  );
};

const Product = (props) => (
  <div>
    <ProductDetail
      title={props.title}
      price={props.price}
      inventory={props.inventory}
    />
    <AddToCartButton
      inventory={props.inventory}
      addToCart={props.addToCart}
    />
    <EditProductButton
      editProduct={props.editProduct}
    />
    <RemoveProductButton
      removeProduct={props.removeProduct}
    />
    <hr/>
  </div>
);

const ProductDetail = (props) => (
  <div>
    <span>{props.title}</span>
    <span> - </span>
    <span>{props.price}</span>
    <span> x </span>
    <span>{props.inventory}</span>
  </div>
);

const AddToCartButton = (props) => {
  if (props.inventory > 0) {
    return (
      <div>
        <button onClick={props.addToCart}>Add to Cart</button>
      </div>
    );
  } else {
    return (
      <div>
        <button disabled={true}>Sold Out</button>
      </div>
    );
  }
};

const EditProductButton = (props) => (
  <div>
    <button onClick={props.editProduct}>Edit Product</button>
  </div>
);

const RemoveProductButton = (props) => (
  <div>
    <button onClick={props.removeProduct}>Remove Product</button>
  </div>
);

class ProductForm extends React.Component {
  state = {
    title: this.props.title || '',
    inventory: this.props.inventory || '',
    price: this.props.price || '',
  }

  onTitleChange = (evt) => {
    this.setState({ title: evt.target.value });
  }

  onInventoryChange = (evt) => {
    this.setState({ inventory: evt.target.value });
  }

  onPriceChange = (evt) => {
    this.setState({ price: evt.target.value });
  }

  onFormSubmit = (evt) => {
    evt.preventDefault();
    this.props.onFormSubmit({
      title: this.state.title,
      inventory: this.state.inventory,
      price: this.state.price,
    });

    this.setState({
      title: '',
      inventory: '',
      price: '',
    });
  }

  render() {
    const submitText = this.props.product.id ? 'Update' : 'Create';
    return (
      <div>
        <form onSubmit={this.onFormSubmit}>
          <input
            placeholder='Title'
            value={this.state.title}
            onChange={this.onTitleChange}
          />
          <input
            placeholder='Inventory'
            value={this.state.inventory}
            onChange={this.onInventoryChange}
          />
          <input
            placeholder='Price'
            value={this.state.price}
            onChange={this.onPriceChange}
          />
          <input
            type='submit'
            value={submitText}
          />
        </form>
      </div>
    );
  }
}

class Cart extends React.Component {
  getTotal = () => (
    this.props.productsInCart.reduce((acc, product) => (
      acc += product.inventory * product.price
    ), 0).toFixed(2)
  );

  render() {
    const total = this.getTotal();
    return (
      <div>
        <h2>Cart</h2>
        <CartList productsInCart={this.props.productsInCart} />
        <CartTotal total={total}/>
        <CartCheckout handleCheckout={this.props.handleCheckout} />
      </div>
    );
  }
}

class CartList extends React.Component {
  render() {
    const cartItems = this.props.productsInCart.map((product) => (
      <CartItem
        id={product.id}
        key={product.id}
        title={product.title}
        price={product.price}
        inventory={product.inventory}
      />
    ));

    return (
      <div>
        {cartItems}
      </div>
    );
  }
}

class CartItem extends React.Component {
  render() {
    return (
      <div>
        <span>{this.props.title}</span>
        <span> - </span>
        <span>{this.props.price}</span>
        <span> x </span>
        <span>{this.props.inventory}</span>
      </div>
    );
  }
}

class CartTotal extends React.Component {
  render() {
    return (
      <div>
        <span>Total: {this.props.total}</span>
      </div>
    );
  }
}

class CartCheckout extends React.Component {
  render() {
    return (
      <button onClick={this.props.handleCheckout}>Checkout</button>
    );
  }
}

// ReactDOM.render(<Store />, document.getElementById('content'));

const ProductsContainer = connect(
  mapStateToProductsProps,
  mapDispatchToProductsProps
)(Products);

const WrappedApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default WrappedApp;
