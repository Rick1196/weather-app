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
  // state to store the current weahter
  const [weather, setWeather] = useState<CurrentWeatherI>();
  // user positition  with custom hook use positition
  const position: GeolocationPosition | undefined = usePosition();
  // state to store the result image of the weather-backgroud function
  const [weatherImage, setWeatherImage] = useState<string>('');
  // state to store the icon image obtained by the icon service
  const [weatherIcon, setWeatherIcon] = useState<string>();
  // React form hook to handle input for the place search
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  /**
   * We can read the default language of the browser and request the weather data on that lang
   * by default the units are in metric system
   */
  const [properties, setProperties] = useState<WeatherPropertiesI>({
    lang: i18next.language,
    units: 'metric',
  });
  /**
   * Get weather image background by cod with the weatherBackgroud funcation ands updates the state od weatherImage
   * @param weatherCode from weather received api
   */
  const readWeatherImage = (weatherCode: number) => {
    const image = weatherBackground(weatherCode);
    setWeatherImage(image);
  };
  /**
   * Takes the weather icon code and ask for the image to the wheater service
   * if the service return and ok response, updates the weatherIcon state
   * @param iconCode from weahter api
   */
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
  /**
   * Takes lat and long and ask for the current weahter at that posititions to the weather service
   * @param lat as string in format 00.00
   * @param long as string in format 00.00
   */
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
    /**
     * Takes an input from the user and asks for the current weahter at that place
     * @param {city}  name of the place to search
     */
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
  /**
   * Reads posititons state and asks for the current weather
   */
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
    if (position) {
      getWeather(
        position.coords.latitude.toFixed(2),
        position.coords.longitude.toFixed(2)
      );
    }
  }, [getWeather, position, readCurrentPositionWeather]);
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
    {/* Search input section */}
      <section className="search-section">
        {/* Return to current position button */}
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
        {/* Seach input */}
        <form onSubmit={handleSubmit(getWeatherByCity)}>
          <input
            className="input-search"
            id="city"
            type="text"
            placeholder="Search your city"
            {...register('city')}
          />
          {/* Search button */}
          <button type="submit" title="Search" className="button right">
            <i className="fas fa-search"></i>
          </button>
        </form>
      </section>
      {/* Close search input section */}
      {/* Cards section */}
      <section>
        <div className="card-deck">
          {/* Current weahter card splitted into 2 columns left for the icon and wight for the text */}
          <div className="card-deck__weather-card">
            {/* Card title */}
            <div className="card-deck__weather-card__title">
              <p>Current weather</p>
            </div>
            {/* Card content */}
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
      {/* Close card section */}
    </>
  );
};

export default Landing;
