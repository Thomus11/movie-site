from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from models import db, User, Movie, Showtime, Seat, Reservation
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from resend.emails._emails import Emails
import cloudinary
import cloudinary.uploader
from datetime import timedelta, datetime
from humanize import naturaltime
from dotenv import load_dotenv
from flask_cors import CORS
import os
import re  # For manual email validation

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cinema.db'
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['RESEND_API_KEY'] = os.getenv('RESEND_API_KEY')
app.config['CLOUDINARY_CLOUD_NAME'] = os.getenv('CLOUDINARY_CLOUD_NAME')
app.config['CLOUDINARY_API_KEY'] = os.getenv('CLOUDINARY_API_KEY')
app.config['CLOUDINARY_API_SECRET'] = os.getenv('CLOUDINARY_API_SECRET')

# Initialize extensions
db.init_app(app)
jwt = JWTManager(app)

# JWT Error Handlers
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({"message": "The token has expired"}), 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({"message": "Invalid token"}), 422

@jwt.unauthorized_loader
def missing_token_callback(error):
    return jsonify({"message": "Request does not contain an access token"}), 401

@jwt.revoked_token_loader
def revoked_token_callback(jwt_header, jwt_payload):
    return jsonify({"message": "The token has been revoked"}), 401
cloudinary.config(
    cloud_name=app.config['CLOUDINARY_CLOUD_NAME'],
    api_key=app.config['CLOUDINARY_API_KEY'],
    api_secret=app.config['CLOUDINARY_API_SECRET']
)

# Error Handling
@app.errorhandler(404)
def not_found(error):
    return jsonify({"message": "Resource not found"}), 404

@app.errorhandler(400)
def bad_request(error):
    return jsonify({"message": "Bad request", "errors": error.description}), 400

@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({"message": "Internal server error"}), 500

# Initialize Resend client
resend = Emails()

# Helper Functions
def send_email(to_email, subject, content):
    try:
        message = resend.Emails.send(
            from_='mainathomas827@gmail.com',
            to=to_email,
            subject=subject,
            text=content
        )
        return message.id
    except Exception as e:
        return str(e)

def validate_email(email):
    """Validate email format using regex."""
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return False
    return True


# Helper function to validate strong password
def is_strong_password(password):
    return (
        len(password) >= 8 and
        re.search(r"[A-Z]", password) and
        re.search(r"[a-z]", password) and
        re.search(r"\d", password) and
        re.search(r"[!@#$%^&*(),.?\":{}|<>]", password)
    )

# Register a new user
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or len(username) > 80:
        return jsonify({"message": "Username is required and must be <= 80 characters"}), 400
    if not email or not validate_email(email):
        return jsonify({"message": "Invalid email address"}), 400
    if not password:
        return jsonify({"message": "Password is required"}), 400
    if not is_strong_password(password):
        return jsonify({
            "message": "Password must be at least 8 characters long, include an uppercase letter, "
                       "a lowercase letter, a number, and a special character."
        }), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"message": "Username already exists"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({
            "message": "An account with this email already exists. Please sign in or use a different email address."
        }), 400

    user = User(username=username, email=email, role='user')  # always default to user
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201


# Login and generate JWT token
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({"message": "We couldn't verify your credentials. Please check your email and password"}), 401

    access_token = create_access_token(identity=user.id, expires_delta=timedelta(hours=1))
    return jsonify({
        "access_token": access_token,
        "role": user.role,
        "username": user.username
    }), 200


