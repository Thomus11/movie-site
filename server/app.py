from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
# from models import *
from models import db, User, Movie, Cinema, Showtime, Seat, Reservation, Payment
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from sqlalchemy.orm import joinedload
from resend.emails._emails import Emails
import resend
import cloudinary
import cloudinary.uploader
import cloudinary.api
from datetime import timedelta, datetime
from humanize import naturaltime
from dotenv import load_dotenv
import os
import re  # For manual email validation
import stripe  # Stripe for payment processing

# Load environment variables
load_dotenv()

app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://neondb_owner:npg_xUMhbu0nQcd5@ep-summer-mountain-a4l2nrlt-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require'

basedir = os.path.abspath(os.path.dirname(__file__))

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://neondb_owner:npg_s5vdiWkpu1Tb@ep-shy-scene-a4pi4s1w-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require'
db.init_app(app)
# db.init_app(app) 
# frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
CORS(app)


# Configure Stripe with secret key from environment variables
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

# Define the process_stripe_payment function
def process_stripe_payment(amount, payment_token):
    """
    Process a payment using Stripe API.

    :param amount: Amount in dollars to charge
    :param payment_token: Stripe payment token (e.g., from frontend)
    :return: Stripe charge object
    """
    try:
        # Stripe expects amount in cents
        amount_cents = int(amount * 100)
        charge = stripe.Charge.create(
            amount=amount_cents,
            currency='usd',
            source=payment_token,
            description='Movie reservation payment'
        )
        return charge
    except stripe.error.StripeError as e:
        # Handle Stripe errors
        raise Exception(f"Stripe error: {str(e)}")

# Configuration

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-secret-key')
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1095)  # 3 years expiry  
app.config['JWT_HEADER_NAME'] = 'Authorization'
app.config['JWT_HEADER_TYPE'] = 'Bearer'
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_COOKIE_CSRF_PROTECT'] = False
FLASK_ENV = os.getenv('FLASK_ENV', 'development')  # Default to development
FLASK_APP = os.getenv('FLASK_APP', 'app.py')  # Default app entry point
app.config['RESEND_API_KEY'] = os.getenv('RESEND_API_KEY')
app.config['CLOUDINARY_CLOUD_NAME'] = os.getenv('CLOUDINARY_CLOUD_NAME')
app.config['CLOUDINARY_API_KEY'] = os.getenv('CLOUDINARY_API_KEY')
app.config['CLOUDINARY_API_SECRET'] = os.getenv('CLOUDINARY_API_SECRET')


# Limit upload size and allowed extensions
app.config['JWT_COOKIE_CSRF_PROTECT'] = False
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024  # 5MB max
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}



# Initialize extensions
# db.init_app(app)
migrate = Migrate(app, db)
jwt_manager = JWTManager(app)

# Configure Cloudinary
cloudinary.config(
    cloud_name=app.config['CLOUDINARY_CLOUD_NAME'],
    api_key=app.config['CLOUDINARY_API_KEY'],
    api_secret=app.config['CLOUDINARY_API_SECRET']
)

# JWT Error Handlers
@jwt_manager.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({"message": "The token has expired"}), 401

@jwt_manager.invalid_token_loader
def invalid_token_callback(error_string):
    return jsonify({"message": "Invalid or malformed token", "error": error_string}), 401

@jwt_manager.unauthorized_loader
def missing_token_callback(error_string):
    return jsonify({"message": "Missing access token", "error": error_string}), 401

@jwt_manager.revoked_token_loader
def revoked_token_callback(jwt_header, jwt_payload):
    return jsonify({"message": "The token has been revoked"}), 401

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
resend.api_key = os.getenv("RESEND_API_KEY")
emails = Emails()

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
    return bool(re.match(r"[^@]+@[^@]+\.[^@]+", email))

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/send-email', methods=['POST'])
@jwt_required()
def send_email_route():
    data = request.get_json()
    to = data.get('to')
    subject = data.get('subject')
    content = data.get('content')

    # Validate
    if not to or not validate_email(to):
        return jsonify({'message': 'Invalid recipient email'}), 400

    if not subject or not content:
        return jsonify({'message': 'Subject and content are required'}), 400

    # Send email
    result = send_email(to, subject, content)

    if "error" in str(result).lower():
        return jsonify({'message': 'Failed to send email', 'error': result}), 500
    
    return jsonify({'message': 'Email sent successfully', 'id': result}), 200



