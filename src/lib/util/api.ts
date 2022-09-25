export const api = {
  get: <T>(path: string) => performRequest<T>('GET', path),
  post: <T>(path: string, body: Record<string, unknown>) => performRequest<T>('POST', path, body),
  delete: <T>(path: string) => performRequest<T>('DELETE', path),
  patch: <T>(path: string, body: Record<string, unknown>) => performRequest<T>('PATCH', path, body),
};

export type ApiResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: { message: string } | Error;
    };

const performRequest = async <T = unknown>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  path: string,
  body?: Record<string, unknown>
): Promise<ApiResult<T>> => {
  try {
    const response = await fetch(path, {
      method,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (response.ok) {
      return {
        success: true,
        data: (await response.json()) as T,
      };
    }

    return {
      success: false,
      error: await response.json(),
    };
  } catch (error) {
    return {
      success: false,
      error: { message: 'An unknown error occurred' },
    };
  }
};
