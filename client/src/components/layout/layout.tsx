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
import { Logout } from "../logout/logout";
import { Header } from "../header/header";
import socketService from "../../services/socket-service";

export class Layout extends Component {

    // Connecting to socket:
    public componentDidMount():void{
        socketService.initialize();
    }

    // Disconnect from socket a moment before the component will end it's life cycle:
    public componentWillUnmount(): void {
        socketService.disconnect();
    }

    // The component's HTML that is being rendered:
    public render(): JSX.Element {
        return (
            <div className="layout">
                <BrowserRouter>
                    <header>
                        <div className="logout-wrapper">
                            <Logout />
                        </div>
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
                    </main>
                </BrowserRouter>
            </div>
        );
    }
} 