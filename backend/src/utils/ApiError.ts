class ApiError extends Error {
  // to write error like 400 or 200
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}
export default ApiError;
