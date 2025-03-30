import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import GlobalStyles from './components/GlobalStyles';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';

// Initialize localStorage defaults if they don't exist
if (localStorage.getItem('user') === null) {
  console.log("Initializing localStorage 'user' to null");
  localStorage.setItem('user', 'null');
}
if (localStorage.getItem('cartItems') === null) {
  console.log("Initializing localStorage 'cartItems' to null");
  localStorage.setItem('cartItems', 'null');
}
if (localStorage.getItem('favoriteItems') === null) {
  console.log("Initializing localStorage 'favoriteItems' to null");
  localStorage.setItem('favoriteItems', 'null');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <GlobalStyles>
            <App />
          </GlobalStyles>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
);