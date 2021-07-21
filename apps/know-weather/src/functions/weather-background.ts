import Atmosphere from '../assets/images/Atmosphere.jpg';
import Clear from '../assets/images/Clear.jpg';
import Clouds from '../assets/images/Clouds.jpg';
import Drizzle from '../assets/images/Drizzle.jpg';
import Rain from '../assets/images/Rain.jpg';
import Snow from '../assets/images/Snow.jpg';
import Thunderstorm from '../assets/images/Thunderstorm.jpg';

function formatCode(weatherCode: number) {
    return String(((weatherCode - (weatherCode % 100)) / 100) * 100);
}
export default function getWeatherImage(weatherCode: number): string {
    if (weatherCode === 800) return Clear;
    const formatedCode = formatCode(weatherCode);
    switch (formatedCode) {
        case '200':
            return Thunderstorm;
        case '300':
            return Drizzle;
        case '500':
            return Rain;
        case '600':
            return Snow;
        case '700':
            return Atmosphere;
        case '800':
            return Clouds;
        default:
            return Clear;
    }
}
