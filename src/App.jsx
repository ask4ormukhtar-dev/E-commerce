import { useState, useEffect } from 'react'; 
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import './App.css'; 

const Navbar = () => (
  <nav className="navbar">
    <div className="logo">E-Commerce</div>
    <div className="nav-links">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>
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

const ProductDetail = () => {
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
          <button className="buy-btn">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

const About = () => <div className="container"><h2>About Us Page</h2></div>;
const Contact = () => <div className="container"><h2>Contact Us Page</h2></div>;

function App() { 
  const [products, setProducts] = useState([]); 
  const productUrl = 'https://fakestoreapi.com/products'; 

  useEffect(() => { 
    fetch(productUrl) 
      .then((response) => response.json()) 
      .then((data) => { 
        setProducts(data); 
      })
      .catch((err) => console.error(err));
  }, []); 

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home products={products} />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  ); 
} 

export default App;
