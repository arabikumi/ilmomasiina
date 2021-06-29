import React from 'react';

import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { redirectToLogin } from '../../modules/auth/actions';
import { useTypedDispatch, useTypedSelector } from '../../store/reducers';

import './Header.scss';

const Header = () => {
  const dispatch = useTypedDispatch();
  const loggedIn = useTypedSelector((state) => state.auth.loggedIn);

  return (
    <div className="navbar navbar-default">
      <div className="container">
        <Link
          to={`${PREFIX_URL}/`}
          className="navbar-brand"
        >
          {BRANDING_HEADER_TITLE}
        </Link>
        {loggedIn && (
          <Button
            onClick={() => dispatch(redirectToLogin())}
          >
            Logout
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;
