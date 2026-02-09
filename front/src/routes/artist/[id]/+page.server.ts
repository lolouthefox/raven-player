import { getArtistProfileInfos } from '$lib';
import { libraryApi } from '$lib/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const artist = await libraryApi.getArtist(params.id);
    const profile = await getArtistProfileInfos(artist);
    const albums = await libraryApi.getAlbums(artist.albumIds);
    const artistIds = albums.flatMap(album => album.artists.map(artist => artist.id));
    const allArtists = await libraryApi.getArtists(artistIds);

    return {
        artist,
        profile,
        allArtists
    };
};
