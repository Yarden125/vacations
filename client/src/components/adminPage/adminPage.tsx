import React, { Component } from "react";
import "./adminPage.css";
import { Vacation } from "../../models/vacation";
import { Unsubscribe } from "redux";
import { store } from "../../redux/store";
import { ActionType } from "../../redux/actionType";
import Modal from 'react-bootstrap/Modal';
import { Admin } from "../../models/admin";
import socketService from "../../services/socket-service";
import apiService from "../../services/api-service";
import dispatchActionService from "../../services/dispatchAction-service";
import Button from 'react-bootstrap/Button';
import dateService from "../../services/date-service";

interface AdminPageState {
    vacations: Vacation[];
    vacation: Vacation;
    adminUsername: string;
    admin: Admin[];
    modalIsOpen: boolean;
    currentVacationID: number;
    currentDestination: string;
    currentImage: string;
}

export class AdminPage extends Component<any, AdminPageState>{

    // Get socket:
    private socket = socketService.getSocket();

    // function for subscribing to changes in the store
    public unsubscribeStore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            vacation: new Vacation(),
            vacations: store.getState().vacations,
            adminUsername: "",
            admin: store.getState().admin,
            modalIsOpen: false,
            currentVacationID: null,
            currentDestination: "",
            currentImage: ""
        };
    }

    // When the component builds itself it will first check if Admin is logged in:
    public componentDidMount(): void {
        this.unsubscribeStore = store.subscribe(() =>
            this.setState({ vacations: store.getState().vacations, admin: store.getState().admin }));
        this.isAdminLoggedIn();
    }

    // checks if Admin is logged in:
    public isAdminLoggedIn(): void {
        apiService.isTheAdminLoggedIn()
            .then(result => {
                if (result) {
                    // If logged in- getAdmin
                    this.getAdmin();
                }
                else {
                    // If not logged in - destroys component and go to login page
                    this.componentWillUnmount()
                    this.props.history.push("/login");
                }
            })
            .catch(err => alert(err.message));
    }

    // get admin from API
    public getAdmin(): void {
        if (store.getState().admin.length === 0) {
            apiService.getTheAdmin()
                .then(admin => {
                    dispatchActionService.dispatchAction(ActionType.GetAdmin, admin);
                })
                .catch(err => alert(err.message));
        }
        this.getAllVacations();
        this.socketsFunctions();
    }

    // Sockets functions:
    public socketsFunctions(): void {

        // Immediate update when vacation was deleted
        this.socket.on("vacation-was-deleted", id => {
            dispatchActionService.dispatchAction(ActionType.DeleteVacation, id);
        });

        // Immediate update when vacation was added
        this.socket.on("vacation-has-been-added", addedVacation => {
            dispatchActionService.dispatchAction(ActionType.AddVacation, addedVacation);
        });

        // Immediate update when vacation was updated
        this.socket.on("vacation-has-been-updated", updatedVacation => {
            dispatchActionService.dispatchAction(ActionType.UpdateFullVacation, updatedVacation);
        });
    }

    // get all vacations from API
    public getAllVacations(): void {
        if (store.getState().vacations.length === 0) {
            apiService.getVacations()
                .then(vacations => {
                    dispatchActionService.dispatchAction(ActionType.GetAllVacations, vacations);
                })
                .catch(err => alert(err.message));
        }
    }

    // The component will unsubscribe to updates from store a moment before the component will end it's life cycle:
    public componentWillUnmount(): void {
        this.unsubscribeStore();
    }

    public logout = (): void => {
        this.socket.emit("admin-is-logging-out", false);
        dispatchActionService.dispatchAction(ActionType.ResetState, null);
        this.props.history.push("/login");
    }

    // Add Vacation
    public addVacation = (): void => {
        this.props.history.push("/admin/add-vacation");
    };

    // Update vacation
    public updateVacation = (id: number): void => {
        this.props.history.push(`/admin/update-vacation/${id}`);
    };

    // The component's HTML that is being rendered
    public render(): JSX.Element {
        return (
            <div className="admin">
                <Button onClick={this.logout} variant="link" className="logout-button">Logout</Button>
                <p className="welcome-admin">Hello {this.state.admin}</p>
                <br />
                <button className="add-vacation-button" onClick={this.addVacation}>Add Vacation</button>
                <br />
                {/* creating the vacation cards */}
                {this.state.vacations.map(v =>
                    <div key={v.id} className="vacation-container-top">
                        <div className="vacations-container">
                            <img src="/assets/icons/pencil.png" alt="pencil-icon" className="pencil"
                                onClick={() => { this.updateVacation(v.id) }} />
                            <img src="/assets/icons/trash.png" className="trash" alt="trash-icon"
                                onClick={() => { this.openModal(v.id, v.destination, v.image) }} />

                            {/* the modal for deleting a vacation */}
                            <Modal show={this.state.modalIsOpen} onHide={this.closeModal}
                                keyboard={false} className="modal-backdrop">
                                <Modal.Body>Are you sure you want to delete {this.state.currentDestination} vacation?</Modal.Body>
                                <Modal.Footer>
                                    <button type="button" className="modal-button-cancel" onClick={this.closeModal}>Cancel</button>
                                    <button type="button" className="modal-button-delete" onClick={this.deleteVacation}>Delete</button>
                                </Modal.Footer>
                            </Modal>
                            <div className="v-destination">
                                <p className="v-destination-p">{v.destination}</p>
                            </div>
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

    // Formatting the date:
    private dateFormat(date: string): string {
        return dateService.formatDate(date);
    }

    // Open Modal function
    public openModal = (id: number, destination: string, image: string): void => {
        this.setState({ modalIsOpen: true, currentVacationID: id, currentDestination: destination, currentImage: image });
    };

    // Close Modal function
    public closeModal = (): void => {
        this.setState({ modalIsOpen: false, currentVacationID: null, currentDestination: "" });
    };

    // Delete Vacation function
    private deleteVacation = (): void => {
        this.setState({ modalIsOpen: false });
        const id = this.state.currentVacationID;
        const image = this.state.currentImage;
        this.socket.emit("admin-delete-vacation", { id: id, image: image });
    };
}