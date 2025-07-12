import { useEffect, useState } from "react";
import "./App.css";

type WetherForecast = {
  data: string;
  temperatureC: number;
  summary: string;
  temperatureF: number;
};

function App() {
  const [data, setData] = useState<WetherForecast[]>([]);

  const fetchData = async () => {
    const response = await fetch("https://localhost:7027/weatherforecast", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result: WetherForecast[] = await response.json();
    setData(result);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {data.map((item, i) => (
        <div key={i}>
          <h2>Summary: {item.summary}</h2>
          <p>Temperature (C): {item.temperatureC}</p>
          <p>Temperature (F): {item.temperatureF}</p>
          <p>{item.data}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
