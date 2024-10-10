import { useState } from 'react';


export function useAssetEdit() {
    const [selectedAsset, setSelectedAsset] = useState(null);

    const handleEditAsset = (asset) => {
        setSelectedAsset(asset);
    };

    const handleAssetUpdated = () => {
        setSelectedAsset(null);
    };

    return {
        selectedAsset,
        handleEditAsset,
        handleAssetUpdated,
    };
}