# Helper function to validate strong password
def is_strong_password(pw):
    return (
        len(pw) >= 8 and
        re.search(r"[A-Z]", pw) and
        re.search(r"[a-z]", pw) and
        re.search(r"\d", pw) and
        re.search(r"[!@#$%^&*(),.?\":{}|<>]", pw)
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

    send_email(email, "Welcome to Our Service", f"Hello {username}, thank you for registering!")

    return jsonify({"message": "User registered successfully"}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({"message": "Email and password required"}), 400
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"message": "Invalid credentials"}), 401
    token = create_access_token(identity=str(user.id))
    return jsonify({"access_token": token, "username": user.username, "role": user.role}), 200



#Admin route
@app.route('/admin', methods=['GET'])
@jwt_required()
def admin_dashboard():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role != 'admin':
        return jsonify({"message": "Admin access required"}), 403

    return jsonify({
        "message": f"Welcome Admin {user.username}",
        "admin": True,
        "email": user.email,
        "user_id": user.id
    }), 200


# Promote a user to admin (Admin only)
@app.route('/users/promote/<int:user_id>', methods=['POST'])
def promote_user(user_id):
    # Temporary endpoint without auth for testing only
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

# Auth Routes
@app.route('/api/auth/me', methods=['GET'])
@jwt_required()  
def get_user_info():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)

    
    return jsonify({
        "username": user.username,
        "email":    user.email,
        "role":     user.role
    }), 200

# Movie Routes
@app.route('/api/movies', methods=['GET'])
def get_movies():
    movies = Movie.query.options(
        joinedload(Movie.showtimes).joinedload(Showtime.cinema)
    ).all()
    return jsonify([{
        'id': m.id,
        'title': m.title,
        'genre': m.genre,
        'rating': float(m.rating) if m.rating else 4.0,
        'duration': m.duration,
        'poster_url': m.poster_url,
        'description': m.description,
        'release_date': m.release_date.isoformat(),
        'price': m.price,
        'cinemas': list({st.cinema_id for st in m.showtimes}),
        'showtimes': [{
            'id': st.id,
            'start_time': st.start_time.isoformat(),
            'cinema_id': st.cinema_id,
            'cinema_name': st.cinema.name if st.cinema else None
        } for st in m.showtimes]
    } for m in movies])

# # Cinema Routes
@app.route('/api/cinemas', methods=['GET'])
def get_cinemas():
    cinemas = Cinema.query.all()
    return jsonify([{
        'id': c.id,
        'name': c.name,
        'location': c.location
    } for c in cinemas])

# # Reservation Routes
@app.route('/api/reservations', methods=['GET'])
@jwt_required()
def get_user_reservations():
    user_id = get_jwt_identity()
    reservations = Reservation.query.options(
        joinedload(Reservation.showtime).joinedload(Showtime.movie),
        joinedload(Reservation.showtime).joinedload(Showtime.cinema),
        joinedload(Reservation.seats)
    ).filter_by(user_id=user_id).all()
    
    return jsonify([{
        'id': r.id,
        'status': r.status,
        'amount': r.payment.amount if r.payment else None,
        'movie': {
            'title': r.showtime.movie.title,
            'poster_url': r.showtime.movie.poster_url
        },
        'cinema': {
            'name': r.showtime.cinema.name,
            'location': r.showtime.cinema.location
        },
        'showtime': {
            'start_time': r.showtime.start_time.isoformat()
        },
        'seats': [s.seat_number for s in r.seats]
    } for r in reservations])    

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

# # Delete a movie (Admin only)
# @app.route('/movies/<int:movie_id>', methods=['DELETE'])
# @jwt_required()
# def delete_movie(movie_id):
#     user_id = get_jwt_identity()
#     user = User.query.get(user_id)

#     if user.role != 'admin':
#         return jsonify({"message": "Admin access required"}), 403

#     movie = Movie.query.get_or_404(movie_id)
#     db.session.delete(movie)
#     db.session.commit()

#     return jsonify({"message": "Movie deleted successfully"}), 200



# # Get paginated list of movies
# @app.route('/movies', methods=['GET'])
# @jwt_required()
# def get_movies():
#     page = request.args.get('page', 1, type=int)
#     per_page = request.args.get('per_page', 10, type=int)

#     pagination = Movie.query.paginate(page=page, per_page=per_page, error_out=False)
#     movies = pagination.items

#     return jsonify({
#         "movies": [{
#             **movie.to_dict(),
#             "natural_release_date": naturaltime(datetime.combine(movie.release_date, datetime.min.time()))
#         } for movie in movies],
#         "total_pages": pagination.pages,
#         "current_page": pagination.page
#     }), 200

