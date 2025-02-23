import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Cart.module.scss'; // Import SCSS module
import { X } from 'lucide-react';
import { CartContext } from '~/context/CartContext';
import productImg from '~/assets/product1.png';
import emptyCartIcon from '~/assets/cart.png'; // Replace with actual path
import routes from '~/config/routes';

const cx = classNames.bind(styles);

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
        <div className={cx('cartContainer')}>
            <div className={cx('cartWrapper')}>
                {cartItems.length === 0 ? (
                    // Empty Cart View
                    <div className={cx('emptyCart')}>
                        <h2 className={cx('emptyCartTitle')}>
                            Giỏ hàng <span>(0 sản phẩm)</span>
                        </h2>
                        <img src={emptyCartIcon} alt="Empty cart" className={cx('emptyCartIcon')} />
                        <p className={cx('emptyCartMessage')}>Bạn chưa chọn sản phẩm.</p>
                        <Link to={routes.home} className={cx('continueShoppingButton')}>
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                ) : (
                    // Cart Items View
                    <>
                        <div className={cx('cartHeader')}>
                            <div>Sản phẩm</div>
                            <div className={cx('price')}>Giá tiền</div>
                            <div className={cx('price')}>Số lượng</div>
                            <div className={cx('totalPrice')}>Thành tiền</div>
                        </div>

                        <div>
                            {cartItems.map((item) => (
                                <div key={item._id} className={cx('cartItem')}>
                                    <div className={cx('productDetails')}>
                                        <img src={productImg} alt={item.name} />
                                        <div className={cx('productInfo')}>
                                            <span className={cx('name')}>{item.name}</span>
                                            <span className={cx('description')}>{item.description}</span>
                                            <div className={cx('actions')}>
                                                <button onClick={() => removeFromCart(item._id)}>
                                                    <X size={14} />
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={cx('price')}>
                                        <span>{formatPrice(item.price)}</span>
                                    </div>

                                    <div className={cx('quantity')}>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item, parseInt(e.target.value))}
                                        />
                                    </div>

                                    <div className={cx('totalPrice')}>{formatPrice(item.price * item.quantity)}</div>
                                </div>
                            ))}
                        </div>

                        <div className={cx('checkoutSection')}>
                            <div className={cx('totalPriceRow')}>
                                <div className={cx('totalPrice')}>
                                    Tổng thành tiền (Đã VAT): {formatPrice(calculateTotal())}
                                </div>
                            </div>
                            <Link to={routes.payment} className={cx('checkoutButtonRow')}>
                                <button className={cx('checkoutButton')}>Tiến hành đặt hàng</button>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Cart;
