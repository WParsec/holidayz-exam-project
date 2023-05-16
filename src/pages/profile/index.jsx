import React, { useState, useEffect } from 'react';

// Import components
import BackSection from '../../components/backSection';
import ProfileBookings from '../../components/profileBookings';

// Import url
import { profileUrl } from '../../common/common';

// Import styles and assets
import styles from './profile.module.scss';
import backgroundImage from '../../assets/backgrounds/leaf.jpg';
import placeholder from '../../assets/userPlaceholder.jpg';
import pen from '../../assets/icons/pen.svg';

// Import hooks
import useApi from '../../hooks/useApi';
import useLocalStorage from '../../hooks/useLocalStorage';
import useAvatar from '../../hooks/useAvatar';

// Import utils
import SEO from '../../utils/SEO.jsx';

function Profile() {
  const { name, accessToken } = useLocalStorage();
  const { data, isLoading, isError } = useApi(profileUrl + name, accessToken);
  const { avatar, name: profileName, venueManager } = data;
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isDisplayingForm, setIsDisplayingForm] = useState(false);
  const {
    updateAvatar,
    isError: isAvatarError,
    errorMessage,
  } = useAvatar(name, accessToken);

  useEffect(() => {
    setAvatarUrl(avatar);
  }, [avatar]);

  const handleEditAvatar = () => {
    setIsDisplayingForm(!isDisplayingForm);
  };

  const handleAvatarUpdate = async (newAvatarUrl) => {
    const updated = await updateAvatar(newAvatarUrl, accessToken);
    if (updated) {
      setAvatarUrl(updated.avatar);
      setIsDisplayingForm(false);
    }
  };

  return (
    <main
      className={styles.main}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <SEO
        title="Profile"
        description={
          'Your profile page on Holidayz. View upcoming and past bookings, and manage your venues.'
        }
      />
      <BackSection />
      <section>
        <div className="container">
          <div className={styles.user_wrap}>
            <div className={styles.user_flex}>
              <div className={styles.image_and_name_flex}>
                <div className={styles.user}>
                  <div className={styles.user_avatar_and_edit}>
                    <div className={styles.image_div}>
                      <img src={avatarUrl || placeholder} alt={profileName} />
                    </div>
                    {name === profileName && (
                      <div className={styles.edit_div}>
                        <button
                          className={styles.edit_button}
                          onClick={handleEditAvatar}
                        >
                          {isDisplayingForm ? 'X' : <img src={pen} alt="pen" />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.user_info}>
                  <h4>{profileName}</h4>
                  <p>{venueManager ? 'Venue Manager' : 'Client'}</p>
                </div>
              </div>
              <div
                className={`${styles.animation} ${
                  isDisplayingForm ? styles.animationActive : ''
                }`}
              >
                {isDisplayingForm && (
                  <form
                    className={`${styles.form} ${
                      isDisplayingForm ? styles.formActive : ''
                    }`}
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAvatarUpdate(e.target.elements[0].value);
                    }}
                  >
                    <input type="text" placeholder="Insert avatar URL" />
                    <button
                      className={`cta_gradient ${styles.submit}`}
                      type="submit"
                    >
                      Submit
                    </button>
                  </form>
                )}
              </div>
              <div className={styles.error}>
                {isAvatarError && isDisplayingForm ? (
                  <p>Error: {errorMessage}</p>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <ProfileBookings url={profileUrl + name} accessToken={accessToken} />
      </section>
    </main>
  );
}

export default Profile;
