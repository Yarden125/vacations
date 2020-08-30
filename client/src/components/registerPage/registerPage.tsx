import React, { Component } from "react";
import "./registerPage.css";
import { User } from "../../models/user";
import { store } from "../../redux/store";
// import socketIOClient from "socket.io-client";
import { Unsubscribe } from "redux";
import { ActionType } from "../../redux/actionType";
import socketService from "../../services/socket-service";

interface RegisterPageState {
    users: User[];
    user: User;
    errors: {
        firstNameError: string,
        lastNameError: string,
        usernameError: string,
        passwordError: string
    }
}

export class RegisterPage extends Component<any, RegisterPageState>{

    // Socket function
    public socket;

    // Function for subscribing to changes in the store
    public unsubscribeStore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            users: [],
            user: new User(),
            errors: {
                firstNameError: "*",
                lastNameError: "*",
                usernameError: "*",
                passwordError: "*"
            }
        };
        this.unsubscribeStore = store.subscribe(() =>
            this.setState({ users: store.getState().users }));
    }

    // The component will unsubscribe to updates from store a moment before the component will end it's life cycle:
    public componentWillUnmount(): void {
        this.unsubscribeStore();
    }

    // Getting the input first name from user and saving it in the state
    public setFirstName = (e: any): void => {
        const firstName = e.target.value;
        let errorMessage = "";
        if (firstName === "") {
            errorMessage = "Missing first name";
        }
        if (firstName.includes("'")) {
            errorMessage = ` Apostrophe " ' " is a forbidden character!`;
        }
        const user = { ...this.state.user };
        const errors = { ...this.state.errors };
        user.firstName = firstName;
        errors.firstNameError = errorMessage;
        this.setState({ user, errors });
    };

    // Getting the input last name from user and saving it in the state
    public setLastName = (e: any): void => {
        const lastName = e.target.value;
        let errorMessage = "";
        if (lastName === "") {
            errorMessage = "Missing last name"
        }
        if (lastName.includes("'")) {
            errorMessage = ` Apostrophe " ' " is a forbidden character!`;
        }
        const user = { ...this.state.user };
        const errors = { ...this.state.errors };
        user.lastName = lastName;
        errors.lastNameError = errorMessage;
        this.setState({ user, errors });
    };

    // Getting the input username from user and saving it in the state
    public setUsername = (e: any): void => {
        const username = e.target.value;
        let errorMessage = "";
        const user = { ...this.state.user };
        user.username = username;
        this.setState({ user });

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
        const user = { ...this.state.user };
        const errors = { ...this.state.errors };
        user.password = password;
        errors.passwordError = errorMessage;
        this.setState({ user, errors });
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
                                <td><input type="text" placeholder="*First Name" className="register-class"
                                    onChange={this.setFirstName} value={this.state.user.firstName} />
                                    <small className="register-error-note">{this.state.errors.firstNameError}</small>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input type="text" placeholder="*Last Name" className="register-class"
                                        onChange={this.setLastName} value={this.state.user.lastName} />
                                    <small className="register-error-note">{this.state.errors.lastNameError}</small>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input type="text" placeholder="*Username" className="register-class"
                                        onChange={this.setUsername} value={this.state.user.username} />
                                    <small className="register-error-note">{this.state.errors.usernameError}</small>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input type="password" placeholder="*Password" className="register-class"
                                        onChange={this.setPassword} value={this.state.user.password} />
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
        fetch("http://localhost:3001/api/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(this.state.user)
        })
            .then(response => response.json())
            .then(result => {
                if (result) {
                    // If username doesn't exists - registen and login automatically to the new user's page
                    this.socket = socketService.getSocket();
                    // this.socket = socketIOClient("http://localhost:3001");
                    // this.socket = socketIOClient("http://localhost:3002");
                    const userId = result.id;
                    this.socket.emit("new-user-is-logged-in", { loggedIn: true, userId: userId });
                    this.socket.on("new-user-now-logged-in", user => {
                        const action = { type: ActionType.GetOneUser, payload: user };
                        store.dispatch(action);
                        this.socket.disconnect();
                        this.props.history.push("/vacations/user/" + result.id);
                    });
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
                    this.setState({ user: { ...this.state.user, username, password } });
                }
            })
            .catch(err => alert(err.message));
    };

    // Cancel registration and going back to login page
    private cancelRegistration = (): void => {
        this.props.history.push("/login");
    }
}