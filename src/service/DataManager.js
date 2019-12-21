import axios from 'axios';

class DataManager {
    constructor({ url }) {
        this.baseURL = axios.create({
            baseURL: url,
        });
        this.list = [];
        this.counter = 0;
        const CancelToken = axios.CancelToken;
        let cancel;

        // Add a request interceptor
        this.baseURL.interceptors.request.use((config) => {
            // Do something before request is sent

            if (config.params && config.params.search) {
                this.counter++;
            }
            if (this.counter > 15) {
                if (cancel) {
                    cancel();
                }
                return false;
            }
            config.cancelToken = new CancelToken(function executor(c) {
                cancel = c;
            })

            return config;

        }, function (error) {
            return Promise.reject(error);
        });

        // Add a response interceptor
        axios.interceptors.response.use((response) => {
            // Do something with response data
            return response;
        }, function (error) {
            // Do something with response error
            return Promise.reject(error);
        });
    }
    getNetworCount = () => {
        return Promise.resolve(this.counter);
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
