player.on("idle", (oldState, newState) => {
    console.log("idle");
    console.log({ oldState, newState });
});

player.on("buffering", (oldState, newState) => {
    console.log("buffering");
    console.log({ oldState, newState });
});

player.on("paused", (oldState, newState) => {
    console.log("paused");
    console.log({ oldState, newState });
});

player.on("playing", (oldState, newState) => {
    console.log("playing");
    console.log({ oldState, newState });
});

player.on("autopaused", (oldState, newState) => {
    console.log("autopaused");
    console.log({ oldState, newState });
});

player.on("stateChange", (oldState, newState) => {
    console.log("stateChange");
    console.log({ oldState, newState });
});

player.on("subscribe", (sub) => {
    console.log("subscribe");
    console.log({ sub });
});

player.on("unsubscribe", (sub) => {
    console.log("unsubscribe");
    console.log({ sub });
});

player.on("error", (err) => {
    console.log("error");
    console.log({ err });
});

player.on("debug", (msg) => {
    console.log("debug");
    console.log({ msg });
});