# Promote a user to admin (Admin only)
@app.route('/users/promote/<int:user_id>', methods=['POST'])
@jwt_required()
def promote_user(user_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if current_user.role != 'admin':
        return jsonify({"message": "Admin access required"}), 403

    user = User.query.get_or_404(user_id)
    user.role = 'admin'
    db.session.commit()

    return jsonify({"message": f"User {user.username} promoted to admin"}), 200

# Create a new movie (Admin only)
@app.route('/movies', methods=['POST'])
@jwt_required()
def create_movie():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role != 'admin':
        return jsonify({"message": "Admin access required"}), 403

    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    poster_url = data.get('poster_url')
    genre = data.get('genre')
    release_date = data.get('release_date')

    # Validation
    if not all([title, description, poster_url, genre, release_date]):
        return jsonify({"message": "Missing required fields"}), 400
    if len(title) > 200:
        return jsonify({"message": "Title must be <= 200 characters"}), 400
    if len(description) > 1000:
        return jsonify({"message": "Description must be <= 1000 characters"}), 400
    if len(genre) > 50:
        return jsonify({"message": "Genre must be <= 50 characters"}), 400
    try:
        release_date = datetime.strptime(release_date, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({"message": "Invalid release date format. Use YYYY-MM-DD"}), 400

    movie = Movie(
        title=title,
        description=description,
        poster_url=poster_url,
        genre=genre,
        release_date=release_date
    )
    db.session.add(movie)
    db.session.commit()

    return jsonify({"message": "Movie created successfully", "movie_id": movie.id}), 201

# Update a movie (Admin only)
@app.route('/movies/<int:movie_id>', methods=['PUT'])
@jwt_required()
def update_movie(movie_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role != 'admin':
        return jsonify({"message": "Admin access required"}), 403

    movie = Movie.query.get_or_404(movie_id)
    data = request.get_json()

    # Validation
    if 'title' in data and len(data['title']) > 200:
        return jsonify({"message": "Title must be <= 200 characters"}), 400
    if 'description' in data and len(data['description']) > 1000:
        return jsonify({"message": "Description must be <= 1000 characters"}), 400
    if 'genre' in data and len(data['genre']) > 50:
        return jsonify({"message": "Genre must be <= 50 characters"}), 400
    if 'release_date' in data:
        try:
            data['release_date'] = datetime.strptime(data['release_date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({"message": "Invalid release date format. Use YYYY-MM-DD"}), 400

    movie.title = data.get('title', movie.title)
    movie.description = data.get('description', movie.description)
    movie.poster_url = data.get('poster_url', movie.poster_url)
    movie.genre = data.get('genre', movie.genre)
    movie.release_date = data.get('release_date', movie.release_date)

    db.session.commit()

    return jsonify({"message": "Movie updated successfully"}), 200

# Delete a movie (Admin only)
@app.route('/movies/<int:movie_id>', methods=['DELETE'])
@jwt_required()
def delete_movie(movie_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role != 'admin':
        return jsonify({"message": "Admin access required"}), 403

    movie = Movie.query.get_or_404(movie_id)
    db.session.delete(movie)
    db.session.commit()

    return jsonify({"message": "Movie deleted successfully"}), 200

# Fetch movies by genre and/or title
@app.route('/movies/search', methods=['GET'])
@jwt_required()
def search_movies():
    genre = request.args.get('genre')
    title = request.args.get('title')

    query = Movie.query
    if genre:
        query = query.filter(Movie.genre.ilike(f"%{genre}%"))
    if title:
        query = query.filter(Movie.title.ilike(f"%{title}%"))

    movies = query.all()
    return jsonify([movie.to_dict() for movie in movies]), 200

# Get paginated list of movies
@app.route('/movies', methods=['GET'])
@jwt_required()
def get_movies():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    pagination = Movie.query.paginate(page=page, per_page=per_page, error_out=False)
    movies = pagination.items

    return jsonify({
        "movies": [movie.to_dict() for movie in movies],
        "total_pages": pagination.pages,
        "current_page": pagination.page
    }), 200

# Upload a movie poster (Admin only)
@app.route('/upload-poster', methods=['POST'])
@jwt_required()
def upload_poster():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role != 'admin':
        return jsonify({"message": "Admin access required"}), 403

    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400

    upload_result = cloudinary.uploader.upload(file)
    return jsonify({"url": upload_result['secure_url']}), 200

# Create a showtime (Admin only)
@app.route('/showtimes', methods=['POST'])
@jwt_required()
def create_showtime():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role != 'admin':
        return jsonify({"message": "Admin access required"}), 403

    data = request.get_json()
    movie_id = data.get('movie_id')
    start_time = data.get('start_time')
    duration = data.get('duration')

    if not all([movie_id, start_time, duration]):
        return jsonify({"message": "Missing required fields"}), 400
    try:
        start_time = datetime.strptime(start_time, '%Y-%m-%d %H:%M:%S')
    except ValueError:
        return jsonify({"message": "Invalid start time format. Use YYYY-MM-DD HH:MM:SS"}), 400

    showtime = Showtime(
        movie_id=movie_id,
        start_time=start_time,
        duration=duration
    )
    db.session.add(showtime)
    db.session.commit()

    return jsonify({"message": "Showtime created successfully", "showtime_id": showtime.id}), 201

# Get movies and showtimes for a specific date
@app.route('/showtimes/search', methods=['GET'])
@jwt_required()
def search_showtimes():
    date = request.args.get('date')
    if not date:
        return jsonify({"message": "Date parameter is required"}), 400

    showtimes = Showtime.query.filter(Showtime.start_time.like(f"{date}%")).all()
    formatted_showtimes = [
        {
            "id": showtime.id,
            "movie_title": showtime.movie.title,
            "start_time": showtime.start_time.isoformat(),
            "available_seats": len([seat for seat in showtime.seats if not seat.is_reserved])
        }
        for showtime in showtimes
    ]

    return jsonify(formatted_showtimes), 200

# Create seats for a showtime (Admin only)
@app.route('/seats', methods=['POST'])
@jwt_required()
def create_seats():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role != 'admin':
        return jsonify({"message": "Admin access required"}), 403

    data = request.get_json()
    showtime_id = data.get('showtime_id')
    seat_numbers = data.get('seat_numbers')  # List of seat numbers (e.g., ['A1', 'A2'])

    if not all([showtime_id, seat_numbers]):
        return jsonify({"message": "Missing required fields"}), 400

    seats = []
    for seat_number in seat_numbers:
        row, column = seat_number[0], int(seat_number[1:])
        seat = Seat(
            seat_number=seat_number,
            row=row,
            column=column,
            showtime_id=showtime_id
        )
        seats.append(seat)

    db.session.add_all(seats)
    db.session.commit()

    return jsonify({"message": "Seats created successfully"}), 201

# Create a reservation
@app.route('/reservations', methods=['POST'])
@jwt_required()
def create_reservation():
    data = request.get_json()
    user_id = get_jwt_identity()
    showtime_id = data.get('showtime_id')
    seat_ids = data.get('seat_ids')

    if not showtime_id or not seat_ids:
        return jsonify({"message": "Missing required fields"}), 400

    # Check seat availability
    seats = Seat.query.filter(Seat.id.in_(seat_ids), Seat.is_reserved == False).all()
    if len(seats) != len(seat_ids):
        return jsonify({"message": "One or more of the selected seats are no longer available. Please choose different seats."}), 400

    reservation = Reservation(user_id=user_id, showtime_id=showtime_id)
    reservation.seats = seats
    db.session.add(reservation)

    # Mark seats as reserved
    for seat in seats:
        seat.is_reserved = True

    db.session.commit()

    # Send confirmation email
    user = User.query.get(user_id)
    send_email(user.email, "Reservation Confirmation", "Your reservation has been confirmed, we look foward to seeing you!")

    return jsonify({"message": "Reservation created successfully"}), 201

# Cancel a reservation (User only)
@app.route('/reservations/<int:reservation_id>', methods=['DELETE'])
@jwt_required()
def cancel_reservation(reservation_id):
    user_id = get_jwt_identity()
    reservation = Reservation.query.get_or_404(reservation_id)

    if reservation.user_id != user_id:
        return jsonify({"message": "Unauthorized to cancel this reservation"}), 403

    if reservation.timestamp < datetime.utcnow():
        return jsonify({"message": "Cannot cancel past reservations"}), 400

    # Mark seats as unreserved
    for seat in reservation.seats:
        seat.is_reserved = False

    db.session.delete(reservation)
    db.session.commit()

    return jsonify({"message": "Reservation cancelled successfully"}), 200

# Admin reporting: All reservations, capacity, and revenue
@app.route('/admin/report', methods=['GET'])
@jwt_required()
def admin_report():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role != 'admin':
        return jsonify({"message": "Admin access required"}), 403

    reservations = Reservation.query.all()
    report = {
        "total_reservations": len(reservations),
        "capacity_utilization": sum(len(r.seats) for r in reservations),
        "revenue": len(reservations) * 10  # Example: $10 per reservation
    }

    return jsonify(report), 200

@app.route('/')
def index():
    return """
    <h1>Movie Site API</h1>
    <p>Welcome to the Movie Site API. Below are some available endpoints:</p>
    <ul>
        <li>POST /register - Register a new user</li>
        <li>POST /login - Login and get JWT token</li>
        <li>GET /movies - Get paginated list of movies (requires JWT)</li>
        <li>POST /movies - Create a new movie (admin only)</li>
        <li>PUT /movies/<movie_id> - Update a movie (admin only)</li>
        <li>DELETE /movies/<movie_id> - Delete a movie (admin only)</li>
        <li>GET /movies/search - Search movies by genre/title (requires JWT)</li>
        <li>POST /showtimes - Create a showtime (admin only)</li>
        <li>GET /showtimes/search - Search showtimes by date (requires JWT)</li>
        <li>POST /seats - Create seats for a showtime (admin only)</li>
        <li>POST /reservations - Create a reservation (requires JWT)</li>
        <li>DELETE /reservations/<reservation_id> - Cancel a reservation (requires JWT)</li>
        <li>GET /admin/report - Admin report (admin only)</li>
    </ul>
    <p>Use an API client like Postman or Thunder Client to test these endpoints with appropriate HTTP methods and headers.</p>
    """

if __name__ == '__main__':
    app.run(debug=True, port=5500)
