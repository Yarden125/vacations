import React, { Component } from "react";
import "./updateVacation.css";
import { Vacation } from "../../models/vacation";
import { Heading } from "../heading/heading";
import socketService from "../../services/socket-service";
import apiService from "../../services/api-service";

interface UpdateVacationState {
    vacationToUpdate: Vacation;
    images: any,
    currentImage: string;
    currentDate: string;
    chosenImage: string;
    errors: {
        errorDescription: string,
        errorDestination: string
        errorStart: string,
        errorEnd: string,
        errorPrice: string
    }
}

export class UpdateVacation extends Component<any, UpdateVacationState>{

    // Get socket:
    private socket = socketService.getSocket();

    public constructor(props: any) {
        super(props);
        this.state = {
            vacationToUpdate: new Vacation(),
            currentImage: "",
            images: [],
            currentDate: "",
            chosenImage: "",
            errors: {
                errorDescription: "",
                errorDestination: "",
                errorStart: "",
                errorEnd: "",
                errorPrice: "",
            }
        };
    }

    // Getting the specific requested vacation to update - it's one when the component builds itself
    public componentDidMount(): void {
        const id = +this.props.match.params.vacationID;
        apiService.getVacation(id)
            .then(vacation => {
                const vacationToUpdate = vacation;
                this.setState({ vacationToUpdate });
                const currentImage = this.state.vacationToUpdate.image;
                this.setState({ currentImage });
            })
            .catch(err => alert(err.message));
        this.getDate();
    }

    // will disconnect  and return to admin page a moment before the component destroys itself
    public componentWillUnmount(): void {
        this.socket.emit("admin-is-logging-out", true);
    }

    // Getting the input destination from the admin and saving it in the state
    public setDestination = (e: any): void => {
        const destination = e.target.value;
        let errorMessage = "";
        if (destination === "") {
            errorMessage = "Missing destination";
        }
        if (destination.includes("'")) {
            errorMessage = ` Apostrophe " ' " is a forbidden character!`;
        }
        const vacationToUpdate = { ...this.state.vacationToUpdate };
        const errors = { ...this.state.errors };
        vacationToUpdate.destination = destination;
        errors.errorDestination = errorMessage;
        this.setState({ vacationToUpdate, errors });
    };

    // Getting the input image from the admin and saving it in the state
    public setImage = (e: any): void => {
        const images = e.target.files[0];
        if (e.target.files[0] !== undefined) {
            const chosenImage = e.target.files[0].name;
            this.setState({ images, chosenImage });
        }
    };

    // Getting the input description from the admin and saving it in the state
    public setDescription = (e: any): void => {
        const description = e.target.value;
        let errorMessage = "";
        if (description === "") {
            errorMessage = "Missing description";
        }
        if (description.includes("'")) {
            errorMessage = ` Apostrophe " ' " is a forbidden character!`;
        }
        const vacationToUpdate = { ...this.state.vacationToUpdate };
        const errors = { ...this.state.errors };
        vacationToUpdate.description = description;
        errors.errorDescription = errorMessage;
        this.setState({ vacationToUpdate, errors });
    };

    // Getting the input price from the admin and saving it in the state
    public setPrice = (e: any): void => {
        const price = +e.target.value;
        let errorMessage = "";
        if (price === null) {
            errorMessage = "Missing price";
        }
        const vacationToUpdate = { ...this.state.vacationToUpdate };
        const errors = { ...this.state.errors };
        vacationToUpdate.price = price;
        errors.errorPrice = errorMessage;
        this.setState({ vacationToUpdate, errors });
    };

    // Getting the input start date from the admin and saving it in the state
    public setStart = (e: any): void => {
        const start = e.target.value;
        let errorMessage = "";
        if (start === "") {
            errorMessage = "Missing start date";
        }
        const vacationToUpdate = { ...this.state.vacationToUpdate };
        const errors = { ...this.state.errors };
        vacationToUpdate.start = start;
        errors.errorStart = errorMessage;
        this.setState({ vacationToUpdate, errors });
    };

