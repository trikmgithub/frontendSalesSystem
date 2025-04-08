// src/pages/Profile/components/FavoritesList/FavoritesList.jsx
import React, { useContext } from 'react';
import { Heart } from 'lucide-react';
import classNames from 'classnames/bind';
import styles from './FavoritesList.module.scss';
import sharedStyles from '../../styles/ProfileShared.module.scss';
import FavoriteItem from './FavoriteItem';
import EmptyState from '../common/EmptyState/EmptyState';
import { FavoritesContext } from '~/context/FavoritesContext';

const cx = classNames.bind({ ...styles, ...sharedStyles });

const FavoritesList = ({ onAddToCart }) => {
    const { favoriteItems, loading, removeFromFavorites } = useContext(FavoritesContext);

    if (loading) {
        return (
            <div className={cx('loading-state')}>
                <div className={cx('loading-spinner')}></div>
                <p>Đang tải danh sách yêu thích...</p>
            </div>
        );
    }

    if (!favoriteItems || favoriteItems.length === 0) {
        return (
            <EmptyState 
                icon={<Heart size={48} />}
                title="Danh sách yêu thích trống"
                message="Bạn chưa có sản phẩm yêu thích nào. Hãy thêm các sản phẩm bạn yêu thích để xem lại sau."
                actionText="Tiếp tục mua sắm"
                actionLink="/"
            />
        );
    }

    return (
        <div className={cx('favoritesList')}>
            {favoriteItems.map((item) => (
                <FavoriteItem 
                    key={item._id}
                    item={item}
                    onAddToCart={onAddToCart}
                    onRemoveFromFavorites={removeFromFavorites}
                />
            ))}
        </div>
    );
};

export default FavoritesList;