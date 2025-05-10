from datetime import datetime, timedelta
import random

from app import app, db
from models import User, Movie, Showtime, Seat, Reservation, Payment, Cinema

def seed_data():
    with app.app_context():
        db.drop_all()
        db.create_all()

        # Create admin user
        admin = User(
            username="Admin Thomus",
            email="adminthomas827@gmail.com",
            role="admin",
            phone="+254700000000"
        )
        admin.set_password("Admin12.?/")
        db.session.add(admin)

        # Create regular users
        users = [
            User(username="John Doe", email="john.doe@example.com", phone="+254712345678", role="user"),
            User(username="Jane Smith", email="jane.smith@example.com", phone="+254723456789", role="user")
        ]
        for user in users:
            user.set_password("password123")
            db.session.add(user)
        db.session.flush()

        # Cinemas
        cinemas = [
            Cinema(id=1, name="Garden City Mall", location="Thika Road"),
            Cinema(id=2, name="Sarit Centre", location="Westlands"),
            Cinema(id=3, name="Panari Sky Centre", location="Mombasa Road"),
            Cinema(id=4, name="Prestige Plaza", location="Ngong Road")
        ]
        db.session.add_all(cinemas)

        now = datetime.now()

        # Available Movies
        available_movies = [
            {
                "title": "Dune: Part Two", "genre": "Sci-Fi", "rating": 4.8, "duration": 166,
                "cinema_ids": [1, 2, 3, 4], "image_url": "/images/Available6.jpeg",
                "description": "Paul Atreides unites...", "price": 1200,
                "release_date": now - timedelta(days=10)
            },
            {
                "title": "The Batman", "genre": "Action", "rating": 4.5, "duration": 176,
                "cinema_ids": [1, 2, 4], "image_url": "/images/Available7.jpeg",
                "description": "When a sadistic serial...", "price": 1100,
                "release_date": now - timedelta(days=5)
            },
            {
                "title": "Until Dawn", "genre": "Drama • Horror", "rating": 4.0, "duration": 112,
                "cinema_ids": [1, 2, 3, 4], "image_url": "/images/Available1.jpeg",
                "description": "A group of friends trapped...", "price": 1000,
                "release_date": now - timedelta(days=7)
            },
            {
                "title": "Sinners", "genre": "Horror • Adventure", "rating": 5.0, "duration": 200,
                "cinema_ids": [1, 2, 3, 4], "image_url": "/images/Available2.jpeg",
                "description": "Trying to leave their troubled lives...", "price": 1800,
                "release_date": now - timedelta(days=3)
            },
            {
                "title": "The Accountant 2", "genre": "Action • Thriller", "rating": 4.5, "duration": 180,
                "cinema_ids": [1, 2, 4], "image_url": "/images/Available3.jpeg",
                "description": "Forensic accountant Christian Wolff...", "price": 1200,
                "release_date": now - timedelta(days=14)
            },
            {
                "title": "The Kings of Kings", "genre": "Animation", "rating": 3.8, "duration": 100,
                "cinema_ids": [1, 2, 4], "image_url": "/images/Available4.jpeg",
                "description": "Renowned writer Charles Dickens...", "price": 2000,
                "release_date": now - timedelta(days=21)
            }
        ]

        # Coming Soon Movies
        coming_soon_movies = [
            {
                "title": "Furiosa", "genre": "Action", "duration": 148,
                "cinema_ids": [1, 2, 4], "image_url": "/images/Available8.jpeg",
                "description": "The origin story of renegade warrior Furiosa...",
                "release_date": now + timedelta(days=30)
            },
            {
                "title": "Deadpool & Wolverine", "genre": "Action • Comedy", "duration": 140,
                "cinema_ids": [1, 2, 3, 4], "image_url": "/images/Coming1.jpeg",
                "description": "The multiverse cracks open as Deadpool and Wolverine join forces...",
                "release_date": now + timedelta(days=40)
            },
            {
                "title": "Joker: Folie à Deux", "genre": "Psychological Thriller", "duration": 130,
                "cinema_ids": [1, 2, 4], "image_url": "/images/Coming2.jpeg",
                "description": "Joker finds a kindred spirit in Arkham Asylum...",
                "release_date": now + timedelta(days=60)
            }
        ]

        all_movies = available_movies + coming_soon_movies

        # Insert movies, showtimes, and seats
        for movie_data in all_movies:
            movie = Movie(
                title=movie_data["title"],
                genre=movie_data["genre"],
                rating=movie_data.get("rating", 4.0),
                duration=movie_data["duration"],
                poster_url=movie_data["image_url"],
                description=movie_data["description"],
                release_date=movie_data["release_date"]
            )
            db.session.add(movie)
            db.session.flush()

            if "price" in movie_data:  # Available movies
                for cinema_id in movie_data["cinema_ids"]:
                    for i in range(2):  # Create 2 showtimes
                        start_time = now + timedelta(hours=3*i + random.randint(1, 3))
                        showtime = Showtime(
                            movie_id=movie.id,
                            cinema_id=cinema_id,
                            start_time=start_time,
                            duration=movie_data["duration"],
                            price=movie_data["price"]
                        )
                        db.session.add(showtime)
                        db.session.flush()

                        # Add 10 seats per showtime
                        for s in range(1, 11):
                            sn = f"A{s}"
                            seat = Seat(
                                seat_number=sn,
                                row=sn[0],
                                column=int(sn[1:]), 
                                showtime_id=showtime.id,
                                is_reserved=False
                            )
                            db.session.add(seat)

        db.session.flush()

        # ✅ Seed sample reservations for John Doe
        user1 = users[0]
        showtime1 = Showtime.query.filter(Showtime.movie.has(title="Dune: Part Two")).first()
        
        # Reservation 1 (Confirmed)
        reservation1 = Reservation(
            user_id=user1.id,
            showtime_id=showtime1.id,
            status="Confirmed"
        )
        db.session.add(reservation1)
        db.session.flush()

        # Assign seats A3 and A4
        seats = Seat.query.filter(
            Seat.showtime_id == showtime1.id,
            Seat.seat_number.in_(["A3", "A4"])
        ).all()
        for seat in seats:
            seat.is_reserved = True
            reservation1.seats.append(seat)
        
        # Payment 1
        payment1 = Payment(
            user_id=user1.id, 
            reservation_id=reservation1.id,
            amount=2400,
            payment_method="M-Pesa",
            status="Completed",
            transaction_id="MPESA123456"
        )
        db.session.add(payment1)

        # Reservation 2 (Completed - The Batman)
        showtime2 = Showtime.query.join(Movie).filter(Movie.title == "The Batman").first()
        
        reservation2 = Reservation(
            user_id=user1.id,
            showtime_id=showtime2.id,
            status="Completed"
        )
        db.session.add(reservation2)
        db.session.flush()

        seat = Seat.query.filter(
            Seat.showtime_id == showtime2.id,
            Seat.seat_number == "A5"
        ).first()
        seat.is_reserved = True
        reservation2.seats.append(seat)

        payment2 = Payment(
            user_id=user1.id,
            reservation_id=reservation2.id,
            amount=1100,
            payment_method="M-Pesa",
            status="Completed",
            transaction_id="MPESA789012"
        )
        db.session.add(payment2)

        db.session.commit()
        print("✅ Database seeded successfully.")

if __name__ == "__main__":
    seed_data()
