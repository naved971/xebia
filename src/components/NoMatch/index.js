import React from 'react';
import { withRouter } from 'react-router-dom'

const NoMatch = (props) => {

    React.useEffect(() => require('./style.css'), []);

    return (
        <div className="container-no-match">
            <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>

            <div class="numero">
                404
            </div>

            <div class="leyenda">
                Sorry! Page not found
            </div>
            <button className="btn btn-primary" onClick={(e) => {
                props.history.goBack();
            }}>GO BACK</button>
        </div>
    );
}

export default withRouter(NoMatch);