import type { Watchlist, WatchlistMovie } from '$lib/models';
import type { WatchListAddMovie } from '$lib/models/watchlist';
import { api } from '$lib/util/api';
import { writable } from 'svelte/store';

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

  return {
    set: (watchlist: Watchlist) => {
      watchlistId = watchlist.id;
      set(watchlist);
    },
    subscribe,
    addMovie,
    removeMovie,
  };
};

export const watchlistStore = createWatchlistStore();
