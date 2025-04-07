// src/pages/Profile/components/FavoritesList/FavoritesList.jsx
import React from 'react';
import { Heart } from 'lucide-react';
import classNames from 'classnames/bind';
import styles from './FavoritesList.module.scss';
import sharedStyles from '../../styles/ProfileShared.module.scss';
import FavoriteItem from './FavoriteItem';
import EmptyState from '../common/EmptyState/EmptyState';

const cx = classNames.bind({ ...styles, ...sharedStyles });

const FavoritesList = ({ 
  favoriteItems, 
  onAddToCart, 
  onRemoveFromFavorites 
}) => {
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
          onRemoveFromFavorites={onRemoveFromFavorites}
        />
      ))}
    </div>
  );
};

export default FavoritesList;