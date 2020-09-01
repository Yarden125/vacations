import React, { Component } from "react";
import "./addVacation.css";
import { Vacation } from "../../models/vacation";
import { Heading } from "../heading/heading";
import socketService from "../../services/socket-service";
import apiService from "../../services/api-service";

interface AddVacationState {
    vacation: Vacation;
    images: any;
    currentDate: string;
    chosenImage: string;
    errors: {
        errorDescription: string,
        errorDestination: string,
        errorImages: string,
        errorStart: string,
        errorEnd: string,
        errorPrice: string
    }
}

export class AddVacation extends Component<any, AddVacationState>{

    // Get socket:
    private socket = socketService.getSocket();
    // private currentDate = this.getDate();

    public constructor(props: any) {
        super(props);
        this.state = {
            vacation: new Vacation(),
            images: [],
            currentDate: "",
            chosenImage: "No image",
            errors: {
                errorDescription: "",
                errorDestination: "",
                errorImages: "",
                errorStart: "",
                errorEnd: "",
                errorPrice: "",
            }
        };
    }

    // Getting the current date when component builds itself
    public componentDidMount(): void {
        this.getDate();
        // let date = this.getDate();
        // this.setState({ currentDate:date });
        // console.log(date);
        // console.log(this.state.currentDate);
        // console.log("componentDidMount");
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
        const vacation = { ...this.state.vacation };
        const errors = { ...this.state.errors };
        vacation.destination = destination;
        errors.errorDestination = errorMessage;
        this.setState({ vacation, errors });
    };

    // Getting the input image from the admin and saving it in the state
    public setImage = (e: any): void => {
        const images = e.target.files[0];
        let errorMessage = "";
        const errors = { ...this.state.errors };
        const chosenImage = e.target.files[0].name;
        if (images === undefined) {
            errorMessage = "Missing image";
        }
        errors.errorImages = errorMessage;
        this.setState({ images, errors, chosenImage });
    };

    // Getting the input description from the admin and saving it in the state
    public setDescription = (e: any): void => {
        const description = e.target.value;
        let errorMessage = "";
        if (description === "") {
            errorMessage = " Missing description";
        }
        if (description.includes("'")) {
            errorMessage = ` Apostrophe " ' " is a forbidden character!`;
        }
        const vacation = { ...this.state.vacation };
        const errors = { ...this.state.errors };
        vacation.description = description;
        errors.errorDescription = errorMessage;
        this.setState({ vacation, errors });
    };

    // Getting the input price from the admin and saving it in the state
    public setPrice = (e: any): void => {
        const price = +e.target.value;
        let errorMessage = "";
        if (price === null) {
            errorMessage = "Missing price";
        }
        const vacation = { ...this.state.vacation };
        const errors = { ...this.state.errors };
        vacation.price = price;
        errors.errorPrice = errorMessage;
        this.setState({ vacation, errors });
    };

    // Getting the input start date from the admin and saving it in the state
    public setStart = (e: any): void => {
        const start = e.target.value;
        let errorMessage = "";
        if (start === "") {
            errorMessage = "Missing start date";
        }
        const vacation = { ...this.state.vacation };
        const errors = { ...this.state.errors };
        vacation.start = start;
        errors.errorStart = errorMessage;
        this.setState({ vacation, errors });
    };

    // Get current date:
    public getDate(): any {
        let today = new Date();
        let dd = String(today.getDate());
        let mm = String(today.getMonth() + 1);
        let yyyy = today.getFullYear();
        // return yyyy + "-" + mm + "-" + dd;

        const currentDate = yyyy + "-" + mm + "-" + dd;
        this.setState({ currentDate });
    }

    // Getting the input end date from the admin and saving it in the state
    public setEnd = (e: any): void => {
        const end = e.target.value;
        let errorMessage = "";
        if (end === "") {
            errorMessage = "Missing end date";
        }
        const vacation = { ...this.state.vacation };
        const errors = { ...this.state.errors };
        vacation.end = end;
        errors.errorEnd = errorMessage;
        this.setState({ vacation, errors });
    };

    // Checking if form legal:
    public isFormLegal(): boolean {
        return this.state.errors.errorDestination === "" &&
            this.state.errors.errorDescription === "" &&
            this.state.errors.errorPrice === "" &&
            this.state.errors.errorStart === "" &&
            this.state.errors.errorEnd === "" &&
            this.state.errors.errorImages === "" &&
            this.state.vacation.destination !== "" &&
            this.state.vacation.description !== "" &&
            this.state.vacation.price !== null &&
            this.state.vacation.start !== "" &&
            this.state.vacation.end !== "";
    }

    // Text and Error text function
    public renderDetailsArea(text,error){
        return (
            <>
              <small className="add-vacation-error-note">{text}</small>
              <small className="add-vacation-error-note">{error}</small>
            </>
        );
    }

    // The component's HTML that is being rendered:
    public render(): JSX.Element {
        return (
            <div className="add-vacation">
                <div className="vacation-container-top">
                    <form className="add-vacation-form" action="/upload-image" method="POST" encType="multipart/form-data">
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <Heading>Adding Vacation</Heading>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <small className="add-vacation-error-note">*All fields are requierd</small>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input className="input-class" type="text" onChange={this.setDestination} value={this.state.vacation.destination} />
                                        {this.renderDetailsArea("Destination",this.state.errors.errorDestination)}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <textarea className="textarea-class" onChange={this.setDescription} value={this.state.vacation.description}></textarea>
                                        {this.renderDetailsArea("Description",this.state.errors.errorDescription)}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input className="input-class" type="number" onChange={this.setPrice} value={this.state.vacation.price} />
                                        {this.renderDetailsArea("Price",this.state.errors.errorPrice)}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input className="input-class" type="date" min={this.state.currentDate} max={this.state.vacation.end} onChange={this.setStart} value={this.state.vacation.start} />
                                        {this.renderDetailsArea("Start",this.state.errors.errorStart)}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input className="input-class" type="date" min={this.state.vacation.start} onChange={this.setEnd} value={this.state.vacation.end} />
                                        {this.renderDetailsArea("End",this.state.errors.errorEnd)}
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
                            <small className="image-uploader-note">{this.state.errors.errorImages}</small>
                        </div>
                        <button type="button" disabled={!this.isFormLegal()} onClick={this.addVacation} className="add-button">Add Vacation</button>
                        <button type="button" onClick={this.cancelAdding} className="cancel-button">Cancel</button>
                    </form>
                </div>
            </div>
        );
    }

    // Adding the vacation
    private addVacation = (): void => {
        this.socket.emit("admin-is-logging-out", true);
        const fd = new FormData();
        fd.append('vacationImage', this.state.images);
        fd.append("vacation", JSON.stringify(this.state.vacation));
        apiService.addVacation(fd);
        this.props.history.push("/admin");
    }

    // Canceling the changes and going back to admin page
    public cancelAdding = (): void => {
        this.socket.emit("admin-is-logging-out", true);
        this.props.history.push("/admin");
    }
}