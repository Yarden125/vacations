import React, { Component } from "react";
import "./header.css";

export class Header extends Component {
    public render(): JSX.Element {
        return (
            <div className="header">
                <h1>VACATIONS</h1>
            </div>
        );
    }
}