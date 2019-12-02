import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import SolarSystem from '../SolarSystem';
import PlanetDetails from '../PlanetDetails';
import Header from '../Header';
import { StoreContext } from '../../context/StoreContext'
import './style.css'
import CircularProgress from '@material-ui/core/CircularProgress';

function Search() {

    const { fetchPlanets } = React.useContext(StoreContext);
    const [planets, setPlanets] = React.useState([]);
    const [selectedPlanet, setSelectedPlanet] = React.useState({});
    const [search, setSearch] = React.useState("");
    const [loading, setLoading] = React.useState("");

    React.useEffect(() => {
        let didCancel = false;
        (async () => {
            try {
                setLoading(true);
                const [planetsResult] = await Promise.all([fetchPlanets(search)]);
                if (!didCancel) {
                    setPlanets(planetsResult);
                    setLoading(false);
                }
            } catch (error) {
                throw error;
            }
        })();

        return () => {
            didCancel = true;
        };
    }, [search]);

    const onPlanetSelection = (selectedPlanet) => {
        setSelectedPlanet(selectedPlanet)
    }

    return (
        <React.Fragment>
            <Header />
            <Card className="search-card">
                <CardContent>
                    <input
                        type="text"
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => setSearch(e.target.value)}
                        value={search}
                        placeholder="Search Solar System"
                    />
                </CardContent>
                {loading && <CardContent className="d-flex justify-content-center">
                    <CircularProgress className="mar-20" color="inherit" size={30} />
                </CardContent>
                }
                <CardContent>
                    {!loading && <SolarSystem
                        planets={planets}
                        onSelectPlanet={onPlanetSelection}
                    />}
                </CardContent>

                <PlanetDetails planet={selectedPlanet} />
            </Card>
        </React.Fragment>
    );
}

export default Search;

