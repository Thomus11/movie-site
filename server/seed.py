from models import db, User, Movie, Showtime, Seat, Reservation, reservation_seats
from datetime import datetime, timedelta
import random

def seed_data():
    # Ensure database tables are created
    db.create_all()

    # Seed an admin user
    if not User.query.filter_by(username="admin").first():
        admin = User(
            username="admin",
            email="admin@example.com",  # Add an email for the admin user
            role="admin"
        )
        admin.set_password("adminpassword")
        db.session.add(admin)

    # Seed regular users
    user1 = User.query.filter_by(username="user1").first()
    if not user1:
        user1 = User(
            username="user1",
            email="user1@example.com"  # Add an email for user1
        )
        user1.set_password("password1")
        db.session.add(user1)
    user2 = User.query.filter_by(username="user2").first()
    if not user2:
        user2 = User(
            username="user2",
            email="user2@example.com"  # Add an email for user2
        )
        user2.set_password("password2")
        db.session.add(user2)

    db.session.flush()

    # Genres for movies
    genres = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi"]

    # Seed movies (10 per genre, 50 total)
    for genre in genres:
        for i in range(1, 11):  # 10 movies per genre
            movie_title = f"{genre} Movie {i}"
            movie_description = f"A thrilling {genre.lower()} movie with gripping moments."
            movie = Movie.query.filter_by(title=movie_title).first()
            if not movie:
                movie = Movie(
                    title=movie_title,
                    description=movie_description,
                    genre=genre,
                    poster_url="https://via.placeholder.com/150",  # Placeholder image URL
                    release_date=datetime.now().date() - timedelta(days=random.randint(1, 365))  # Random past date
                )
                db.session.add(movie)
                db.session.flush()  # Save the movie to get its ID

                # Seed showtimes for each movie
                for j in range(5):  # 5 showtimes per movie
                    start_time = datetime.now() + timedelta(days=j, hours=random.randint(1, 3))
                    showtime = Showtime(
                        movie_id=movie.id,
                        start_time=start_time,
                        duration=random.randint(90, 180)  # Random duration between 90 and 180 minutes
                    )
                    db.session.add(showtime)
                    db.session.flush()  # Save the showtime to get its ID

                    # Seed 20 seats per showtime
                    for seat_num in range(1, 21):  # 20 seats per showtime
                        row = "ABCDE"[seat_num // 5]  # Rows A-E
                        column = seat_num % 5 or 5    # Columns 1-5
                        seat = Seat(
                            seat_number=f"{row}{column}",
                            row=row,
                            column=column,
                            showtime_id=showtime.id,
                            is_reserved=False
                        )
                        db.session.add(seat)

    db.session.flush()

    # Seed reservations for user1 on some showtimes and seats
    showtimes = Showtime.query.limit(5).all()
    for showtime in showtimes:
        reservation = Reservation(user_id=user1.id, showtime_id=showtime.id)
        db.session.add(reservation)
        db.session.flush()

        # Reserve first 3 seats for this reservation
        seats = Seat.query.filter_by(showtime_id=showtime.id).limit(3).all()
        for seat in seats:
            seat.is_reserved = True
            reservation.seats.append(seat)

    # Commit all changes
    db.session.commit()
    print("Database seeded with movies, showtimes, seats, and reservations.")

if __name__ == '__main__':
    from app import app  # Import the Flask app
    with app.app_context():  # Run the script within the Flask app context
        seed_data()
        print("Database seeding completed!")