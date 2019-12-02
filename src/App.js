import React from 'react';
import './App.css';
import { StoreContext } from '../src/context/StoreContext'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

function App() {

  const { getOpenRestaurants } = React.useContext(StoreContext);
  const [restaurants, setRestaurants] = React.useState([]);
  const [date, setDate] = React.useState(new Date())
  React.useEffect(() => {
    let didCancel = false;

    (async () => {
      try {
        const [restaurantResult] = await Promise.all([
          getOpenRestaurants("rest_hours", date)
        ]);
        if (!didCancel) {
          setRestaurants([])
        }
      } catch (error) {
        throw error;
      }
    })()
    return () => {
      didCancel = true;
    };
  }, [date])

  const handleChange = (selectedDate) => {
    setDate(selectedDate)
  }


console.log(restaurants)
  return (
    <div className="App">

      <div className="my-4">
        <DatePicker
          selected={date}
          onChange={handleChange}
          showTimeSelect
          dateFormat="MMMM d, yyyy h:mm aa"
        />
      </div>

      <div className="restaurant-list my-4">
        {restaurants.length > 0 ? (<ul >
          {Object.entries(restaurants).map(([key, restaurant]) => (<li key={key}> {restaurant.name}</li>))}
        </ul>) :
          <div> No Restaurant found!!!</div>
        }
      </div>
    </div>
  );
}

export default App;
