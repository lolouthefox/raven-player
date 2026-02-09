import type { Artist } from "$definitions/library";
import axios from "axios";

export function secondsToFormattedTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export interface ArtistProfileInfos {
    biography: string | null;
    profilePicture: string | null;
    banner: string | null;
}

export async function getArtistProfileInfos(artist: Artist): Promise<ArtistProfileInfos | null> {
    const { data } = await axios.get(`https://www.theaudiodb.com/api/v1/json/2/search.php?s=${encodeURIComponent(artist.name)}`);
    if (!data.artists) return null;
    return {
        biography: data.artists[0].strBiographyEN,
        profilePicture: data?.artists?.[0]?.strArtistThumb || null,
        banner: data?.artists?.[0]?.strArtistFanart || null
    };
}
