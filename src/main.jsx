import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import GlobalStyles from './components/GlobalStyles';
import { CartProvider } from './context/CartContext';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <CartProvider>
            <GlobalStyles>
                <App />
            </GlobalStyles>
        </CartProvider>
    </StrictMode>,
);
