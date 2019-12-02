import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

function PlanetDetails({ planet }) {
    const keys = [
        "name",
        "population",
        "diameter",
        "rotation",
        "orbital period",
        "climate",
        "gravity",
        "terrain",
        "surface water"
    ];

    const listPlanetDetails = () => {
        return Object.keys(planet).map((key) => {
            if (keys.includes(key.toLowerCase().trim())) {
                return (
                    <ListItem key={key}>
                        <ListItemText
                            primary={key}
                            secondary={planet[key]}
                        />
                    </ListItem>
                )
            } else {
                return false;
            }
        })
    }

    return (
        <List>
            {listPlanetDetails()}
        </List>
    )
}

export default PlanetDetails;