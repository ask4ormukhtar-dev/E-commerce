import { useState, useEffect } from 'react'; 
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import './App.css'; 

// 1. Navbar with cart counter
const Navbar = ({ cart }) => (
  <nav className="navbar">
    <div className="logo">E-Commerce</div>
    <div className="nav-links">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>
      <button className="nav-cart-btn">
        🛒 Cart ({cart.length})
      </button>
    </div>
  </nav>
);

const Home = ({ products }) => (
  <div className="container">
    <h2>Our Products</h2>
    <div className="product-grid">
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.title} />
            <Link to={`/product/${product.id}`} className="product-title-link">
              <h3>{product.title}</h3>
            </Link>
            <p className="price">${product.price.toFixed(2)}</p>
          </div>
        ))
      ) : (
        <p>Loading products...</p>
      )}
    </div>
  </div>
);

const ProductDetail = ({ addToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="container"><p>Loading product details...</p></div>;
  if (!product) return <div className="container"><h2>Product not found</h2></div>;

  return (
    <div className="container single-product">
      <Link to="/" className="back-btn">← Back to Products</Link>
      <div className="details-wrapper">
        <img src={product.image} alt={product.title} />
        <div className="details-info">
          <h2>{product.title}</h2>
          <p className="category">Category: {product.category}</p>
          <p className="description">{product.description}</p>
          <p className="price">${product.price.toFixed(2)}</p>
          <button className="buy-btn" onClick={() => addToCart(product)}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. Populated About Us Page component
const About = () => (
  <div className="container about-page">
    <h2>About Our Store</h2>
    <p className="about-intro">
      Welcome to E-Commerce, your premier online destination for premium apparel, fine jewelry, and cutting-edge electronics. Founded with a vision to streamline your shopping experience, we bring global trends straight to your doorstep.
    </p>
    
    <div className="about-grid">
      <div className="about-card">
        <h3>🌱 Our Mission</h3>
        <p>To provide high-quality, ethically-sourced goods at accessible price points without compromising on style or durability.</p>
      </div>
      <div className="about-card">
        <h3>⚡ Fast Delivery</h3>
        <p>With distribution hubs across the globe, we guarantee swift processing windows and reliable tracking updates for every order.</p>
      </div>
      <div className="about-card">
        <h3>🛠️ Support 24/7</h3>
        <p>Our dedicated customer success team works around the clock to assist you with tracking, adjustments, or returns.</p>
      </div>
    </div>
  </div>
);

// 3. Populated Contact Page component with a working form state
const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container contact-page">
      <h2>Get In Touch</h2>
      <p className="contact-subtitle">Have questions about an order or product? Drop us a line below.</p>
      
      <div className="contact-wrapper">
        {submitted ? (
          <div className="submission-success">
            <h3>🎉 Thank You!</h3>
            <p>Your message has been sent successfully. Our team will review your inquiry and reach back out within 24 business hours.</p>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" required placeholder="Mukhtar Muhammad" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" required placeholder="mukhtar@9.com" />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" rows="5" required placeholder="Type your message here..."></textarea>
            </div>
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        )}

        <div className="contact-info">
          <h3>Contact Details</h3>
          <p><strong>📍 Address:</strong> 123 Tech Commerce Boulevard, Suite 400, San Francisco, CA</p>
          <p><strong>📞 Phone:</strong> +1 (555) 019-2834</p>
          <p><strong>✉️ Email:</strong> support@ecommerce-shop.com</p>
          <p><strong>🕒 Business Hours:</strong> Mon - Fri, 9:00 AM - 6:00 PM EST</p>
        </div>
      </div>
    </div>
  );
};

function App() { 
  const [products, setProducts] = useState([]); 
  const [cart, setCart] = useState([]);
  const productUrl = 'https://fakestoreapi.com/products'; 

  useEffect(() => { 
    fetch(productUrl) 
      .then((response) => response.json()) 
      .then((data) => { 
        setProducts(data); 
      })
      .catch((err) => console.error(err));
  }, []); 

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  return (
    <Router>
      <div className="App">
        <Navbar cart={cart} />
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
