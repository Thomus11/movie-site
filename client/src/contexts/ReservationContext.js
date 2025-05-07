import { createContext, useState, useContext } from 'react';

const ReservationContext = createContext();

export const ReservationProvider = ({ children }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [reservationInProgress, setReservationInProgress] = useState(null);

  const resetReservation = () => {
    setSelectedSeats([]);
    setSelectedShowtime(null);
    setReservationInProgress(null);
  };

  return (
    <ReservationContext.Provider
      value={{
        selectedSeats,
        setSelectedSeats,
        selectedShowtime,
        setSelectedShowtime,
        reservationInProgress,
        setReservationInProgress,
        resetReservation
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservation = () => useContext(ReservationContext);