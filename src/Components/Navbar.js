import React from 'react';
import "../styles/navbar.css";
import Modal from 'react-modal';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import queryString from "query-string";

Modal.defaultStyles.overlay.backgroundColor = '#0000008e';
const customStyles = {
    content: {
        padding: '1rem 2rem 1rem 2rem',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        borderRadius: '6px',
        width: '456px',
        height: '540px'
    },
};

const customStylesSign = {
    content: {
        padding: '1rem 2rem 1rem 2rem',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        borderRadius: '6px',
        width: '456px',
        height: '610px'
    },
};

const customSuccesStyles = {
    content: {
        padding: '1rem 2rem 1rem 2rem',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        borderRadius: '6px',
        width: '456px',
        height: '200px'
    },
};

class Navbar extends React.Component {
    constructor() {
        super();
        this.state = {
            showLoginModal: false,
            isLoggedIn: false,
            userName: undefined,
            showSignUpModal: false,
            signupSuccessModal: false
        }
    }

    openUserSec = () => {
        if (document.getElementById("openMenu").classList.contains("open") && document.getElementById("menuItems").classList.contains("show")) {
            document.getElementById("openMenu").classList.remove("open")
            document.getElementById("menuItems").classList.remove("show")
        }
        else {
            document.getElementById("openMenu").classList.add("open")
            document.getElementById("menuItems").classList.add("show")
        }
    }

    goHome = () => {
        console.log("Home Working");
        console.log(this.props.history);
        this.props.history.push("/");
    }

    handleModal = (state, value) => {
        this.setState({ [state]: value })
        this.openUserSec();
    }


    signUp = () => {
        this.handleModal('showLoginModal', false);
        this.handleModal('showSignUpModal', true);
    }

    login = () => {
        this.handleModal('showLoginModal', true);
        this.handleModal('showSignUpModal', false);
        this.handleModal('signupSuccessModal', false)
    }

    responseGoogle = (response) => {
        console.log(response);

        const newUserGoogle= {
            FN: response.profileObj.givenName,
            LN: response.profileObj.familyName,
            email: response.profileObj.email,
            pass: "Signed in by Google"
        }

        axios({
            method: 'POST',
            url: 'https://obscure-stream-64864.herokuapp.com/signup',
            headers: { 'Content-Type': 'application/json' },
            data: newUserGoogle
        })
            .then()
            .catch(error => console.log(error))

        this.handleModal("showSignUpModal", false)
        this.handleModal('signupSuccessModal', true)
    
        this.setState({ isLoggedIn: true, userName: response.profileObj.givenName, showLoginModal: false, showSignUpModal: false });
    }

    responseFacebook = (response) => {
        const newUserGoogle= {
            FN: response.name,
            LN: response.name,
            email: response.userID,
            pass: "Signed in by Facebook"
        }

        axios({
            method: 'POST',
            url: 'https://obscure-stream-64864.herokuapp.com/signup',
            headers: { 'Content-Type': 'application/json' },
            data: newUserGoogle
        })
            .then()
            .catch(error => console.log(error))

        this.handleModal("showSignUpModal", false)
        this.handleModal('signupSuccessModal', true)
        this.setState({ isLoggedIn: true, userName: response.name, showLoginModal: false, showSignUpModal: false });
    }

    loginResponseGoogle = (response) => {
        const loginCreds = {
            username: response.profileObj.email,
            password: "Signed in by Google"
        }
        
        axios({
            method: 'POST',
            url: 'https://obscure-stream-64864.herokuapp.com/login',
            headers: { 'Content-Type': 'application/json' },
            data: loginCreds
        })
            .then(response => {
                if (response.data.isAuthenticated){
                    console.log("Reached Here")
                    this.setState({isLoggedIn: true});
                    this.setState({userName: response.profileObj.givenName});
                } else {
                    alert("You don't have a account. Please create an account first!")
                }
            })
            .catch(error => console.log(error))
           
        this.handleModal("showLoginModal", false)
    }

    loginResponseFacebook = (response) =>{
        const loginCreds = {
            username: response.userID,
            password: "Signed in by Facebook"
        }
        
        axios({
            method: 'POST',
            url: 'https://obscure-stream-64864.herokuapp.com/login',
            headers: { 'Content-Type': 'application/json' },
            data: loginCreds
        })
            .then(response => {
                if (response.data.isAuthenticated){
                    console.log("Reached Here")
                    this.setState({isLoggedIn: true});
                    this.setState({userName: response.name});
                } else {
                    alert("You don't have a account. Please create an account first!")
                }
            })
            .catch(error => console.log(error))
           
        this.handleModal("showLoginModal", false)
    }

    handleLogout = () => {
        this.setState({ isLoggedIn: false, username: undefined });
    }

    signUpValForm = (e) => {
        function isEmail(email) {
            return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                email
            );
        }

        let count = 0;

        const fName = document.getElementById("FN");
        const LName = document.getElementById("LN");
        const Uname = document.getElementById("username");
        const pass = document.getElementById("pwd");

