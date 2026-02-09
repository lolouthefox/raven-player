import { libraryApi } from '$lib/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const albums = await libraryApi.getAlbums();

    return {
        albums
    };
};
