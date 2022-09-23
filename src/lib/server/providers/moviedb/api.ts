import { MOVIEDB_API_V3_KEY, MOVIEDB_API_V3_URL } from '$env/static/private';
import type { MovieSearchResult } from '$lib/models';
import { zMovieSearchResult, type MovieDBSearchResult, type PaginatedResult } from './responses';

// TODO: Research more about this pattern, or consider simply throwing errors instead
type Maybe<T> =
  | {
      data: T;
      error?: undefined;
    }
  | {
      data?: undefined;
      error: Error;
    };

export const movieDBClient = {
  /** `/search/movie?language=en-US&query=mymovie&page=1&include_adult=false` */
  searchMovies: async (query: string): Promise<Maybe<MovieSearchResult[] | null>> => {
    const url = buildUrl('search/movie', { query, include_adult: 'false' });
    const { error, data } = await performRequest<PaginatedResult<MovieDBSearchResult>>(url);
    if (error) {
      return { error: new Error(`${error} response`) };
    }
    if (!data?.results) {
      return { error: new Error('Malformed response') };
    }

    const result = zMovieSearchResult.array().safeParse(data.results);

    if (!result.success) {
      return { error: result.error };
    }

    return { data: result.data };
  },
};

const buildUrl = (path: string, queryParams: Record<string, string>) => {
  const url = new URL(`${MOVIEDB_API_V3_URL}/${path}`);
  Object.entries(queryParams).forEach(([key, value]) => url.searchParams.set(key, value));
  url.searchParams.set('api_key', MOVIEDB_API_V3_KEY);
  url.searchParams.set('language', 'en-US');

  return url;
};

const performRequest = async <T>(url: URL): Promise<Maybe<T>> => {
  const response = await fetch(url);
  if (!response.ok) {
    return { error: new Error(response.status.toString()) };
  }

  const data = await response.json();

  return { data };
};
