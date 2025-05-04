import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/ui/Navbar";

const availableMovies = [
  {
    id: 1,
    title: "Until Dawn",
    genre: "Drama • Horror",
    rating: 4,
    runtime: "1h 57m",
    price: 1200,
    image: "/images/Available1.jpeg",
  },
  {
    id: 2,
    title: "Sinners",
    genre: "Horror • Adventure",
    rating: 5,
    runtime: "2h 05m",
    price: 1500,
    image: "/images/Available2.jpeg",
  },
  {
    id: 3,
    title: "The Accountant 2",
    genre: "Action • Thriller",
    rating: 4,
    runtime: "2h 11m",
    price: 1300,
    image: "/images/Available3.jpeg",
  },
  {
    id: 4,
    title: "The Kings of Kings",
    genre: "Animation",
    rating: 5,
    runtime: "1h 34m",
    price: 1000,
    image: "/images/Available4.jpeg",
  },
];

const comingSoonMovies = [
  { image: "/images/Soon1.jpeg", title: "Mission: Impossible – Dead Reckoning Part Two", description: "Action/Thriller." },
  { image: "/images/Soon2.jpeg", title: "Thunderbolts", description: "Action/Adventure." },
  { image: "/images/Soon3.jpeg", title: "Blade", description: "Action/Horror." },
  { image: "/images/Soon4.jpeg", title: "Jurassic World Rebirth", description: "Action/Sci-fi." },
  { image: "/images/Soon5.jpeg", title: "Fast X: Part 2", description: "Action/Thriller." },
  { image: "/images/Soon6.jpeg", title: "Star Wars: Lost Horizons", description: "Sci-fi." },
  { image: "/images/Soon7.jpeg", title: "Avatar: Fire & Ash", description: "Action/Sci-fi." },
  { image: "/images/Soon8.jpeg", title: "Return of the Living Dead", description: "Horror/Comedy." },
];

const branches = ["Sarit", "Garden City", "Junction Mall", "Panari"];

const fadeInVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
    },
  }),
};

export default function UserDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  return (
    <div className="bg-[#0B0C10] min-h-screen pb-20">
      <Navbar />
      <div className="pt-28" />

      <div className="max-w-screen-xl mx-auto px-6 space-y-24">
        {branches.map((branch, index) => (
          <section key={index}>
            <h2 className="text-white text-4xl font-bold mb-10 border-l-4 pl-4 border-[#6a040f]">
              {branch} Branch
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {availableMovies.map((movie, i) => (
                <motion.div
                  key={movie.id + branch}
                  className="bg-[#1F1F1F] rounded-2xl overflow-hidden shadow-lg"
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInVariant}
                >
                  <img src={movie.image} alt={movie.title} className="w-full h-56 object-cover" />
                  <div className="p-6 flex flex-col justify-between h-[270px]">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{movie.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">{movie.genre}</p>
                      <p className="text-sm text-gray-400">Runtime: {movie.runtime}</p>
                      <div className="flex justify-center mt-3">
                        {Array(5).fill().map((_, i) => (
                          <span key={i} className={i < movie.rating ? "text-[#D4AF37]" : "text-gray-600"}>
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="text-base text-gray-300 mt-2">From KES {movie.price}</p>
                    </div>
                    <button
                      onClick={() => setSelectedMovie(movie)}
                      className="mt-4 bg-[#8B0000] text-white font-bold text-lg py-2 rounded-full hover:bg-[#a10000] transition"
                    >
                      Get Tickets
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))}

        {/* Coming Soon Section */}
        <section>
          <h2 className="text-white text-4xl font-bold mb-10 border-l-4 pl-4 border-[#6a040f]">
            Coming Soon
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            {comingSoonMovies.map((movie, index) => (
              <motion.div
                key={index}
                className="bg-[#1F1F1F] p-6 rounded-2xl hover:scale-105 transition shadow-md"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <img src={movie.image} alt={movie.title} className="w-full h-56 object-cover rounded-xl mb-4" />
                <h3 className="text-white text-xl font-semibold mb-2">{movie.title}</h3>
                <p className="text-sm text-gray-400">{movie.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Modal (Placeholder) */}
      {selectedMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-[90%] max-w-md text-black relative">
            <h2 className="text-2xl font-bold mb-4">Book Tickets for {selectedMovie.title}</h2>
            <p><strong>Price:</strong> KES {selectedMovie.price}</p>
            <p><strong>Runtime:</strong> {selectedMovie.runtime}</p>
            <p><strong>Genre:</strong> {selectedMovie.genre}</p>
            {/* Placeholder - form can be added here */}
            <button
              onClick={() => setSelectedMovie(null)}
              className="mt-6 bg-[#8B0000] text-white px-4 py-2 rounded hover:bg-[#a10000]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

