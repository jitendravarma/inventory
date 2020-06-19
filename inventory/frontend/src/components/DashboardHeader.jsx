import React from 'react';

// import common css file
import '../css/App.css';

class DashboardHeader extends React.Component {

    render() {
        return (
            <div className="body-section border">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item active">
                                <a className="nav-link" href="/company">Company <span
                                    className="sr-only">(current)</span></a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/product">Products</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/purchase-order">Purchase Order</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        )
    }
}

export default DashboardHeader