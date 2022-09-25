import type { Watchlist, WatchlistMovie } from '$lib/models';
import { zWatchListPatchMovie, type WatchListAddMovie, type WatchListPatchMovie } from '$lib/models/watchlist';
import { api } from '$lib/util/api';
import { get, writable } from 'svelte/store';

const createWatchlistStore = () => {
  let watchlistId = '';
  const store = writable<Watchlist>({} as Watchlist);
  const { subscribe, update, set } = store;

  const addMovie = async (movie: WatchListAddMovie) => {
    if (!watchlistId) throw new Error('Missing watchlistId, was the store initialized?');

    const result = await api.post<WatchlistMovie>(`/api/watchlist/${watchlistId}/movies`, movie);
    if (!result.success) {
      return result;
    }

    update((current) => ({
      ...current,
      movies: [...current.movies, result.data],
    }));

    return result;
  };

  const removeMovie = async (movieId: string) => {
    if (!watchlistId) throw new Error('Missing watchlistId, was the store initialized?');

    const result = await api.delete<WatchlistMovie>(`/api/watchlist/${watchlistId}/movies/${movieId}`);
    if (!result.success) {
      return result;
    }

    update(({ movies, ...current }) => {
      const newMovies = movies.filter((m) => m.id !== result.data.id);
      return {
        ...current,
        movies: newMovies,
        movieCount: newMovies.length,
      };
    });

    return result;
  };

  const updateMovie = async (movieId: string, data: Partial<WatchListPatchMovie['input']>) => {
    if (!watchlistId) throw new Error('Missing watchlistId, was the store initialized?');

    const valuePriorToUpdate = get(store).movies.find((m) => m.id === movieId);
    if (!valuePriorToUpdate) {
      return;
    }

    const updateMovieData = (newData: Partial<WatchlistMovie>) => {
      update(({ movies, ...current }) => {
        const movieIndex = movies.findIndex((m) => m.id === movieId);

        movies[movieIndex] = { ...movies[movieIndex], ...newData };

        return {
          ...current,
          movies,
        };
      });
    };

    const optimisticResult = zWatchListPatchMovie.safeParse(data);
    if (!optimisticResult.success) return;

    updateMovieData(optimisticResult.data);

    const result = await api.patch<WatchlistMovie>(`/api/watchlist/${watchlistId}/movies/${movieId}`, data);

    if (!result.success) {
      updateMovieData(valuePriorToUpdate);
      return result;
    }

    updateMovieData(result.data);

    return result;
  };

  return {
    set: (watchlist: Watchlist) => {
      watchlistId = watchlist.id;
      set(watchlist);
    },
    subscribe,
    addMovie,
    removeMovie,
    updateMovie,
  };
};

export const watchlistStore = createWatchlistStore();
