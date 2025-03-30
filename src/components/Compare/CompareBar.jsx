import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '~/context/CompareContext';
import { FaBalanceScale, FaTimes, FaPlus } from 'react-icons/fa';
import classNames from 'classnames/bind';
import styles from './CompareBar.module.scss';

const cx = classNames.bind(styles);

const CompareBar = () => {
  const { 
    compareItems, 
    removeFromCompare, 
    clearCompare, 
    showCompareBar, 
    toggleCompareBar,
    maxCompareItems 
  } = useCompare();

  // Auto-show compare bar when items are added (but not removed)
  useEffect(() => {
    // If we have items but the bar is hidden, show it
    if (compareItems.length > 0 && !showCompareBar) {
      toggleCompareBar(); // This should make the bar visible
    }
  }, [compareItems.length]);

  // Generate placeholder slots based on max items and current items
  const placeholderCount = Math.max(0, maxCompareItems - compareItems.length);
  const placeholders = Array(placeholderCount).fill(null);

  // If no items in comparison, no need to render anything
  if (compareItems.length === 0) {
    return null;
  }

  return (
    <>
      {/* Floating button to toggle compare bar */}
      <div className={cx('toggleCompareBar')} onClick={toggleCompareBar}>
        <FaBalanceScale size={20} />
        {compareItems.length > 0 && (
          <span className={cx('count')}>{compareItems.length}</span>
        )}
      </div>

      {/* Compare bar */}
      <div className={cx('compareBarContainer', { visible: showCompareBar })}>
        <div className={cx('compareBar')}>
          <div className={cx('compareItems')}>
            {/* Render selected items */}
            {compareItems.map(item => (
              <div key={item._id} className={cx('compareItem')}>
                <img 
                  src={item.imageUrls?.[0] || 'https://via.placeholder.com/70x70?text=No+Image'} 
                  alt={item.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/70x70?text=No+Image';
                  }}
                />
                <div 
                  className={cx('removeCompareItem')} 
                  onClick={() => removeFromCompare(item._id)}
                  title="Xóa khỏi danh sách so sánh"
                >
                  <FaTimes size={10} />
                </div>
              </div>
            ))}
            
            {/* Render placeholders */}
            {placeholders.map((_, index) => (
              <div key={`placeholder-${index}`} className={cx('compareItemPlaceholder')}>
                <FaPlus size={16} />
              </div>
            ))}
          </div>
          
          <div className={cx('compareActions')}>
            <button 
              className={cx('clearCompareButton')}
              onClick={clearCompare}
            >
              Xóa tất cả
            </button>
            
            <Link 
              to={`/compare?ids=${compareItems.map(item => item._id).join(',')}`}
              className={cx('compareNowButton')}
              disabled={compareItems.length < 2}
            >
              So sánh ngay
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompareBar;