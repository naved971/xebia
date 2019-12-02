import React from 'react';
import PropTypes from 'prop-types';
import DataManager from '../service/DataManager';


const StoreContext = React.createContext({});

const StoreProvider = (props) => {
    const { children } = props;
    const url = process.env.REACT_APP_SWAPI_URL;
    const dataManger = new DataManager({ url });

    return (
        <StoreContext.Provider value={dataManger}>
            {children}
        </StoreContext.Provider>
    )
}

StoreProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { StoreContext, StoreProvider };
