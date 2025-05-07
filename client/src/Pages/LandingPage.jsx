import React, { useState } from 'react';
import { Star, Ticket, Clock, Heart, MapPin, CalendarDays, Popcorn } from 'lucide-react';

const LandingPage = () => {
  const [activeCinema, setActiveCinema] = useState('Garden City');
  
  // Cinema data with locations and features
  const cinemas = [
    { 
      name: 'Garden City', 
      location: 'Thika Road', 
      features: ['IMAX', 'Dolby Atmos', 'VIP Lounges'],
      layout: 'grid'
    },
    { 
      name: 'Sarit Centre', 
      location: 'Westlands', 
      features: ['4DX', 'Gourmet Snacks'],
      layout: 'carousel'
    },
    { 
      name: 'Panari', 
      location: 'Mombasa Road', 
      features: ['Sky Deck', 'Kids Arena'],
      layout: 'masonry'
    },
    { 
      name: 'Prestige', 
      location: 'Ngong Road', 
      features: ['Platinum Class', 'Wine Bar'],
      layout: 'list'
    }
  ];

  // Complete movie database for all cinemas
  const cinemaMovies = {
    'Garden City': {
      available: [
        {
            id: 1,
            title: "Until Dawn",
            genre: "Drama • Horror",
            rating: 4,
            price: 12,
            image: "/images/Available1.jpeg",
          },
          {
            id: 2,
            title: "Sinners",
            genre: "Horror • Adventure",
            rating: 5,
            price: 15,
            image: "/images/Available2.jpeg",
          },
          {
            id: 3,
            title: "The Accountant 2",
            genre: "Action • Thriller",
            rating: 4,
            price: 13,
            image: "/images/Available3.jpeg",
          },
          {
            id: 4,
            title: "The Kings of Kings",
            genre: "Animation",
            rating: 5,
            price: 10,
            image: "/images/Available4.jpeg",
          },
      ],
      comingSoon: [
        { 
            image: "/images/Soon1.jpeg", 
            title: "Mission: Impossible – Dead Reckoning Part Two", 
            genre: "Action/Thriller",
            releaseDate: "2024-05-15",
            runtime: "158 min",
            director: "Christopher McQuarrie"
          },
          { 
            image: "/images/Soon2.jpeg", 
            title: "Thunderbolts", 
            genre: "Action/Adventure",
            releaseDate: "2024-06-28",
            runtime: "132 min",
            director: "Jake Schreier"
          },
          { 
            image: "/images/Soon3.jpeg", 
            title: "Blade", 
            genre: "Action/Horror",
            releaseDate: "2024-09-06",
            runtime: "125 min",
            director: "Yann Demange"
          },
          { 
            image: "/images/Soon4.jpeg", 
            title: "Jurassic World Rebirth", 
            genre: "Action/Sci-fi",
            releaseDate: "2024-07-19",
            runtime: "142 min",
            director: "Gareth Edwards"
          },
          { 
            image: "/images/Soon5.jpeg", 
            title: "Fast X: Part 2", 
            genre: "Action/Thriller",
            releaseDate: "2024-08-02",
            runtime: "138 min",
            director: "Louis Leterrier"
          },
          { 
            image: "/images/Soon6.jpeg", 
            title: "Star Wars: Lost Horizons", 
            genre: "Sci-fi",
            releaseDate: "2024-12-18",
            runtime: "155 min",
            director: "Sharmeen Obaid-Chinoy"
          },
          { 
            image: "/images/Soon7.jpeg", 
            title: "Avatar: Fire & Ash", 
            genre: "Action/Sci-fi",
            releaseDate: "2025-03-21",
            runtime: "192 min",
            director: "James Cameron"
          },
          { 
            image: "/images/Soon8.jpeg", 
            title: "Return of the Living Dead", 
            genre: "Horror/Comedy",
            releaseDate: "2024-10-25",
            runtime: "118 min",
            director: "Jordan Peele"
          }
      ]
    },
    'Sarit Centre': {
      available: [
        {
            id: 1,
            title: "Until Dawn",
            genre: "Drama • Horror",
            rating: 4,
            price: 12,
            image: "/images/Available1.jpeg",
          },
          {
            id: 2,
            title: "Sinners",
            genre: "Horror • Adventure",
            rating: 5,
            price: 15,
            image: "/images/Available2.jpeg",
          },
          {
            id: 3,
            title: "The Accountant 2",
            genre: "Action • Thriller",
            rating: 4,
            price: 13,
            image: "/images/Available3.jpeg",
          },
          {
            id: 4,
            title: "The Kings of Kings",
            genre: "Animation",
            rating: 5,
            price: 10,
            image: "/images/Available4.jpeg",
          },

      ],
      comingSoon: [
        { 
            image: "/images/Soon1.jpeg", 
            title: "Mission: Impossible – Dead Reckoning Part Two", 
            genre: "Action/Thriller",
            releaseDate: "2024-05-15",
            runtime: "158 min",
            director: "Christopher McQuarrie"
          },
          { 
            image: "/images/Soon2.jpeg", 
            title: "Thunderbolts", 
            genre: "Action/Adventure",
            releaseDate: "2024-06-28",
            runtime: "132 min",
            director: "Jake Schreier"
          },
          { 
            image: "/images/Soon3.jpeg", 
            title: "Blade", 
            genre: "Action/Horror",
            releaseDate: "2024-09-06",
            runtime: "125 min",
            director: "Yann Demange"
          },
          { 
            image: "/images/Soon4.jpeg", 
            title: "Jurassic World Rebirth", 
            genre: "Action/Sci-fi",
            releaseDate: "2024-07-19",
            runtime: "142 min",
            director: "Gareth Edwards"
          },
          { 
            image: "/images/Soon5.jpeg", 
            title: "Fast X: Part 2", 
            genre: "Action/Thriller",
            releaseDate: "2024-08-02",
            runtime: "138 min",
            director: "Louis Leterrier"
          },
          { 
            image: "/images/Soon6.jpeg", 
            title: "Star Wars: Lost Horizons", 
            genre: "Sci-fi",
            releaseDate: "2024-12-18",
            runtime: "155 min",
            director: "Sharmeen Obaid-Chinoy"
          },
          { 
            image: "/images/Soon7.jpeg", 
            title: "Avatar: Fire & Ash", 
            genre: "Action/Sci-fi",
            releaseDate: "2025-03-21",
            runtime: "192 min",
            director: "James Cameron"
          },
          { 
            image: "/images/Soon8.jpeg", 
            title: "Return of the Living Dead", 
            genre: "Horror/Comedy",
            releaseDate: "2024-10-25",
            runtime: "118 min",
            director: "Jordan Peele"
          }
        // Different coming soon for Sarit
      ]
    },
    // Similar structures for Panari and Prestige
    'Panari': {
        available: [
          {
              id: 1,
              title: "Until Dawn",
              genre: "Drama • Horror",
              rating: 4,
              price: 12,
              image: "/images/Available1.jpeg",
            },
            {
              id: 2,
              title: "Sinners",
              genre: "Horror • Adventure",
              rating: 5,
              price: 15,
              image: "/images/Available2.jpeg",
            },
            {
              id: 3,
              title: "The Accountant 2",
              genre: "Action • Thriller",
              rating: 4,
              price: 13,
              image: "/images/Available3.jpeg",
            },
            {
              id: 4,
              title: "The Kings of Kings",
              genre: "Animation",
              rating: 5,
              price: 10,
              image: "/images/Available4.jpeg",
            },
        ],
        comingSoon: [
          { 
              image: "/images/Soon1.jpeg", 
              title: "Mission: Impossible – Dead Reckoning Part Two", 
              genre: "Action/Thriller",
              releaseDate: "2024-05-15",
              runtime: "158 min",
              director: "Christopher McQuarrie"
            },
            { 
              image: "/images/Soon2.jpeg", 
              title: "Thunderbolts", 
              genre: "Action/Adventure",
              releaseDate: "2024-06-28",
              runtime: "132 min",
              director: "Jake Schreier"
            },
            { 
              image: "/images/Soon3.jpeg", 
              title: "Blade", 
              genre: "Action/Horror",
              releaseDate: "2024-09-06",
              runtime: "125 min",
              director: "Yann Demange"
            },
            { 
              image: "/images/Soon4.jpeg", 
              title: "Jurassic World Rebirth", 
              genre: "Action/Sci-fi",
              releaseDate: "2024-07-19",
              runtime: "142 min",
              director: "Gareth Edwards"
            },
            { 
              image: "/images/Soon5.jpeg", 
              title: "Fast X: Part 2", 
              genre: "Action/Thriller",
              releaseDate: "2024-08-02",
              runtime: "138 min",
              director: "Louis Leterrier"
            },
            { 
              image: "/images/Soon6.jpeg", 
              title: "Star Wars: Lost Horizons", 
              genre: "Sci-fi",
              releaseDate: "2024-12-18",
              runtime: "155 min",
              director: "Sharmeen Obaid-Chinoy"
            },
            { 
              image: "/images/Soon7.jpeg", 
              title: "Avatar: Fire & Ash", 
              genre: "Action/Sci-fi",
              releaseDate: "2025-03-21",
              runtime: "192 min",
              director: "James Cameron"
            },
            { 
              image: "/images/Soon8.jpeg", 
              title: "Return of the Living Dead", 
              genre: "Horror/Comedy",
              releaseDate: "2024-10-25",
              runtime: "118 min",
              director: "Jordan Peele"
            }
        ]
      },
      'Prestige': {
        available: [
          {
              id: 1,
              title: "Until Dawn",
              genre: "Drama • Horror",
              rating: 4,
              price: 12,
              image: "/images/Available1.jpeg",
            },
            {
              id: 2,
              title: "Sinners",
              genre: "Horror • Adventure",
              rating: 5,
              price: 15,
              image: "/images/Available2.jpeg",
            },
            {
              id: 3,
              title: "The Accountant 2",
              genre: "Action • Thriller",
              rating: 4,
              price: 13,
              image: "/images/Available3.jpeg",
            },
            {
              id: 4,
              title: "The Kings of Kings",
              genre: "Animation",
              rating: 5,
              price: 10,
              image: "/images/Available4.jpeg",
            },
  
        ],
        comingSoon: [
          { 
              image: "/images/Soon1.jpeg", 
              title: "Mission: Impossible – Dead Reckoning Part Two", 
              genre: "Action/Thriller",
              releaseDate: "2024-05-15",
              runtime: "158 min",
              director: "Christopher McQuarrie"
            },
            { 
              image: "/images/Soon2.jpeg", 
              title: "Thunderbolts", 
              genre: "Action/Adventure",
              releaseDate: "2024-06-28",
              runtime: "132 min",
              director: "Jake Schreier"
            },
            { 
              image: "/images/Soon3.jpeg", 
              title: "Blade", 
              genre: "Action/Horror",
              releaseDate: "2024-09-06",
              runtime: "125 min",
              director: "Yann Demange"
            },
            { 
              image: "/images/Soon4.jpeg", 
              title: "Jurassic World Rebirth", 
              genre: "Action/Sci-fi",
              releaseDate: "2024-07-19",
              runtime: "142 min",
              director: "Gareth Edwards"
            },
            { 
              image: "/images/Soon5.jpeg", 
              title: "Fast X: Part 2", 
              genre: "Action/Thriller",
              releaseDate: "2024-08-02",
              runtime: "138 min",
              director: "Louis Leterrier"
            },
            { 
              image: "/images/Soon6.jpeg", 
              title: "Star Wars: Lost Horizons", 
              genre: "Sci-fi",
              releaseDate: "2024-12-18",
              runtime: "155 min",
              director: "Sharmeen Obaid-Chinoy"
            },
            { 
              image: "/images/Soon7.jpeg", 
              title: "Avatar: Fire & Ash", 
              genre: "Action/Sci-fi",
              releaseDate: "2025-03-21",
              runtime: "192 min",
              director: "James Cameron"
            },
            { 
              image: "/images/Soon8.jpeg", 
              title: "Return of the Living Dead", 
              genre: "Horror/Comedy",
              releaseDate: "2024-10-25",
              runtime: "118 min",
              director: "Jordan Peele"
            }
        ]
  }
  }

  // Days until release calculation
  const getDaysUntilRelease = (dateString) => {
    const releaseDate = new Date(dateString);
    const today = new Date();
    const diffTime = releaseDate - today;
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  // Get release status text
  const getReleaseStatus = (days) => {
    if (days === 0) return "Opening today!";
    if (days === 1) return "Tomorrow!";
    if (days <= 7) return "Next week!";
    return `In ${days} days`;
  };

  // Render movie card based on layout
  const renderMovieCard = (movie, isComingSoon = false) => {
    return (
      <div className={`relative group rounded-xl overflow-hidden transition-all duration-500 ${
        isComingSoon ? 'border border-blue-500/30' : 'border border-red-500/30'
      } ${activeCinema === 'Panari' ? 'mb-6' : ''}`}>
        
        {/* Movie Poster */}
        <div className={`relative ${
          activeCinema === 'Garden City' ? 'h-80' : 
          activeCinema === 'Sarit Centre' ? 'h-64' :
          activeCinema === 'Panari' ? 'h-96' : 'h-48'
        } overflow-hidden`}>
          <img
            src={movie.image}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {isComingSoon && (
            <div className={`absolute top-4 left-4 text-sm font-bold px-3 py-1 rounded-full flex items-center ${
              getDaysUntilRelease(movie.releaseDate) <= 7 ? 'bg-blue-500/90 text-white' : 'bg-black/80 text-blue-400'
            }`}>
              <CalendarDays className="mr-1 w-4 h-4" />
              {getReleaseStatus(getDaysUntilRelease(movie.releaseDate))}
            </div>
          )}
        </div>

        {/* Movie Info - Different layouts per cinema */}
        <div className={`${
          activeCinema === 'Garden City' ? 'p-6' :
          activeCinema === 'Sarit Centre' ? 'p-4' :
          activeCinema === 'Panari' ? 'absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-6 flex flex-col justify-end' :
          'p-4 flex items-center'
        }`}>
          
          <h3 className={`${
            activeCinema === 'Garden City' ? 'text-xl font-bold' :
            activeCinema === 'Sarit Centre' ? 'text-lg font-semibold' :
            activeCinema === 'Panari' ? 'text-2xl font-bold' :
            'text-base font-medium'
          } text-white mb-2 line-clamp-2`}>
            {movie.title}
          </h3>
          
          {activeCinema !== 'Prestige' && (
            <div className="flex flex-wrap gap-1 mb-3">
              {movie.genre.split('/').map((g, i) => (
                <span key={i} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                  {g.trim()}
                </span>
              ))}
            </div>
          )}

          {!isComingSoon && activeCinema !== 'Prestige' && (
            <div className="flex items-center mb-4">
              <div className="flex mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(movie.rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-600 text-gray-600"}
                  />
                ))}
              </div>
              <span className="text-gray-300 text-sm">({(movie.rating * 20).toFixed(0)} reviews)</span>
            </div>
          )}

          <div className={`${
            activeCinema === 'Prestige' ? 'ml-4' : ''
          }`}>
            {!isComingSoon ? (
              <div className="flex justify-between items-center">
                <span className="text-white font-bold">KSh {movie.price.toLocaleString()}</span>
                <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-full flex items-center transition-colors">
                  <Ticket className="mr-2" size={18} /> Book
                </button>
              </div>
            ) : (
              <button className="w-full bg-transparent hover:bg-blue-500/10 text-blue-500 font-medium py-2 px-4 rounded-lg border border-blue-500/30 flex items-center justify-center transition-colors">
                <CalendarDays className="mr-2" size={18} /> Notify Me
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#0B0C10] min-h-screen">
      {/* Cinema Selector */}
      <div className="pt-12 pb-8 px-6 overflow-x-auto bg-gradient-to-b from-black to-[#0B0C10] sticky top-0 z-10">
      <div className="flex justify-center">
        <div className="flex space-x-4 min-w-max">
          {cinemas.map((cinema) => (
            <button
              key={cinema.name}
              onClick={() => setActiveCinema(cinema.name)}
              className={`flex flex-col items-center px-8 py-4 rounded-xl transition-all ${
                activeCinema === cinema.name
                  ? 'bg-red-600 shadow-lg shadow-red-900/50'
                  : 'bg-[#1F1F1F] hover:bg-[#2A2A2A]'
              }`}
            >
              <MapPin className={`w-6 h-6 mb-2 ${
                activeCinema === cinema.name ? 'text-white' : 'text-red-500'
              }`} />
              <span className="font-bold text-white">{cinema.name}</span>
              <span className="text-xs text-gray-300 mt-1">{cinema.location}</span>
            </button>
          ))}
        </div>
    </div>
  </div>

      {/* Cinema Features */}
      <div className="px-6 py-4 bg-[#1F1F1F] mb-8">
        <div className="max-w-screen-xl mx-auto">
          <h3 className="text-white font-bold mb-2">Cinema Features:</h3>
          <div className="flex flex-wrap gap-2">
            {cinemas.find(c => c.name === activeCinema).features.map((feature, i) => (
              <span key={i} className="bg-red-500/20 text-red-400 text-xs px-3 py-1 rounded-full">
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Movie Display */}
      <div className="px-6 pb-20 max-w-screen-xl mx-auto">
        {/* Available Now Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="w-4 h-4 bg-red-500 rounded-full mr-3"></span>
            Currently Showing at {activeCinema}
          </h2>
          
          {activeCinema === 'Garden City' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {cinemaMovies[activeCinema].available.map((movie) => (
                renderMovieCard(movie)
              ))}
            </div>
          )}
          
          {activeCinema === 'Sarit Centre' && (
            <div className="flex overflow-x-auto pb-6 -mx-6 px-6">
              <div className="flex space-x-6">
                {cinemaMovies[activeCinema].available.map((movie) => (
                  <div key={movie.id} className="flex-shrink-0 w-64">
                    {renderMovieCard(movie)}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeCinema === 'Panari' && (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-8">
              {cinemaMovies[activeCinema].available.map((movie) => (
                <div key={movie.id} className="break-inside-avoid mb-8">
                  {renderMovieCard(movie)}
                </div>
              ))}
            </div>
          )}
          
          {activeCinema === 'Prestige' && (
            <div className="space-y-6">
              {cinemaMovies[activeCinema].available.map((movie) => (
                <div key={movie.id} className="flex bg-[#1F1F1F]/80 rounded-xl overflow-hidden">
                  <div className="w-1/3 flex-shrink-0">
                    <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6 w-2/3">
                    <h3 className="text-xl font-bold text-white mb-2">{movie.title}</h3>
                    <div className="flex items-center mb-4">
                      <div className="flex mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < Math.floor(movie.rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-600 text-gray-600"}
                          />
                        ))}
                      </div>
                      <span className="text-gray-300 text-sm">({movie.rating}/5)</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {movie.genre.split('/').map((g, i) => (
                        <span key={i} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                          {g.trim()}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-300 text-sm">Director: {movie.director}</p>
                        <p className="text-gray-300 text-sm">Runtime: {movie.runtime}</p>
                      </div>
                      <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-full">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Coming Soon Section */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="w-4 h-4 bg-blue-500 rounded-full mr-3"></span>
            Coming Soon to {activeCinema}
          </h2>
          
          {activeCinema === 'Garden City' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {cinemaMovies[activeCinema].comingSoon.map((movie) => (
                renderMovieCard(movie, true)
              ))}
            </div>
          )}
          {activeCinema === 'Sarit Center' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {cinemaMovies[activeCinema].comingSoon.map((movie) => (
                renderMovieCard(movie, true)
              ))}
            </div>
          )}
          {activeCinema === 'Panari' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {cinemaMovies[activeCinema].comingSoon.map((movie) => (
                renderMovieCard(movie, true)
              ))}
            </div>
          )}
          {activeCinema === 'Prestige' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {cinemaMovies[activeCinema].comingSoon.map((movie) => (
                renderMovieCard(movie, true)
              ))}
            </div>
          )}
          {/* Other cinema layouts for coming soon... */}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black py-8 text-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} Nairobi Cinema Experience</p>
        <p className="mt-2">Garden City • Sarit Centre • Panari • Prestige</p>
      </div>

      {/* Custom Font */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600&display=swap');
        body {
          font-family: 'Inter', sans-serif;
        }
        .font-bebas {
          font-family: 'Bebas Neue', cursive;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;