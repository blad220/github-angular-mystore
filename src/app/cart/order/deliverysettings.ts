export interface NovaPoshtaResponse {
    // "Present": string,
    // "Warehouses": number,
    // "MainDescription": string,
    // "Area": string,
    // "Region": string,
    // "SettlementTypeCode": string,
    // "Ref": string,
    // "DeliveryCity": string,
    // "AddressDeliveryAllowed": boolean,
    // "StreetsAvailability": boolean,
    // "ParentRegionTypes": string,
    // "ParentRegionCode": string,
    // "RegionTypes": string,
    // "RegionTypesCode": string,
  
    // "companyDeliveryId":string,
    
    "Description": string,
    "DescriptionRu": string,
    "Ref": string,
    "Delivery1": string,
    "Delivery2": string,
    "Delivery3": string,
    "Delivery4": string,
    "Delivery5": string,
    "Delivery6": string,
    "Delivery7": string,
    "Area": string,
    "SettlementType": string,
    "IsBranch": string,
    "PreventEntryNewStreetsUser": null,
    "Conglomerates": null,
    "CityID": string,
    "SettlementTypeDescriptionRu": string,
    "SettlementTypeDescription": string,
    "indexId": number,
  }
  export interface NovaPoshtaResponsePrice {
    AssessedCost: number
    Cost: number  
  }
  export class NovaPoshtaResponsePriceAll {
    "data": Array<NovaPoshtaResponsePrice>
  }
export class NovaPoshta {
    "success": boolean;
    "data": Array<NovaPoshtaResponse>
        // {
            
        //     "TotalCount": number,
        //     "Addresses": 
        //     Array<NovaPoshtaResponse>
        //     ,
        //     "errors": [],
        //     "warnings": [],
        //     "info": [],
        //     "messageCodes": [],
        //     "errorCodes": [],
        //     "warningCodes": [],
        //     "infoCodes": []



        // }
    ;
    "errors": [string];
    "warnings": [string];
    "info": [string];
    "messageCodes": [string];
    "errorCodes": [string];
    "warningCodes": [string];
    "infoCodes": [string];

}
export class NovaPoshtaSettings {
    searchCityName = '';
    searchLimit = 5;
    options: {
        "apiKey": string,
        "modelName": string,
        "calledMethod": string,
        "methodProperties": {
            // "Ref": string

            // "CityName": string,
            // "Limit": number
        }
    }
    price: {
        "modelName": string,
        "calledMethod": string,
        "methodProperties": {
           "CitySender": string,
           "CityRecipient": string,
           "Weight": number,
           "ServiceType": string,
           "Cost": number,
           "CargoType": string,
           "SeatsAmount": number
        },
        "apiKey": string
     }
    REST_API_SERVER: string = "https://api.novaposhta.ua/v2.0/json/";
    cargoLocation:string = "db5c88de-391c-11dd-90d9-001a92567626";
    apiKey:string = "9aac6502e5f1304191e7466ab061dfb1";
    constructor() {
        // this.REST_API_SERVER = "https://api.novaposhta.ua/v2.0/json/"

        this.options = {
            "apiKey": this.apiKey,
            "modelName": "Address",
            // "calledMethod": "searchSettlements",getCities
            "calledMethod": "getCities",
            "methodProperties": {
                // "Ref": "ebc0eda9-93ec-11e3-b441-0050568002cf"
                // "CityName": this.searchCityName,
                // "Limit": this.searchLimit
            }
        };
        this.price = {
            "modelName": "InternetDocument",
            "calledMethod": "getDocumentPrice",
            "methodProperties": {
               "CitySender": this.cargoLocation,
               "CityRecipient": "d4f4058d-64d0-11e9-898c-005056b24375",
               "Weight": 1,
               "ServiceType": "DoorsDoors",
               "Cost": 100,
               "CargoType": "Cargo",
               "SeatsAmount": 1
            },
            "apiKey": this.apiKey
         }
    }
}
export interface DeliveryResponse {
        "id": string,
        "name": string,
        "RegionId": string,
        "IsWarehouse": boolean,
        "ExtracityPickup": boolean,
        "ExtracityShipping": boolean,
        "RAP": boolean,
        "RAS": boolean,
        "regionName": string,
        "regionId": number,
        "country": number,
        "districtName": string
}
export class Delivery {

    "status": boolean;
    "message": string;
    "data": 
    Array<DeliveryResponse>
        
    
    

    constructor() {

    }

}

export class DeliverySettings {


    REST_API_SERVER: string;
    options: {
        "apiKey": string,
        "modelName": string,
        "calledMethod": string,
        "methodProperties": {
            "CityName": string,
            "Limit": number
        }
    }

    constructor() {
        this.REST_API_SERVER = "https://delivery-auto.com/api/v4/Public/GetAreasList?culture=uk-UA&fl_all={fl_all}&regionId={regionId}&country=1";
        // this.options = {

        // }
    }
    

}