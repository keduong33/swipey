export type GenericServerError = {
    error: true;
    message: string;
};

export type GenericServerSuccess = {
    error: false;
};

export type GenericServerResponse = GenericServerSuccess | GenericServerError;
