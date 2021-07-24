import i18next from 'i18next';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import '@fortawesome/fontawesome-free/css/all.min.css';
import usePosition from '../../custom-hooks/use-position';
import weatherBackground from '../../functions/weather-background';
import CurrentWeatherI from '../../interfaces/current-weatherI';
import { WeatherPropertiesI } from '../../interfaces/weather-propertiesI';
import currentWeather, {
  getWeatherCity,
  getWeatherIcon,
} from '../../services/weather-service';

const Landing: React.ComponentType<Record<string, never>> = () => {
  const [weather, setWeather] = useState<CurrentWeatherI>();
  const position: GeolocationPosition | undefined = usePosition();
  const [weatherImage, setWeatherImage] = useState<string>('');
  const [weatherIcon, setWeatherIcon] = useState<string>();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [properties, setProperties] = useState<WeatherPropertiesI>({
    lang: i18next.language,
    units: 'metric',
  });
  const readWeatherImage = (weatherCode: number) => {
    const image = weatherBackground(weatherCode);
    setWeatherImage(image);
  };
  const readWeatherIcon = (iconCode: string) => {
    getWeatherIcon(iconCode)
      .then((res) => {
        const code = res;
        const reader = new FileReader();
        reader.readAsDataURL(code);
        reader.onloadend = () => {
          const base64data = reader.result;
          setWeatherIcon(base64data as string);
        };
      })
      .catch((error) => console.error(error));
  };
  const getWeather = useCallback(
    (lat: string, long: string) => {
      currentWeather(long, lat, properties).then((res) => {
        console.log(res);
        readWeatherIcon(res.weather[0].icon);
        readWeatherImage(res.cod);
        setWeather(res);
      });
    },
    [properties]
  );
  const getWeatherByCity = (formData: { city: string }) => {
    getWeatherCity(formData.city, properties)
      .then((res) => {
        readWeatherIcon(res.weather[0].icon);
        readWeatherImage(res.cod);
        setWeather(res);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const readCurrentPositionWeather = useCallback(() => {
    if (position) {
      getWeather(
        position.coords.latitude.toFixed(2),
        position.coords.longitude.toFixed(2)
      );
    }
  }, [position, getWeather]);
  /**
   * Read current weather of the current position
   */
  useEffect(() => {
    readCurrentPositionWeather();
  }, [position, readCurrentPositionWeather]);
  /**
   * Each time imageBackground value changes, change body style background
   */
  useEffect(() => {
    console.log(weatherImage);
    const body = document.querySelector('body');
    if (body) {
      console.log('Setting background');
      body.style.background = `url(${weatherImage}) no-repeat center center fixed`;
      body.style.backgroundSize = 'cover';
    }
  }, [weatherImage]);
  return (
    <>
      <div className="search-section">
        <button
          type="submit"
          title="Return to home city"
          onClick={() => {
            readCurrentPositionWeather();
          }}
          className="button left"
        >
          <i className="fas fa-home"></i>
        </button>
        <form onSubmit={handleSubmit(getWeatherByCity)}>
          <input
            className="input-search"
            id="city"
            type="text"
            placeholder="Search your city"
            {...register('city')}
          />
          <button type="submit" title="Search" className="button right">
            <i className="fas fa-search"></i>
          </button>
        </form>
      </div>
      <section>
        <div className="card-deck">
          <div className="card-deck__weather-card">
            <div className="card-deck__weather-card__title">
              <p>Current weather</p>
            </div>
            <div className="card-deck__weather-card__content">
              <div>
                {weatherIcon && (
                  <img
                    src={weatherIcon}
                    alt="current-weather-icon"
                    width={200}
                    height={200}
                  />
                )}
              </div>
              <div>
                {weather && (
                  <section className="card-deck__weather-card__content__column__content">
                    <p>{weather.main.temp}°C</p>
                    <p>{weather.weather[0].description}</p>
                  </section>
                )}
              </div>
            </div>
          </div>
          <div className="card-deck__weather-card">
            <div className="card-deck__weather-card__title">
              <p>Feels like</p>
            </div>
            <div>
              <div>
                {weather && (
                  <section>
                    <p>{weather.main.feels_like}°C</p>{' '}
                  </section>
                )}
              </div>
            </div>
          </div>
          <div className="card-deck__weather-card">
            <div className="card-deck__weather-card__title">
              <p>Min - Max</p>
            </div>
            <div>
              <div>
                {weather && (
                  <section>
                    <p>
                      {weather.main.temp_min}°C - {weather.main.temp_max}°C
                    </p>
                  </section>
                )}
              </div>
            </div>
          </div>
          <div className="card-deck__weather-card">
            <div className="card-deck__weather-card__title">
              <p>Humidity - Presure</p>
            </div>
            <div>
              <div>
                {weather && (
                  <section>
                    <p>{weather.main.humidity}</p>
                    <p>{weather.main.pressure}</p>
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Landing;
