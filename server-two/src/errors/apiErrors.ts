class ApiError extends Error {
    statusCode: number;
    status: string;

    constructor(statusCode: number, message: string, status: string = 'error') {
        super(message);
        this.statusCode = statusCode;
        this.status = status;
    }
}

export default ApiError;
