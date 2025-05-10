import React, { useEffect } from "react";
import { Star, Ticket, Clock, Heart } from "lucide-react";
import { toast } from "react-toastify";

const movies = [
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
];

function AvailableNow() {
  useEffect(() => {
    const buttons = document.querySelectorAll("button span");
    buttons.forEach((span) => {
      if (span.textContent === "Reserve") {
        span.parentElement.addEventListener("click", (e) => {
          e.preventDefault();
          toast.error("Please login or sigh up to complete reservation");
        });
      }
    });
  }, []);

  return (
    <section className="bg-gradient-to-b from-[#0B0C10] to-[#1a1a1a] py-20 px-4 sm:px-6">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-16 relative">
          <h2 className="text-5xl font-bold text-white mb-4 font-['Bebas_Neue'] tracking-wider">
            NOW <span className="text-red-500">PLAYING</span>
          </h2>
          <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
        </div>

        <div className="relative">
          {/* Gradient Fades */}
          <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0B0C10] to-transparent z-10 pointer-events-none"></div>
          <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0B0C10] to-transparent z-10 pointer-events-none"></div>

          {/* Movie Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 overflow-x-auto pb-6 -mx-4 px-4 snap-x snap-mandatory">
            {movies.map((movie) => (
              <div 
                key={movie.id}
                className="snap-start flex-shrink-0 w-full sm:w-auto"
              >
                <div className="group relative bg-[#1F1F1F]/80 rounded-xl overflow-hidden shadow-2xl hover:shadow-red-900/30 transition-all duration-500 border border-gray-800 hover:border-red-500/30">
                  {/* Poster with Hover Effect */}
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <button className="absolute top-4 right-4 bg-black/60 p-2 rounded-full hover:bg-red-500 transition">
                        <Heart className="text-white" size={20} />
                      </button>
                      <p className="text-gray-300 text-sm flex items-center mb-2">
                        <Clock className="mr-1" size={16} /> 2h 15m
                      </p>
                      <p className="text-gray-200 text-sm line-clamp-3">
                      </p>
                    </div>
                  </div>

                  {/* Movie Info */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-white truncate">{movie.title}</h3>
                      <span className="bg-red-500/90 text-white text-xs font-bold px-2 py-1 rounded">
                        {movie.rating}/5
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {movie.genre.split('•').map((g, i) => (
                        <span key={i} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                          {g.trim()}
                        </span>
                      ))}
                    </div>

                    {/* Enhanced Rating */}
                    <div className="flex items-center mb-4">
                      <div className="flex mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < movie.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-600 text-gray-600"}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold text-lg">${movie.price}</span>
                      <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-full flex items-center transition-colors group">
                        <Ticket className="mr-2 transition-transform group-hover:rotate-[-10deg]" size={18} /> 
                        <span>Reserve</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Font */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        .font-['Bebas_Neue'] {
          font-family: 'Bebas Neue', cursive;
        }
        .snap-x {
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        .snap-start {
          scroll-snap-align: start;
        }
      `}</style>
    </section>
  );
}

export default AvailableNow;
