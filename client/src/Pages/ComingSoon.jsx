import React from "react";
import { CalendarDays, Clock, Popcorn, Bell } from "lucide-react";
import { toast } from "react-toastify";

const ComingSoon = () => {
  const movies = [
    {
      image: "/images/Soon1.jpeg",
      title: "Mission: Impossible – Dead Reckoning Part Two",
      genre: "Action/Thriller",
      releaseDate: "2024-05-15",
      runtime: "158 min",
      director: "Christopher McQuarrie",
      trailerLink: "https://www.youtube.com/watch?v=example1",
    },
    {
      image: "/images/Soon2.jpeg",
      title: "Thunderbolts",
      genre: "Action/Adventure",
      releaseDate: "2024-06-28",
      runtime: "132 min",
      director: "Jake Schreier",
      trailerLink: "https://www.youtube.com/watch?v=example2",
    },
    {
      image: "/images/Soon3.jpeg",
      title: "Blade",
      genre: "Action/Horror",
      releaseDate: "2024-09-06",
      runtime: "125 min",
      director: "Yann Demange",
      trailerLink: "https://www.youtube.com/watch?v=example3",
    },
    {
      image: "/images/Soon4.jpeg",
      title: "Jurassic World Rebirth",
      genre: "Action/Sci-fi",
      releaseDate: "2024-07-19",
      runtime: "142 min",
      director: "Gareth Edwards",
      trailerLink: "https://www.youtube.com/watch?v=example4",
    },
    {
      image: "/images/Soon5.jpeg",
      title: "Fast X: Part 2",
      genre: "Action/Thriller",
      releaseDate: "2024-08-02",
      runtime: "138 min",
      director: "Louis Leterrier",
      trailerLink: "https://www.youtube.com/watch?v=example5",
    },
    {
      image: "/images/Soon6.jpeg",
      title: "Star Wars: Lost Horizons",
      genre: "Sci-fi",
      releaseDate: "2024-12-18",
      runtime: "155 min",
      director: "Sharmeen Obaid-Chinoy",
      trailerLink: "https://www.youtube.com/watch?v=example6",
    },
    {
      image: "/images/Soon7.jpeg",
      title: "Avatar: Fire & Ash",
      genre: "Action/Sci-fi",
      releaseDate: "2025-03-21",
      runtime: "192 min",
      director: "James Cameron",
      trailerLink: "https://www.youtube.com/watch?v=example7",
    },
    {
      image: "/images/Soon8.jpeg",
      title: "Return of the Living Dead",
      genre: "Horror/Comedy",
      releaseDate: "2024-10-25",
      runtime: "118 min",
      director: "Jordan Peele",
      trailerLink: "https://www.youtube.com/watch?v=example8",
    },
  ];

  const getDaysUntilRelease = (dateString) => {
    const releaseDate = new Date(dateString);
    const today = new Date();
    const diffTime = releaseDate - today;
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const getReleaseStatus = (days, dateString) => {
    if (days === 0) return "Opening today!";
    if (days === 1) return "Tomorrow!";
    if (days <= 7) return "Next week!";
    if (days <= 30) return `In ${days} days`;
    return `Coming ${new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
    })}`;
  };

  const handleRemindMe = (movieTitle) => {
    toast.info(`We'll remind you about "${movieTitle}" as the release date approaches!`);
  };

  const handleTrailerClick = (trailerLink) => {
    window.open(trailerLink, "_blank");
  };

  return (
    <section className="bg-gradient-to-b from-[#0B0C10] to-[#1a1a1a] py-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
        <Popcorn className="absolute top-20 right-10 text-red-500/10 w-32 h-32" />
        <Popcorn className="absolute bottom-20 left-10 text-red-500/10 w-32 h-32 transform rotate-180" />
      </div>

      <div className="max-w-screen-xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4 font-['Bebas_Neue'] tracking-wider">
            COMING <span className="text-red-500">ATTRACTIONS</span>
          </h2>
          <p className="text-lg text-gray-300 mt-3 flex justify-center items-center">
            <Clock className="mr-2 w-5 h-5 text-red-500" />
            Upcoming theatrical releases
          </p>
        </div>

        {/* Movie Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {movies.map((movie, index) => {
            const daysUntilRelease = getDaysUntilRelease(movie.releaseDate);
            const releaseStatus = getReleaseStatus(daysUntilRelease, movie.releaseDate);

            return (
              <div
                key={index}
                className="group relative bg-[#1F1F1F]/90 rounded-xl overflow-hidden shadow-lg hover:shadow-red-900/30 transition-all duration-500 border border-gray-800 hover:border-red-500/30"
              >
                {/* Poster with Countdown */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div
                    className={`absolute top-4 left-4 text-sm font-bold px-3 py-1 rounded-full flex items-center ${
                      daysUntilRelease <= 7
                        ? "bg-red-500/90 text-white"
                        : "bg-black/80 text-red-400"
                    }`}
                  >
                    <CalendarDays className="mr-1 w-4 h-4" />
                    {releaseStatus}
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 leading-tight">
                    {movie.title}
                  </h3>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {movie.genre.split("/").map((g, i) => (
                      <span
                        key={i}
                        className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded"
                      >
                        {g.trim()}
                      </span>
                    ))}
                  </div>

                  <div className="text-sm text-gray-400 mb-3">
                    <p className="truncate">Director: {movie.director}</p>
                    <div className="flex justify-between mt-1">
                      <span>{movie.runtime}</span>
                      <span className="text-red-400 font-medium">
                        {new Date(movie.releaseDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleRemindMe(movie.title)}
                      className="flex-1 bg-transparent hover:bg-red-500/10 text-red-500 font-medium py-2 px-3 rounded-lg border border-red-500/30 flex items-center justify-center transition-colors text-sm"
                    >
                      <Bell className="mr-2 w-4 h-4" />
                      Remind Me
                    </button>
                    <button
                      onClick={() => handleTrailerClick(movie.trailerLink)}
                      className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                    >
                      Trailer
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Font Import */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap");
        .font-['Bebas_Neue'] {
          font-family: 'Bebas Neue', cursive;
        }
      `}</style>
    </section>
  );
};

export default ComingSoon;
