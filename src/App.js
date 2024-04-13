import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom'; // Import useParams
import './App.css'; // Import the style file

// Display book details
function BookDetail() {
  const { id } = useParams(); // Access the id parameter using useParams
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const apiKey = 'AIzaSyA8SS84Igu2_EuyIj15uCvm3or3mMgOLQM';
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}?key=${apiKey}`);
        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    };

    fetchBook();
  }, [id]);

  if (!book || !book.volumeInfo) {
    return <div className="book-detail">Loading...</div>;
  }

  const { imageLinks, title, description } = book.volumeInfo;

  return (
    <div className="book-detail">
      {/* Check if imageLinks.thumbnail exists before rendering */}
      {imageLinks && imageLinks.thumbnail && (
        <img src={imageLinks.thumbnail} alt="Book Cover" className="book-detail__image" />
      )}
      <div className="book-detail__info">
        {/* Check if title exists before rendering */}
        {title && <h2 className="book-detail__title">{title}</h2>}
        {/* Check if description exists before rendering */}
        {description && (
          <p className="book-detail__description" dangerouslySetInnerHTML={{ __html: description }}></p>
        )}
      </div>
    </div>
  );
}

function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [books, setBooks] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [startIndex, setStartIndex] = useState(0);

  const categories = ['all', 'art', 'biography', 'computers', 'history', 'medical', 'poetry'];

  useEffect(() => {
    const searchBooks = async () => {
      const apiKey = 'AIzaSyA8SS84Igu2_EuyIj15uCvm3or3mMgOLQM';
      let url = `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=30&key=${apiKey}`;

      if (category !== 'all') {
        url += `&subject=${category}`;
      }

      try {
        const response = await fetch(url);
        const data = await response.json();
        setBooks(data.items || []);
        setTotalItems(data.totalItems || 0);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    searchBooks();
  }, [startIndex, category, query]);

  const loadMore = () => {
    setStartIndex(startIndex + 30);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setStartIndex(0);
  };

  return (
    <Router>
      <div className="container">
        <div className="book-detail">
          <Routes>
            <Route path="/book/:id" element={<BookDetail />} />
          </Routes>
        </div>
        <div className="books-container">
          <h1 className="heading">Book Search App</h1>
          <form onSubmit={handleSearch} className="search-form">
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} className="search-input" />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="category-select">
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <button type="submit" className="search-button">Search</button>
          </form>
          <p className="total-items">Found {totalItems} books</p>
          <div className="books-list">
            {books.map((book) => (
              <Link key={book.id} to={`/book/${book.id}`} className="book-link">
                <div className="book-card">
                  <img src={book.volumeInfo.imageLinks?.thumbnail} alt="Book Cover" className="book-card__image" />
                  <div className="book-card__info">
                    <h2 className="book-card__title">{book.volumeInfo.title}</h2>
                    <p className="book-card__authors">Authors: {book.volumeInfo.authors?.join(', ')}</p>
                    <p className="book-card__category">Category: {book.volumeInfo.categories?.[0]}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {totalItems > books.length && <button onClick={loadMore} className="load-more">Load more</button>}
        </div>
      </div>
    </Router>
  );
}
export default App;