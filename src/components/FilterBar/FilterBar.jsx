// src/components/FilterBar/FilterBar.jsx
import { useState } from 'react';
import classNames from 'classnames/bind';
import { FaSort } from 'react-icons/fa';
import styles from './FilterBar.module.scss';

const cx = classNames.bind(styles);

function FilterBar({ onFilterChange, onSortChange }) {
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [sortOrder, setSortOrder] = useState('default');

  const handlePriceChange = (e, index) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(e.target.value) || 0;
    setPriceRange(newRange);
    
    if (onFilterChange) {
      onFilterChange({ priceRange: newRange });
    }
  };

  const handleSortChange = (e) => {
    const newSortOrder = e.target.value;
    setSortOrder(newSortOrder);
    
    if (onSortChange) {
      onSortChange(newSortOrder);
    }
  };

  return (
    <div className={cx('filter-bar')}>
      <div className={cx('container')}>
        <div className={cx('price-filter')}>
          <h3>KHOẢNG GIÁ</h3>
          <div className={cx('price-inputs')}>
            <input 
              type="number" 
              value={priceRange[0]} 
              onChange={(e) => handlePriceChange(e, 0)}
              placeholder="0"
              className={cx('price-input')}
            />
            <span className={cx('separator')}>-</span>
            <input 
              type="number" 
              value={priceRange[1]} 
              onChange={(e) => handlePriceChange(e, 1)}
              placeholder="1000000"
              className={cx('price-input')}
            />
          </div>
        </div>
        
        <div className={cx('sort-control')}>
          <label htmlFor="sortOrder">
            <FaSort /> Sắp xếp:
          </label>
          <select 
            id="sortOrder" 
            value={sortOrder} 
            onChange={handleSortChange}
            className={cx('sort-select')}
          >
            <option value="default">Mặc định</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
            <option value="name-asc">Tên: A-Z</option>
            <option value="name-desc">Tên: Z-A</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;