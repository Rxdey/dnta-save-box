// export const PAGE = 'http://127.0.0.1:7888';
// export const API_HOST = 'http://127.0.0.1:7052';
export const PAGE = process.env.PLASMO_PUBLIC_PAGE;
export const API_HOST = process.env.PLASMO_API_HOST;

export const LOGIN_PAGE = `${PAGE}/login`;
export const BASE_URL = `${API_HOST}`;