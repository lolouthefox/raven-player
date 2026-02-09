import { MusicLibrary } from "./methods/musicLibrary";

const library = new MusicLibrary([process.env.HOME + "/Music"]);
library.scanAll();

const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

const server = Bun.serve({
    routes: {
        "/api/albums": async (req) => {
            let albums = library.albums;
            const url = new URL(req.url);
            const filter = url.searchParams.get("filter");
            if (filter) {
                const filterList = filter.split(";").map(f => f.toLowerCase().trim());
                albums = albums.filter(a => filterList.some(f => a.id.includes(f)));
            }
            console.log(`Serving ${albums.length} albums`);
            return Response.json({ albums }, { status: 200, headers });
        },
        "/api/songs": (req) => {
            let songs = library.songs;
            const url = new URL(req.url);
            const filter = url.searchParams.get("filter");
            if (filter) {
                const filterList = filter.split(";").map(f => f.toLowerCase().trim());
                songs = songs.filter(s => filterList.some(f => s.id.includes(f)));
            }
            console.log(`Serving ${songs.length} songs`);
            return Response.json({ songs }, { status: 200, headers });
        },
        "/api/artists": (req) => {
            let artists = library.artists;
            const url = new URL(req.url);
            const filter = url.searchParams.get("filter");
            if (filter) {
                const filterList = filter.split(";").map(f => f.toLowerCase().trim());
                artists = artists.filter(a => filterList.some(f => a.id.includes(f)));
            }
            console.log(`Serving ${artists.length} artists`);
            return Response.json({ artists }, { status: 200, headers });
        },

        "/api/artist/:id": (req) => {
            const { id } = req.params;
            const artist = library.artists.find(a => a.id === id);
            if (!artist) {
                return new Response("Artist not found", { status: 404 });
            }
            return Response.json({ artist }, { status: 200, headers });
        },
        "/api/album/:id": (req) => {
            const { id } = req.params;
            const album = library.albums.find(a => a.id === id);
            if (!album) {
                return new Response("Album not found", { status: 404 });
            }
            return Response.json({ album }, { status: 200, headers });
        },
        "/api/song/:id": (req) => {
            const { id } = req.params;
            const song = library.songs.find(s => s.id === id);
            if (!song) {
                return new Response("Song not found", { status: 404 });
            }
            return Response.json({ song }, { status: 200, headers });
        },

        "/api/cover/:id": (req) => {
            const { id } = req.params;
            const cover = library.getCoverArtById(id);
            if (!cover || !cover[0]) {
                return new Response("Cover art not found", { status: 404, headers });
            }
            return new Response(cover[0].data, {
                status: 200,
                headers: {
                    "Content-Type": cover[0].format,
                    ...headers
                },
            });
        },

        "/api/audio/:id": (req) => {
            const { id } = req.params;
            const song = library.songs.find(s => s.id === id);
            if (!song) {
                return new Response("Song not found", { status: 404, headers });
            }
            return new Response(Bun.file(song.path), { status: 200, headers });
        },

        "/api/rescan": async (req) => {
            await library.scanAll();
            return new Response("Rescan complete", { status: 200, headers });
        },

        // Serve a file by lazily loading it into memory
        "/favicon.ico": Bun.file("./favicon.ico"),
    },

    // Fallback for unmatched routes:
    fetch(req) {
        return new Response("Not Found", { status: 404, headers });
    },
});

console.log(`Server running at ${server.url}`);