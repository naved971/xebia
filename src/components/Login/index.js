import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { StoreContext } from '../../context/StoreContext'
import Auth from '../../helper/Authenticate'
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', 
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const SignIn = (props) => {
    const classes = useStyles();
    const { doLogin } = React.useContext(StoreContext);
    const [loginRequest, setLoginRequest] = React.useState(false);
    const [userName, setUserName] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        let didCancel = false;
        if (loginRequest)
            (async () => {
                try {
                    setLoading(true);
                    const [loginResult] = await Promise.all([doLogin(userName, password)]);
                    if (!didCancel) {
                        if (loginResult) {
                            Auth.authenticate(() => props.history.push("/search"), userName)
                        }else{
                            alert("Login Failed Try again ")
                        }
                        setLoginRequest(false);
                        setLoading(false);
                    }
                } catch (error) {
                    throw error;
                }
            })();

        return () => {
            didCancel = true;
        };
    }, [loginRequest]);

    return (

        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        setLoginRequest(true);
                    }}
                    className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)} />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={`${classes.submit} d-flex `}
                    >

                        Sign In

                        {loading && <CircularProgress className="mar-20" color="inherit" size={20} />}
                    </Button>

                </form>
            </div>

        </Container>
    );
}

export default SignIn;