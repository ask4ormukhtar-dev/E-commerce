import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import './App.css';

// 1. Updated Navbar with click handler
const Navbar = ({ cart, onCartClick }) => (
  <nav className="navbar">
    <div className="logo">E-Commerce</div>
    <div className="nav-links">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>
      <button className="nav-cart-btn" onClick={onCartClick}>
        🛒 Cart ({cart.length})
      </button>
    </div>
  </nav>
);

// NEW: Side Drawer component to see selected items
const CartDrawer = ({ isOpen, onClose, cart, removeFromCart }) => {
  if (!isOpen) return null;

  // Calculate total price accurately
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h3>Your Shopping Cart</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <p className="empty-message">Your cart is empty.</p>
          ) : (
            cart.map((item, index) => (
              <div key={`${item.id}-${index}`} className="cart-item">
                <img src={item.image} alt={item.title} />
                <div className="cart-item-details">
                  <h4>{item.title}</h4>
                  <p className="cart-item-price">${item.price.toFixed(2)}</p>
                  <button 
                    className="remove-btn" 
                    onClick={() => removeFromCart(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={() => alert('Checkout not implemented')}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ... Keep your Home, ProductDetail, About, and Contact components exactly as they are ...

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false); // Track drawer visibility

  const productUrl = 'https://fakestoreapi.com';

  useEffect(() => {
    fetch(productUrl)
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  // Remove individual item by its unique array position index
  const removeFromCart = (indexToRemove) => {
    setCart((prevCart) => prevCart.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Router>
      <div className="App">
        {/* Pass state triggers down */}
        <Navbar cart={cart} onCartClick={() => setIsCartOpen(true)} />
        
        <CartDrawer 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          cart={cart}
          removeFromCart={removeFromCart}
        />

        <Routes>
          <Route path="/" element={<Home products={products} />} />
          <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
