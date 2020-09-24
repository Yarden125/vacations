import React, { Component } from "react";
import "./loginPage.css";
import { Login } from "../../models/login";
import { Admin } from "../../models/admin";
import { Unsubscribe } from "redux";
import { store } from "../../redux/store";
import { ActionType } from "../../redux/actionType";
import { User } from "../../models/user";
import apiService from "../../services/api-service";
import dispatchActionService from "../../services/dispatchAction-service"
import validationService from "../../services/validation-service";

interface LoginPageState {
    login: Login;
    adminCheckBox: boolean;
    admin: Admin;
    user: User;
    errors: {
        usernameError: string,
        passwordError: string,
        loginError: string
    };
}

export class LoginPage extends Component<any, LoginPageState>{

    // function for subscribing to changes in the store
    public unsubscribeStore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            login: new Login(),
            adminCheckBox: false,
            admin: null,
            user: null,
            errors: {
                usernameError: "*",
                passwordError: "*",
                loginError: ""
            }
        };
    }

    // Called immediately after a component is mounted
    public componentDidMount():void{
        this.unsubscribeStore = store.subscribe(() =>
            this.setState({ admin: store.getState().admin, user: store.getState().user }));
    }

    // The component will unsubscribe to updates from store immediately before the component is destroyed:
    public componentWillUnmount(): void {
        this.unsubscribeStore();
    }

    // Set username input from user/admin and saves it to the state
    public setUsername = (e: any): void => {
        const currentUsername = e.target.value;
        let errorMessage = validationService.validateInput(currentUsername, "username");
        const login = { ...this.state.login };
        const errors = { ...this.state.errors };
        login.username = currentUsername;
        errors.usernameError = errorMessage;
        this.setState({ login, errors });
    };

    // set password input from user/admin and saves it to the state
    public setPassword = (e: any): void => {
        const currentPassword = e.target.value;
        let errorMessage = validationService.validateInput(currentPassword, "password");
        const login = { ...this.state.login };
        const errors = { ...this.state.errors }; 
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
            this.logInAdmin();
        }
        else if (this.state.adminCheckBox === false) {
            this.logInUser();
        }
    };

    // If Admin was checked in the checkbox - get Admin according to login details
    public logInAdmin(): void {
        apiService.loginAdmin(JSON.stringify(this.state.login))
            .then(admin => {
                // If details are correct - would login to Admin:
                if (admin) {
                    dispatchActionService.dispatchAction(ActionType.GetAdmin, admin);
                    this.props.history.push("/admin");
                }
                else {
                    // If details are incorrect - would stay on the login page:
                    this.dealWithIncorrectLogin();
                }
            })
            .catch(err => alert(err.message));
    }

    // If Admin was not checked in the checkbox - get User according to login details 
    public logInUser(): void {
        apiService.loginUser(JSON.stringify(this.state.login))
            .then(result => {
                if(result.checkedLogin){
                    // If details are correct - would login to the user:
                    const userId = result.userDetails.id;
                    dispatchActionService.dispatchAction(ActionType.GetOneUser, result.userDetails);
                    this.props.history.push("/vacations/user/" + userId);
                }
                else {
                    // If details are incorrect - would stay on the login page:
                    this.dealWithIncorrectLogin();
                }
            })
            .catch(err => alert(err.message));
    }

    // Deal with incorrect login:
    public dealWithIncorrectLogin():void{
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