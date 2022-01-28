import React from 'react';
import headerLogo from '../images/Vector.svg';
import { Link, useLocation } from 'react-router-dom';

function Header({ loggedIn, currentEmail, onSignOut }) {
  const { pathname } = useLocation();
  const textToggle = `${pathname === '/sign-in' ? 'Регистрация' : 'Войти'}`;
  const linkToggle = `${pathname === '/sign-in' ? '/sign-up' : '/sign-in'}`;

  function handleSignOut() {
    onSignOut();
  }

  return (
    <div className="header">
      <img src={headerLogo} className="header__logo" alt="Лого" />
      <div className="header__container">
        {loggedIn ? (
          <>
            <p className="header__email">{currentEmail}</p>
            <Link to="" className="header__logout" onClick={handleSignOut}>
              Выйти
            </Link>
          </>
        ) : (
          <Link to={linkToggle} className="header__link">
            {textToggle}
          </Link>
        )}
      </div>
    </div>
  );
}

export default Header;
