const auth = {
    authenticate(cb, userName) {
        localStorage.setItem('userName', userName)
        localStorage.setItem("userLoggedIn", true);
        if (cb) cb();

    },
    signout(cb) {
        localStorage.setItem('userName', "")
        localStorage.setItem("userLoggedIn", false);
        if (cb) cb();
    }
}
export default auth;