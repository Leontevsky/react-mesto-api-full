// import headerLogo from '../images/Vector.svg';
import '../index.css';
import React from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm.js';
import ImagePopup from './ImagePopup.js';
import api from '../utils/Api.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import { CurrentUserContext } from '../context/CurrentUserContext.js';
import Login from './Login';
import Register from './Register';
import InfoTooltip from './InfoTooltip.js';
import * as auth from '../utils/auth.js';
import successIcon from '../images/success.png';
import failIcon from '../images/fail.png';
import ProtectedRoute from './ProtectedRoute.js';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);
  const [info, setInfo] = React.useState({ icon: '', text: '' });
  const history = useHistory();
  const [currentEmail, setCurrentEmail] = React.useState('');

  React.useEffect(() => {
    api
      .getUserInfo()
      .then((module) => {
        setCurrentUser(module);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  React.useEffect(() => {
    api
      .getInitialCards()
      .then((module) => {
        setCards(module);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  React.useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      auth
        .checkToken(jwt)
        .then((res) => {
          setLoggedIn(true);
          setCurrentEmail(res.data.email);
          history.push('/');
        })
        .catch((err) => console.log(err));
    }
  }, [history]);

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleCardClick(card) {
    setSelectedCard(card);
  }
  function handleInfoTooltipContainer({ icon, text }) {
    setInfo({ icon: icon, text: text });
  }
  function handleInfoTooltipOpen() {
    setIsInfoTooltipOpen(true);
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateUser({ name, about }) {
    api
      .editUserInfo(name, about)
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        setIsEditProfilePopupOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar({ avatar }) {
    api
      .editUserAvatar(avatar)
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        setIsEditAvatarPopupOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlaceSubmit({ name, link }) {
    api
      .addCard(name, link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        setIsAddPlacePopupOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUserRegistration(email, password) {
    auth
      .register(email, password)
      .then((res) => {
        if (res) {
          handleInfoTooltipContainer({
            icon: successIcon,
            text: 'Вы успешно зарегистрировались!',
          });
          handleInfoTooltipOpen();

          setTimeout(history.push, 3500, '/sign-in');
          setTimeout(closeAllPopups, 5000);
        } else {
          console.log('Некорректно заполнено одно из полей!');
        }
      })
      .catch((err) => {
        handleInfoTooltipContainer({
          icon: failIcon,
          text: 'Что-то пошло не так! Попробуйте ещё раз.',
        });
        handleInfoTooltipOpen();

        setTimeout(closeAllPopups, 6000);

        console.log(err);
      });
  }

  function handleUserAuthorization(email, password) {
    auth
      .authorize(email, password)
      .then((res) => {
        if (res.token) {
          localStorage.setItem('jwt', res.token);
          setLoggedIn(true);
          setCurrentEmail(email);
          handleInfoTooltipContainer({
            icon: successIcon,
            text: 'Вы успешно авторизовались!',
          });
          handleInfoTooltipOpen();
          setTimeout(history.push, 3500, '/');
          setTimeout(closeAllPopups, 3000);
        }
      })
      .catch((err) => {
        handleInfoTooltipContainer({
          icon: failIcon,
          text: 'Что-то пошло не так! Попробуйте ещё раз.',
        });
        handleInfoTooltipOpen();

        setTimeout(closeAllPopups, 3000);

        console.log(err);
      });
  }

  function handleSignOut() {
    setLoggedIn(false);
    localStorage.removeItem('jwt');
    setCurrentEmail('');
    setTimeout(history.push, 3500, '/sign-in');
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsInfoTooltipOpen(false);
    setSelectedCard({});
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="description">
        <div className="page">
          <Header loggedIn={loggedIn} currentEmail={currentEmail} onSignOut={handleSignOut} />
          <Switch>
            <Route path="/sign-in">
              <Login
                onInfoTooltip={handleInfoTooltipOpen}
                setLoggedIn={setLoggedIn}
                setCurrentEmail={setCurrentEmail}
                onLogin={handleUserAuthorization}
              />
            </Route>
            <Route path="/sign-up">
              <Register
                onInfoTooltip={handleInfoTooltipOpen}
                onClose={closeAllPopups}
                onRegister={handleUserRegistration}
              />
            </Route>
            <ProtectedRoute
              path="/"
              loggedIn={loggedIn}
              component={Main}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              cards={cards}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
            />
            <Route>{loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}</Route>
          </Switch>
          <Footer />
          {/* <Main
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            cards={cards}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
          /> */}
        </div>

        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />
        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />
        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        <PopupWithForm name="delete" title="Вы уверены?" submitButton="Да"></PopupWithForm>
        <InfoTooltip onClose={closeAllPopups} isOpen={isInfoTooltipOpen} info={info} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
