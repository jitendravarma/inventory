import React from 'react';
import ReactDOM from 'react-dom';

import DashboardHeader from '../components/DashboardHeader';

import { ToastContainer } from 'react-toastify';
import { getRequest, postRequest, getHeaders, postHeaders, notify } from '../utils/Utils';
import { Button, Form, Input } from 'reactstrap';

import { COMPANY_API } from '../utils/constants'

class CompanyPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gst: '',
            companies: [],
            company_name: '',
        }
    }

    // handles form validation and notifies the user for the same
    handleValidation = () => {
        if (!this.state.company_name) {
            notify("Company name cannot be empty!", 'error');
            return false;
        }
        if (!this.state.gst) {
            notify("GST cannot be empty!", 'error');
            return false;
        }
        var regexp = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if (!regexp.test(this.state.gst)) {
            notify("Please enter a valid GST number", 'error')
        }
        return true;
    }

    // event handler for on submit of profile form
    onSubmit = () => {
        var isValid = this.handleValidation();
        if (isValid) {
            var post_data = {
                "name": this.state.company_name,
                "gst_no": this.state.gst,
            }
            var body = JSON.stringify(post_data)
            postRequest(COMPANY_API, body, this.handleSubmitResponse, "POST", postHeaders);
        }
    }

    // callback event for profile form submit
    handleSubmitResponse = (data) => {
        if (data.header.status == 1) {
            notify(data.body.msg)
            var state = this.state;
            console.log(data.body)
            console.log("data.body")
            state['companies'] = data.body.data;
            this.setState({ state })
        } else {
            notify(data.errors.errorList[0]['field_error'], 'error')
        }
    }

    // handle input text change 
    handleTextChange = (e) => {
        if (e.target.name == 'company_name') {
            this.setState({ company_name: e.target.value });
        }
        if (e.target.name == 'gst') {
            this.setState({ gst: e.target.value });
        }
    }

    componentDidMount() {
        this.getCompanies();
    }

    getCompanies = () => {
        getRequest(COMPANY_API, this.setCompany, getHeaders);
    }

    // callback function to set profile
    setCompany = (data) => {
        if (data) {
            this.setState({
                companies: data.body.results,
            })
        }
    }

    render() {
        var table = "";
        // render history table
        if (this.state.companies.length > 0) {
            table = <table className="table table-striped">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>GST</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.companies.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.gst_no}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        }
        return (
            <React.Fragment>
                <ToastContainer />
                <DashboardHeader
                    fullName={this.state.fullName}
                    profilePic={this.state.profilePic}
                />
                <ToastContainer />
                <div className="row justify-content-center">
                    <div className="col-md-4 m-4 p-3">
                        <center>
                            <h4>Company</h4>
                        </center>
                        <Form>
                            <div className="form-group">
                                <label >Name</label>
                                <Input type="text" className="form-control" name="company_name"
                                    placeholder="Enter company name" value={`${this.state.company_name}`}
                                    onChange={this.handleTextChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>GST No</label>
                                <Input type="text" className="form-control" name="gst"
                                    placeholder="John" value={`${this.state.gst}`}
                                    onChange={this.handleTextChange} />
                            </div>
                            <div>
                                <Button color="primary" size="md" onClick={this.onSubmit}>Add</Button>
                            </div>
                        </Form>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-6 m-4">
                        {table}
                    </div>
                </div>

            </React.Fragment>
        );
    }
}

export default CompanyPage;

ReactDOM.render(<CompanyPage />, document.getElementById('root'));
