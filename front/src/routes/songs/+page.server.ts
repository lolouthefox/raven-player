import { getArtistProfileInfos } from '$lib';
import { libraryApi } from '$lib/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const songs = await libraryApi.getSongs();

    return {
        songs
    };
};
