from flask import Flask, request, jsonify
from flask_jwt_extended import (
    JWTManager, create_access_token,
    jwt_required, get_jwt_identity
)
from datetime import datetime, timedelta
from sqlalchemy import or_
from models import db, User, Movie, Showtime, Seat, Reservation, Payment, reservation_seats

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///movies.db'
app.config['JWT_SECRET_KEY'] = 'your-super-secret-key-here'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

db.init_app(app)
jwt = JWTManager(app)

# Authentication Routes
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"error": "Username and password required"}), 400
        
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"error": "Username already exists"}), 400

    user = User(username=data['username'], role=data.get('role', 'user'))
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({"error": "Invalid credentials"}), 401
    
    access_token = create_access_token(identity={
        'id': user.id,
        'username': user.username,
        'role': user.role
    })
    
    return jsonify(access_token=access_token), 200

# Movie Routes
@app.route('/movies', methods=['GET'])
@jwt_required()
def get_movies():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    movies = Movie.query.paginate(page=page, per_page=per_page)
    
    return jsonify({
        'movies': [movie.to_dict() for movie in movies.items],
        'total': movies.total,
        'pages': movies.pages,
        'current_page': movies.page
    })

@app.route('/movies', methods=['POST'])
@jwt_required()
def create_movie():
    if get_jwt_identity()['role'] != 'admin':
        return jsonify({"error": "Admin privileges required"}), 403
    
    data = request.get_json()
    movie = Movie(
        title=data['title'],
        description=data.get('description'),
        poster_url=data.get('poster_url'),
        genre=data.get('genre')
    )
    db.session.add(movie)
    db.session.commit()
    
    return jsonify(movie.to_dict()), 201

@app.route('/movies/<int:movie_id>', methods=['PUT'])
@jwt_required()
def update_movie(movie_id):
    if get_jwt_identity()['role'] != 'admin':
        return jsonify({"error": "Admin privileges required"}), 403
    
    movie = Movie.query.get_or_404(movie_id)
    data = request.get_json()
    
    movie.title = data.get('title', movie.title)
    movie.description = data.get('description', movie.description)
    movie.poster_url = data.get('poster_url', movie.poster_url)
    movie.genre = data.get('genre', movie.genre)
    
    db.session.commit()
    return jsonify(movie.to_dict())

@app.route('/movies/<int:movie_id>', methods=['DELETE'])
@jwt_required()
def delete_movie(movie_id):
    if get_jwt_identity()['role'] != 'admin':
        return jsonify({"error": "Admin privileges required"}), 403
    
    movie = Movie.query.get_or_404(movie_id)
    db.session.delete(movie)
    db.session.commit()
    
    return jsonify({"message": "Movie deleted"})

@app.route('/movies/search', methods=['GET'])
@jwt_required()
def search_movies():
    query = request.args.get('q', '')
    movies = Movie.query.filter(
        or_(
            Movie.title.ilike(f'%{query}%'),
            Movie.genre.ilike(f'%{query}%')
        )
    ).all()
    
    return jsonify([movie.to_dict() for movie in movies])

# Showtime Routes
@app.route('/showtimes', methods=['POST'])
@jwt_required()
def create_showtime():
    if get_jwt_identity()['role'] != 'admin':
        return jsonify({"error": "Admin privileges required"}), 403
    
    data = request.get_json()
    showtime = Showtime(
        movie_id=data['movie_id'],
        start_time=datetime.fromisoformat(data['start_time'])
    )
    db.session.add(showtime)
    db.session.commit()
    
    return jsonify(showtime.to_dict()), 201

@app.route('/showtimes/search', methods=['GET'])
@jwt_required()
def search_showtimes():
    date_str = request.args.get('date')
    try:
        date = datetime.fromisoformat(date_str).date()
    except ValueError:
        return jsonify({"error": "Invalid date format"}), 400
    
    showtimes = Showtime.query.filter(
        db.func.date(Showtime.start_time) == date
    ).all()
    
    return jsonify([showtime.to_dict() for showtime in showtimes])

