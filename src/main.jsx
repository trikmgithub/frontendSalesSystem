import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import GlobalStyles from './components/GlobalStyles';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { CompareProvider } from './context/CompareContext';

// Initialize localStorage with better handling
if (!localStorage.getItem('user')) {
  localStorage.setItem('user', 'null');
}
if (!localStorage.getItem('cartItems')) {
  localStorage.setItem('cartItems', 'null');
}
if (!localStorage.getItem('favoriteItems')) {
  localStorage.setItem('favoriteItems', 'null');
}
if (!localStorage.getItem('compareItems')) {
  localStorage.setItem('compareItems', 'null');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <CompareProvider>
            <GlobalStyles>
              <App />
            </GlobalStyles>
          </CompareProvider>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
);