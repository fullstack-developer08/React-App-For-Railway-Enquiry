import React, { Component } from 'react';
import { validatePNRNumber } from '../validators/PNR-status-form.validator';
import { getPNRStatusService } from '../services/railway.service';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getPNRStatus, getStateFromStorage } from '../actions/user.action';
import { Loader } from './Loader';
import { loadState } from '../storage/localStorage';

class PNRStatus extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.validateOnChange = this.validateOnChange.bind(this);
        this.state = {
            loader: true,
            PNRNumberInputClass: 'form-control',
            PNRNumberValidateErrors: [],
            successResponse: true,
        }
    }

    componentDidMount() {
        this.setState((prevState) => ({
            loader: false
        }));
        const persistedState = loadState();
        if (persistedState && persistedState.railway.pnr_status && !this.props.railway.pnr_status) {
            this.props.getStateFromStorage(persistedState.railway);
        }
    }



    onSubmit(e) {
        e.preventDefault();
        const pnr = e.target.elements.PNRNumber.value;
        const validateErrors = validatePNRNumber(pnr);
        if (validateErrors.PNRNumber.length > 0) {
            this.setState((prevState) => ({
                PNRNumberInputClass: 'form-control is-invalid',
                PNRNumberValidateErrors: validateErrors.PNRNumber,
                successResponse: false
            }));
        } else {
            this.setState((prevState) => ({
                loader: true,
                PNRNumberInputClass: 'form-control',
                PNRNumberValidateErrors: [],
                successResponse: true
            }));

            getPNRStatusService(pnr).then((res) => {
                if (res.response_code === 200) {
                    this.props.getPNRStatus({ pnr_status: res });
                    this.setState((prevState) => ({
                        loader: false
                    }));
                }
            })
        }
    }

    validateOnChange(e) {
        let elementName = e.target.name;
        let validateErrors;
        if (elementName === 'PNRNumber') {
            validateErrors = validatePNRNumber(e.target.value);
            if (validateErrors.PNRNumber.length > 0) {
                this.setState((prevState) => ({
                    PNRNumberInputClass: 'form-control is-invalid',
                    PNRNumberValidateErrors: validateErrors.PNRNumber
                }));
            } else {
                this.setState((prevState) => ({
                    PNRNumberInputClass: 'form-control',
                    PNRNumberValidateErrors: []
                }));
            }
        }
    }

    render() {
        return (

            this.state.loader
                ?
                (
                    <div>
                        <Loader loader={this.state.loader} />
                    </div>
                )
                :
                (
                    <div className="container mt-3">
                        <div>
                            <div className="justify-content-md-center row">
                                <div className="col-sm-6">
                                    <div className="card">
                                        <div className="card-header bg-info text-white">
                                            PNR Status
                                </div>
                                        <div className="card-body">
                                            <form onSubmit={this.onSubmit}>
                                                <div className="form-group">
                                                    <label htmlFor="PNRNumber">PNR Number</label>
                                                    <input
                                                        type="text"
                                                        className={this.state.PNRNumberInputClass}
                                                        id="PNRNumber"
                                                        name="PNRNumber"
                                                        placeholder="PNR Number"
                                                        onChange={this.validateOnChange}
                                                    />
                                                    {
                                                        this.state.PNRNumberValidateErrors.length > 0 && this.state.PNRNumberValidateErrors.map((err) =>
                                                            (
                                                                <div className="invalid-feedback" key={err}>
                                                                    {err}
                                                                </div>
                                                            )
                                                        )
                                                    }
                                                </div>
                                                <button type="submit" className="btn btn-info">Submit</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br />
                        {
                            this.props.railway.pnr_status && this.state.successResponse &&
                            (
                                <div className="card">
                                    <div className="card-header bg-info text-white">
                                        PNR Number : {this.props.railway.pnr_status.pnr}
                                    </div>
                                    <div className="mt-2">
                                        <table className="table table-light">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Chart Prepared</th>
                                                    <th scope="col">Train Name</th>
                                                    <th scope="col">Train Number</th>
                                                    <th scope="col">From Station</th>
                                                    <th scope="col">To Station</th>
                                                    <th scope="col">Boarding Point</th>
                                                    <th scope="col">Journey date</th>
                                                    <th scope="col">No. of Passengers</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{this.props.railway.pnr_status.chart_prepared ? 'Yes' : 'No'}</td>
                                                    <td>{this.props.railway.pnr_status.train.name}</td>
                                                    <td>{this.props.railway.pnr_status.train.number}</td>
                                                    <td>{this.props.railway.pnr_status.from_station.code + ' - ' + this.props.railway.pnr_status.from_station.name}</td>
                                                    <td>{this.props.railway.pnr_status.to_station.code + ' - ' + this.props.railway.pnr_status.to_station.name}</td>
                                                    <td>{this.props.railway.pnr_status.boarding_point.code + ' - ' + this.props.railway.pnr_status.boarding_point.name}</td>
                                                    <td>{this.props.railway.pnr_status.doj}</td>
                                                    <td>{this.props.railway.pnr_status.total_passengers}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <br />
                                    <div className="card">
                                        <div className="card-header bg-info text-white">
                                            Passengers Status
                                </div>
                                        <div>
                                            <table className="table table-light">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Number</th>
                                                        <th scope="col">Current Status</th>
                                                        <th scope="col">Booking Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        this.props.railway.pnr_status && this.props.railway.pnr_status.passengers.map((passengerStatus) => {
                                                            return (
                                                                <tr key={passengerStatus.no}>
                                                                    <td>{passengerStatus.no}</td>
                                                                    <td>{passengerStatus.current_status}</td>
                                                                    <td>{passengerStatus.booking_status}</td>
                                                                </tr>
                                                            )
                                                        })
                                                    }

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                )
        )
    }
}

const mapStateToProps = (state) => ({
    railway: state.railway,
})

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        getPNRStatus: getPNRStatus,
        getStateFromStorage: getStateFromStorage
    }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(PNRStatus);