        const errMessage = document.getElementById("errmsg");
        const passErrMessage = document.getElementById("passerrmsg");
        const FNErrMessage = document.getElementById("FNerrmsg");
        const LNErrMessage = document.getElementById("LNerrmsg");

        const border = document.getElementById("userBorder");
        const passBorder = document.getElementById("passBorder");
        const FNBorder = document.getElementById("FNBorder");
        const LNBorder = document.getElementById("LNBorder");

        if (fName.value.trim() === "" || fName.value.trim() === null){
            FNErrMessage.innerHTML = "Can't be Empty";
            FNBorder.style.borderColor = "red";
        } else {
            count += 1;
            FNErrMessage.innerHTML = "";
            FNBorder.style.borderColor = "green";
        }
        
        if (LName.value.trim() === "" || LName.value.trim() === null){
            LNErrMessage.innerHTML = "Can't be Empty";
            LNBorder.style.borderColor = "red";
        } else {
            count += 1;
            LNErrMessage.innerHTML = "";
            LNBorder.style.borderColor = "green";
        }


        if (Uname.value.trim() === "" || Uname.value.trim() === null) {
            errMessage.innerHTML = "This field can't be empty";
            border.style.borderColor = "red";
        } else if (!isEmail(Uname.value.trim())) {
            errMessage.innerHTML = "Please enter a valid email";
            border.style.borderColor = "red";
        } else {
            count += 1;
            errMessage.innerHTML = "";
            border.style.borderColor = "green";
        }

        if (pass.value.trim() === "" || pass.value.trim() === null) {
            passErrMessage.innerHTML = "This field can't be empty";
            passBorder.style.borderColor = "red";
        } else {
            count += 1;
            passErrMessage.innerHTML = "";
            passBorder.style.borderColor = "green";
        }
        console.log(count);

