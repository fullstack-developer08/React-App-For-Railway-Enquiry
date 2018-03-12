import React from 'react';

export const Loader = (props) => {
    return (
        <div>
            {
                props.loader
                    ?
                    (
                        <div className="holder">
                            <div className="preloader">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                    )
                    :
                    <div></div>
            }
        </div>

    )
}