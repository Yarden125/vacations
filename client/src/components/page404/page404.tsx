import React, { Component } from "react";
import "./page404.css";
import { NavLink } from "react-router-dom";

export class Page404 extends Component {
    public render(): JSX.Element {
        return (
            <div className="page-404">
                <p>Oops! Something went wrong!</p>
                <NavLink to="/login" exact className="home-class-inactive" activeClassName="home-class-active">Home</NavLink>
            </div>
        );
    }
}