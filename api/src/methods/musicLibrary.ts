import { readdir } from "node:fs/promises";
import type { Album, Artist, Song } from "library";
import { parseFile, type IPicture } from "music-metadata";
import murmurHash3 from "murmurhash3js";
import { randomUUID } from "node:crypto";


export class MusicLibrary {
    #albums: Album[] = [];
    #songs: Song[] = [];
    #artists: Artist[] = [];

    private allowMatchingTypes = [".mp3", ".flac", ".wav", ".aac", ".ogg", ".m4a", ".opus", ".alac"];

    constructor(
        public folders: string[],
    ) { }

    async stripProperties(obj: any, propertiesToStrip: string[]): Promise<any> {
        if (Array.isArray(obj)) {
            return Promise.all(obj.map(item => this.stripProperties(item, propertiesToStrip)));
        } else if (typeof obj === "object" && obj !== null) {
            const newObj: any = {};
            for (const key in obj) {
                if (!propertiesToStrip.includes(key)) {
                    newObj[key] = await this.stripProperties(obj[key], propertiesToStrip);
                }
            }
            return newObj;
        } else {
            return obj;
        }
    }

    get albums(): Album[] {
        const albumsWithNoCoverArt = this.#albums.map(album => {
            const albumCopy = { ...album };
            albumCopy.songs = albumCopy.songs.map(song => {
                const songCopy = { ...song };
                songCopy.coverArt = null; // Strip cover art from songs in album listing
                return songCopy;
            });
            return albumCopy;
        });
        return albumsWithNoCoverArt;
    }

    get songs(): Song[] {
        const songsWithNoCoverArt = this.#songs.map(song => {
            const songCopy = { ...song };
            songCopy.coverArt = null; // Strip cover art from song listing
            return songCopy;
        });
        return songsWithNoCoverArt;
    }

    get artists(): Artist[] {
        return this.#artists;
    }

    getCoverArtById(id: string): IPicture[] | null {
        const song = this.#songs.find(s => s.id === id);
        if (!song) {
            return null;
        }
        return song.coverArt;
    }

    /**
     * Scans the specified folders for music files and populates the library with songs, artists, and albums.
     */
    async scanAll() {
        // Clear existing library data
        this.#albums = [];
        this.#songs = [];
        this.#artists = [];
        for (const folder of this.folders) {
            await this.scanFolder(folder);
        }
        this.reorderAll();
    }

    async scanFolder(folder: string) {
        const entries = await readdir(folder, { withFileTypes: true, recursive: true });

        for (const entry of entries) {
            if (entry.isFile() && this.allowMatchingTypes.some(ext => entry.name.endsWith(ext))) {
                const path = `${entry.parentPath}/${entry.name}`;
                await this.addSong(path);
            }
        }

        console.log(`Finished scanning folder: ${folder}`);
        console.log(`Total songs: ${this.#songs.length}, albums: ${this.#albums.length}, artists: ${this.#artists.length}`);
    }

    async addSong(path: string) {
        const metadata = await parseFile(path);

        const title = metadata.common.title || path.split("/").pop() || "Unknown Title";
        const artists = metadata.common.artist ? MusicLibrary.parseMetadataStringArray(metadata.common.artist) : ["Unknown Artist"];
        const albumTitle = metadata.common.album || "Unknown Album";
        const duration = metadata.format.duration || -1;
        const coverArt = metadata.common.picture || null;
        const quality = metadata.format.bitrate ? `${Math.round(metadata.format.bitrate / 1000)}kbps` : "Unknown Quality";
        const index = metadata.common.track;

        const artistObjs = await this.getArtistsByNames(artists);
        const album = await this.getAlbumByTitle(albumTitle, artistObjs.map(a => a.id));


        let song: Song = {
            id: murmurHash3.x86.hash32(title + artistObjs.map(a => a.id).join(",")).toString(),
            title: title,
            artistIds: artistObjs.map(a => a.id),
            albumId: album.id,
            coverArt: coverArt,
            duration: duration,
            path,
            quality: quality,
            index: index.no ?? 0,
        };

        // Add song to library
        this.#songs.push(song);

        // Add song to album
        album.songs.push(song);

        // Add artists to album
        for (const artist of artistObjs) {
            if (!album.artists.some(a => a.id === artist.id)) {
                album.artists.push(artist);
            }
            if (!artist.albumIds.includes(album.id)) {
                artist.albumIds.push(album.id);
            }
        }
    }

    async getArtistByName(name: string): Promise<Artist> {
        let artist = this.#artists.find(a => a.name === name);
        if (!artist) {
            artist = {
                id: murmurHash3.x86.hash32(name).toString(),
                name,
                albumIds: [],
            };
            this.#artists.push(artist);
        }
        return artist;
    }

    async getArtistsByNames(names: string[]): Promise<Artist[]> {
        const artists: Artist[] = [];
        for (const name of names) {
            const artist = await this.getArtistByName(name);
            artists.push(artist);
        }
        return artists;
    }

    async getAlbumByTitle(title: string, artistIds: string[]): Promise<Album> {
        let album = this.#albums.find(
            (a: Album) => a.title === title &&
                a.artists.some((a: Artist) => artistIds.includes(a.id))
        );

        if (!album) {
            album = {
                id: title === "Unknown Album" ? randomUUID() : murmurHash3.x86.hash32(title).toString(),
                title,
                artists: [],
                songs: [],
            };
            this.#albums.push(album);
        }
        return album;
    }

    reorderAll() {
        this.#albums = this.#albums.map(album => this.reorderTracksByIndex(album));
    }

    reorderTracksByIndex(album: Album): Album {
        const sortedSongs = [...album.songs].sort((a, b) => a.index - b.index);
        return {
            ...album,
            songs: sortedSongs,
        };
    }

    static parseMetadataStringArray(str: string): string[] {
        // Split the string by commas and trim whitespace
        return str.split(";").map(s => s.trim());
    }
}
