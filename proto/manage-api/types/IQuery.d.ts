interface SuccessResponse<T> {
	success: true;
	data: T;
}

interface ErrorResponse {
	success: false;
	message: string;
}

export type IQuery<T> = Promise<SuccessResponse<T> | ErrorResponse>;
