import api from '../utils/api';

export const getAssets = async () => {
    const response = await api.get('/assets');
    return response.data;
};

export const createAsset = async (asset) => {
    const response = await api.post('/assets', asset);
    return response;
};


export const updateAsset = async (id, asset) => {
    const response = await api.patch(`/assets/${id}`, asset);
    return response.data;
};

export const deleteAsset = async (id) => {
    const response = await api.delete(`/assets/${id}`);
    return response.data;
};

export const getAssetById = async (id) => {
    const response = await api.get(`/assets/${id}`);
    return response.data;
};

export const getFirstAvailableAsset = async (assetCategory) => {
    const response = await api.get(`/assets/available/${assetCategory}`);
    return response.data;
};
