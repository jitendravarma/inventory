import React from 'react';
import ReactDOM from 'react-dom';
import DashboardHeader from '../components/DashboardHeader';

import Select from 'react-select';

import { ToastContainer } from 'react-toastify';
import { getRequest, postRequest, getHeaders, postHeaders, notify } from '../utils/Utils';
import { Button, Form, Input } from 'reactstrap';

import { PRODUCT_API } from '../utils/constants'

class ProductPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cost: '',
            products: [],
            companies: [],
            product_name: '',
            companyId: '',
            companyName: '',
        }
    }

    // handles form validation and notifies the user for the same
    handleValidation = () => {
        if (!this.state.product_name) {
            notify("Product name cannot be empty!", 'error');
            return false;
        }
        if (!this.state.cost) {
            notify("Cost cannot be empty!", 'error');
            return false;
        }
        if (!this.state.companyId) {
            notify("Please select a company!", 'error');
            return false;
        }
        return true;
    }

    // event handler for on submit of profile form
    onSubmit = () => {
        var isValid = this.handleValidation();
        if (isValid) {
            var post_data = {
                "name": this.state.product_name,
                "price": this.state.cost,
                "company": this.state.companyId,
            }
            console.log(this.state.companyId);
            var body = JSON.stringify(post_data);
            postRequest(PRODUCT_API, body, this.handleSubmitResponse, "POST", postHeaders);
        }
    }

    // callback event for profile form submit
    handleSubmitResponse = (data) => {
        if (data.header.status == 1) {
            notify(data.body.msg)
            this.setState({
                products: data.body.data,
            })
        } else {
            notify(data.errors.errorList[0]['field_error'], 'error')
        }
    }

    // handle input text change 
    handleTextChange = (e) => {
        if (e.target.name == 'product_name') {
            this.setState({ product_name: e.target.value });
        }
        if (e.target.name == 'cost') {
            this.setState({ cost: e.target.value });
        }
    }

    componentDidMount() {
        this.getInitial();
    }

    getInitial = () => {
        getRequest(PRODUCT_API, this.setProduct, getHeaders);
    }

    // callback function to set profile
    setProduct = (data) => {
        if (data) {
            this.setState({
                companies: data.body.companies,
                products: data.body.results,
            })
        }
    }

    // handle dropdown change
    handleDDChange = (e) => {
        var state = this.state;
        state.companyName = e.label;
        state.companyId = e.value;
        this.setState(state)
    }


    render() {
        var table = "";
        // render history table
        if (this.state.products.length > 0) {
            table = <table className="table table-striped">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Company</th>
                        <th>Cost</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.products.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.company.name}</td>
                                <td>{item.price}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        }
        var company_dd = [];
        this.state.companies.map((item) => {
            company_dd.push({ 'label': item.name, 'value': item.id })
        })
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
                            <h4>Products</h4>
                        </center>
                        <Form>
                            <div className="form-group">
                                <label >Name</label>
                                <Input type="text" className="form-control" name="product_name"
                                    placeholder="Enter product name" value={`${this.state.product_name}`}
                                    onChange={this.handleTextChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Company</label>
                                <Select refs="adgroup"
                                    value={{ value: this.state.companyId, label: this.state.companyName }}
                                    onChange={(e) => this.handleDDChange(e)}
                                    options={company_dd} />
                            </div>
                            <div className="form-group">
                                <label>Cost</label>
                                <Input type="text" className="form-control" name="cost"
                                    placeholder="100.00" value={`${this.state.cost}`}
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

export default ProductPage;

ReactDOM.render(<ProductPage />, document.getElementById('root'));
