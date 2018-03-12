import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Header } from '../components/Header.component';
import { Footer } from '../components/Footer.component';
import { RailwayDashboard } from '../components/Railway-dashboard.component';
import LiveStatus from '../components/Live-status.component';
import PNRStatus from '../components/PNRStatus.component';
import TrainBetweenStations from '../components/TrainBetweenStation.component';

export const AppRouter = () => (
    <BrowserRouter>
        <div>
            <Header />
            <Switch>
                <Route exact path="/" component={RailwayDashboard} />
                <Route path="/train-live-status" component={LiveStatus} />
                <Route path="/pnr-status" component={PNRStatus} />
                <Route path="/train-between-stations" component={TrainBetweenStations} />
            </Switch>
            <Footer />
        </div>
    </BrowserRouter>
)