    // Getting the input end date from the admin and saving it in the state
    public setEnd = (e: any): void => {
        const end = e.target.value;
        let errorMessage = "";
        if (end === "") {
            errorMessage = "Missing end date";
        }
        const vacationToUpdate = { ...this.state.vacationToUpdate };
        const errors = { ...this.state.errors };
        vacationToUpdate.end = end;
        errors.errorEnd = errorMessage;
        this.setState({ vacationToUpdate, errors });
    };

    // Get current date:
    public getDate(): void {
        let today = new Date();
        let dd = String(today.getDate());
        let mm = String(today.getMonth() + 1);
        let yyyy = today.getFullYear();
        const currentDate = yyyy + "-" + mm + "-" + dd;
        this.setState({ currentDate });
    }

    // Checking if form legal:
    public isFormLegal(): boolean {
        return this.state.errors.errorDestination === "" &&
            this.state.errors.errorDescription === "" &&
            this.state.errors.errorPrice === "" &&
            this.state.errors.errorStart === "" &&
            this.state.errors.errorEnd === "" &&
            this.state.vacationToUpdate.destination !== "" &&
            this.state.vacationToUpdate.description !== "" &&
            this.state.vacationToUpdate.price !== null &&
            this.state.vacationToUpdate.start !== "" &&
            this.state.vacationToUpdate.end !== "";
    }

    // The component's HTML that is being rendered:
    public render(): JSX.Element {
        return (
            <div className="update-vacation">
                <div className="update-vacation-container-top">
                    <form>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <Heading>Updating Vacation</Heading>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input className="input-update-vacation" type="text" onChange={this.setDestination} value={this.state.vacationToUpdate.destination} />
                                        <small className="update-vacation-error-note">Destination</small>
                                        <small className="update-vacation-error-note">{this.state.errors.errorDestination}</small>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <textarea className="textarea-update-vacation" onChange={this.setDescription} value={this.state.vacationToUpdate.description}></textarea>
                                        <small className="update-vacation-error-note">Description</small>
                                        <small className="update-vacation-error-note">{this.state.errors.errorDescription}</small>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input className="input-update-vacation" type="number" onChange={this.setPrice} value={this.state.vacationToUpdate.price} />
                                        <small className="update-vacation-error-note">Price</small>
                                        <small className="update-vacation-error-note">{this.state.errors.errorPrice}</small>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input className="input-update-vacation" type="date" min={this.state.currentDate} max={this.state.vacationToUpdate.end} onChange={this.setStart} value={this.state.vacationToUpdate.start} />
                                        <small className="update-vacation-error-note">Start</small>
                                        <small className="update-vacation-error-note">{this.state.errors.errorStart}</small>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input className="input-update-vacation" type="date" min={this.state.vacationToUpdate.start} onChange={this.setEnd} value={this.state.vacationToUpdate.end} />
                                        <small className="update-vacation-error-note">End</small>
                                        <small className="update-vacation-error-note">{this.state.errors.errorEnd}</small>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="image-uploader-div">
                            <label className="image-uploader-lable">Choose Image
                            <input id="vacation-image" multiple={false} formAction="/upload-image" type="file" formEncType="multipart/form-data"
                                    accept="image/*" name="vacationImage" onChange={this.setImage} className="image-uploader" />
                            </label>
                            <small className="image-uploader-note">{this.state.chosenImage}</small>
                        </div>
                        <button type="button" disabled={!this.isFormLegal()} onClick={this.saveChanges} className="update-button">Save changes</button>
                        <button type="button" onClick={this.cancelChanges} className="cancel-button">Cancel</button>
                    </form>
                </div>
            </div>
        );
    }

    // Save changes and update vacation
    public saveChanges = (): void => {
        this.socket.emit("admin-is-logging-out", true);
        const fd = new FormData();
        fd.append('vacationImage', this.state.images);
        fd.append("vacation", JSON.stringify(this.state.vacationToUpdate));
        fd.append("prevImage", this.state.currentImage);
        apiService.updateVacation(fd);
        this.props.history.push("/admin");
    };

    // Doesn't save changes and go back to admin page
    public cancelChanges = (): void => {
        this.socket.emit("admin-is-logging-out", true);
        this.props.history.push("/admin");
    };
}