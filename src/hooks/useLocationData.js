// src/hooks/useLocationData.js
import { useState, useEffect, useCallback } from 'react';
import locationData from '~/utils/locationData';

/**
 * Custom hook for accessing and manipulating location data
 * @returns {Object} Location data and utility functions
 */
const useLocationData = () => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [errors, setErrors] = useState({
    region: '',
    district: '',
    ward: ''
  });

  // Reset district and ward when region changes
  useEffect(() => {
    if (selectedRegion) {
      setErrors(prev => ({ ...prev, region: '' }));
    } else {
      setSelectedDistrict('');
      setSelectedWard('');
    }
  }, [selectedRegion]);

  // Reset ward when district changes
  useEffect(() => {
    if (selectedDistrict) {
      setErrors(prev => ({ ...prev, district: '' }));
    } else {
      setSelectedWard('');
    }
  }, [selectedDistrict]);

  // Clear ward error when ward is selected
  useEffect(() => {
    if (selectedWard) {
      setErrors(prev => ({ ...prev, ward: '' }));
    }
  }, [selectedWard]);

  /**
   * Handle region selection
   * @param {string} region - Selected region
   */
  const handleRegionChange = (region) => {
    setSelectedRegion(region);
    // Reset dependent fields
    setSelectedDistrict('');
    setSelectedWard('');
  };

  /**
   * Handle district selection
   * @param {string} district - Selected district
   */
  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
    // Reset dependent field
    setSelectedWard('');
  };

  /**
   * Handle ward selection
   * @param {string} ward - Selected ward
   */
  const handleWardChange = (ward) => {
    setSelectedWard(ward);
  };

  /**
   * Validate location form
   * @returns {boolean} - Whether form is valid
   */
  const validateForm = () => {
    const newErrors = {
      region: !selectedRegion ? 'Vui lòng chọn khu vực' : '',
      district: !selectedDistrict ? 'Vui lòng chọn quận/huyện' : '',
      ward: !selectedWard ? 'Vui lòng chọn phường/xã' : ''
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  /**
   * Get formatted address string
   * @returns {string} - Formatted address
   */
  const getFormattedAddress = () => {
    if (selectedRegion && selectedDistrict && selectedWard) {
      return `${selectedWard}, ${selectedDistrict}, ${selectedRegion}`;
    }
    return '';
  };

  /**
   * Reset all location selections
   */
  const resetSelections = () => {
    setSelectedRegion('');
    setSelectedDistrict('');
    setSelectedWard('');
    setErrors({
      region: '',
      district: '',
      ward: ''
    });
  };

  /**
   * Find best matching region 
   */
  const findMatchingRegion = useCallback((regionText) => {
    // Check exact match first
    if (locationData.regions.includes(regionText)) {
      return regionText;
    }
    
    // Try to find a region that contains this text or vice versa
    return locationData.regions.find(r => 
      r.toLowerCase().includes(regionText.toLowerCase()) || 
      regionText.toLowerCase().includes(r.toLowerCase())
    );
  }, []);

  /**
   * Find best matching district for a region
   */
  const findMatchingDistrict = useCallback((region, districtText) => {
    const districts = locationData.districts[region] || [];
    
    // Check exact match first
    if (districts.includes(districtText)) {
      return districtText;
    }
    
    // Look for district with or without prefix
    const districtWithoutPrefix = districtText.replace(/^(Quận|Huyện|TP\.|Thị xã)\s+/, '');
    
    return districts.find(d => {
      const dWithoutPrefix = d.replace(/^(Quận|Huyện|TP\.|Thị xã)\s+/, '');
      return d === districtText || 
             dWithoutPrefix === districtText ||
             d === districtWithoutPrefix ||
             dWithoutPrefix === districtWithoutPrefix ||
             d.toLowerCase().includes(districtText.toLowerCase()) || 
             districtText.toLowerCase().includes(d.toLowerCase());
    });
  }, []);

  /**
   * Parse a full address string into components
   * @param {string} address - Full address string
   */
  const parseAddress = useCallback((address) => {
    if (!address) return;
    
    // Try to parse address in the format: "Ward, District, Region"
    const parts = address.split(', ');
    
    if (parts.length >= 3) {
      const regionText = parts[2];
      const districtText = parts[1];
      const wardText = parts[0];
      
      // Find matching region
      const matchedRegion = findMatchingRegion(regionText);
      
      if (matchedRegion) {
        setSelectedRegion(matchedRegion);
        
        // Find matching district
        const matchedDistrict = findMatchingDistrict(matchedRegion, districtText);
        
        if (matchedDistrict) {
          setSelectedDistrict(matchedDistrict);
          
          // Set the ward as-is since we have fewer ward data
          setSelectedWard(wardText);
        }
      }
    }
  }, [findMatchingRegion, findMatchingDistrict]);

  return {
    // Data
    locationData,
    selectedRegion,
    selectedDistrict,
    selectedWard,
    errors,
    
    // Functions
    setSelectedRegion,
    setSelectedDistrict,
    setSelectedWard,
    setErrors,
    handleRegionChange,
    handleDistrictChange,
    handleWardChange,
    validateForm,
    getFormattedAddress,
    resetSelections,
    parseAddress
  };
};

export default useLocationData;