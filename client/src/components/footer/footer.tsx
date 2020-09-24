import React, { Component } from "react";
import "./footer.css";

export class Footer extends Component{
    public render():JSX.Element{
        return(
            <div className="footer">
                <p>&copy;All Rights Reserved - Yarden Mor</p>
                <p className="github">GitHub - <a href="https://github.com/Yarden125/vacations" target="_blank" rel="noopener noreferrer">https://github.com/Yarden125/vacations</a></p>
            </div>
        )
    }
}