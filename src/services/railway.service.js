import axios from 'axios';
import * as _ from 'lodash';

const API_LIVE_STATUS = 'http://localhost:3000/live_status';
const API_PNR_STATUS = 'http://localhost:3000/pnr_status';
const API_TRAIN_BETWEEN_STATIONS = 'http://localhost:3000/train_between_station';

const API = 'https://api.railwayapi.com';
const API_KEY = 'd2cwfuc0mv';

export function getLiveStatusService(requestParams) {
    //API + '/v2/live/train/' + requestParams.trainNumber + '/date/' + requestParams.date + '/apikey/' + API_KEY + '/'
    return axios.get(API_LIVE_STATUS)
        .then(function (response) {
            return response.data
        });
}

export function getPNRStatusService(requestParams) {
    // API + '/v2/pnr-status/pnr/' + requestParams.trainNumber + '/apikey/' + API_KEY + '/'
    return axios.get(API_PNR_STATUS)
        .then(function (response) {
            return response.data
        });
}

export function getTrainBetweenStationsService(requestParams) {
    //API + '/v2/between/source/' + requestParams.fromStationValue + '/dest/' + requestParams.toStationValue + '/date/' + requestParams.dateValue + '/apikey/' + API_KEY + '/'
    // API + '/v2/between/source/' + requestParams.sourceStationCode + '/dest/' + requestParams.destStationCode + '/date' + requestParams.date + '/apikey/' + API_KEY + '/'
    //'http://localhost:3000/train_between_station'
    return axios.get('http://localhost:3000/train_between_station')
        .then(function (response) {
            return response.data
        });
}

export function checkSeatAvailability(requestParams) {
    //API + '/v2/check-seat/train/' + requestParams.trainNumber + '/source/' + requestParams.sourceStation + '/dest/' + requestParams.destStation + '/date/' + requestParams.travelDate + '/pref/' + requestParams.classCode + '/quota/' + requestParams.quota + '/apikey/' + API_KEY + '/'
    //'http://localhost:3000/seat-availability'
    return axios.get('http://localhost:3000/seat-availability').then((res) => console.log(res.data))
}

var autoCompleteAPIIsCalled = false;
export function autoCompleteStationService(requestParams) {

    //'http://localhost:3000/auto-complete'
    let filterData = [];
    let autoCompleteData = JSON.parse(localStorage.getItem('autoCompleteStation'));
    let count = 0;
    if (!autoCompleteAPIIsCalled && (autoCompleteData === null || autoCompleteData === undefined)) {
        autoCompleteAPIIsCalled = true;
        axios.get('http://localhost:3000/auto-complete')
            .then(function (response) {

                localStorage.setItem('autoCompleteStation', JSON.stringify(response.data));
                response.data.map(data => {
                    if (data.indexOf(requestParams) !== -1) {
                        count++;
                        if (count < 10) {
                            filterData.push(data)
                        }
                    }
                })
            });
    } else {
        autoCompleteData.map(data => {
            if (data.indexOf(requestParams) !== -1) {
                count++;
                if (count < 10) {
                    filterData.push(data)
                }
            }
        })
    }

    return filterData;
}

