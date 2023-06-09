import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Import styles and assets
import styles from './profileBookings.module.scss';

// Import hooks
import useApi from '../../hooks/useApi';

function ProfileBookings({ url, accessToken }) {
  const {
    data: bookings,
    isLoading,
    isError,
    errorMessage,
  } = useApi(url + '/bookings?_venue=true', accessToken);

  // Drop down bar states
  const [showPrevious, setShowPrevious] = useState(false);
  const [showUpcoming, setShowUpcoming] = useState(false);

  // Build two arrays from the bookings array: One for bookings in the future and one for bookings in the past
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [previousBookings, setPreviousBookings] = useState([]);

  useEffect(() => {
    const upcoming = [];
    const previous = [];

    if (bookings && Array.isArray(bookings)) {
      bookings.forEach((booking) => {
        const today = new Date();
        const bookingDate = new Date(booking.dateFrom);

        if (bookingDate > today) {
          upcoming.push(booking);
        } else {
          previous.push(booking);
        }
      });

      setUpcomingBookings(upcoming);
      setPreviousBookings(previous);
    }
  }, [bookings]);

  if (isLoading)
    return (
      <div className="container">
        <h2>Loading...</h2>
      </div>
    );

  if (isError)
    return (
      <div className="container">
        <p>{errorMessage}</p>
      </div>
    );

  return (
    <div className="container">
      <div className={styles.bookings_wrap}>
        <div className={styles.left}>
          <h4 className={styles.h4}>
            Your previous bookings{' '}
            <span
              tabIndex="0"
              onClick={() => setShowPrevious(!showPrevious)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setShowPrevious(!showPrevious);
                }
              }}
            >
              View
            </span>
          </h4>
          <div
            className={`${styles.bookings} ${showPrevious ? styles.show : ''}`}
          >
            {bookings && bookings.length > 0
              ? previousBookings.map((booking) => (
                  <Link to={`/venue/${booking.venue.id}`} key={booking.id}>
                    <div className={styles.booking}>
                      <div className={styles.image_div}>
                        <img
                          src={booking.venue.media[0]}
                          alt={booking.venue.name}
                        />
                      </div>
                      <div className={styles.info}>
                        <h5 className={styles.h5}>{booking.venue.name}</h5>
                        {booking.venue.location.address && (
                          <p>{booking.venue.location.address}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))
              : ''}
          </div>
        </div>
        <div className={styles.right}>
          <h4 className={styles.h4}>
            Your upcoming bookings{' '}
            <span
              onClick={() => setShowUpcoming(!showUpcoming)}
              tabIndex="0"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setShowUpcoming(!showUpcoming);
                }
              }}
            >
              View
            </span>
          </h4>
          <div
            className={`${styles.bookings} ${showUpcoming ? styles.show : ''}`}
          >
            {bookings && bookings.length > 0
              ? upcomingBookings.map((booking) => (
                  <Link to={`/venue/${booking.venue.id}`} key={booking.id}>
                    <div className={styles.booking}>
                      <div className={styles.image_div}>
                        <img
                          src={booking.venue.media[0]}
                          alt={booking.venue.name}
                        />
                      </div>
                      <div className={styles.info}>
                        <h5 className={styles.h5}>{booking.venue.name}</h5>
                        {booking.venue.location.address && (
                          <p>{booking.venue.location.address}</p>
                        )}
                      </div>
                      <div className={styles.dates}>
                        <p>
                          From:{' '}
                          {new Date(booking.dateFrom).toLocaleDateString()}
                        </p>
                        <p>
                          To: {new Date(booking.dateTo).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              : ''}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileBookings;
