import React, { Component } from "react";
import "./updateVacation.css";
import { Vacation } from "../../models/vacation";
import { Heading } from "../heading/heading";
import socketService from "../../services/socket-service";
import apiService from "../../services/api-service";
import dateService from "../../services/date-service";
import validationService from "../../services/validation-service";

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

    // Getting the specific requested vacation to update - Called immediately after a component is mounted
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

    // Getting the destination input from the admin and saving it in the state
    public setDestination = (e: any): void => {
        const destination = e.target.value;
        let errorMessage = validationService.validateInput(destination, "destination");
        const vacationToUpdate = { ...this.state.vacationToUpdate };
        const errors = { ...this.state.errors };
        vacationToUpdate.destination = destination;
        errors.errorDestination = errorMessage;
        this.setState({ vacationToUpdate, errors });
    };

    // Getting the image input from the admin and saving it in the state
    public setImage = (e: any): void => {
        const images = e.target.files[0];
        if (e.target.files[0] !== undefined) {
            const chosenImage = e.target.files[0].name;
            this.setState({ images, chosenImage });
        }
    };

    // Getting the description input from the admin and saving it in the state
    public setDescription = (e: any): void => {
        const description = e.target.value;
        let errorMessage = validationService.validateInput(description, "description");
        const vacationToUpdate = { ...this.state.vacationToUpdate };
        const errors = { ...this.state.errors };
        vacationToUpdate.description = description;
        errors.errorDescription = errorMessage;
        this.setState({ vacationToUpdate, errors });
    };

    // Getting the price input from the admin and saving it in the state
    public setPrice = (e: any): void => {
        const price = +e.target.value;
        let errorMessage = validationService.validatePrice(price);
        const vacationToUpdate = { ...this.state.vacationToUpdate };
        const errors = { ...this.state.errors };
        vacationToUpdate.price = price;
        errors.errorPrice = errorMessage;
        this.setState({ vacationToUpdate, errors });
    };

    // Getting the start date input from the admin and saving it in the state
    public setStart = (e: any): void => {
        const start = e.target.value;
        let errorMessage = validationService.validateInput(start, "start date");
        const vacationToUpdate = { ...this.state.vacationToUpdate };
        const errors = { ...this.state.errors };
        vacationToUpdate.start = start;
        errors.errorStart = errorMessage;
        this.setState({ vacationToUpdate, errors });
    };

    // Getting the end date input from the admin and saving it in the state
    public setEnd = (e: any): void => {
        const end = e.target.value;
        let errorMessage = validationService.validateInput(end, "end date");
        const vacationToUpdate = { ...this.state.vacationToUpdate };
        const errors = { ...this.state.errors };
        vacationToUpdate.end = end;
        errors.errorEnd = errorMessage;
        this.setState({ vacationToUpdate, errors });
    };

    // Get current date:
    public getDate(): void {
        const currentDate = dateService.getTheDate();
        this.setState({ currentDate });
    }

    // Checking if form is legal:
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

    // Text and Error text function
    public renderDetailsArea(text: string, error: string): JSX.Element {
        return (
            <>
                <small className="update-vacation-error-note">{text}</small>
                <small className="update-vacation-error-note">{error}</small>
            </>
        );
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
                                        <small className="update-vacation-error-note">*All fields are requierd</small>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input className="input-update-vacation" type="text" onChange={this.setDestination} value={this.state.vacationToUpdate.destination} />
                                        {this.renderDetailsArea("Destination", this.state.errors.errorDestination)}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <textarea className="textarea-update-vacation" onChange={this.setDescription} value={this.state.vacationToUpdate.description}></textarea>
                                        {this.renderDetailsArea("Description", this.state.errors.errorDescription)}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input className="input-update-vacation" type="number" onChange={this.setPrice} value={this.state.vacationToUpdate.price} />
                                        {this.renderDetailsArea("Price", this.state.errors.errorPrice)}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input className="input-update-vacation" type="date" min={this.state.currentDate} max={this.state.vacationToUpdate.end} onChange={this.setStart} value={this.state.vacationToUpdate.start} />
                                        {this.renderDetailsArea("Start", this.state.errors.errorStart)}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input className="input-update-vacation" type="date" min={this.state.vacationToUpdate.start} onChange={this.setEnd} value={this.state.vacationToUpdate.end} />
                                        {this.renderDetailsArea("End", this.state.errors.errorEnd)}
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

    // Save changes, update vacation and goes back to admin page
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