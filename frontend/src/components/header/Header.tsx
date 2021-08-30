import { useTypedSelector } from '../../hooks/useTypedSelector';
import { AppBar, Toolbar } from '@material-ui/core';
import Navbar from './Navbar';
import ProfileMenu from './profile/ProfileMenu';
import AuthenticationMenu from './profile/AuthenticationMenu';
import classes from './Header.module.scss';
import logo from '../../assets/img/scale.svg';

const Header: React.FC = () => {
  const token = useTypedSelector((state) => state.authUser.token);

  return (
    <div className={classes.container}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <img src={logo} className={classes.icon} alt="scale" />
          <h1>WeighMe</h1>

          {token ? <ProfileMenu /> : <AuthenticationMenu />}
        </Toolbar>
      </AppBar>
      {token && <Navbar />}
    </div>
  );
};

export default Header;
