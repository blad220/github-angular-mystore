export interface NovaPoshtaResponse {
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
    "data": Array<NovaPoshtaResponse>;
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
    cargoLocation: string = "db5c88de-391c-11dd-90d9-001a92567626";
    apiKey: string = "9aac6502e5f1304191e7466ab061dfb1";
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
export interface DeliveryResponsePrice {
    "allSumma": number,
    "status": boolean,
}
export interface DeliveryResponsePriceAll {
    "data": Array<DeliveryResponsePrice>
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

    REST_API_SERVER_Price: string;
    REST_API_SERVER_WAREHOUSES: string;
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
    price: {
        culture: string, //Культура
        areasSendId: string, //Город отправления
        areasResiveId: string, //Город прибытия
        warehouseSendId: string, //Склад отправления
        warehouseResiveId: string, //Склад прибытия
        InsuranceValue: number, //Страховая стоимость груза
        CashOnDeliveryValue: number, //Стоимость наложенного платежа
        dateSend: string, //Дата отправления
        deliveryScheme: number, //Схема доставки
        category: [ //Массив категорий груза
            {
                categoryId: string, //Id категории груза
                countPlace: number, //Количество мест
                helf: number, //Вес груза
                size: number // Объем груза
            }],

    }

    constructor() {
        this.REST_API_SERVER = "https://delivery-auto.com/api/v4/Public/GetAreasList?culture=uk-UA&fl_all={fl_all}&regionId={regionId}&country=1";
        this.REST_API_SERVER_WAREHOUSES = "https://delivery-auto.com/api/v4/Public/GetFindWarehouses?culture=uk-UA&Longitude=0&Latitude=0&count=1&includeRegionalCenters=true&CityId="
        // this.options = {

        // }
        this.REST_API_SERVER_Price = 'https://delivery-auto.com/api/v4/Public/PostReceiptCalculate'
        this.price = {
            culture: "ru-RU", //Культура
            areasSendId: "75491888-1429-e311-8b0d-00155d037960", //Город отправления
            areasResiveId: "e3ac6f68-3529-e311-8b0d-00155d037960", //Город прибытия
            warehouseSendId: "2711ddd1-da49-e211-9515-00155d012d0d", //Склад отправления
            warehouseResiveId: "d908c5e1-b36b-e211-81e9-00155d012a15", //Склад прибытия
            InsuranceValue: 1000000, //Страховая стоимость груза
            CashOnDeliveryValue: 5000, //Стоимость наложенного платежа
            dateSend: "06.06.2014", //Дата отправления
            deliveryScheme: 2, //Схема доставки
            category: [ //Массив категорий груза
                {
                    categoryId: "00000000-0000-0000-0000-000000000000", //Id категории груза
                    countPlace: 1, //Количество мест
                    helf: 1, //Вес груза
                    size: 0.1 // Объем груза
                }],
        }
    }


}