import {
  HttpResponse,
  HttpStatus,
} from "../../http";

export class TerminateBrowserSessionResponseMapper {

  static success(): HttpResponse {

    return {
      status: HttpStatus.OK,

      headers: {},

      cookies: [],

      body: {
        terminated: true,
      },

    };

  }

}