# Seat Routes
@app.route('/seats', methods=['POST'])
@jwt_required()
def create_seats():
    if get_jwt_identity()['role'] != 'admin':
        return jsonify({"error": "Admin privileges required"}), 403
    
    data = request.get_json()
    seats = [Seat(seat_number=n, showtime_id=data['showtime_id']) 
            for n in data['seat_numbers']]
    db.session.add_all(seats)
    db.session.commit()
    
    return jsonify({"message": f"{len(seats)} seats created"}), 201

# Reservation Routes
@app.route('/reservations', methods=['POST'])
@jwt_required()
def create_reservation():
    user_id = get_jwt_identity()['id']
    data = request.get_json()
    
    # Check seat availability
    seats = Seat.query.filter(
        Seat.id.in_(data['seat_ids']),
        Seat.is_reserved == False
    ).all()
    
    if len(seats) != len(data['seat_ids']):
        return jsonify({"error": "Some seats unavailable"}), 400
    
    # Create reservation
    reservation = Reservation(
        user_id=user_id,
        showtime_id=data['showtime_id']
    )
    reservation.seats = seats
    
    # Mark seats as reserved
    for seat in seats:
        seat.is_reserved = True
    
    # Create payment
    payment = Payment(
        user_id=user_id,
        reservation_id=reservation.id,
        amount=data['amount'],
        payment_method=data['payment_method'],
        status='completed'
    )
    
    db.session.add_all([reservation, payment])
    db.session.commit()
    
    return jsonify({
        "reservation": reservation.to_dict(),
        "payment": payment.to_dict()
    }), 201

@app.route('/reservations/<int:reservation_id>', methods=['DELETE'])
@jwt_required()
def cancel_reservation(reservation_id):
    current_user = get_jwt_identity()
    reservation = Reservation.query.get_or_404(reservation_id)
    
    if reservation.user_id != current_user['id'] and current_user['role'] != 'admin':
        return jsonify({"error": "Unauthorized"}), 403
    
    # Release seats
    for seat in reservation.seats:
        seat.is_reserved = False
    
    # Update payment status
    if reservation.payment:
        reservation.payment.status = 'refunded'
    
    db.session.delete(reservation)
    db.session.commit()
    
    return jsonify({"message": "Reservation cancelled"})

# Payment Routes
@app.route('/payments/<int:payment_id>', methods=['GET'])
@jwt_required()
def get_payment(payment_id):
    current_user = get_jwt_identity()
    payment = Payment.query.get_or_404(payment_id)
    
    if payment.user_id != current_user['id'] and current_user['role'] != 'admin':
        return jsonify({"error": "Unauthorized"}), 403
    
    return jsonify(payment.to_dict())

@app.route('/payments/<int:payment_id>/status', methods=['PUT'])
@jwt_required()
def update_payment_status(payment_id):
    if get_jwt_identity()['role'] != 'admin':
        return jsonify({"error": "Admin privileges required"}), 403
    
    payment = Payment.query.get_or_404(payment_id)
    new_status = request.json.get('status')
    
    if new_status not in ['pending', 'completed', 'failed', 'refunded']:
        return jsonify({"error": "Invalid status"}), 400
    
    payment.status = new_status
    db.session.commit()
    
    return jsonify(payment.to_dict())

# Admin Routes
@app.route('/admin/report', methods=['GET'])
@jwt_required()
def admin_report():
    if get_jwt_identity()['role'] != 'admin':
        return jsonify({"error": "Admin privileges required"}), 403
    
    report = {
        "total_users": User.query.count(),
        "total_movies": Movie.query.count(),
        "total_reservations": Reservation.query.count(),
        "total_revenue": db.session.query(db.func.sum(Payment.amount)).filter(
            Payment.status == 'completed'
        ).scalar() or 0
    }
    
    return jsonify(report)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)