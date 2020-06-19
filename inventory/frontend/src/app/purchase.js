import React from 'react';
import ReactDOM from 'react-dom';
import DashboardHeader from '../components/DashboardHeader';

import Select from 'react-select';

import { ToastContainer } from 'react-toastify';
import { getRequest, postRequest, getHeaders, postHeaders, notify } from '../utils/Utils';
import { Button, Form, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { PURCHASE_API, DOWNLOAD_PDF, PRODUCT_API } from '../utils/constants'

class PurchasePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cost: '',
            purchases: [],
            products: [],
            companies: [],
            quantity: '',
            companyId: '',
            companyName: '',
            productId: '',
            productName: '',
            invoiceModal: false,
            last_id: '',
        }
    }

    // handles form validation and notifies the user for the same
    handleValidation = () => {
        if (!this.state.quantity) {
            notify("Quantity cannot be empty!", 'error');
            return false;
        }
        if (!this.state.productId) {
            notify("Product cannot be empty!", 'error');
            return false;
        }
        if (!this.state.companyId) {
            notify("Company cannot be company!", 'error');
            return false;
        }
        return true;
    }

    // event handler for on submit of profile form
    onSubmit = () => {
        var isValid = this.handleValidation();
        if (isValid) {
            var post_data = {
                "company": this.state.companyId,
                "product": this.state.productId,
                "quantity": this.state.quantity,
            }
            var body = JSON.stringify(post_data);
            postRequest(PURCHASE_API, body, this.handleSubmitResponse, "POST", postHeaders);
        }
    }

    // callback event for profile form submit
    handleSubmitResponse = (data) => {
        if (data.header.status == 1) {
            notify(data.body.msg)
            this.setState({
                purchases: data.body.purchases,
                invoiceModal: true,
                last_id: data.body.id,
            })
        } else {
            notify(data.errors.errorList[0]['field_error'], 'error')
        }
    }

    // handle input text change 
    handleTextChange = (e) => {
        this.setState({ quantity: e.target.value });
    }

    componentDidMount() {
        this.getInitial();
    }

    getInitial = () => {
        getRequest(PURCHASE_API, this.setPurchase, getHeaders);
    }

    // callback function to set profile
    setPurchase = (data) => {
        if (data) {
            this.setState({
                companies: data.body.companies,
                products: data.body.products,
                purchases: data.body.purchases,
            })
        }
    }

    toggleinvoiceModal = () => {
        this.setState({ invoiceModal: !this.state.invoiceModal })
    }

    getProducts = () => {
        var URL = PRODUCT_API + this.state.companyId;
        console.log(URL);
        getRequest(URL, this.setProducts, getHeaders);
    }

    setProducts = (data) => {
        if (data) {
            this.setState({
                products: data.body.results,
            })
        }
    }

    // handle dropdown change
    handleDDChange = (e) => {
        var state = this.state;
        state.companyName = e.label;
        state.companyId = e.value;
        this.setState(state);
        this.getProducts();
    }

    handleProductDDChange = (e) => {
        var state = this.state;
        state.productName = e.label;
        state.productId = e.value;
        this.setState(state);
    }


    handleDownload = (e) => {
        var URL = DOWNLOAD_PDF + this.state.last_id
        getRequest(URL, this.doNothing, getHeaders);
    }

    doNothing = (data) => { }

    render() {
        var table = "";
        // render invoice table
        if (this.state.purchases.length > 0) {
            table = <table className="table table-striped">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Product Name</th>
                        <th>Company Name</th>
                        <th>Quantity</th>
                        <th>Rate</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.purchases.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.product.name}</td>
                                <td>{item.company.name}</td>
                                <td>{item.quantity}</td>
                                <td>{item.product.price}</td>
                                <td>{item.quantity * item.product.price}</td>
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

        var products_dd = [];
        this.state.products.map((item) => {
            products_dd.push({ 'label': item.name, 'value': item.id })
        })

        var invoiceTable = '';
        if (this.state.purchases.length > 0) {
            invoiceTable = <table className="table table-striped">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Product Name</th>
                        <th>Company Name</th>
                        <th>Quantity</th>
                        <th>Rate</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.purchases.map((item, index) => {
                        if (index == 0) {
                            return (
                                <tr key={index}>
                                    <td>{item.order_number}</td>
                                    <td>{item.product.name}</td>
                                    <td>{item.company.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.quantity * item.product.price}</td>
                                </tr>
                            );
                        }
                    })}
                </tbody>
            </table>
        }
        return (
            <React.Fragment>
                <ToastContainer />
                <DashboardHeader />
                <ToastContainer />
                <div className="row justify-content-center">
                    <div className="col-md-4 m-4 p-3">
                        <center>
                            <h4>Purchase Order</h4>
                        </center>
                        <Form>
                            <div className="form-group">
                                <label >Product</label>
                                <Select refs="adgroup" name="product"
                                    value={{ value: this.state.productId, label: this.state.productName }}
                                    onChange={(e) => this.handleProductDDChange(e)}
                                    options={products_dd} />
                            </div>
                            <div className="form-group">
                                <label>Company</label>
                                <Select refs="adgroup" name="company"
                                    value={{ value: this.state.companyId, label: this.state.companyName }}
                                    onChange={(e) => this.handleDDChange(e)}
                                    options={company_dd} />
                            </div>
                            <div className="form-group">
                                <label>Quantity</label>
                                <Input type="text" className="form-control" name="quantity"
                                    placeholder="100" value={`${this.state.quantity}`}
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
                <Modal isOpen={this.state.invoiceModal} toggle={this.toggleinvoiceModal} size="lg">
                    <ModalHeader toggle={this.toggleinvoiceModal}>Invoice Details</ModalHeader>
                    <ModalBody>
                        {invoiceTable}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={this.handleDownload}>Download</Button>
                        <Button color="secondary" onClick={this.toggleinvoiceModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        );
    }
}

export default PurchasePage;

ReactDOM.render(<PurchasePage />, document.getElementById('root'));
