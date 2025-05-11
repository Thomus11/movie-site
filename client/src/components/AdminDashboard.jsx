import React, { useState , useEffect} from "react";
import { toast } from "react-toastify";
import {
  FiUsers,
  FiFilm,
  FiHome,
  FiDollarSign,
  FiPieChart,
  FiSettings,
  FiLogOut,
  FiCalendar,
  FiClock,
  FiMapPin,
} from "react-icons/fi";
import { FaFilm, FaTheaterMasks, FaUserCog } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import api from "../api";
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    location.href = "/";
  };
  const [showModal, setShowModal] = useState(false);
  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_preset"); // Cloudinary preset

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dlcjvoshi/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.secure_url;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const file = form.poster.files[0];
    const poster_url = await handleImageUpload(file);

    const payload = {
      title: form.title.value,
      description: form.description.value,
      genre: form.genre.value,
      release_date: form.release_date.value,
      poster_url,
    };

    // send payload to your backend
    await fetch("/api/movies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setShowModal(false);
    const newMovies = response.data.map((movie) => {
      // Define hardcoded values for known titles
      const overrides = {
        "Dune: Part Two": { runtime: "166 min", status: "showing", ticketsSold: 1245 },
        "The Batman": { runtime: "176 min", status: "showing", ticketsSold: 982 },
        "Furiosa": { runtime: "148 min", status: "coming soon", ticketsSold: 0 },
        "Avatar 3": { runtime: "190 min", status: "coming soon", ticketsSold: 0 },
      };

      return {
        ...movie,
        ...overrides[movie.title] || { runtime: "N/A", status: "coming soon", ticketsSold: 0 }
      };
    });

    // Merge logic: update if exists, else add
    const updatedMovies = [...movies];
    newMovies.forEach((newMovie) => {
      const index = updatedMovies.findIndex((m) => m.id === newMovie.id);
      if (index > -1) {
        updatedMovies[index] = newMovie;
      } else {
        updatedMovies.push(newMovie);
      }
    });

    setMovies(updatedMovies);
  };


  const [cinemas, setCinemas] = useState([]);

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const cinemas_response = await api.get("/api/cinemas");
        setCinemas(cinemas_response.data);
      } catch (error) {
        console.error("Failed to fetch cinemas:", error);
      }
    };

    fetchCinemas();
  }, []);

  const [movies, setMovies] = useState([
    {
      id: 1,
      title: "Dune: Part Two",
      genre: "Sci-Fi",
      runtime: "166 min",
      status: "showing",
      ticketsSold: 1245,
    },
    {
      id: 2,
      title: "The Batman",
      genre: "Action",
      runtime: "176 min",
      status: "showing",
      ticketsSold: 982,
    },
    {
      id: 3,
      title: "Furiosa",
      genre: "Action",
      runtime: "148 min",
      status: "coming soon",
      ticketsSold: 0,
    },
    {
      id: 4,
      title: "Avatar 3",
      genre: "Sci-Fi",
      runtime: "190 min",
      status: "coming soon",
      ticketsSold: 0,
    },
  ]);
  useEffect(()=> {
    const fetchmovies = async () => {
      try{
        const moviedata = await api.get('/api/movies')
        console.log(moviedata.data)
        setMovies(moviedata.data)
      } catch(error){
        console.log(`error: ${error}`)
      }
    }
    fetchmovies()
  }, [])

  const handeleDeleteMovies = async (id) => {
    try{
      const deleteMovie = await api.delete(`/movies/${id}`)
      // alert('Movie deleted succes')
      toast.success('Movie Deleted successfully')
      // fetchmovies()
    }catch(error){
      console.log(`delete error: ${error}`)
    }
    // console.log('clicked')
  }
  useEffect(() => {
    const fetchUsers = async () => {
      try{
        const userData = await api.get('/api/users')
        console.log(userData.data)
        setUsers(userData.data)
      } catch(error){
        console.log(`error: ${error}`)
      }
    }
    fetchUsers()
  }, [])
  const [users, setUsers] = useState([

  ]);

  const [revenueData, setRevenueData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue (KSh)",
        data: [1200000, 1900000, 1500000, 1800000, 2100000, 2300000],
        backgroundColor: "#ef4444",
      },
    ],
  });

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100 text-red-500 mr-4">
                  <FiDollarSign size={24} />
                </div>
                <div>
                  <p className="text-gray-500">Total Revenue</p>
                  <h3 className="text-2xl font-bold">KSh 12,450,000</h3>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                  <FiUsers size={24} />
                </div>
                <div>
                  <p className="text-gray-500">Total Users</p>
                  <h3 className="text-2xl font-bold">1,245</h3>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                  <FaFilm size={24} />
                </div>
                <div>
                  <p className="text-gray-500">Active Movies</p>
                  <h3 className="text-2xl font-bold">8</h3>
                </div>
              </div>
            </div>
          </div>
        );
      case "movies":
        return (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <form
                  onSubmit={handleSubmit}
                  className="bg-white p-6 rounded shadow-md w-96 space-y-4"
                >
                  <h2 className="text-xl font-semibold">Add New Movie</h2>
                  <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    required
                    className="w-full border px-3 py-2"
                  />
                  <textarea
                    name="description"
                    placeholder="Description"
                    required
                    className="w-full border px-3 py-2"
                  />
                  <input
                    type="text"
                    name="genre"
                    placeholder="Genre"
                    required
                    className="w-full border px-3 py-2"
                  />
                  <input
                    type="date"
                    name="release_date"
                    required
                    className="w-full border px-3 py-2"
                  />
                  <input
                    type="file"
                    name="poster"
                    accept="image/*"
                    required
                    className="w-full"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="ml-2 text-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-lg">Movie Management</h3>
              <button onClick={() => setShowModal(true)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                Add New Movie
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Genre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Runtime
                    </th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tickets Sold
                    </th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {movies.map((movie) => (
                    <tr key={movie.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {movie.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {movie.genre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {movie.duration}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            movie.status === "showing"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {movie.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {movie.ticketsSold}
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/* <button className="text-blue-500 hover:text-blue-700 mr-3">
                          Edit
                        </button> */}
                        <button onClick={() => handeleDeleteMovies(movie.id)} className="text-red-500 hover:text-red-700">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "cinemas":
        return (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-lg">Cinema Management</h3>
              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                Add New Cinema
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Screens
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cinemas.map((cinema) => (
                    <tr key={cinema.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {cinema.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {cinema.location}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        {cinema.screens}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            cinema.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {cinema.status}
                        </span>
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-red-500 hover:text-red-700">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "users":
        return (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-lg">User Management</h3>
              {/* <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                Add New User
              </button> */}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th> */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : user.role === "manager"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        {user.lastLogin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-red-500 hover:text-red-700">
                          Delete
                        </button>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-lg mb-6">System Settings</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  System Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                  defaultValue="CineReserve Admin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Ticket Price (KSh)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                  defaultValue="1200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maintenance Mode
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="maintenance"
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="maintenance"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Enable maintenance mode
                  </label>
                </div>
              </div>
              <div className="pt-4">
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">
            <span className="text-red-500">Cine</span>Reserve Admin
          </h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center p-3 rounded-lg ${
                  activeTab === "dashboard"
                    ? "bg-red-50 text-red-500"
                    : "hover:bg-gray-100"
                }`}
              >
                <FiHome className="mr-3" />
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("movies")}
                className={`w-full flex items-center p-3 rounded-lg ${
                  activeTab === "movies"
                    ? "bg-red-50 text-red-500"
                    : "hover:bg-gray-100"
                }`}
              >
                <FaFilm className="mr-3" />
                Movies
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("cinemas")}
                className={`w-full flex items-center p-3 rounded-lg ${
                  activeTab === "cinemas"
                    ? "bg-red-50 text-red-500"
                    : "hover:bg-gray-100"
                }`}
              >
                <FaTheaterMasks className="mr-3" />
                Cinemas
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("users")}
                className={`w-full flex items-center p-3 rounded-lg ${
                  activeTab === "users"
                    ? "bg-red-50 text-red-500"
                    : "hover:bg-gray-100"
                }`}
              >
                <FaUserCog className="mr-3" />
                Users
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center p-3 rounded-lg ${
                  activeTab === "settings"
                    ? "bg-red-50 text-red-500"
                    : "hover:bg-gray-100"
                }`}
              >
                <FiSettings className="mr-3" />
                Settings
              </button>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button
            onClick={() => handleLogout()}
            className="w-full flex items-center p-3 rounded-lg hover:bg-gray-100 text-red-500"
          >
            <FiLogOut className="mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold capitalize">{activeTab}</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white">
              AD
            </div>
          </div>
        </header>

        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
