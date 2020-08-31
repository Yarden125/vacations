import React, { Component } from "react";
import "./vacationsPage.css";
import { Vacation } from "../../models/vacation";
import { store } from "../../redux/store";
import { ActionType } from "../../redux/actionType";
import { Unsubscribe } from "redux";
import { FollowedVacation } from "../../models/followedVacation";
import { User } from "../../models/user";
import socketService from "../../services/socket-service";
import apiService from "../../services/api-service";

interface VacationsState {
    vacations: Vacation[];
    followedVacation: FollowedVacation;
    followedVacations: FollowedVacation[];
    users: User[];
    currentUserID: number;
    userUsername: string;
    welcomeUser: string;
    myVacations: Vacation[];
    restOfVacations: Vacation[];
    currentVacationID: number;
}

export class Vacations extends Component<any, VacationsState>{

    // Get socket:
    private socket = socketService.getSocket();

    // Subscribing to changes in the store
    public unsubscribeStore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            vacations: store.getState().vacations,
            followedVacation: new FollowedVacation(),
            followedVacations: store.getState().followedVacations,
            users: store.getState().users,
            welcomeUser: "",
            currentUserID: 0,
            userUsername: "",
            currentVacationID: null,
            myVacations: [],
            restOfVacations: [],
        };
        this.unsubscribeStore = store.subscribe(() =>
            this.setState({ vacations: store.getState().vacations, users: store.getState().users, followedVacations: store.getState().followedVacations }));
    }

    // When the component builds itself it will first check if the user is logged in:
    public componentDidMount(): void {
        this.isUserLoggedIn();
    }

    // checks if the user is logged in:
    public isUserLoggedIn(): void {
        const id = +this.props.match.params.userID;
        apiService.isUserLoggedIn(id)
            .then(result => {
                if (result) {
                    // If logged in- getUserPage
                    this.getUserPage();
                }
                else {
                    // If not logged in - destroys component and go to login page
                    this.componentWillUnmount()
                    this.props.history.push("/login");
                }
            })
            .catch(err => alert(err.message));
    }

    // Function that gets the user's page
    public getUserPage(): void {
        this.getAllVacations();
        const id = +this.props.match.params.userID;
        const currentUserID = id;
        this.setState({ currentUserID });
        this.getAllFollowedVacations(id);
        if (isNaN(id)) {
            this.props.history.push("/page404");
        }
        else {
            this.getSpecificUser(id);
        }
        this.socketsFunctions();
    }

    // Sockets functions:
    public socketsFunctions(): void {
        // Immediate update when vacation id being followed
        this.socket.on("vacation-is-being-followed", followedObj => {
            const action = { type: ActionType.AddFollowedVacation, payload: followedObj };
            store.dispatch(action);
            this.splitVacations();
        });

        // Immediate update when vacation is being unfollowed
        this.socket.on("vacation-is-being-unfollowed", unfollowedObj => {
            const action = { type: ActionType.UnfollowVacation, payload: unfollowedObj };
            store.dispatch(action);
            this.splitVacations();
        });

        // Immediate update when vacation was added 
        this.socket.on("vacation-has-been-added", addedVacation => {
            const action = { type: ActionType.AddVacation, payload: addedVacation };
            store.dispatch(action);
            this.splitVacations();
        });

        // Immediate update when vacation was deleted 
        this.socket.on("vacation-was-deleted", id => {
            const action = { type: ActionType.DeleteVacation, payload: id };
            store.dispatch(action);
            this.splitVacations();
        });

        // Immediate update when vacation was updated 
        this.socket.on("vacation-has-been-updated", updatedVacation => {
            const action = { type: ActionType.UpdateFullVacation, payload: updatedVacation };
            store.dispatch(action);
            this.splitVacations();
        });
    }

    // Get all vacations from API
    public getAllVacations(): void {
        if (store.getState().vacations.length === 0) {
            apiService.getVacations()
                .then(vacations => {
                    const action = { type: ActionType.GetAllVacations, payload: vacations };
                    store.dispatch(action);
                })
                .catch(err => alert(err.message));
        }
    }

    // Get all followed vacations by this user
    public getAllFollowedVacations(id: number): void {
        if (store.getState().followedVacations.length === 0) {
            apiService.getFollowedVacation(id)
                .then(followedVacations => {
                    const action = { type: ActionType.GetAllFollowedVacations, payload: followedVacations }
                    store.dispatch(action);
                    this.splitVacations();
                })
                .catch(err => alert(err.message));
        }
    }

    // Splits the vacations to Followed and to Unfollowed
    public splitVacations(): void {
        let followed = [];
        let rest = [];
        for (let i = 0; i < this.state.vacations.length; i++) {
            let vac = this.state.vacations[i];
            let found = false;
            for (let j = 0; j < this.state.followedVacations.length; j++) {
                if (vac.id === this.state.followedVacations[j].vacationID) {
                    found = true;
                }
            }
            if (found) {
                vac.followed = true;
                followed.push(vac);
            } else {
                vac.followed = false;
                rest.push(vac);
            }
        }
        this.setState({ myVacations: followed, restOfVacations: rest });
    }

    // Get the specific user from API
    public getSpecificUser(id: number): void {
        apiService.getUser(id)
            .then(username => {
                const action = { type: ActionType.GetOneUser, payload: username }
                store.dispatch(action);
            })
            .catch(err => alert(err.message));
    }

    // The component will unsubscribe to updates from store a moment before the component will end it's life cycle:
    public componentWillUnmount(): void {
        this.socket.emit("user-is-logging-out", { loggedIn: false, userId: this.state.currentUserID });
        this.unsubscribeStore();
    }

    // The component's HTML that is being rendered
    public render(): JSX.Element {
        return (
            <div className="vacations-page">
                <p className="welcome-user">Hello {this.state.users}</p>
                <br />
                {/* All the Followed vacations */}
                {this.state.myVacations.map(v =>
                    <div key={v.id} className="vacation-container-top">
                        <div className="vacations-container">
                            <label className="yellow-star">
                                <input type="checkbox" defaultChecked={v.followed} className="follow-input"
                                    onChange={(event) => { this.isVacationChecked(v.id, event) }}></input>
                            </label>
                            <div className="v-destination-p">{v.destination}</div>
                            <div className="v-image">
                                <img src={`http://localhost:3001/assets/uploads/${v.image}`} alt="vacation" className="vacation-image" />
                            </div>
                            <div className="v-description">
                                <p className="vacation-details-class-description">{v.description}</p>
                                <p className="vacation-details-class">{v.price + "$"}</p>
                                <p className="vacation-details-class">{this.dateFormat(v.start) + "-" + this.dateFormat(v.end)}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* The rest of the vacations that aren't being followed  */}
                {this.state.restOfVacations.map(v =>
                    <div key={v.id} className="vacation-container-top">
                        <div className="vacations-container">
                            <label className="empty-star">
                                <input type="checkbox" defaultChecked={v.followed} className="unfollow-input"
                                    onChange={(event) => { this.isVacationChecked(v.id, event) }}></input>
                            </label>
                            <div className="v-destination-p">{v.destination}</div>
                            <div className="v-image">
                                <img src={`http://localhost:3001/assets/uploads/${v.image}`} alt="vacation" className="vacation-image" />
                            </div>
                            <div className="v-description">
                                <p className="vacation-details-class-description">{v.description}</p>
                                <p className="vacation-details-class">{v.price + "$"}</p>
                                <p className="vacation-details-class">{this.dateFormat(v.start) + "-" + this.dateFormat(v.end)}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Checkes if vacation is checked. "Checked" means followed, "not checked" means not followed
    public isVacationChecked = (id: number, e: any): void => {
        const userId = +this.props.match.params.userID;
        const checked = e.target.checked;
        if (checked === true) {
            this.followVacation(id, userId);
        }
        else if (checked === false) {
            this.unFollowVacation(id, userId);
        }
    };

    // Follow vacation
    public followVacation(id: number, userId: number): void {
        const followedVacation = { ...this.state.followedVacation };
        followedVacation.userID = userId;
        followedVacation.vacationID = id;
        this.setState({ followedVacation });
        this.socket.emit("user-follow-vacation", followedVacation);
    }

    // Unfollow vacation
    public unFollowVacation(id: number, userId: number): void {
        const followedVacation = { ...this.state.followedVacation };
        followedVacation.userID = userId;
        followedVacation.vacationID = id;
        this.setState({ followedVacation });
        this.socket.emit("user-unfollow-vacation", followedVacation);
    }

    // Changing the date format
    private dateFormat(date: string): string {
        const d = new Date(date);
        let day: any = d.getDate();
        let month: any = (d.getMonth() + 1);
        const year = d.getFullYear();
        if (day < 10) {
            day = "0" + day;
        }
        if (month < 10) {
            month = "0" + month;
        }
        return day + "/" + month + "/" + year;
    }
}