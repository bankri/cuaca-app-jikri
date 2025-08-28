import React from "react";
import { Button, Chip, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
}

interface WeatherCardProps {
  data: WeatherData;
  isCelsius: boolean;
  toggleTemperatureUnit: () => void;
  isMobile: boolean;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  data,
  isCelsius,
  toggleTemperatureUnit,
  isMobile,
}) => {
  const convertToFahrenheit = (celsius: number) => {
    return (celsius * 9) / 5 + 32;
  };

  const formatTemperature = (temp: number) => {
    const temperature = isCelsius ? temp : convertToFahrenheit(temp);
    return `${Math.round(temperature)}°${isCelsius ? "C" : "F"}`;
  };

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: Record<string, string> = {
      "01d": "lucide:sun",
      "01n": "lucide:moon",
      "02d": "lucide:cloud-sun",
      "02n": "lucide:cloud-moon",
      "03d": "lucide:cloud",
      "03n": "lucide:cloud",
      "04d": "lucide:clouds",
      "04n": "lucide:clouds",
      "09d": "lucide:cloud-drizzle",
      "09n": "lucide:cloud-drizzle",
      "10d": "lucide:cloud-rain",
      "10n": "lucide:cloud-rain",
      "11d": "lucide:cloud-lightning",
      "11n": "lucide:cloud-lightning",
      "13d": "lucide:snowflake",
      "13n": "lucide:snowflake",
      "50d": "lucide:wind",
      "50n": "lucide:wind",
    };
    
    return iconMap[iconCode] || "lucide:cloud";
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getWeatherBackground = (weatherMain: string) => {
    const backgrounds: Record<string, string> = {
      "Clear": "bg-gradient-to-br from-blue-50 to-yellow-100",
      "Clouds": "bg-gradient-to-br from-gray-100 to-blue-100",
      "Rain": "bg-gradient-to-br from-blue-100 to-gray-200",
      "Drizzle": "bg-gradient-to-br from-blue-100 to-gray-200",
      "Thunderstorm": "bg-gradient-to-br from-gray-300 to-blue-200",
      "Snow": "bg-gradient-to-br from-blue-50 to-gray-100",
      "Mist": "bg-gradient-to-br from-gray-200 to-gray-100",
      "Smoke": "bg-gradient-to-br from-gray-300 to-gray-200",
      "Haze": "bg-gradient-to-br from-yellow-100 to-gray-200",
      "Dust": "bg-gradient-to-br from-yellow-200 to-gray-200",
      "Fog": "bg-gradient-to-br from-gray-200 to-gray-100",
      "Sand": "bg-gradient-to-br from-yellow-200 to-gray-200",
      "Ash": "bg-gradient-to-br from-gray-300 to-gray-200",
      "Squall": "bg-gradient-to-br from-blue-200 to-gray-300",
      "Tornado": "bg-gradient-to-br from-gray-400 to-gray-300",
    };
    
    return backgrounds[weatherMain] || "bg-gradient-to-br from-blue-50 to-purple-50";
  };

  const weatherMain = data.weather[0].main;
  const weatherDescription = data.weather[0].description;
  const weatherIcon = getWeatherIcon(data.weather[0].icon);

  return (
    <div className={`rounded-lg overflow-hidden transition-all duration-300 ${getWeatherBackground(weatherMain)}`}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">
            {data.name}, {data.sys.country}
          </h2>
          <Button
            size="sm"
            variant="flat"
            color="primary"
            onPress={toggleTemperatureUnit}
          >
            {isCelsius ? "°C → °F" : "°F → °C"}
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between py-4">
          <div className="flex items-center mb-4 sm:mb-0">
            <Icon icon={weatherIcon} className="text-5xl text-primary" />
            <div className="ml-4">
              <p className="text-4xl font-bold">
                {formatTemperature(data.main.temp)}
              </p>
              <p className="capitalize text-default-600">{weatherDescription}</p>
            </div>
          </div>
          <div>
            <p className="text-sm">
              Feels like: {formatTemperature(data.main.feels_like)}
            </p>
          </div>
        </div>

        <Divider className="my-4" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex flex-col items-center">
            <Icon icon="lucide:droplets" className="text-blue-500 mb-1" />
            <p className="text-xs text-default-500">Humidity</p>
            <p className="font-semibold">{data.main.humidity}%</p>
          </div>
          <div className="flex flex-col items-center">
            <Icon icon="lucide:wind" className="text-blue-500 mb-1" />
            <p className="text-xs text-default-500">Wind</p>
            <p className="font-semibold">{data.wind.speed} m/s</p>
          </div>
          <div className="flex flex-col items-center">
            <Icon icon="lucide:sunrise" className="text-orange-500 mb-1" />
            <p className="text-xs text-default-500">Sunrise</p>
            <p className="font-semibold">{formatTime(data.sys.sunrise)}</p>
          </div>
          <div className="flex flex-col items-center">
            <Icon icon="lucide:sunset" className="text-orange-500 mb-1" />
            <p className="text-xs text-default-500">Sunset</p>
            <p className="font-semibold">{formatTime(data.sys.sunset)}</p>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <Chip color="primary" variant="flat" size="sm">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Chip>
        </div>
      </div>
    </div>
  );
};