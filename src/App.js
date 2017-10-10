import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const products = [
  {"id": 1, "title": "iPad 4 Mini", "price": 500.01, "inventory": 2},
  {"id": 2, "title": "H&M T-Shirt White", "price": 10.99, "inventory": 10},
  {"id": 3, "title": "Charli XCX - Sucker CD", "price": 19.99, "inventory": 5}
];

class Store extends React.Component {
  state = {
    products: products,
    productsInCart: [],
    productBeingEdited: {},
  }

  handleAddToCart = (id) => (
    this.updateInventoryQuantities(id)
  )

  handleCheckout = () => {
    this.emptyCart();
  }

  updateInventoryQuantities = (id) => {
    this.setState({
      products: this.updatedProductInventories(id),
      productsInCart: this.updatedProductInCartInventories(id),
    })
  }

  updatedProductInventories = (id) => (
    this.state.products.map((product) => {
      if (product.id === id) {
        return Object.assign({}, product, {
          inventory: product.inventory - 1
        });
      } else {
        return product;
      }
    })
  )

  updatedProductInCartInventories = (id) => {
    let freshCart = [...this.state.productsInCart]

    if (!this.isProductInCart(id)) {
      const productToAdd = Object.assign({}, this.findProductById(id), {inventory: 0});
      freshCart = freshCart.concat(productToAdd);
    }

    return freshCart.map((product) => {
      if (product.id === id) {
        return Object.assign({}, product, {
          inventory: product.inventory + 1
        });
      } else {
        return product;
      }
    })
  }

  isProductInCart = (id) => (
    this.state.productsInCart.some((product) => (product.id === id))
  )

  findProductById = (id) => (
    this.state.products.find((product) => (product.id === id))
  )

  emptyCart = () => {
    this.setState({
      productsInCart: [],
    });
  }

  editProduct = (id) => {
    const product = this.findProductById(id);
    this.setState({
      productBeingEdited: product,
    });
  }

  nextId = () => {
    return Math.max(...this.state.products.map((product) => product.id)) + 1;
  }

  onFormSubmit = (freshProduct) => {
    const current = this.state.productBeingEdited;

    if (current.id) {
      const products = this.state.products.map((product) => {
        if (product.id === current.id) {
          return Object.assign({}, freshProduct, {id: product.id});
        } else {
          return product;
        }
      });
      this.setState({ products, productBeingEdited: {} });

    } else {
      const freshProductWithId = Object.assign({}, freshProduct, {id: this.nextId()});

      this.setState({
        products: [...this.state.products, freshProductWithId],
      });
    }
  }

  render() {
    console.log(this.state);

    return (
      <div>
        <ProductList
          products={this.state.products}
          addToCart={this.handleAddToCart}
          editProduct={this.editProduct}
        />
        <ProductForm
          id={this.state.productBeingEdited.id}
          title={this.state.productBeingEdited.title}
          inventory={this.state.productBeingEdited.inventory}
          price={this.state.productBeingEdited.price}
          onFormSubmit={this.onFormSubmit}
        />
        <Cart
          productsInCart={this.state.productsInCart}
          handleCheckout={this.handleCheckout}
        />
      </div>
    );
  }
}

class ProductList extends React.Component {
  render() {
    const products = this.props.products.map((product) => (
      <Product
        id={product.id}
        key={product.id}
        title={product.title}
        price={product.price}
        inventory={product.inventory}
        addToCart={this.props.addToCart}
        editProduct={this.props.editProduct}
      />
    ));

    return (
      <div>
        <h2>Products</h2>
        {products}
      </div>
    );
  }
}

class Product extends React.Component {
  render() {
    return (
      <div>
        <span>{this.props.title}</span>
        <span> - </span>
        <span>{this.props.price}</span>
        <span> x </span>
        <span>{this.props.inventory}</span>
        <AddToCartButton
          id={this.props.id}
          inventory={this.props.inventory}
          addToCart={this.props.addToCart}
        />
        <EditProductButton
          id={this.props.id}
          editProduct={this.props.editProduct}
        />
        <hr/>
      </div>
    );
  }
}

class AddToCartButton extends React.Component {
  handleAddToCart = () => (
    this.props.addToCart(this.props.id)
  )

  render() {
    if (this.props.inventory > 0) {
      return (
        <div>
          <button onClick={this.handleAddToCart}>Add to Cart</button>
        </div>
      );
    } else {
      return (
        <div>
          <button disabled={true}>Sold Out</button>
        </div>
      );
    }
  }
}

class EditProductButton extends React.Component {
  handleEditProduct = () => {
    return this.props.editProduct(this.props.id);
  }

  render() {
    return (
      <div>
        <button onClick={this.handleEditProduct}>Edit Product</button>
      </div>
    );
  }
}

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
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      title: nextProps.title || '',
      inventory: nextProps.inventory || '',
      price: nextProps.price || '',
    });
  }

  render() {
    const submitText = this.props.id ? 'Update' : 'Create';
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

export default Store;
