import * as axiosConfig from '~/utils/axiosConfig';

// Get

// Get items
const getItemsAxios = async () => {
    try {
        const res = await axiosConfig.get('items/all');
        console.log(res);
        return res;
    } catch (error) {
        console.log('Error at itemAxios.js');
        throw new Error(error);
    }
};

export { getItemsAxios };
