// GLOBAL APP INIT

window.addEventListener("load", async () => {

    console.log("Talkie app loaded");

    // 1. Initialize video UI first (creates DOM elements)
    if (window.initVideoSystem) {
        window.initVideoSystem();
    }

    // 2. Initialize draggable/resizable system
    if (window.initDraggableVideos) {
        window.initDraggableVideos();
    }

    // 3. Prepare UI state
    if (window.addSystemMessage) {
        window.addSystemMessage("👋 Welcome to Talkie");
    }

    // 4. Optional: pre-warm camera permissions (better UX)
    // (only if you want early permission request)
    // navigator.mediaDevices.getUserMedia({ video: true, audio: true });

});
