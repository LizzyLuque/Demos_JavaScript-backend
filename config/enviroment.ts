export const SERVER_PORT : number = Number(process.env.PORT || 5000);
export const DB_PORT : number = 27017;
export const DB_HOST : string = "localhost";
export const DB_DATABASE : string = "api_rest_blog";
export const CADUCIDAD_TOKEN : string = "48h";
export const SEED_AUTENTICACION : string = (process.env.SEED_AUTENTICACION || "semilla-desarrollo").toString();
export const IMAGE_PATH: string ="./uploads/articles/";
