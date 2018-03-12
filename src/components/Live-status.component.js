import React, { Component } from 'react';
import { getLiveStatus, toggleLiveStatusRoute, getStateFromStorage } from '../actions/user.action';
import { getLiveStatusService } from '../services/railway.service';
import { validateTrainNumber, validateDate } from '../validators/Live-status-form.validator';
import { Loader } from './Loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadState } from '../storage/localStorage';
import Pikaday from 'pikaday';

class LiveStatus extends Component {

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.findRoute = this.findRoute.bind(this);
        this.validateOnChange = this.validateOnChange.bind(this);
        this.onFocusDate = this.onFocusDate.bind(this);
        this.state = {
            loader: true,
            // API response fields
            successResponse: true,
            errorResponse: undefined,
            // form validation fields
            dateInputClass: 'form-control',
            dateValidateErrors: [],
            trainNumberInputClass: 'form-control',
            trainNumberValidateErrors: [],
            pikadayInstanceAvailable: false
        }
    }

    componentDidMount() {
        this.setState((prevState) => ({
            loader: false
        }))
        const persistedState = loadState();
        if (persistedState && persistedState.railway.live_status && !this.props.railway.live_status) {
            this.props.getStateFromStorage(persistedState.railway);
        }
    }

    onFocusDate(e) {
        if (!this.state.pikadayInstanceAvailable) {
            this.setState(prevState => ({
                pikadayInstanceAvailable: true
            }))
            new Pikaday({
                field: e.target,
                format: 'DD-MM-YYYY'
            });
        }
    }

    onSubmit(e) {
        e.preventDefault();
        const trainNumber = e.target.elements.trainNumber.value;
        const date = e.target.elements.date.value;
        validateDate(date);
        const validateErrors = validateTrainNumber(trainNumber);
        if (validateErrors.date.length > 0 || validateErrors.trainNumber.length > 0) {
            if (validateErrors.date.length > 0) {
                this.setState((prevState) => ({
                    dateValidateErrors: validateErrors.date,
                    dateInputClass: 'form-control is-invalid'
                }))
            } else {
                this.setState((prevState) => ({
                    dateValidateErrors: [],
                    dateInputClass: 'form-control'
                }))
            }
            if (validateErrors.trainNumber.length > 0) {
                this.setState((prevState) => ({
                    trainNumberValidateErrors: validateErrors.trainNumber,
                    trainNumberInputClass: 'form-control is-invalid'
                }))
            } else {
                this.setState((prevState) => ({
                    trainNumberValidateErrors: [],
                    trainNumberInputClass: 'form-control'
                }))
            }
        } else {
            this.setState((prevState) => ({
                date: date,
                trainNumber: trainNumber,
                loader: true
            }));
            getLiveStatusService({ trainNumber, date }).then(
                (res) => {
                    if (res.response_code === 200) {
                        this.props.getLiveStatus({ live_status: res });
                        if (this.props.railway.live_status) {
                            this.props.railway.live_status = { ...this.props.railway.live_status, toggleRoute: false }
                        }
                        this.setState((prevState) => ({
                            loader: false,
                            successResponse: true,
                            errorResponse: false
                        }));
                    } else if (res.response_code === 502) {
                        this.setState((prevState) => ({
                            loader: false,
                            successResponse: false,
                            errorResponse: true,
                            trainNumberInputClass: 'form-control',
                            dateInputClass: 'form-control'
                        }));
                    }
                }
            );
        }
    }

    findRoute(e) {
        e.preventDefault();
        setTimeout(function () {
            window.scrollTo(0, document.body.scrollHeight);
        }, 0)
        this.props.toggleLiveStatusRoute(!this.props.railway.live_status.toggleRoute);
    }

    validateOnChange(e) {
        let elementName = e.target.name;
        let validateErrors;
        if (elementName === 'date') {
            validateErrors = validateDate(e.target.value)
            if (validateErrors.date.length > 0) {
                this.setState((prevState) => ({
                    dateValidateErrors: validateErrors.date,
                    dateInputClass: 'form-control is-invalid'
                }))
            } else {
                this.setState((prevState) => ({
                    dateValidateErrors: [],
                    dateInputClass: 'form-control'
                }))
            }
        }

        if (elementName === 'trainNumber') {
            validateErrors = validateTrainNumber(e.target.value)
            if (validateErrors.trainNumber.length > 0) {
                this.setState((prevState) => ({
                    trainNumberValidateErrors: validateErrors.trainNumber,
                    trainNumberInputClass: 'form-control is-invalid'
                }))
            } else {
                this.setState((prevState) => ({
                    trainNumberValidateErrors: [],
                    trainNumberInputClass: 'form-control'
                }))
            }
        }
    }

    render() {
        return (
            <div className="container mt-3">
                {
                    this.state.loader
                        ?
                        (
                            <div>
                                <Loader loader={this.state.loader} />
                            </div>
                        )
                        :
                        (
                            <div>
                                <div className="justify-content-md-center row">
                                    <div className="col-sm-6">
                                        {
                                            this.state.errorResponse && (
                                                <div className="mt-2">
                                                    <div className="alert alert-danger text-center" role="alert">
                                                        Bad Request
                                                    </div>
                                                </div>
                                            )
                                        }
                                        <div className="card">
                                            <div className="card-header bg-info text-white">
                                                Get live status of train
                                            </div>
                                            <div className="card-body">
                                                <form onSubmit={this.onSubmit}>
                                                    <div className="form-group">
                                                        <label htmlFor="trainNumber">Train Number</label>
                                                        <input
                                                            type="text"
                                                            id="trainNumber"
                                                            name="trainNumber"
                                                            placeholder="Enter Train Number"
                                                            className={this.state.trainNumberInputClass}
                                                            onBlur={this.validateOnChange}
                                                        />
                                                        {
                                                            this.state.trainNumberValidateErrors.length > 0 && this.state.trainNumberValidateErrors.map((err) =>
                                                                (
                                                                    <div className="invalid-feedback" key={err}>
                                                                        {err}
                                                                    </div>
                                                                )
                                                            )
                                                        }
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="datepicker">Date</label>
                                                        <input
                                                            type="text"
                                                            id="datepicker"
                                                            ref="datepicker"
                                                            name="date"
                                                            placeholder="DD-MM-YYYY"
                                                            className={this.state.dateInputClass}
                                                            onFocus={this.onFocusDate}
                                                            onBlur={this.validateOnChange}
                                                        />
                                                        {
                                                            this.state.dateValidateErrors.length > 0 && this.state.dateValidateErrors.map((err) =>
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
                                <br />
                                {
                                    this.props.railway.live_status && this.state.successResponse &&
                                    (
                                        <div className="card">
                                            <div className="card-header bg-info text-white">
                                                Train Number : {this.props.railway.live_status.train.number}
                                            </div>
                                            <div className="mt-2">
                                                <table className="table table-light">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Train Number</th>
                                                            <th scope="col">Train Name</th>
                                                            <th scope="col">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>{this.props.railway.live_status.train.number}</td>
                                                            <td>{this.props.railway.live_status.train.name}</td>
                                                            <td>{this.props.railway.live_status.position}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <div className="mt-2">
                                                    <button className="btn btn-info" onClick={this.findRoute} data-spy="scroll" data-target="#myScrollspy">Check Route</button>

                                                </div>
                                                {
                                                    this.props.railway.live_status.route && this.props.railway.live_status.toggleRoute &&
                                                    (
                                                        <table className="table table-light mt-2 myScrollspy" id="myScrollspy">
                                                            <thead>
                                                                <tr>
                                                                    <th scope="col">Station name</th>
                                                                    <th scope="col">Station code</th>
                                                                    <th scope="col">Arrived</th>
                                                                    <th scope="col">Depart</th>
                                                                    <th scope="col">Schedule Arrival</th>
                                                                    <th scope="col">Schedule Departure</th>
                                                                    <th scope="col">Actual Arrival</th>
                                                                    <th scope="col">Actual Departure</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    this.props.railway.live_status.route.map((route) => {
                                                                        return (
                                                                            <tr key={route.station.name}>
                                                                                <td>{route.station.name}</td>
                                                                                <td>{route.station.code}</td>
                                                                                <td>{route.scharr ? route.scharr.toUpperCase() === 'SOURCE' ? '-' : (route.has_arrived ? 'Yes' : 'No') : ''}</td>
                                                                                <td>{route.has_departed ? 'Yes' : 'No'}</td>
                                                                                <td>{route.scharr}</td>
                                                                                <td>{route.schdep}</td>
                                                                                <td>{route.actarr}</td>
                                                                                <td>{route.actdep}</td>
                                                                            </tr>
                                                                        )
                                                                    })
                                                                }

                                                            </tbody>
                                                        </table>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        )
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        railway: state.railway,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getLiveStatus: getLiveStatus,
        toggleLiveStatusRoute: toggleLiveStatusRoute,
        getStateFromStorage: getStateFromStorage
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveStatus);
