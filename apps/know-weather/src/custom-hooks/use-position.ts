import { useEffect, useState } from 'react';
/**
 * Read browser geolocation
 * @returns Current use GeololocationPosition Object
 */
export default function usePosition(): GeolocationPosition | undefined {
    const [currentPosition, setCurrentPosition] =
        useState<GeolocationPosition>();
    const updateGeolocation = (position: GeolocationPosition) => {
        console.log('Updating posititon', position);
        setCurrentPosition(position);
    };
    useEffect(() => {
        window.navigator.geolocation.getCurrentPosition(
            updateGeolocation,
            (error) => {
                console.error(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 100000,
            }
        );
    });
    return currentPosition;
}
