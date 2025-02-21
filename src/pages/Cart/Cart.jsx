import React, { useContext } from 'react';
import styles from './Cart.module.scss'; // Import SCSS module
import { Heart, X } from 'lucide-react';
import { CartContext } from '~/context/CartContext';
import productImg from '~/assets/product1.png';

const Cart = () => {
    const { cartItems, updateCartItemQuantity, removeFromCart } = useContext(CartContext);

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + ' ₫';

    const calculateTotal = () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleQuantityChange = (item, quantity) => {
        if (quantity >= 1) {
            updateCartItemQuantity(item._id, quantity);
        }
    };

    return (
        <div className={styles.cartContainer}>
            <div className={styles.cartWrapper}>
                <div className={styles.cartHeader}>
                    <div>Sản phẩm</div>
                    <div className={styles.price}>Giá tiền</div>
                    <div className={styles.price}>Số lượng</div>
                    <div className={styles.totalPrice}>Thành tiền</div>
                </div>

                <div>
                    {cartItems.map((item) => (
                        <div key={item._id} className={styles.cartItem}>
                            <div className={styles.productDetails}>
                                <img src={productImg} alt={item.name} />
                                <div className={styles.productInfo}>
                                    <span className={styles.name}>{item.name}</span>
                                    <span className={styles.description}>{item.description}</span>
                                    <div className={styles.actions}>
                                        <button>
                                            <Heart size={14} />
                                            Yêu thích
                                        </button>
                                        <button onClick={() => removeFromCart(item._id)}>
                                            <X size={14} />
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.price}>
                                <span>{formatPrice(item.price)}</span>
                            </div>

                            <div className={styles.quantity}>
                                <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(item, parseInt(e.target.value))}
                                />
                            </div>

                            <div className={styles.totalPrice}>{formatPrice(item.price * item.quantity)}</div>
                        </div>
                    ))}
                </div>

                <div className={styles.checkoutSection}>
                    <div className={styles.totalPriceRow}>
                        <div className={styles.totalPrice}>Tổng thành tiền: {formatPrice(calculateTotal())}</div>
                    </div>
                    <div className={styles.checkoutButtonRow}>
                        <button className={styles.checkoutButton}>Tiến hành đặt hàng</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
