import axios, { AxiosRequestConfig } from 'axios';
import CurrentWeatherI from '../interfaces/current-weatherI';
import { WeatherPropertiesI } from '../interfaces/weather-propertiesI';

export default function currentWeather(
    long: string,
    latitude: string,
    properties: WeatherPropertiesI
): Promise<CurrentWeatherI> {
    const requestOptions: AxiosRequestConfig = {
        method: 'GET',
        url: `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${long}&lang=${properties.lang}&units=${properties.units}&appid=09c3ec7f0d27318a79781b2a3b302312`,
    };
    return axios.request(requestOptions).then((response) => {
        return response.data as CurrentWeatherI;
    });
}

export function getWeatherIcon(codeIcon: string): Promise<Blob> {
    const requestOptions: AxiosRequestConfig = {
        method: 'GET',
        url: `https://openweathermap.org/img/wn/${codeIcon}@2x.png`,
        headers: {
            Accept: 'application/png',
        },
        responseType: 'blob',
    };
    return axios.request(requestOptions).then((res) => {
        return res.data;
    });
}

export function getWeatherCity(
    cityName: string,
    properties: WeatherPropertiesI
): Promise<CurrentWeatherI> {
    const requestOptions: AxiosRequestConfig = {
        method: 'GET',
        url: `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&lang=${properties.lang}&units=${properties.units}&appid=09c3ec7f0d27318a79781b2a3b302312`,
    };
    return axios.request(requestOptions).then((response) => {
        return response.data as CurrentWeatherI;
    });
}
