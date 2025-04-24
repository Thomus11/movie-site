

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

# Association Table for Seats Reserved
reservation_seats = db.Table(
    'reservation_seats',
    db.Column('reservation_id', db.Integer, db.ForeignKey('reservations.id')),
    db.Column('seat_id', db.Integer, db.ForeignKey('seats.id'))
)

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    password_hash = db.Column(db.String(128))
    role = db.Column(db.String(20), default='user')  # user or admin

    reservations = db.relationship('Reservation', backref='user', cascade="all, delete")

    serialize_rules = ('-password_hash', '-reservations.user',)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Movie(db.Model, SerializerMixin):
    __tablename__ = 'movies'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    description = db.Column(db.String)
    poster_url = db.Column(db.String)
    genre = db.Column(db.String)

    showtimes = db.relationship('Showtime', backref='movie', cascade="all, delete")

    serialize_rules = ('-showtimes.movie',)

class Showtime(db.Model, SerializerMixin):
    __tablename__ = 'showtimes'
    id = db.Column(db.Integer, primary_key=True)
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'))
    start_time = db.Column(db.DateTime)

    reservations = db.relationship('Reservation', backref='showtime', cascade="all, delete")
    seats = db.relationship('Seat', backref='showtime', cascade="all, delete")

    serialize_rules = ('-reservations.showtime', '-seats.showtime',)

class Seat(db.Model, SerializerMixin):
    __tablename__ = 'seats'
    id = db.Column(db.Integer, primary_key=True)
    seat_number = db.Column(db.String)
    is_reserved = db.Column(db.Boolean, default=False)
    showtime_id = db.Column(db.Integer, db.ForeignKey('showtimes.id'))

    serialize_rules = ('-showtime.seats',)

class Reservation(db.Model, SerializerMixin):
    __tablename__ = 'reservations'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    showtime_id = db.Column(db.Integer, db.ForeignKey('showtimes.id'))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    seats = db.relationship('Seat', secondary=reservation_seats)

    serialize_rules = ('-user.reservations', '-showtime.reservations',)
