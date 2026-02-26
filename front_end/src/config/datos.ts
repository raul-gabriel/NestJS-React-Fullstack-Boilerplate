export const url_principal = import.meta.env.DEV
    ? 'http://localhost:3000'
    : `${window.location.protocol}//${window.location.host}`;




export const url_servidor = url_principal + '/api'
export const paginaLogin = '/login'
export const paginaPanel = '/panel'
export const nombreCache = 'token_access'


//para busqueda con dni
export const URL_API_RENIEC = 'https://apiperu.dev/api/dni'
export const TOKEN_SUNAT1="5bf520ae33bc4d05b7faccb79350979c0a441110f3d37a1b179ddb10ef3725a2";
export const TOKEN_SUNAT2="bf3e1fbd6a10532326c6e4b904178dbc8ce2e4e252fea2ff79d41fc2f803cc76";


//busqueda con ruc
export const URL_API_SUNAT = 'https://dniruc.apisperu.com/api/v1/ruc/'
export const TOKEN_APIS_PERU = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6IndlZ2V0ZXIzMTdAYmlyaWdlLmNvbSJ9.O2VKOUrB7I-_XaPv2u1wjWN-_B6445gyiRWX4ISB-WQ'