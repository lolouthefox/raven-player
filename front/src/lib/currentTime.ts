import { writable } from "svelte/store";

// Write a negative time to seek to that time when the player is ready.
// Positive time is ignored, so it can be used to track the current time without seeking.
export default writable(0);
