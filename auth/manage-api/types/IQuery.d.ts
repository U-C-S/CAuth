interface SuccessResponse<T> {
  success: true;
  data: T;
}

interface ErrorResponse {
  success: false;
  message: string;
}

export type SResponse<T> = SuccessResponse<T> | ErrorResponse;
