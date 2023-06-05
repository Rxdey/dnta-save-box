export interface ResponseType<T> {
    state?: number;
    data?: T;
    msg?: string;
    token?: string;
    success?: boolean;
}