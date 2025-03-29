// src/utils/formatCurrency.js
/**
 * Format a number as Vietnamese currency
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '0₫';
    
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount).replace('₫', '').trim() + '₫';
};