import React from 'react';

export const RailwayDashboard = () => (
    <div>
        <div className="jumbotron  text-white rounded bg-dark">
            <div className="col-md-6 px-0">
                <h1 className="display-4 font-italic">Indian Railway Enquiry</h1>
                <p className="lead my-3">This is a demo application in Reactjs. It used indian railway API to give the informaion to the customers.</p>
                <p className="lead mb-0"><a href="" className="text-white font-weight-bold">Continue reading...</a></p>
            </div>

        </div>
        <div className="container">
            <div className="row mb-2">
                <div className="col-md-6">
                    <div className="card flex-md-row mb-4 box-shadow h-md-250">
                        <div className="card-body d-flex flex-column align-items-start">
                            <h3 className="mb-0">
                                <a className="text-primary" href="">Redux</a>
                            </h3>
                            <p className="card-text mb-auto">
                                It is a state management library.
                            </p>
                            <a href="">Continue reading</a>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card flex-md-row mb-4 box-shadow h-md-250">
                        <div className="card-body d-flex flex-column align-items-start">
                            <h3 className="mb-0">
                                <a className="text-primary" href="">Pikaday</a>
                            </h3>
                            <p className="card-text mb-auto">It is date picker library.</p>
                            <a href="">Continue reading</a>
                        </div>
                       
                    </div>
                </div>
            </div>
            <div className="row mb-2">
                <div className="col-md-6">
                    <div className="card flex-md-row mb-4 box-shadow h-md-250">
                        <div className="card-body d-flex flex-column align-items-start">
                            <h3 className="mb-0">
                                <a className="text-primary" href="">Axios</a>
                            </h3>
                            <p className="card-text mb-auto">
                                It is https request API for react.
                            </p>
                            <a href="">Continue reading</a>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card flex-md-row mb-4 box-shadow h-md-250">
                        <div className="card-body d-flex flex-column align-items-start">
                            <h3 className="mb-0">
                                <a className="text-primary" href="">Pikaday</a>
                            </h3>
                            <p className="card-text mb-auto">It is date picker library.</p>
                            <a href="">Continue reading</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
)