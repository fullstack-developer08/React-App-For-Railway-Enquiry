import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadState } from '../storage/localStorage';
import { Loader } from './Loader';
import Pikaday from 'pikaday';
import { autoCompleteStationService, getTrainBetweenStationsService, checkSeatAvailability } from '../services/railway.service';
import { validateFromStation, validateToStation, validateDate } from '../validators/TrainBetweenStationForm.validator'
import { getTrainBetweenStations, getStateFromStorage } from '../actions/user.action';

class TrainBetweenStations extends Component {
    constructor(props) {
        super(props);
        this.onFocusDate = this.onFocusDate.bind(this);
        this.autoCompleteStation = this.autoCompleteStation.bind(this);
        this.mapSearchedData = this.mapSearchedData.bind(this);
        this.onBlurHideSearchAndValidateField = this.onBlurHideSearchAndValidateField.bind(this);
        this.checkSeatAvailability = this.checkSeatAvailability.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            loader: true,
            successResponse: true,
            errorResponse: undefined,
            fromStationInputClass: 'form-control',
            toStationInputClass: 'form-control',
            dateInputClass: 'form-control',
            fromStationValidateErrors: [],
            toStationValidateErrors: [],
            dateValidateErrors: [],
            pikadayInstanceAvailable: false,
            searchClassForFromStation: 'ls_result_div',
            searchClassForToStation: 'ls_result_div',
            autoSearchedStation: [],
            bindFromStationValue: '',
            bindToStationValue: '',
            sourceStation: '',
            destStation: '',
            travelDate: '',
            quota: 'GN',

        };
    }

    componentDidMount() {
        this.setState((prevState) => (
            {
                loader: false
            }
        ));
        const persistedState = loadState();
        if (persistedState && persistedState.railway.trains_between_stations && !this.props.railway.trains_between_stations) {
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

    autoCompleteStation(e) {
        let inputValue = e.target.value;
        let inputName = e.target.name;
        let responseData = autoCompleteStationService(inputValue.toUpperCase());
        if (inputName === 'fromStation') {
            this.setState((prevState) => ({
                fromStationInputClass: 'form-control',
                bindFromStationValue: inputValue
            }))
            setTimeout(function () {
                this.setState((prevState) => ({
                    searchClassForFromStation: 'ls_result_div display-search',
                    autoSearchedStation: responseData
                }))
            }.bind(this), 300)
        }
        if (inputName === 'toStation') {
            this.setState((prevState) => ({
                toStationInputClass: 'form-control',
                bindToStationValue: inputValue
            }))
            setTimeout(function () {
                this.setState((prevState) => ({
                    searchClassForToStation: 'ls_result_div display-search',
                    autoSearchedStation: responseData
                }))
            }.bind(this), 300)
        }
        if (inputName === 'date') {
            this.setState((prevState) => ({
                travelDate: inputValue
            }))
        }
    }

    mapSearchedData(station, id) {
        if (id === 'fromStation') {
            this.setState((prevState) => ({
                bindFromStationValue: station,
                searchClassForFromStation: 'ls_result_div'
            }))
        }
        if (id === 'toStation') {
            this.setState((prevState) => ({
                bindToStationValue: station,
                searchClassForToStation: 'ls_result_div'
            }))
        }
    }

    onBlurHideSearchAndValidateField(e) {
        // on blur hide searched box for auto station
        setTimeout(() => {
            this.setState((prevState) => ({
                searchClassForFromStation: 'ls_result_div',
                searchClassForToStation: 'ls_result_div'
            }))
        }, 100)

        //on blur validate fields
        let inputName = e.target.name;
        let inputValue = e.target.value;
        let validateErrors = {};
        if (inputName === 'fromStation') {
            validateErrors = validateFromStation(inputValue);
            if (validateErrors.fromStation.length > 0) {
                this.setState((prevState) => ({
                    fromStationInputClass: 'form-control is-invalid',
                    fromStationValidateErrors: validateErrors.fromStation
                }))
            } else {
                this.setState((prevState) => ({
                    fromStationInputClass: 'form-control'
                }))
            }
        }

        if (inputName === 'toStation') {
            validateErrors = validateToStation(inputValue);
            if (validateErrors.toStation.length > 0) {
                this.setState((prevState) => ({
                    toStationInputClass: 'form-control is-invalid',
                    toStationValidateErrors: validateErrors.toStation
                }))
            } else {
                this.setState((prevState) => ({
                    toStationInputClass: 'form-control'
                }))
            }
        }

        if (inputName === 'date') {
            validateErrors = validateDate(inputValue);
            if (validateErrors.date.length > 0) {
                this.setState((prevState) => ({
                    dateInputClass: 'form-control is-invalid',
                    dateValidateErrors: validateErrors.date
                }))
            } else {
                this.setState((prevState) => ({
                    dateInputClass: 'form-control',
                    travelDate: inputValue
                }))
            }
        }

    }

    onSubmit(e) {
        e.preventDefault();

        // getting the forms element value

        let fromStationValue = e.target.elements.fromStation.value;
        let toStationValue = e.target.elements.toStation.value;
        let dateValue = e.target.elements.date.value;

        // on submit validating form

        validateFromStation(fromStationValue);
        validateToStation(toStationValue);
        let validateErrors = validateDate(dateValue);
        if (validateErrors.fromStation.length > 0 || validateErrors.toStation.length > 0 || validateErrors.date.length > 0) {
            if (validateErrors.fromStation.length > 0) {
                this.setState((prevState) => ({
                    fromStationInputClass: 'form-control is-invalid',
                    fromStationValidateErrors: validateErrors.fromStation
                }))
            }
            if (validateErrors.toStation.length > 0) {
                this.setState((prevState) => ({
                    toStationInputClass: 'form-control is-invalid',
                    toStationValidateErrors: validateErrors.toStation
                }))
            }
            if (validateErrors.date.length > 0) {
                this.setState((prevState) => ({
                    dateInputClass: 'form-control is-invalid',
                    dateValidateErrors: validateErrors.date
                }))
            }
        } else {
            // if form has no error than calling the API
            if (fromStationValue.indexOf('-') > -1) {
                fromStationValue = fromStationValue.split('-').pop().trim();
            };
            if (toStationValue.indexOf('-') > -1) {
                toStationValue = toStationValue.split('-').pop().trim();
            };
            this.setState((prevState) => ({
                sourceStation: fromStationValue,
                destStation: toStationValue,
                travelDate: dateValue
            }));
            this.setState((prevState) => ({
                loader: true
            }));
            getTrainBetweenStationsService({ fromStationValue, toStationValue, dateValue }).then(
                (res) => {
                    if (res.response_code === 200) {
                        this.props.getTrainBetweenStations({ trains_between_stations: res });
                        this.setState((prevState) => ({
                            loader: false
                        }));
                    }
                }
            )
        }
    }

    checkSeatAvailability(trainNumber, sourceStation, destStation, travelDate, classCode, quota) {
        console.log(checkSeatAvailability({ trainNumber, sourceStation, destStation, travelDate, classCode, quota }));
    }

    render() {
        return (
            <div className="container mt-3">
                {
                    this.state.loader
                        ?
                        (
                            <Loader loader={this.state.loader} />
                        )
                        :
                        (
                            <div>

                                {/* sheat availibility modal */}
                                <div class="modal fade bd-example-modal-lg" id="availabilityModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                                    <div class="modal-dialog modal-lg">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="exampleModalLabel"></h5>
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div class="modal-body">

                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                                <button type="button" class="btn btn-primary">Send message</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>


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
                                                Train between stations
                                            </div>
                                            <div className="card-body">
                                                <form onSubmit={this.onSubmit}>
                                                    <div className="form-group">
                                                        <label htmlFor="fromStation">From Station</label>
                                                        <input
                                                            type="text"
                                                            id="fromStation"
                                                            name="fromStation"
                                                            placeholder="From Station"
                                                            className={this.state.fromStationInputClass}
                                                            onChange={this.autoCompleteStation}
                                                            value={this.state.bindFromStationValue}
                                                            onBlur={this.onBlurHideSearchAndValidateField}
                                                            autoComplete="off"
                                                        />
                                                        <div className={this.state.searchClassForFromStation}>
                                                            {this.state.autoSearchedStation.map((station) => (
                                                                <div key={station} onClick={this.mapSearchedData.bind(this, station, 'fromStation')}>{station}</div>
                                                            ))}
                                                        </div>
                                                        {
                                                            this.state.fromStationValidateErrors.length > 0 && this.state.fromStationValidateErrors.map((err) =>
                                                                (
                                                                    <div className="invalid-feedback" key={err}>
                                                                        {err}
                                                                    </div>
                                                                )
                                                            )
                                                        }
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="fromStation">To Station</label>
                                                        <input
                                                            type="text"
                                                            id="toStation"
                                                            name="toStation"
                                                            placeholder="To Station"
                                                            className={this.state.toStationInputClass}
                                                            onChange={this.autoCompleteStation}
                                                            value={this.state.bindToStationValue}
                                                            onBlur={this.onBlurHideSearchAndValidateField}
                                                            autoComplete="off"
                                                        />
                                                        <div className={this.state.searchClassForToStation}>
                                                            {this.state.autoSearchedStation.map((station) => (
                                                                <div key={station} onClick={this.mapSearchedData.bind(this, station, 'toStation')}>{station}</div>
                                                            ))}
                                                        </div>
                                                        {
                                                            this.state.toStationValidateErrors.length > 0 && this.state.toStationValidateErrors.map((err) =>
                                                                (
                                                                    <div className="invalid-feedback" key={err}>
                                                                        {err}
                                                                    </div>
                                                                )
                                                            )
                                                        }
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="date">Date</label>
                                                        <input
                                                            type="text"
                                                            id="date"
                                                            name="date"
                                                            placeholder="DD-MM-YYYY"
                                                            className={this.state.dateInputClass}
                                                            onFocus={this.onFocusDate}
                                                            onBlur={this.onBlurHideSearchAndValidateField}
                                                            autoComplete="off"
                                                            value={this.state.travelDate}
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
                                                    <button type="submit" className="btn btn-info">SUBMIT</button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br />
                                {
                                    this.props.railway.trains_between_stations && this.props.railway.trains_between_stations.trains &&
                                    (
                                        <div className="card">
                                            <div className="card-header bg-info text-white">
                                                From - {this.state.bindFromStationValue} , To - {this.state.bindToStationValue}, Date - {this.state.travelDate}
                                            </div>
                                            <div className="mt-2">
                                                <table className="table table-light">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Train Number</th>
                                                            <th scope="col">Train Name</th>
                                                            <th scope="col">Departure time</th>
                                                            <th scope="col">Dest Arrival time</th>
                                                            <th scope="col">Travel time</th>
                                                            <th scope="col">Seat Availability</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            this.props.railway.trains_between_stations.trains.map(train => (
                                                                <tr>
                                                                    <td>{train.number}</td>
                                                                    <td>{train.name}</td>
                                                                    <td>{train.src_departure_time}</td>
                                                                    <td>{train.dest_arrival_time}</td>
                                                                    <td>{train.travel_time}</td>
                                                                    <td>
                                                                        <button type="button" data-toggle="modal" data-target="#availabilityModal" className="btn btn-default" onClick={this.checkSeatAvailability.bind(this, train.number, this.state.sourceStation, this.state.destStation, this.state.travelDate, '1A', this.state.quota)}>1A</button>
                                                                        <button type="button" data-toggle="modal" data-target="#availabilityModal" className="btn btn-default" onClick={this.checkSeatAvailability.bind(this, train.number, this.state.sourceStation, this.state.destStation, this.state.travelDate, '2A', this.state.quota)}>2A</button>
                                                                        <button type="button" data-toggle="modal" data-target="#availabilityModal" className="btn btn-default" onClick={this.checkSeatAvailability.bind(this, train.number, this.state.sourceStation, this.state.destStation, this.state.travelDate, '3A', this.state.quota)}>3A</button>
                                                                        <button type="button" data-toggle="modal" data-target="#availabilityModal" className="btn btn-default" onClick={this.checkSeatAvailability.bind(this, train.number, this.state.sourceStation, this.state.destStation, this.state.travelDate, 'SL', this.state.quota)}>SL</button>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        }
                                                    </tbody>
                                                </table>

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
        railway: state.railway
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getTrainBetweenStations: getTrainBetweenStations,
        getStateFromStorage: getStateFromStorage
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TrainBetweenStations);

