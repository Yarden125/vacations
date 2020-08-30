import React, { Component } from "react";
import "./logout.css";
import { NavLink } from "react-router-dom";

export class Logout extends Component {

    public render(): JSX.Element {
        return (
            <div className="logout">
                <NavLink to="/login" exact className="logout-class-inactive" activeClassName="logout-class-active">Logout</NavLink>
            </div>
        );
    }
}