# Upload a movie poster (Admin only) with file validation
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

    if not allowed_file(file.filename):
        return jsonify({"message": "Invalid file type"}), 400

    try:
        upload_result = cloudinary.uploader.upload(
            file,
            resource_type="image",
            allowed_formats=list(ALLOWED_EXTENSIONS)
        )
        return jsonify({"url": upload_result['secure_url']}), 200
    except Exception as e:
        app.logger.error(f"Cloudinary upload failed: {str(e)}")
        return jsonify({"message": "File upload failed"}), 500
    
# # Create a showtime (Admin only)
# @app.route('/showtimes', methods=['POST'])
# @jwt_required()
# def create_showtime():
#     user_id = get_jwt_identity()
#     user = User.query.get(user_id)

#     if user.role != 'admin':
#         return jsonify({"message": "Admin access required"}), 403

#     data = request.get_json()
#     movie_id = data.get('movie_id')
#     start_time = data.get('start_time')
#     duration = data.get('duration')

#     if not all([movie_id, start_time, duration]):
#         return jsonify({"message": "Missing required fields"}), 400
#     try:
#         start_time = datetime.strptime(start_time, '%Y-%m-%d %H:%M:%S')
#     except ValueError:
#         return jsonify({"message": "Invalid start time format. Use YYYY-MM-DD HH:MM:SS"}), 400

#     showtime = Showtime(
#         movie_id=movie_id,
#         start_time=start_time,
#         duration=duration
#     )
#     db.session.add(showtime)
#     db.session.commit()

#     return jsonify({
#         "message": "Showtime created successfully", 
#         "showtime_id": showtime.id,
#         "start_time": naturaltime(showtime.start_time)
#     }), 201

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


# Get current user data
@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "phone": user.phone,
        "role": user.role
    }), 200

# Get user's reservations
@app.route('/api/reservations', methods=['GET'])
@jwt_required()
def get_user_reservations():
    user_id = get_jwt_identity()
    reservations = Reservation.query.filter_by(user_id=user_id).all()
    
    return jsonify([{
        "id": reservation.id,
        "movie": {
            "id": reservation.showtime.movie.id,
            "title": reservation.showtime.movie.title
        },
        "cinema": {
            "id": reservation.showtime.cinema.id,
            "name": reservation.showtime.cinema.name
        },
        "showtime": reservation.showtime.start_time.isoformat(),
        "seats": [seat.seat_number for seat in reservation.seats],
        "amount": reservation.payment.amount,
        "status": reservation.status,
        "payment_method": reservation.payment.payment_method
    } for reservation in reservations]), 200

