import React, { Component } from "react";
import "./registerPage.css";
import { User } from "../../models/user";
import { store } from "../../redux/store";
import { Unsubscribe } from "redux";
import { ActionType } from "../../redux/actionType";
import socketService from "../../services/socket-service";
import apiService from "../../services/api-service";
import dispatchActionService from "../../services/dispatchAction-service";
import validationService from "../../services/validation-service";

interface RegisterPageState {
    user: User;
    newUser: User;
    errors: {
        firstNameError: string,
        lastNameError: string,
        usernameError: string,
        passwordError: string
    }
}

export class RegisterPage extends Component<any, RegisterPageState>{

    // Get socket
    public socket = socketService.getSocket();;

    // Function for subscribing to changes in the store
    public unsubscribeStore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            user: null,
            newUser: new User(),
            errors: {
                firstNameError: "*",
                lastNameError: "*",
                usernameError: "*",
                passwordError: "*"
            }
        };
    }

    public componentDidMount(): void {
        this.unsubscribeStore = store.subscribe(() =>
            this.setState({ user: store.getState().user }));
    }

    // The component will unsubscribe to updates from store a moment before the component will end it's life cycle:
    public componentWillUnmount(): void {
        this.unsubscribeStore();
    }

    // Getting the input first name from user and saving it in the state
    public setFirstName = (e: any): void => {
        const firstName = e.target.value;
        let errorMessage = validationService.validateText(firstName, "first name");
        // let errorMessage = "";
        // if (firstName === "") {
        //     errorMessage = "Missing first name";
        // }
        // if (firstName.includes("'")) {
        //     errorMessage = ` Apostrophe " ' " is a forbidden character!`;
        // }
        const newUser = { ...this.state.newUser };
        const errors = { ...this.state.errors };
        newUser.firstName = firstName;
        errors.firstNameError = errorMessage;
        this.setState({ newUser, errors });
    };

    // Getting the input last name from user and saving it in the state
    public setLastName = (e: any): void => {
        const lastName = e.target.value;
        let errorMessage = validationService.validateText(lastName, "last name");

        // let errorMessage = "";
        // if (lastName === "") {
        //     errorMessage = "Missing last name"
        // }
        // if (lastName.includes("'")) {
        //     errorMessage = ` Apostrophe " ' " is a forbidden character!`;
        // }
        const newUser = { ...this.state.newUser };
        const errors = { ...this.state.errors };
        newUser.lastName = lastName;
        errors.lastNameError = errorMessage;
        this.setState({ newUser, errors });
    };

    // Getting the input username from user and saving it in the state
    public setUsername = (e: any): void => {
        const username = e.target.value;
        let errorMessage = "";
        const newUser = { ...this.state.newUser };
        newUser.username = username;
        this.setState({ newUser });

        if (username === "") {
            errorMessage = "Missing username"
        }
        if (username === "Admin") {
            errorMessage = "Invalid username"
        }
        if (username.length < 4) {
            errorMessage = "Username must be at least 4 digits"
        }
        if (username.includes("'")) {
            errorMessage = ` Apostrophe " ' " is a forbidden character!`;
        }
        const errors = { ...this.state.errors };
        errors.usernameError = errorMessage;
        this.setState({ errors });

    };

    // Getting the input password from user and saving it in the state
    public setPassword = (e: any): void => {
        const password = e.target.value;
        let errorMessage = "";
        if (password === "") {
            errorMessage = "Missing password"
        }
        if (password.length < 4) {
            errorMessage = "Password must be at least 4 digits"
        }
        if (password.includes("'")) {
            errorMessage = ` Apostrophe " ' " is a forbidden character!`;
        }
        const newUser = { ...this.state.newUser };
        const errors = { ...this.state.errors };
        newUser.password = password;
        errors.passwordError = errorMessage;
        this.setState({ newUser, errors });
    };

    // Checks if form legal
    public isFormLegal(): boolean {
        return this.state.errors.firstNameError === "" &&
            this.state.errors.lastNameError === "" &&
            this.state.errors.usernameError === "" &&
            this.state.errors.passwordError === "";
    }

    //Sends the user to the login page 
    public login = (): void => {
        this.props.history.push("/login");
    };

    // The component's HTML that is being rendered:
    public render(): JSX.Element {
        return (
            <div className="register-page">
                <form>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <small className="register-error-note">*All fields are requierd</small>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input type="text" placeholder="*First Name" className="register-class"
                                           onChange={this.setFirstName} value={this.state.newUser.firstName} />
                                    <small className="register-error-note">{this.state.errors.firstNameError}</small>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input type="text" placeholder="*Last Name" className="register-class"
                                           onChange={this.setLastName} value={this.state.newUser.lastName} />
                                    <small className="register-error-note">{this.state.errors.lastNameError}</small>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input type="text" placeholder="*Username" className="register-class"
                                           onChange={this.setUsername} value={this.state.newUser.username} />
                                    <small className="register-error-note">{this.state.errors.usernameError}</small>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input type="password" placeholder="*Password" className="register-class"
                                           onChange={this.setPassword} value={this.state.newUser.password} />
                                    <small className="register-error-note">{this.state.errors.passwordError}</small>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <button type="button" disabled={!this.isFormLegal()} className="register-button" onClick={this.addUser}>Register</button>
                                    <button type="button" onClick={this.cancelRegistration} className="cancel-button">Cancel</button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p className="login-text">Already a member? Login here</p>
                                    <button type="button" className="login-button" onClick={this.login}>Login</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div >
        );
    }

    // Add user
    private addUser = (): void => {
        apiService.addUser(JSON.stringify(this.state.newUser))
            .then(result => {
                if (result) {
                    dispatchActionService.dispatchAction(ActionType.GetOneUser, result);
                    this.props.history.push("/vacations/user/" + result.id);
                }
                else {
                    // If username already exists - would ask the user to choose a different name :
                    let errorMessage = "Sorry! Username is not available. Choose a different one";
                    const errors = { ...this.state.errors };
                    errors.usernameError = errorMessage;
                    errors.passwordError = "*";
                    this.setState({ errors });
                    this.props.history.push("/register");
                    const username = "";
                    const password = "";
                    this.setState({ newUser: { ...this.state.newUser, username, password } });
                }
            })
            .catch(err => alert(err.message));
    };

    // Cancel registration and going back to login page
    private cancelRegistration = (): void => {
        this.props.history.push("/login");
    }
}