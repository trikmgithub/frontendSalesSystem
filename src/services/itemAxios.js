import * as axiosConfig from '~/utils/axiosConfig';

// Get all items (without pagination)
const getItemsAxios = async () => {
    try {
        const res = await axiosConfig.get('items/all');
        return res;
    } catch (error) {
        console.log('Error at itemAxios.js');
        throw new Error(error);
    }
};

// Get item detail
const getItemDetail = async (itemId) => {
    try {
        const res = await axiosConfig.get(`items/${itemId}`);
        return res;
    } catch (error) {
        console.log('Error at itemAxios.js');
        throw new Error(error);
    }
};

// Get paginated items
const getItemsPaginatedAxios = async (page = 1, limit = 18) => {
    try {
        const res = await axiosConfig.get(`items/paginate?page=${page}&limit=${limit}`);
        return res;
    } catch (error) {
        console.log('Error fetching paginated items:', error);
        throw new Error(error);
    }
};

export { getItemsAxios, getItemsPaginatedAxios, getItemDetail };
