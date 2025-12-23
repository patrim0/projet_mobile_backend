import { City } from "../interfaces/city.interface";
import { database } from "../app";

export class CityService {
    
    public static async getCitiesByCca3(cca3: string): Promise<City[]> {

        const cities = database.collection<City>("cities");

        const citiesList = await cities
        .find({ cca3: cca3 })
        .sort({ city: 1})
        .toArray();

        if (!citiesList) {
            throw { message: "City not found", statusCode: 404 };
        }
        return citiesList;
    }
}