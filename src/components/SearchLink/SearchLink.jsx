// src/components/SearchLink/SearchLink.jsx
import { useNavigate } from 'react-router-dom';

/**
 * SearchLink - A component that redirects to search results page
 * 
 * @param {Object} props - Component props
 * @param {string} props.text - The text to display and use as search term
 * @param {string} props.className - Optional CSS class
 * @param {Object} props.style - Optional inline styles
 * @returns {JSX.Element} - Clickable element that navigates to search results
 */
function SearchLink({ text, className, style, children }) {
  const navigate = useNavigate();
  
  const handleClick = (e) => {
    e.preventDefault();
    // Use the text or children as the search term
    const searchTerm = text || (typeof children === 'string' ? children : text);
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };
  
  return (
    <a 
      href="#" 
      onClick={handleClick} 
      className={className} 
      style={style}
    >
      {children || text}
    </a>
  );
}

export default SearchLink;