import axios from 'axios';

class DataManager {
    constructor({ url }) {
        this.baseURL = axios.create({
            baseURL: url,
        });
    }

    doLogin = async (username, password) => {
        try {
            const result = await this.baseURL.get("/people");
            let peoples = result.data.results;
            let checkForPeople = peoples && peoples.filter((people) => people.name === username && people.birth_year === password);
            return checkForPeople.length > 0
        } catch (error) {
            console.log(error)
        }

    }

    fetchPlanets = async (search) => {
        try {
            const params = {};
            if (search) {
                params.search = search;
            }
            let result = await this.baseURL.get("/planets", {
                params: params
            });
            let planets = result.data.results;
            return planets;
        } catch (error) {
            console.log(error)
        }
    }
}

export default DataManager;
