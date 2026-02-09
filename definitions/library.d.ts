import { IPicture } from "music-metadata";

export interface Album {
    id: string;
    title: string;

    // Since album is the top-level entity, we can store objects directly here
    artists: Artist[];
    songs: Song[];
}

export interface Song {
    id: string;
    index: number; // track number in the album
    title: string;

    // Ids used to avoid circular references in the data structure
    artistIds: string[];
    albumId: string;

    coverArt: IPicture[] | null; // server only
    duration: number; // in seconds
    path: string; // file path to the song
    quality: string; // e.g., "320kbps", "FLAC", etc.
}

export interface Artist {
    id: string;
    name: string;
    albumIds: string[];
}
