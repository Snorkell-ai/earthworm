import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * Transforms the sign-up request data to match the backend's expected format.
   *
   * @param {SignUpRequest} signUpData - The original sign-up request data.
   *
   * @returns {Object} The transformed sign-up request data with the following changes:
   * - `firstName` is mapped to `first_name`
   * - `lastName` is mapped to `last_name`
   * - `email` is mapped to `username`
   * - All other properties remain unchanged.
   *
   * @example
   * const originalData = {
   *   firstName: 'John',
   *   lastName: 'Doe',
   *   email: 'john.doe@example.com',
   *   password: 'securePassword123'
   * };
   *
   * const transformedData = transformSignUpRequestForBackend(originalData);
   * console.log(transformedData);
   * // Outputs:
   * // {
   * //   firstName: 'John',
   * //   lastName: 'Doe',
   * //   email: 'john.doe@example.com',
   * //   password: 'securePassword123',
   * //   first_name: 'John',
   * //   last_name: 'Doe',
   * //   username: 'john.doe@example.com'
   * // }
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    const message =
      exception.message ??
      `${status >= 500 ? 'Service Error' : 'Client Error'}`;

    const errorResponse = {
      data: {},
      message,
    };

    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}
