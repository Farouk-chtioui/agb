import { getCoordinates } from '../../api/geocodingService';

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; 
    return distance;
};

export const calculatePrice = async (marketAddress, clientAddress, products) => {
    try {
        const marketCoords = await getCoordinates(marketAddress);
        const clientCoords = await getCoordinates(clientAddress);

        const distance = calculateDistance(
            parseFloat(marketCoords.latitude),
            parseFloat(marketCoords.longitude),
            parseFloat(clientCoords.latitude),
            parseFloat(clientCoords.longitude)
        );

        let priceAdjustment = 0;
        if (distance > 300) {
            priceAdjustment = (distance - 300) * 2; // 2 euros per km over 300 km
        }

        // Calculate the total product price
        let productTotalPrice = 0;
        products.forEach(product => {
            if (product.price) {
                productTotalPrice += product.price * product.quantity;
            }
        });

        const deliveryFee = priceAdjustment;
        const finalPrice = productTotalPrice + deliveryFee;

        return finalPrice.toFixed(2);
    } catch (error) {
        throw new Error('Error calculating price: ' + error.message);
    }
};
