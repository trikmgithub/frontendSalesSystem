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
   * @param {string} streetAddress - Optional street address
   * @returns {string} - Formatted address
   */
  const getFormattedAddress = (streetAddress = '') => {
    if (selectedRegion && selectedDistrict && selectedWard) {
      if (streetAddress) {
        return `${streetAddress}, ${selectedWard}, ${selectedDistrict}, ${selectedRegion}`;
      }
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
    
    console.log("Parsing address:", address);
    
    // Try to parse address in the format: "Ward, District, Region" or "Street, Ward, District, Region"
    const parts = address.split(', ');
    
    if (parts.length >= 3) {
      // The last part is always the region
      const regionText = parts[parts.length - 1];
      // The second-to-last part is the district
      const districtText = parts[parts.length - 2];
      // The third-to-last part is the ward
      const wardText = parts[parts.length - 3];
      
      console.log("Address parts:", { 
        ward: wardText, 
        district: districtText, 
        region: regionText,
        street: parts.length > 3 ? parts.slice(0, parts.length - 3).join(', ') : ''
      });
      
      // Find matching region
      const matchedRegion = findMatchingRegion(regionText);
      console.log("Matched region:", matchedRegion);
      
      if (matchedRegion) {
        // Always set region first
        setSelectedRegion(matchedRegion);
        
        // Find matching district for this region
        const matchedDistrict = findMatchingDistrict(matchedRegion, districtText);
        console.log("Matched district:", matchedDistrict);
        
        if (matchedDistrict) {
          // Always set district to ensure UI updates
          setSelectedDistrict(matchedDistrict);
          
          // Always set ward value
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