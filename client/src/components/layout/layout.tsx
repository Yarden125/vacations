import React, { Component } from "react";
import "./layout.css";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { LoginPage } from "../loginPage/loginPage";
import { AdminPage } from "../adminPage/adminPage";
import { AddVacation } from "../addVacation/addVacation";
import { RegisterPage } from "../registerPage/registerPage";
import { Vacations } from "../vacationsPage/vacationsPage";
import { UpdateVacation } from "../updateVacation/updateVacation";
import { Page404 } from "../page404/page404";
import { Header } from "../header/header";
import socketService from "../../services/socket-service";
import { Footer } from "../footer/footer";

export class Layout extends Component {

    // Initialize socket
    public socket = socketService.initialize();

    // Disconnect from socket immediately before the component is destroyed:
    public componentWillUnmount(): void {
        socketService.disconnect();
    }

    // The component's HTML that is being rendered:
    public render(): JSX.Element {
        return (
            <div className="layout">
                <BrowserRouter>
                    <header>
                        <Header />
                    </header>
                    <main>
                        <Switch>
                            <Route path="/login" exact component={LoginPage} />
                            <Route path="/register" exact component={RegisterPage} />
                            <Route path="/admin" exact component={AdminPage} />
                            <Route path="/admin/add-vacation" exact component={AddVacation} />
                            <Route path="/admin/update-vacation/:vacationID" exact component={UpdateVacation} />
                            <Route path="/vacations/user/:userID" exact component={Vacations} />
                            <Redirect from="/" to="/login" exact />
                            <Route component={Page404} />
                        </Switch>
                        <Footer />
                    </main>
                </BrowserRouter>
            </div>
        );
    }
} 