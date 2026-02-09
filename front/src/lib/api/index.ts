import axios from "axios";
import type { Album, Artist, Song } from "$definitions/library";

async function getAlbums(filter?: string[]): Promise<Album[]> {
    if (filter) {
        const { data } = await axios.get("http://localhost:3000/api/albums", {
            params: {
                filter: filter.join(";")
            }
        });
        return data.albums;
    }
    const { data } = await axios.get("http://localhost:3000/api/albums");
    return data.albums;
}
async function getSongs(filter?: string[]): Promise<Song[]> {
    if (filter) {
        const { data } = await axios.get("http://localhost:3000/api/songs", {
            params: {
                filter: filter.join(";")
            }
        });
        return data.songs;
    }
    const { data } = await axios.get("http://localhost:3000/api/songs");
    return data.songs;
}
async function getArtists(filter?: string[]): Promise<Artist[]> {
    if (filter) {
        const { data } = await axios.get("http://localhost:3000/api/artists", {
            params: {
                filter: filter.join(";")
            }
        });
        return data.artists;
    }
    const { data } = await axios.get("http://localhost:3000/api/artists");
    return data.artists;
}

async function getArtist(id: string): Promise<Artist> {
    const { data } = await axios.get(`http://localhost:3000/api/artist/${id}`);
    return data.artist;
}
async function getAlbum(id: string): Promise<Album> {
    const { data } = await axios.get(`http://localhost:3000/api/album/${id}`);
    return data.album;
}
async function getSong(id: string): Promise<Song> {
    const { data } = await axios.get(`http://localhost:3000/api/song/${id}`);
    return data.song;
}

function getCoverUrl(id: string | Song | Album): string {
    if (typeof id === "object") {
        if ("songs" in id) {
            id = id.songs[0].id;
        } else {
            id = id.id;
        }
    }
    return `http://localhost:3000/api/cover/${id}`;
}
function getAudioUrl(id: string | Song): string {
    if (typeof id === "object") {
        id = id.id;
    }
    return `http://localhost:3000/api/audio/${id}`;
}

async function rescanLibrary(): Promise<void> {
    await axios.get("http://localhost:3000/api/rescan");
}

export const libraryApi = {
    getAlbums,
    getSongs,
    getArtists,

    getArtist,
    getAlbum,
    getSong,

    getCoverUrl,
    getAudioUrl,

    rescanLibrary
};
