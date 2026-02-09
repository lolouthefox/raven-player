import type { Song } from "$definitions/library";
import { derived, writable } from "svelte/store";


export let queue = writable<Song[]>([]);
export let queueIndex = writable(0);
export let currentSong = derived([queue, queueIndex], ([$queue, $queueIndex]) => $queue[$queueIndex] || null);

let currentIndex = 0;
queueIndex.subscribe(i => currentIndex = i);
let currentQueue: Song[] = [];
queue.subscribe(q => currentQueue = q);


export function addToQueue(song: Song) {
    queue.update(q => [...q, song]);
}

export function removeFromQueue(index: number) {
    queue.update(q => {
        q.splice(index, 1);
        return q;
    });
    queueIndex.update(i => i > index ? i - 1 : i);
}

export function clearQueue() {
    queue.set([]);
    queueIndex.set(0);
}

export function playNext(song: Song) {
    console.log("Playing next:", song);
    queue.update((q) => {
        q.splice(currentIndex + 1, 0, song);
        return q;
    });
}

export function playLast(song: Song) {
    queue.update(q => [...q, song]);
}

export function playNow(song: Song) {
    if (currentIndex === 0 && currentQueue.length === 0) {
        // If the queue is empty, just add the song and set it as current
        queue.set([song]);
        queueIndex.set(0);
        return;
    }
    queue.update((q) => {
        q.splice(currentIndex + 1, 0, song);
        return q;
    });
    queueIndex.update(i => i + 1);
}

export function skipNext() {
    let queueLength = currentQueue.length;
    queueIndex.update(i => Math.min(i + 1, queueLength - 1));
}

export function skipPrevious() {
    queueIndex.update(i => Math.max(i - 1, 0));
}

export function shuffleQueue() {
    queue.update(q => {
        for (let i = q.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [q[i], q[j]] = [q[j], q[i]];
        }
        return q;
    });
}

export function unshuffleQueue() {
    queue.update(q => {
        q.sort((a, b) => a.id.localeCompare(b.id));
        return q;
    });
}

export function setRepeatMode(mode: 'disabled' | 'repeat' | 'one') {
    // This function is a placeholder for setting the repeat mode.
    // The actual implementation would depend on how the repeat mode is used in the player logic.
}