# Create new reservation
@app.route('/api/reservations', methods=['POST'])
@jwt_required()
def create_reservation():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['movie_id', 'showtime_id', 'seat_ids', 'payment_method']
    if not all(field in data for field in required_fields):
        return jsonify({"message": "Missing required fields"}), 400
    
    try:
        # Check seat availability
        seats = Seat.query.filter(
            Seat.id.in_(data['seat_ids']),
            Seat.is_reserved == False
        ).all()
        
        if len(seats) != len(data['seat_ids']):
            return jsonify({"message": "Some seats are already taken"}), 400
        
        # Calculate total amount
        movie = Movie.query.get(data['movie_id'])
        total_amount = movie.price * len(seats)
        
        # Create reservation
        reservation = Reservation(
            user_id=user_id,
            showtime_id=data['showtime_id'],
            status='pending'
        )
        db.session.add(reservation)
        db.session.flush()  # Get the reservation ID
        
        # Assign seats
        for seat in seats:
            seat.is_reserved = True
            reservation.seats.append(seat)
        
        # Create payment record
        payment = Payment(
            reservation_id=reservation.id,
            amount=total_amount,
            payment_method=data['payment_method'],
            status='pending'
        )
        db.session.add(payment)
        
        db.session.commit()
        
        return jsonify({
            "message": "Reservation created successfully",
            "reservation_id": reservation.id,
            "total_amount": total_amount
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Reservation failed: {str(e)}"}), 500

# # Create seats for a showtime (Admin only)
# @app.route('/seats', methods=['POST'])
# @jwt_required()
# def create_seats():
#     user_id = get_jwt_identity()
#     user = User.query.get(user_id)

#     if user.role != 'admin':
#         return jsonify({"message": "Admin access required"}), 403

#     data = request.get_json()
#     showtime_id = data.get('showtime_id')
#     seat_numbers = data.get('seat_numbers')  # List of seat numbers (e.g., ['A1', 'A2'])

#     if not all([showtime_id, seat_numbers]):
#         return jsonify({"message": "Missing required fields"}), 400

#     seats = []
#     for seat_number in seat_numbers:
#         row, column = seat_number[0], int(seat_number[1:])
#         seat = Seat(
#             seat_number=seat_number,
#             row=row,
#             column=column,
#             showtime_id=showtime_id
#         )
#         seats.append(seat)

#     db.session.add_all(seats)
#     db.session.commit()

#     return jsonify({"message": "Seats created successfully"}), 201

# Create Reservation
@app.route('/reservations/<int:reservation_id>', methods=['PUT'])
@jwt_required()
def update_reservation(reservation_id):
    data = request.get_json()
    user_id = get_jwt_identity()
    showtime_id = data.get('showtime_id')
    seat_ids = data.get('seat_ids')
    payment_method = data.get('payment_method', 'credit_card')  # Default payment method

    # Validate required fields
    if not all([showtime_id, seat_ids]):
        return jsonify({"message": "Missing required fields"}), 400

    # Fetch the existing reservation
    reservation = Reservation.query.filter_by(id=reservation_id, user_id=user_id).first()
    if not reservation:
        return jsonify({"message": "Reservation not found"}), 404

    # Validate seats availability
    seats = Seat.query.filter(Seat.id.in_(seat_ids), Seat.is_reserved == False).all()
    if len(seats) != len(seat_ids):
        return jsonify({"message": "One or more seats are already reserved"}), 400

    # Calculate total amount
    seat_price = 10.00  # Default seat price
    total_amount = len(seats) * seat_price

    # Start transaction
    try:
        # Update reservation details
        reservation.showtime_id = showtime_id
        reservation.seats = seats  # Update seats
        db.session.add(reservation)
        db.session.flush()  # Get reservation ID for payment

        # Update payment record
        payment = reservation.payment
        payment.amount = total_amount
        payment.payment_method = payment_method
        payment.status = 'pending'  # Reset status for new payment processing
        db.session.add(payment)

        # Process payment based on method
        if payment_method == 'credit_card':
            try:
                charge = process_stripe_payment(total_amount, data.get('payment_token'))
                payment.status = 'completed'
                payment.transaction_id = charge.id
                reservation.status = 'confirmed'
            except Exception as e:
                raise Exception(f"Credit card payment failed: {str(e)}")

        elif payment_method == 'paypal':
            payment.status = 'processing'
            reservation.status = 'awaiting_payment'

        elif payment_method == 'cash':
            payment.status = 'pending'
            reservation.status = 'awaiting_verification'

        else:
            raise Exception("Unsupported payment method")

        # Mark seats as reserved
        for seat in seats:
            seat.is_reserved = True

        db.session.commit()

        # Prepare response data
        response_data = {
            "message": "Reservation updated successfully",
            "reservation_id": reservation.id,
            "payment_status": payment.status,
            "seats": [seat.seat_number for seat in seats],
            "total_amount": total_amount
        }

        # Send confirmation email if payment completed
        if payment.status == 'completed':
            user = User.query.get(user_id)
            showtime = Showtime.query.get(showtime_id)
            movie = showtime.movie

            content = (
                f"Hello {user.username},\n\n"
                f"Your reservation for '{movie.title}' on {showtime.start_time.strftime('%Y-%m-%d %H:%M')} has been updated.\n"
                f"Seats: {', '.join([seat.seat_number for seat in seats])}\n"
                f"Amount paid: ${total_amount:.2f}\n"
                f"Payment method: {payment_method}\n\n"
                "Thank you for choosing our cinema!"
            )
            send_email(user.email, "Reservation Update Confirmation", content)

            return jsonify(response_data), 200

        # Different response for pending payments
        response_data["message"] = "Payment processing required"
        return jsonify(response_data), 202

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Reservation update failed: {str(e)}"}), 400


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
    
    #Fetches all reservations
    reservations = Reservation.query.all()
    
    #prepare the report  data
    report = {
        "total_reservations": len(reservations),
        "capacity_utilization": sum(len(r.seats) for r in reservations),
        "revenue": len(reservations) * 10  # Example: $10 per reservation
    }

    return jsonify(report), 200

# Admin view of all reservations
@app.route('/admin/reservations', methods=['GET'])
@jwt_required()
def admin_view_reservations():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role != 'admin':
        return jsonify({"message": "Admin access required"}), 403

    reservations = Reservation.query.all()

    reservation_data = [
        {
            "reservation_id": reservation.id,
            "user_id": reservation.user_id,
            "showtime": naturaltime(reservation.showtime.start_time),
            "seats": [seat.seat_number for seat in reservation.seats],
            "total_amount": len(reservation.seats) * 10  # Example amount calculation
        }
        for reservation in reservations
    ]

    return jsonify(reservation_data), 200


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
    app.run(debug=True)
