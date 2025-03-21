import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import GlobalStyles from './components/GlobalStyles';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <CartProvider>
            <FavoritesProvider>
                <GlobalStyles>
                    <App />
                </GlobalStyles>
            </FavoritesProvider>
        </CartProvider>
    </StrictMode>,
);