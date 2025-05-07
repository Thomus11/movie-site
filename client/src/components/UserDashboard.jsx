import React, { useState } from 'react';
import { FiSearch, FiStar, FiClock, FiMapPin, FiCalendar, FiDollarSign, FiX, FiHome, FiUser, FiLogOut } from 'react-icons/fi';
import { FaPlay } from 'react-icons/fa';
import { FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';
import MpesaPayment from "../Pages/MpesaPayment";
import { toast } from "react-toastify";

const UserDashboard = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCinema, setActiveCinema] = useState('All');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showBookingPage, setShowBookingPage] = useState(false);
  const [showPaymentPage, setShowPaymentPage] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // User data
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+254712345678',
    reservations: [
      {
        id: 'RES001',
        movie: 'Dune: Part Two',
        cinema: 'Garden City Mall',
        date: '2024-05-15',
        time: '7:00 PM',
        seats: ['A3', 'A4'],
        amount: 2400,
        status: 'Confirmed'
      },
      {
        id: 'RES002',
        movie: 'The Batman',
        cinema: 'Sarit Centre',
        date: '2024-04-20',
        time: '3:30 PM',
        seats: ['B5'],
        amount: 1100,
        status: 'Completed'
      }
    ]
  });

  // Cinema data
  const cinemas = [
    {
      id: 1,
      name: 'Garden City Mall',
      location: 'Thika Road',
      image: '/cinemas/garden-city.jpg',
      features: ['IMAX', 'Dolby Atmos', 'VIP Lounges']
      },
      {
      id: 2,
      name: 'Sarit Centre',
      location: 'Westlands',
      image: '/cinemas/sarit.jpg',
      features: ['4DX', 'Gourmet Snacks']
      },
      {
      id: 3,
      name: 'Panari Sky Centre',
      location: 'Mombasa Road',
      image: '/cinemas/panari.jpg',
      features: ['Sky Deck', 'Kids Arena']
      },
      {
      id: 4,
      name: 'Prestige Plaza',
      location: 'Ngong Road',
      image: '/cinemas/prestige.jpg',
      features: ['Platinum Class', 'Wine Bar']
      }
  ];

  // Movies data
  const movies = {
    available: [

        {
        id: 1,
        title: "Dune: Part Two",
        genre: "Sci-Fi",
        rating: 4.8,
        duration: "166 min",
        cinemas: [1, 2, 3, 4],
        image: "/images/Available6.jpeg",
        description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
        showtimes: ["10:00 AM", "2:30 PM", "7:00 PM"],
        price: 1200
        },
        {
        id: 2,
        title: "The Batman",
        genre: "Action",
        rating: 4.5,
        duration: "176 min",
        cinemas: [1, 2, 4],
        image: "/images/Available7.jpeg",
        description: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate.",
        showtimes: ["11:00 AM", "3:30 PM", "8:00 PM"],
        price: 1100
        },
        {
        id: 3,
        title: "Until Dawn",
        genre: "Drama • Horror",
        rating: 4,
        duration: "112 min",
        cinemas: [1, 2, 3, 4],
        image: "/images/Available1.jpeg",
        description: "A group of friends trapped in a time loop, where mysterious foes chase and kill them in gruesome ways, must survive until dawn to escape it.",
        showtimes: ["10:00 AM", "2:30 PM", "7:00 PM"],
        price: 1000
        },
        {
        id: 4,
        title: "Sinners",
        genre: "Horror • Adventure",
        rating: 5,
        duration: "200 min",
        cinemas: [1, 2, 3, 4],
        image: "/images/Available2.jpeg",
        description: "Trying to leave their troubled lives behind, twin brothers return to their Mississippi hometown to start again, only to discover that an even greater evil is waiting to welcome them back.",
        showtimes: ["10:00 AM", "2:30 PM", "7:00 PM"],
        price: 1800
        },
        {
        id: 5,
        title: "The Accountant 2",
        genre: "Action • Thriller",
        rating: 4.5,
        duration: "180 min",
        cinemas: [1, 2, 4],
        image: "/images/Available3.jpeg",
        description: "Forensic accountant Christian Wolff teams up with his estranged but highly lethal brother to track down mysterious assassins",
        showtimes: ["11:00 AM", "3:30 PM", "8:00 PM"],
        price: 1200
        },
        {
        id: 6,
        title: "The Kings of Kings",
        genre: "Animation",
        rating: 3.8,
        duration: "100 min",
        cinemas: [1, 2, 4],
        image: "/images/Available4.jpeg",
        description: "Renowned writer Charles Dickens shares the story of Jesus Christ with his son, Walter. As his father narrates the stirring tale, Walter becomes captivated with the events of Jesus' life.",
        showtimes: ["11:00 AM", "3:30 PM", "8:00 PM"],
        price: 2000
        },
        
        
    ],
    comingSoon: [
      // ... (coming soon movies data remains the same)
      {
        id: 101,
        title: "Furiosa: A Mad Max Saga",
        genre: "Action",
        releaseDate: "2026-05-24",
        cinemas: [1, 2, 4],
        image: "/images/Available8.jpeg",
        description: "The origin story of renegade warrior Furiosa before she teamed up with Mad Max.",
        duration: "148 min"
        },
        {
        id: 102,
        title: "Kingdom of the Planet of the Apes",
        genre: "Sci-Fi",
        releaseDate: "2026-05-10",
        cinemas: [1, 3, 4],
        image: "/images/Available9.jpeg",
        description: "Many generations after Caesar's reign, apes are the dominant species living harmoniously.",
        duration: "145 min"
        },
        { 
        id: 103,
        title: "Mission: Impossible – Dead Reckoning Part Two", 
        genre: "Action/Thriller", 
        releaseDate: "2025-08-15",
        cinemas: [1, 3, 4],
        image: "/images/Soon1.jpeg",
        description: "Many generations after Caesar's reign, apes are the dominant species living harmoniously.",
        duration: "158 min"
        },
        { 
        id: 104,
        title: "Thunderbolts", 
        genre: "Action/Adventure",
        releaseDate: "2024-06-28",
        cinemas: [1, 3, 4],
        image: "/images/Soon2.jpeg",
        description: "Many generations after Caesar's reign, apes are the dominant species living harmoniously.",
        duration: "132 min"
        },
        { 
        id: 105,
        title: "Blade", 
        genre: "Action/Horror",
        releaseDate: "2024-09-06",
        cinemas: [1, 3, 4],
        image: "/images/Soon3.jpeg",
        description: "Many generations after Caesar's reign, apes are the dominant species living harmoniously.",
        duration: "132 min"
        },
        { 
        id: 106, 
        title: "Jurassic World Rebirth", 
        genre: "Action/Sci-fi",
        releaseDate: "2024-07-19",
        cinemas: [1, 3, 4],
        image: "/images/Soon4.jpeg", 
        description: "Many generations after Caesar's reign, apes are the dominant species living harmoniously.",
        duration: "132 min"
        },
        { 
        id: 107,
        title: "Fast X: Part 2", 
        genre: "Action/Thriller",
        releaseDate: "2024-08-02",
        cinemas: [1, 3, 4],
        image: "/images/Soon5.jpeg", 
        description: "Many generations after Caesar's reign, apes are the dominant species living harmoniously.",
        duration: "132 min"
        },
        { 
        id: 108,
        title: "Star Wars: Lost Horizons", 
        genre: "Sci-fi",
        releaseDate: "2024-12-18",
        cinemas: [1, 3, 4],
        image: "/images/Soon6.jpeg", 
        description: "Many generations after Caesar's reign, apes are the dominant species living harmoniously.",
        duration: "132 min"
        },
        { 
        image: "/images/Soon7.jpeg", 
        title: "Avatar: Fire & Ash", 
        genre: "Action/Sci-fi",
        releaseDate: "2025-03-21",
        cinemas: [1, 3, 4],
        image: "/images/Soon7.jpeg", 
        description: "Many generations after Caesar's reign, apes are the dominant species living harmoniously.",
        duration: "132 min"
        },
        { 
        id: 110,
        title: "Return of the Living Dead", 
        genre: "Horror/Comedy",
        releaseDate: "2024-10-25",
        cinemas: [1, 3, 4],
        image: "/images/Soon8.jpeg",
        description: "Many generations after Caesar's reign, apes are the dominant species living harmoniously.",
        duration: "132 min"
        }
        
    ]
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    // In a real app, you would also clear user session/tokens here
    console.log("User logged out");
    // Redirect to login page
    // navigate('/login');
  };

  // Handle profile click
  const handleProfileClick = () => {
    setShowProfile(!showProfile);
  };

  // Handle payment success
  const handlePaymentSuccess = (paymentDetails) => {
    // Create new reservation
    const newReservation = {
      id: `RES${Date.now().toString().slice(-6)}`,
      movie: selectedMovie.title,
      cinema: cinemas.find(c => c.id === parseInt(activeCinema))?.name || 'Unknown Cinema',
      date: new Date().toISOString().split('T')[0],
      time: selectedTime,
      seats: selectedSeats,
      amount: (selectedMovie.price * selectedSeats.length) + 100,
      status: 'Confirmed'
    };

    // Update user reservations
    setUser({
      ...user,
      reservations: [newReservation, ...user.reservations]
    });

    // Close payment and booking pages
    setShowPaymentPage(false);
    setShowBookingPage(false);
    
    // Reset selections
    setSelectedMovie(null);
    setSelectedSeats([]);
    setSelectedTime(null);

    // Show success message
    alert(`Booking confirmed!\nTransaction ID: ${paymentDetails.transactionId}\nAmount: KSh ${paymentDetails.amount}`);
  };

  // Filter movies safely
  const filteredMovies = {
    available: movies.available?.filter(movie => 
      (activeCinema === 'All' || movie.cinemas?.includes(parseInt(activeCinema))) &&
      (movie.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       movie.genre?.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [],
    comingSoon: movies.comingSoon?.filter(movie => 
      (activeCinema === 'All' || movie.cinemas?.includes(parseInt(activeCinema))) &&
      (movie.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       movie.genre?.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || []
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  // Seat selection component
  const renderSeatSelection = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0C10] to-[#1A1A2E] text-white">
      {/* Enhanced Navbar */}
      <header className="bg-[#1F1F1F]/90 backdrop-blur-md py-4 px-6 shadow-lg sticky top-0 z-50 border-b border-[#2A2A2A]">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold">
              <span className="text-red-500">Cine</span>Reserve
            </h1>
            
            <nav className="hidden md:flex space-x-6">
              <a href="/" className="flex items-center space-x-2 hover:text-red-400 transition-colors">
                <FiHome className="text-lg" />
                <span>Home</span>
              </a>
            </nav>
          </div>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-md mx-8">
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
          
          {/* User Controls */}
          <div className="flex items-center space-x-4 relative">
            <button 
              onClick={handleProfileClick}
              className="p-2 rounded-full hover:bg-[#2A2A2A] transition-colors relative"
            >
              <FiUser className="text-lg" />
              {showProfile && (
                <div className="absolute right-0 top-12 w-72 bg-[#1F1F1F] rounded-lg shadow-xl z-50 border border-[#2A2A2A]">
                  <div className="p-4 border-b border-[#2A2A2A]">
                    <h3 className="font-bold">{user.name}</h3>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                  <div className="p-4 border-b border-[#2A2A2A]">
                    <h4 className="font-semibold mb-2">My Reservations</h4>
                    {user.reservations.length > 0 ? (
                      <div className="space-y-3">
                        {user.reservations.map(reservation => (
                          <div key={reservation.id} className="text-sm bg-[#0B0C10] p-3 rounded-lg">
                            <div className="flex justify-between">
                              <span className="font-medium">{reservation.movie}</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                reservation.status === 'Confirmed' ? 'bg-green-500/20 text-green-400' : 
                                reservation.status === 'Completed' ? 'bg-blue-500/20 text-blue-400' : 
                                'bg-gray-500/20 text-gray-400'
                              }`}>
                                {reservation.status}
                              </span>
                            </div>
                            <div className="flex justify-between mt-1 text-gray-400">
                              <span>{reservation.cinema}</span>
                              <span>KSh {reservation.amount}</span>
                            </div>
                            <div className="flex justify-between mt-1 text-xs">
                              <span>{reservation.date} • {reservation.time}</span>
                              <span>Seats: {reservation.seats.join(', ')}</span>
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
        
        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="mt-4 md:hidden">
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
      </header>

      {/* Main Content */}
      <main className="max-w-screen-xl mx-auto py-8 px-6">
        {/* ... (rest of the main content remains the same until the booking page) ... */}
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
                      {filteredMovies.available?.length || 0} movies available
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredMovies.available?.map(movie => (
                      <div 
                        key={movie.id} 
                        className="bg-[#1F1F1F]/80 hover:bg-[#1F1F1F] rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-red-900/10 transition-all duration-300 border border-[#2A2A2A] hover:border-[#3A3A3A]"
                      >
                        <div className="relative h-72">
                          <img 
                            src={movie.image} 
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
                                {movie.duration}
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
                      {filteredMovies.comingSoon?.length || 0} movies coming
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredMovies.comingSoon?.map(movie => (
                      <div 
                        key={movie.id} 
                        className="bg-[#1F1F1F]/80 hover:bg-[#1F1F1F] rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-300 border border-[#2A2A2A] hover:border-[#3A3A3A]"
                      >
                        <div className="relative h-72">
                          <img 
                            src={movie.image} 
                            alt={movie.title} 
                            className="w-full h-full object-cover opacity-90"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-5">
                            <span className="bg-blue-500/90 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
                              <FiCalendar className="mr-1" size={12} />
                              {new Date(movie.releaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
        
        {/* Booking Page */}
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
                        src={selectedMovie.image} 
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
                          {selectedMovie.duration}
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
                      {selectedMovie.showtimes?.map((time, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedTime(time)}
                          className={`py-3 px-4 rounded-lg transition-colors text-center ${
                            selectedTime === time
                              ? 'bg-red-600 text-white'
                              : 'bg-[#0B0C10] hover:bg-[#2A2A2A] text-white'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Seat Selection - Only show if time is selected */}
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
                          <span>{selectedTime}</span>
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
                          alert('Please select a showtime');
                          return;
                        }
                        if (selectedSeats.length === 0) {
                          alert('Please select at least one seat');
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

        {/* M-Pesa Payment Page */}
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
        {/* ... (footer content remains the same) ... */}
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
                        <li><a href="#" className="hover:text-red-400 transition-colors">Home</a></li>
                        <li><a href="#" className="hover:text-red-400 transition-colors">Movies</a></li>
                        <li><a href="#" className="hover:text-red-400 transition-colors">Cinemas</a></li>
                        <li><a href="#" className="hover:text-red-400 transition-colors">Offers</a></li>
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
                        <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                          <FiFacebook />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                          <FiTwitter />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                          <FiInstagram />
                        </a>
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