class ApiResponse {
  constructor(Statuscode, data, message = "success") {
    this.Statuscode = Statuscode;
    this.data = data;
    this.message = message;
    this.success = Statuscode < 400;
  }
}

export { ApiResponse };
