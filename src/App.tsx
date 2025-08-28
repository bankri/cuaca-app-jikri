import React from "react";
import { Card, Input, Button, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { WeatherCard } from "./components/weather-card";
import { useFetch } from "./hooks/use-fetch";
import { useLocalStorage } from "./hooks/use-local-storage";
import { useToggle } from "./hooks/use-toggle";
import { useWindowSize } from "./hooks/use-window-size";

// Weather API types
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

export default function App() {
  const [city, setCity] = useLocalStorage<string>("lastCity", "Jakarta");
  const [searchInput, setSearchInput] = React.useState(city);
  const [isCelsius, toggleTemperatureUnit] = useToggle(true);
  const { width } = useWindowSize();
  const isMobile = width < 640;

  const apiKey = "4d8fb5b93d4af21d66a2948710284366"; // Demo key for OpenWeatherMap
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  
  const { data, loading, error, refetch } = useFetch<WeatherData>(url);

  const handleSearch = () => {
    if (searchInput.trim()) {
      setCity(searchInput);
      refetch();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 p-4 flex flex-col items-center justify-center">
      <Card className="w-full max-w-md shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-6 text-center">Weather App</h1>
          
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Enter city name"
              value={searchInput}
              onValueChange={setSearchInput}
              onKeyDown={handleKeyDown}
              startContent={
                <Icon icon="lucide:map-pin" className="text-default-400" />
              }
              className="flex-1"
            />
            <Button color="primary" onPress={handleSearch}>
              <Icon icon="lucide:search" />
              {!isMobile && <span className="ml-1">Search</span>}
            </Button>
          </div>

          {loading && (
            <div className="flex justify-center my-8">
              <Spinner size="lg" color="primary" />
            </div>
          )}

          {error && (
            <div className="text-center p-4 text-danger">
              <Icon icon="lucide:alert-circle" className="text-3xl mb-2" />
              <p>City not found or API error. Please try again.</p>
            </div>
          )}

          {data && !loading && (
            <WeatherCard 
              data={data} 
              isCelsius={isCelsius} 
              toggleTemperatureUnit={toggleTemperatureUnit}
              isMobile={isMobile}
            />
          )}
        </div>
      </Card>
      
      <p className="mt-4 text-small text-default-500 text-center">
        Data from OpenWeatherMap API
      </p>
    </div>
  );
}