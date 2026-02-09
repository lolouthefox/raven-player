import type { Artist, Song } from "$definitions/library";
import axios from "axios";
import { libraryApi } from "./api";

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

export interface LyricsResponse {
    id: number,
    trackName: string,
    artistName: string,
    albumName: string,
    duration: number,
    instrumental: boolean,
    plainLyrics: string,
    syncedLyrics: string
}

export async function getLyrics(song: Song): Promise<LyricsResponse | null> {
    try {
        const artists = await libraryApi.getArtists(song.artistIds);
        const album = await libraryApi.getAlbum(song.albumId);
        const artistsNames = artists.map(a => a.name).join(", ");
        const { data } = await axios.get(`https://lrclib.net/api/get?artist_name=${encodeURIComponent(artistsNames)}&track_name=${encodeURIComponent(song.title)}&album_name=${encodeURIComponent(album.title)}&duration=${song.duration}`);
        return data || null;
    } catch (error) {
        console.error("Error fetching lyrics:", error);
        return null;
    }
}
