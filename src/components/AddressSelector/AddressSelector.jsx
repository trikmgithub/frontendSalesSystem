// src/components/AddressSelector/AddressSelector.jsx
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './AddressSelector.module.scss';
import useLocationData from '~/hooks/useLocationData';

const cx = classNames.bind(styles);

/**
 * Address selector component
 * @param {Object} props - Component props
 * @param {function} props.onAddressChange - Callback when address changes
 * @param {string} props.initialAddress - Initial address to parse
 * @param {string} props.className - Additional class name
 * @returns {JSX.Element} - Address selector component
 */
const AddressSelector = ({ 
  onAddressChange, 
  initialAddress = '',
  className = ''
}) => {
  const {
    locationData,
    selectedRegion,
    selectedDistrict,
    selectedWard,
    errors,
    handleRegionChange,
    handleDistrictChange,
    handleWardChange,
    parseAddress
  } = useLocationData();

  // Use a ref to track if initial address has been parsed
  const initialParseComplete = useRef(false);

  // Parse initial address when component mounts or when initialAddress changes
  useEffect(() => {
    if (initialAddress) {
      // Set a small timeout to ensure state is ready
      setTimeout(() => {
        parseAddress(initialAddress);
        initialParseComplete.current = true;
      }, 10);
    }
  }, [initialAddress, parseAddress]);

  // Track previous values to prevent unnecessary updates
  const prevValuesRef = useRef({ region: '', district: '', ward: '' });

  // Call onAddressChange when address components change - with proper change detection
  useEffect(() => {
    // Only update if we have all required fields AND something has actually changed
    if (selectedRegion && selectedDistrict && selectedWard && onAddressChange) {
      const prev = prevValuesRef.current;
      // Check if anything changed before calling the callback
      if (prev.region !== selectedRegion || 
          prev.district !== selectedDistrict || 
          prev.ward !== selectedWard) {
        
        // Update the ref with current values
        prevValuesRef.current = {
          region: selectedRegion,
          district: selectedDistrict,
          ward: selectedWard
        };
        
        // Call the callback with new data
        onAddressChange({
          region: selectedRegion,
          district: selectedDistrict,
          ward: selectedWard,
          formattedAddress: `${selectedWard}, ${selectedDistrict}, ${selectedRegion}`
        });
      }
    }
  }, [selectedRegion, selectedDistrict, selectedWard, onAddressChange]);

  return (
    <div className={cx('addressGroup', className)}>
      <div className={cx('selectWrapper')}>
        <select
          value={selectedRegion}
          onChange={(e) => handleRegionChange(e.target.value)}
          className={errors.region ? cx('error') : ''}
        >
          <option value="">Tỉnh/Thành phố</option>
          {locationData.regions.map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
        <div className={cx('selectArrow')}></div>
        {errors.region && <span className={cx('fieldError')}>{errors.region}</span>}
      </div>

      <div className={cx('selectWrapper')}>
        <select
          value={selectedDistrict}
          onChange={(e) => handleDistrictChange(e.target.value)}
          disabled={!selectedRegion}
          className={errors.district ? cx('error') : ''}
        >
          <option value="">Quận/huyện</option>
          {selectedRegion && locationData.districts[selectedRegion]?.map(district => (
            <option key={district} value={district}>{district}</option>
          ))}
        </select>
        <div className={cx('selectArrow')}></div>
        {errors.district && <span className={cx('fieldError')}>{errors.district}</span>}
      </div>

      <div className={cx('selectWrapper')}>
        {(!selectedDistrict || !locationData.wards[selectedDistrict]) ? (
          <input 
            type="text"
            value={selectedWard}
            onChange={(e) => handleWardChange(e.target.value)}
            disabled={!selectedDistrict}
            placeholder="Nhập tên phường/xã"
            className={errors.ward ? cx('error') : ''}
          />
        ) : (
          <select
            value={selectedWard}
            onChange={(e) => handleWardChange(e.target.value)}
            disabled={!selectedDistrict}
            className={errors.ward ? cx('error') : ''}
          >
            <option value="">Phường/xã</option>
            {selectedDistrict && locationData.wards[selectedDistrict]?.map(ward => (
              <option key={ward} value={ward}>{ward}</option>
            ))}
          </select>
        )}
        {selectedDistrict && locationData.wards[selectedDistrict] && (
          <div className={cx('selectArrow')}></div>
        )}
        {errors.ward && <span className={cx('fieldError')}>{errors.ward}</span>}
      </div>
    </div>
  );
};

export default AddressSelector;