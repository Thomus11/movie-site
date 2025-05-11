import React, { useState, useEffect } from 'react';
import { 
  FiSearch, FiStar, FiClock, FiCalendar, FiHome, 
  FiUser, FiLogOut, FiFacebook, FiTwitter, 
  FiInstagram, FiX, FiMapPin 
} from 'react-icons/fi';
import { FaPlay } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import MpesaPayment from "../Pages/MpesaPayment";
import api from "../api"

const UserDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [movies, setMovies] = useState({ available: [], comingSoon: [] });
  const [cinemas, setCinemas] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCinema, setActiveCinema] = useState('All');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showBookingPage, setShowBookingPage] = useState(false);
  const [showPaymentPage, setShowPaymentPage] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch current user
        const userRes = await api.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurrentUser(userRes.data);
        
        // Fetch movies
        const moviesRes = await api.get('/api/movies');
        const now = new Date();
        setMovies({
          available: moviesRes.data.filter(m => new Date(m.release_date) <= now),
          comingSoon: moviesRes.data.filter(m => new Date(m.release_date) > now)
        });
        
        // Fetch cinemas
        const cinemasRes = await api.get('/api/cinemas');
        setCinemas(cinemasRes.data);
        
        // Fetch user reservations
        const reservationsRes = await api.get('/api/reservations');
        setReservations(reservationsRes.data);
        
      } catch (error) {
        toast.error("Failed to load data");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter movies based on search and cinema
  const filteredMovies = {
    available: movies.available.filter(movie => 
      (activeCinema === 'All' || movie.cinemas.includes(parseInt(activeCinema))) &&
      (movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       movie.genre.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
    comingSoon: movies.comingSoon.filter(movie => 
      (activeCinema === 'All' || movie.cinemas.includes(parseInt(activeCinema))) &&
      (movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       movie.genre.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  };
  

  // Handle seat reservation
  const handleReserveSeats = async (paymentDetails = null) => {
    try {
      const token = localStorage.getItem('authToken');
      const reservationData = {
        movie_id: selectedMovie.id,
        showtime_id: selectedTime.id,
        seat_ids: selectedSeats,
        payment_method: 'M-Pesa'
      }
      console.log(reservationData)
      const response = await api.post('/api/reservations', reservationData);

      // Update local state with new reservation
      setReservations([response.data, ...reservations]);
      toast.success("Reservation confirmed!");
      
      // Reset booking state
      setShowBookingPage(false);
      setSelectedMovie(null);
      setSelectedSeats([]);
      setSelectedTime(null);
      
    } catch (error) {
      toast.error(`Reservation failed: ${error.message}`);
      console.error("Reservation error:", error);
    }
  };

  // Handle payment success
  const handlePaymentSuccess = (paymentDetails) => {
    // Create new reservation object
    
    const newReservation = {
      id: `RES${Date.now().toString().slice(-6)}`,
      movie: selectedMovie.title,
      cinema: cinemas.find(c => c.id === parseInt(activeCinema))?.name || 'Unknown Cinema',
      date: new Date().toISOString().split('T')[0],
      time: selectedTime.start_time,
      seats: selectedSeats,
      amount: (selectedMovie.price * selectedSeats.length) + 100,
      status: 'Confirmed',
      payment: {
        method: 'M-Pesa',
        transaction_id: paymentDetails.transactionId,
        amount: paymentDetails.amount
      }
    };



    // Update local state
    setReservations([newReservation, ...reservations]);
    setShowPaymentPage(false);
    setShowBookingPage(false);
    
    // Reset selections
    setSelectedMovie(null);
    setSelectedSeats([]);
    setSelectedTime(null);

    // Show success message
    toast.success(`Booking confirmed! Transaction ID: ${paymentDetails.transactionId}`);
    handleReserveSeats(paymentDetails);
  };



  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Seat selection component
  const renderSeatSelection = () => {
    const rows = ['A', 'B', 'C', 'D', 'E'];
    const cols = [1, 2, 3, 4, 5, 6, 7, 8];
    
    return (
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Select Your Seats</h3>
        <div className="bg-[#1F1F1F] p-6 rounded-lg">
          <div className="w-full max-w-md mx-auto">
            {/* Screen */}
            <div className="text-center mb-6">
              <div className="h-2 bg-gray-600 rounded-full mb-1"></div>
              <p className="text-gray-400 text-sm">SCREEN</p>
            </div>
            
            {/* Seats */}
            <div className="space-y-3">
              {rows.map(row => (
                <div key={row} className="flex justify-center space-x-3">
                  {cols.map(col => {
                    const seatId = `${row}${col}`;
                    const isSelected = selectedSeats.includes(seatId);
                    return (
                      <button
                        key={col}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedSeats(selectedSeats.filter(s => s !== seatId));
                          } else {
                            setSelectedSeats([...selectedSeats, seatId]);
                          }
                        }}
                        className={`w-8 h-8 rounded-sm flex items-center justify-center text-xs ${
                          isSelected 
                            ? 'bg-red-500 text-white' 
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                      >
                        {seatId}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            
            {/* Seat Legend */}
            <div className="flex justify-center mt-6 space-x-6 text-sm text-gray-400">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-700 rounded-sm mr-2"></div>
                Available
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-sm mr-2"></div>
                Selected
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-800 rounded-sm mr-2"></div>
                Taken
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0C10] to-[#1A1A2E] text-white">
      {/* Navbar */}
      <header className="bg-[#1F1F1F]/90 backdrop-blur-md py-4 px-6 shadow-lg sticky top-0 z-50 border-b border-[#2A2A2A]">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold">
              <span className="text-red-500">Cine</span>Reserve
            </h1>
            <nav className="hidden md:flex space-x-6">
              <button className="flex items-center space-x-2 hover:text-red-400 transition-colors">
                <FiHome className="text-lg" />
                <span>Home</span>
              </button>
            </nav>
          </div>
          
          <form onSubmit={(e) => e.preventDefault()} className="hidden md:block flex-1 max-w-md mx-8">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search movies..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#0B0C10] border border-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-red-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
          
          <div className="flex items-center space-x-4 relative">
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className="p-2 rounded-full hover:bg-[#2A2A2A] transition-colors relative"
            >
              <FiUser className="text-lg" />
              {showProfile && (
                <div className="absolute right-0 top-12 w-72 bg-[#1F1F1F] rounded-lg shadow-xl z-50 border border-[#2A2A2A]">
                  <div className="p-4 border-b border-[#2A2A2A]">
                    <h3 className="font-bold">{currentUser?.username}</h3>
                    <p className="text-sm text-gray-400">{currentUser?.email}</p>
                  </div>
                  <div className="p-4 border-b border-[#2A2A2A]">
                    <h4 className="font-semibold mb-2">My Reservations</h4>
                    {reservations.length > 0 ? (
                      <div className="space-y-3">
                        {reservations.map(reservation => (
                          <div key={reservation.id} className="text-sm bg-[#0B0C10] p-3 rounded-lg">
                            <div className="flex justify-between">
                              <span className="font-medium">{reservation.movie.title}</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                reservation.status === 'Confirmed' ? 'bg-green-500/20 text-green-400' : 
                                'bg-blue-500/20 text-blue-400'
                              }`}>
                                {reservation.status}
                              </span>
                            </div>
                            <div className="flex justify-between mt-1 text-gray-400">
                              <span>{reservation.cinema.name}</span>
                              <span>KSh {reservation.amount}</span>
                            </div>
                            <div className="flex justify-between mt-1 text-xs">
                              {/* <span>
                                {new Date(reservation.showtime.start_time).toLocaleDateString()} • 
                                {new Date(reservation.showtime.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span> */}
                              <span>Seats: {reservation.seats.map(s => s.seat_number).join(', ')}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">No reservations yet</p>
                    )}
                  </div>
                  <div className="p-2">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-2 bg-[#2A2A2A] hover:bg-red-600/20 hover:text-red-400 px-4 py-2 rounded-lg transition-colors"
                    >
                      <FiLogOut className="text-lg" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-[#2A2A2A] hover:bg-red-600/20 hover:text-red-400 px-4 py-2 rounded-lg transition-colors border border-[#3A3A3A]"
            >
              <FiLogOut className="text-lg" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-xl mx-auto py-8 px-6">
        {/* Cinema Filter */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 font-serif tracking-wide">Nairobi Cinemas</h2>
          <div className="flex overflow-x-auto pb-4 -mx-6 px-6">
            <div className="flex space-x-3">
              <button
                onClick={() => setActiveCinema('All')}
                className={`flex-shrink-0 px-6 py-3 rounded-xl transition-all ${
                  activeCinema === 'All' 
                    ? 'bg-red-600 text-white shadow-lg' 
                    : 'bg-[#1F1F1F] hover:bg-[#2A2A2A] hover:shadow-md'
                }`}
              >
                All Cinemas
              </button>
              {cinemas?.map(cinema => (
                <button
                  key={cinema.id}
                  onClick={() => setActiveCinema(cinema.id.toString())}
                  className={`flex-shrink-0 px-6 py-3 rounded-xl transition-all ${
                    activeCinema === cinema.id.toString() 
                      ? 'bg-red-600 text-white shadow-lg' 
                      : 'bg-[#1F1F1F] hover:bg-[#2A2A2A] hover:shadow-md'
                  }`}
                >
                  {cinema.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Available Movies */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold font-serif tracking-wide">Now Showing</h2>
            <p className="text-gray-400">
              {filteredMovies.available.length} movies available
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredMovies.available.map(movie => (
              <div 
                key={movie.id} 
                className="bg-[#1F1F1F]/80 hover:bg-[#1F1F1F] rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-red-900/10 transition-all duration-300 border border-[#2A2A2A] hover:border-[#3A3A3A]"
              >
                <div className="relative h-72">
                  <img 
                    src={movie.poster_url} 
                    alt={movie.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-between p-5">
                    <div className="flex justify-between">
                      <span className="bg-red-500/90 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {movie.rating}/5
                      </span>
                      <span className="text-white text-xs bg-black/50 px-3 py-1 rounded-full flex items-center">
                        <FiClock className="mr-1" size={12} />
                        {movie.duration} min
                      </span>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedMovie(movie);
                        setShowBookingPage(true);
                      }}
                      className="self-end bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full text-sm transition-colors shadow-lg"
                    >
                      Get Tickets
                    </button>
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="font-bold text-xl mb-2">{movie.title}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">{movie.genre}</span>
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <FiStar className="fill-current" size={16} />
                      <span className="text-white text-sm">{movie.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Coming Soon */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold font-serif tracking-wide">Coming Soon</h2>
            <p className="text-gray-400">
              {filteredMovies.comingSoon.length} movies coming
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredMovies.comingSoon.map(movie => (
              <div 
                key={movie.id} 
                className="bg-[#1F1F1F]/80 hover:bg-[#1F1F1F] rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-300 border border-[#2A2A2A] hover:border-[#3A3A3A]"
              >
                <div className="relative h-72">
                  <img 
                    src={movie.poster_url} 
                    alt={movie.title} 
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-5">
                    <span className="bg-blue-500/90 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
                      <FiCalendar className="mr-1" size={12} />
                      {new Date(movie.release_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="font-bold text-xl mb-2">{movie.title}</h3>
                  <span className="text-gray-400 text-sm">{movie.genre}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Booking Modal */}
      {showBookingPage && selectedMovie && (
        <div className="fixed inset-0 bg-[#0B0C10]/95 z-50 overflow-y-auto">
          <div className="min-h-screen max-w-6xl mx-auto py-12 px-6">
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-3xl font-bold">
                Booking: <span className="text-red-500">{selectedMovie.title}</span>
              </h2>
              <button 
                onClick={() => {
                  setShowBookingPage(false);
                  setSelectedMovie(null);
                  setSelectedTime(null);
                  setSelectedSeats([]);
                }}
                className="p-2 rounded-full hover:bg-[#2A2A2A] transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Movie Details */}
              <div className="lg:col-span-2 space-y-8">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-1/3">
                    <img 
                      src={selectedMovie.poster_url} 
                      alt={selectedMovie.title} 
                      className="w-full rounded-xl shadow-2xl"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-[#1F1F1F] text-white px-3 py-1 rounded-full text-sm">
                        {selectedMovie.genre}
                      </span>
                      <span className="bg-[#1F1F1F] text-white px-3 py-1 rounded-full text-sm flex items-center">
                        <FiClock className="mr-1" size={14} />
                        {selectedMovie.duration} min
                      </span>
                      <span className="bg-[#1F1F1F] text-white px-3 py-1 rounded-full text-sm flex items-center">
                        <FiStar className="mr-1 text-yellow-400" size={14} />
                        {selectedMovie.rating}/5
                      </span>
                    </div>
                    
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {selectedMovie.description}
                    </p>
                    
                    <button className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors">
                      <FaPlay size={14} />
                      <span>Watch Trailer</span>
                    </button>
                  </div>
                </div>
                
                {/* Showtimes */}
                <div className="bg-[#1F1F1F] p-6 rounded-xl">
                  <h3 className="text-xl font-semibold mb-6">Select Showtime</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {selectedMovie.showtimes?.map((showtime) => (
                      <button
                        key={showtime.id}
                        onClick={() => setSelectedTime(showtime)}
                        className={`py-3 px-4 rounded-lg transition-colors text-center ${
                          selectedTime?.id === showtime.id
                            ? 'bg-red-600 text-white'
                            : 'bg-[#0B0C10] hover:bg-[#2A2A2A] text-white'
                        }`}
                      >
                        {new Date(showtime.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Seat Selection */}
                {selectedTime && renderSeatSelection()}
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-[#1F1F1F] p-6 rounded-xl sticky top-8">
                  <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
                  
                  <div className="space-y-4 mb-8">
                    {selectedTime && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Showtime:</span>
                        <span>
                          {new Date(selectedTime.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tickets ({selectedSeats.length})</span>
                      <span>KSh {selectedMovie.price * selectedSeats.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Service Fee</span>
                      <span>KSh 100</span>
                    </div>
                    <div className="border-t border-gray-700 my-4"></div>
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>KSh {(selectedMovie.price * selectedSeats.length) + 100}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      if (!selectedTime) {
                        toast.error('Please select a showtime');
                        return;
                      }
                      if (selectedSeats.length === 0) {
                        toast.error('Please select at least one seat');
                        return;
                      }
                      setShowPaymentPage(true);
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-lg transition-colors text-lg font-medium"
                  >
                    Proceed to Payment
                  </button>
                  
                  {selectedSeats.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-gray-400 mb-2">Selected Seats</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedSeats.map(seat => (
                          <span key={seat} className="bg-[#0B0C10] px-3 py-1 rounded-full text-sm">
                            {seat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* M-Pesa Payment Modal */}
      {showPaymentPage && selectedMovie && (
        <MpesaPayment
          amount={(selectedMovie.price * selectedSeats.length) + 100}
          movieTitle={selectedMovie.title}
          seats={selectedSeats}
          onPaymentSuccess={handlePaymentSuccess}
          onCancel={() => setShowPaymentPage(false)}
        />
      )}

      {/* Footer */}
      <footer className="bg-[#1F1F1F] border-t border-[#2A2A2A] py-12 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">
                <span className="text-red-500">Cine</span>Reserve
              </h3>
              <p className="text-gray-400 text-sm">
                Your premium movie booking experience in Nairobi
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button className="hover:text-red-400 transition-colors">Home</button></li>
                <li><button className="hover:text-red-400 transition-colors">Movies</button></li>
                <li><button className="hover:text-red-400 transition-colors">Cinemas</button></li>
                <li><button className="hover:text-red-400 transition-colors">Offers</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Nairobi, Kenya</li>
                <li>info@cinerserve.com</li>
                <li>+254 700 123456</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <button className="text-gray-400 hover:text-red-400 transition-colors">
                  <FiFacebook />
                </button>
                <button className="text-gray-400 hover:text-red-400 transition-colors">
                  <FiTwitter />
                </button>
                <button className="text-gray-400 hover:text-red-400 transition-colors">
                  <FiInstagram />
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-[#2A2A2A] mt-8 pt-8 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} CineReserve. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserDashboard;