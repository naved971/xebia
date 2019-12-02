import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router-dom'
import Auth from '../../helper/Authenticate';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

const Header = (props) => {
    const classes = useStyles();
    const userName = localStorage.getItem("userName");
    const doLogout = () => {
        Auth.signout(() => props.history.push("/"));
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" className={classes.title}>
                    {userName}
                </Typography>
                <Button className="btn-danger" onClick={doLogout} color="inherit">Logout</Button>
            </Toolbar>
        </AppBar>
    )
}

export default withRouter(Header);