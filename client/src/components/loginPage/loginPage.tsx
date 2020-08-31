import React, { Component } from "react";
import "./loginPage.css";
import { Login } from "../../models/login";
import { Admin } from "../../models/admin";
import { Unsubscribe } from "redux";
import { store } from "../../redux/store";
import { ActionType } from "../../redux/actionType";
import { User } from "../../models/user";
import socketService from "../../services/socket-service";
import apiService from "../../services/api-service"

interface LoginPageState {
    login: Login;
    adminCheckBox: boolean;
    admin: Admin[];
    user: User[];
    errors: {
        usernameError: string,
        passwordError: string,
        loginError: string
    };
}

export class LoginPage extends Component<any, LoginPageState>{

    // Get socket
    private socket = socketService.getSocket();
    
    // function for subscribing to changes in the store
    public unsubscribeStore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            login: new Login(),
            adminCheckBox: false,
            admin: [],
            user: [],
            errors: {
                usernameError: "*",
                passwordError: "*",
                loginError: ""
            }
        };
        this.unsubscribeStore = store.subscribe(() =>
            this.setState({ admin: store.getState().admin, user: store.getState().users }));
    }

    // The component will unsubscribe to updates from store a moment before the component will end it's life cycle:
    public componentWillUnmount(): void {
        this.unsubscribeStore();
    }

    // set Input username date from user/admin and saves it in the state
    public setUsername = (e: any): void => {
        const currentUsername = e.target.value;
        let errorMessage = "";
        const login = { ...this.state.login };
        const errors = { ...this.state.errors };
        if (currentUsername === "") {
            errorMessage = "Mssing username";
        }
        login.username = currentUsername;
        errors.usernameError = errorMessage;
        this.setState({ login, errors });
    };

    // set Input password date from user/admin and saves it in the state
    public setPassword = (e: any): void => {
        const currentPassword = e.target.value;
        let errorMessage = "";
        const login = { ...this.state.login };
        const errors = { ...this.state.errors };
        if (currentPassword === "") {
            errorMessage = "Missing password";
        }
        login.password = currentPassword;
        errors.passwordError = errorMessage;
        this.setState({ login, errors });
    };

    // Ckecks if Admin ckeckbox is ckecked
    public isAdmin = (e: any): void => {
        const admin = e.target.checked;
        if (this.state.adminCheckBox === false) {
            const adminCheckBox = admin;
            this.setState({ adminCheckBox });
        }
        else {
            const adminCheckBox = admin;
            this.setState({ adminCheckBox });
        }
    };

    // According to the checkbox - it will continue with logging in the user or the admin
    public checkLogin = (): void => {
        if (this.state.adminCheckBox === true) {
            this.loginAdmin();
        }
        else if (this.state.adminCheckBox === false) {
            this.loginUser();
        }
    };

    // If Admin was checked in the checkbox - get Admin API according to login details
    public loginAdmin(): void {
        apiService.loginAdmin(JSON.stringify(this.state.login))
            .then(admin => {
                // If details are correct - would log in to Admin:
                if (admin) {
                    this.socket.emit("admin-is-logged-in", true);
                    this.socket.on("admin-now-logged-in", admin => {
                        const action = { type: ActionType.GetAdmin, payload: admin };
                        store.dispatch(action);
                        this.props.history.push("/admin");
                    });
                }
                else {
                    // If details are incorrect - would stay in the login page:
                    let errorMessage = "Username or password don't exist"
                    const errors = { ...this.state.errors };
                    errors.loginError = errorMessage;
                    this.setState({ errors });
                    this.props.history.push("/login");
                    const password = "";
                    const username = ""
                    this.setState({ login: { ...this.state.login, password, username } });
                }
            })
            .catch(err => alert(err.message));
    }

    // If Admin was not checked in the checkbox - get User API according to login details 
    public loginUser(): void {
        apiService.loginUser(JSON.stringify(this.state.login))
            .then(result => {
                // If details are correct - would log in to the specific user:
                if (result.checkedLogin === true) {
                    const userId = result.userDetails[0].id;
                    // socketService.updateUserLoginStatus(userId, true);
                    this.socket.emit("user-is-logged-in", { loggedIn: true, userId: userId });
                    this.socket.on("user-now-logged-in", user => {
                        const action = { type: ActionType.GetOneUser, payload: user };
                        store.dispatch(action);
                        this.props.history.push("/vacations/user/" + userId);
                    });
                }
                else if (result) {
                    // If details are incorrect - would stay in the login page:
                    let errorMessage = `Username or password don't exist`;
                    const errors = { ...this.state.errors };
                    errors.loginError = errorMessage;
                    errors.usernameError = "*";
                    errors.passwordError = "*";
                    this.setState({ errors });
                    this.props.history.push("/login");
                    const username = "";
                    const password = "";
                    this.setState({ login: { ...this.state.login, username, password } });
                }
            })
            .catch(err => alert(err.message));
    }

    // Checked if form is legal
    public isFormLegal(): boolean {
        return this.state.errors.usernameError === "" &&
            this.state.errors.passwordError === "";
    }

    // Sends the user to the register page
    public register = (): void => {
        this.props.history.push("/register");
    };

    // The component's HTML that is being rendered:
    public render(): JSX.Element {
        return (
            <div className="login-page">
                <form>
                    <div className="admin-checkbox-div">
                        <input type="checkbox" checked={this.state.adminCheckBox} onChange={this.isAdmin} className="checkbox-admin" />
                        <label className="admin-text">Admin</label>
                        <br />
                        <small className="admin-text">Admin? Please check the box first and then login</small>
                    </div>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <small className="login-error-note-login">{this.state.errors.loginError}</small>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input type="text" placeholder="*Username" className="input-class" autoFocus
                                        onChange={this.setUsername} value={this.state.login.username} />
                                    <small className="login-error-note">{this.state.errors.usernameError}</small>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input type="password" placeholder="*Password" className="input-class"
                                        onChange={this.setPassword} value={this.state.login.password} />
                                    <small className="login-error-note">{this.state.errors.passwordError}</small>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <button type="button" disabled={!this.isFormLegal()} onClick={this.checkLogin} className="login-button">Login</button>
                    <p className="register-text">Not yet a member? Register here</p>
                    <button type="button" onClick={this.register} className="register-button">Register</button>
                </form>
            </div>
        );
    }
}