        if (count === 4){
            e.preventDefault();

            const newUser = {
                FN: e.target[0].value,
                LN: e.target[1].value,
                email: e.target[2].value,
                pass: e.target[3].value
            }

            axios({
                method: 'POST',
                url: 'https://obscure-stream-64864.herokuapp.com/signup',
                headers: { 'Content-Type': 'application/json' },
                data: newUser
            })
                .then()
                .catch(error => console.log(error))

            this.handleModal("showSignUpModal", false)
            this.handleModal('signupSuccessModal', true)
        } else {
            e.preventDefault();
        }

    }

    loginValForm = (e) => {
        // const {isLoggedIn, userName}=this.state;
        e.preventDefault();

        const loginCreds = {
            username: e.target[0].value,
            password: e.target[1].value
        }
        
        axios({
            method: 'POST',
            url: 'https://obscure-stream-64864.herokuapp.com/login',
            headers: { 'Content-Type': 'application/json' },
            data: loginCreds
        })
            .then(response => {
                if (response.data.isAuthenticated){
                    console.log("Reached Here")
                    this.setState({isLoggedIn: true});
                    this.setState({userName: response.data.user[0]?.firstName});
                }
            })
            .catch(error => console.log(error))
           
        this.handleModal("showLoginModal", false)
        
    }

    render() {
        const { showLoginModal, showSignUpModal, signupSuccessModal, isLoggedIn, userName } = this.state;
        const { bgcolor = "crimson", opcOfLogo = "1" } = this.props;
        return (
            <div className="outerDIV">
                <div className="navbar" style={{ backgroundColor: bgcolor }}>
                    <div className="logo" onClick={this.goHome} style={{ opacity: opcOfLogo }}>e!</div>
                    <div id="openMenu" className="hamburgerIcon" onClick={this.openUserSec}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    {isLoggedIn ? <div className="user-sec" id="menuItems">
                        <a onClick={this.handleLogout}>Logout</a>
                        <a href="/">{userName}</a>
                    </div> : <div className="user-sec" id="menuItems">
                        <a onClick={() => this.handleModal('showLoginModal', true)}>Login</a>
                        <a onClick={() => this.handleModal('showSignUpModal', true)}>Create an Account</a>
                    </div>}

                </div>

                {/* LOGIN Modal */}
                <Modal
                    isOpen={showLoginModal}
                    style={customStyles}
                    onRequestClose={() => this.handleModal('showLoginModal', false)}
                    shouldCloseOnOverlayClick={true}
                >
                    <div className="loginModal">
                        <i class="iconLoginModal fas fa-times" onClick={() => this.handleModal('showLoginModal', false)}></i>
                        <h1 className="login">Login</h1>

                        <form action="" onSubmit={this.loginValForm}>
                            <div className="wrapIconInput" id="userBorder">
                                <i class="iconInput fas fa-solid fa-user"></i>
                                <input type="text" id="username" className="inFields" placeholder="Username or email" autoComplete='off' />
                                <div className="errMsg" id='errmsg'></div>
                            </div>
                            <div className="wrapIconInput" id='passBorder'>
                                <i class="iconInput fas fa-solid fa-lock"></i>
                                <input type="password" id="pwd" className="inFields" placeholder="Password" />
                                <div className="errMsg" id='passerrmsg'></div>
                            </div>
                            <button className="wrapIconInput" id="loginBtn">Login</button>

                        </form>

                        <div className="divider">
                            <span>or</span>
                        </div>


                        <GoogleLogin
                            clientId="780502215129-j754hcv83ovmqh81uguakfu2kc244os1.apps.googleusercontent.com"
                            render={renderProps => (
                                <button className="GMlogin loginModalFields" onClick={renderProps.onClick} disabled={renderProps.disabled}>
                                    <i className="fab fa-brands fa-google"></i>
                                    Conitnue with Google</button>
                            )}
                            buttonText="Login"
                            onSuccess={this.loginResponseGoogle}
                            onFailure={this.loginResponseGoogle}
                            cookiePolicy={'single_host_origin'}
                        />

                        <FacebookLogin
                            appId="335306071960189"
                            autoLoad={false}
                            callback={this.loginResponseFacebook}
                            render={renderProps => (
                                <button className="FBlogin loginModalFields" onClick={renderProps.onClick}>
                                    <i className="fab fa-brands fa-facebook"></i>
                                    Continue with Facebook
                                </button>
                            )}
                        />

                        <div className="lineInModal"></div>

                        <div className="signup">
                            Don’t have account? <span onClick={() => this.signUp()}>Sign UP</span>
                        </div>

                    </div>
                </Modal>

                {/* SignUP Modal */}
                <Modal
                    isOpen={showSignUpModal}
                    style={customStylesSign}
                    onRequestClose={() => this.handleModal('showSignUpModal', false)}
                    shouldCloseOnOverlayClick={true}
                >
                    <div className="loginModal">
                        <i class="iconLoginModal fas fa-times" onClick={() => this.handleModal('showSignUpModal', false)}></i>
                        <h1 className="signUp">Sign Up</h1>

                        <form action="" onSubmit={this.signUpValForm}>
                            <div className="wrapFNLN">
                                <div className="wrapIconInput" id="FNBorder">
                                    <input type="text" name="" id="FN" autoComplete='off' placeholder='First Name' />
                                    <div className="errMsg" id='FNerrmsg'></div>
                                </div>
                                <div className="wrapIconInput" id="LNBorder">
                                    <input type="text" name=""  id="LN" autoComplete='off' placeholder='Last Name' />
                                    <div className="errMsg" id='LNerrmsg'></div>
                                </div>
                                
                            </div>
                            <div className="wrapIconInput" id="userBorder">
                                <i class="iconInput fas fa-solid fa-user"></i>
                                <input type="text" name="" id="username" className="inFields" placeholder="Email" autoComplete='off' />
                                <div className="errMsg" id='errmsg'></div>
                            </div>
                            <div className="wrapIconInput" id='passBorder'>
                                <i class="iconInput fas fa-solid fa-lock"></i>
                                <input type="password" name="" id="pwd" className="inFields" placeholder="Password" />
                                <div className="errMsg" id='passerrmsg'></div>
                            </div>
                            <button type="submit" className="wrapIconInput" id="loginBtn">Sign Up</button>
                        </form>

                        <div className="divider">
                            <span>or</span>
                        </div>

                        <GoogleLogin
                            clientId="780502215129-j754hcv83ovmqh81uguakfu2kc244os1.apps.googleusercontent.com"
                            render={renderProps => (
                                <button className="GMlogin loginModalFields" onClick={renderProps.onClick} disabled={renderProps.disabled}>
                                    <i className="fab fa-brands fa-google"></i>
                                    Conitnue with Google</button>
                            )}
                            buttonText="Login"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            cookiePolicy={'single_host_origin'}
                        />

                        <FacebookLogin
                            appId="335306071960189"
                            autoLoad={false}
                            callback={this.responseFacebook}
                            render={renderProps => (
                                <button className="FBlogin loginModalFields" onClick={renderProps.onClick}>
                                    <i className="fab fa-brands fa-facebook"></i>
                                    Continue with Facebook
                                </button>
                            )}
                        />

                        <div className="lineInModal"></div>

                        <div className="signup">
                            Already have an account? <span onClick={() => this.login()}>Login</span>
                        </div>

                    </div>
                </Modal>
                {/* SignUp Success Indicator */}
                <Modal
                    isOpen={signupSuccessModal}
                    style={customSuccesStyles}
                    onRequestClose={() => this.handleModal('signupSuccessModal', false)}
                    shouldCloseOnOverlayClick={true}
                >
                    <div className="wrapSucces">
                        <h1>You have successfully signed with us!!!</h1>
                        <button className="wrapIconInput" id="loginBtn" onClick={this.login}>Login</button>
                    </div>

                </Modal>
                
            </div>
        )
    }
}


export default withRouter(Navbar)