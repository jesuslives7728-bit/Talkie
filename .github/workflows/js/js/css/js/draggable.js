const canvas = document.getElementById("videoCanvas");

let activeDrag = null;
let offsetX = 0;
let offsetY = 0;

// ============================
// INIT SYSTEM
// ============================

window.addEventListener("load", () => {
    initDraggableVideos();

    // watch for new video cards (IMPORTANT FIX)
    observeVideoCanvas();
});

// ============================
// OBSERVER (handles WebRTC dynamic UI)
// ============================

function observeVideoCanvas() {

    const observer = new MutationObserver(() => {
        initDraggableVideos();
    });

    observer.observe(canvas, {
        childList: true,
        subtree: true
    });
}

// ============================
// APPLY DRAG + RESIZE
// ============================

function initDraggableVideos() {

    const videos = document.querySelectorAll(".videoCard");

    videos.forEach(video => {

        if (!video.dataset.draggable) {
            enableDrag(video);
            enableResize(video);
            video.dataset.draggable = "true";
        }
    });
}

// ============================
// DRAG
// ============================

function enableDrag(el) {

    const header = el.querySelector(".videoHeader");
    if (!header) return;

    header.style.cursor = "grab";

    header.addEventListener("mousedown", (e) => {

        // prevent resize handle triggering drag
        if (e.target.classList.contains("resizeHandle")) return;

        activeDrag = el;

        const rect = el.getBoundingClientRect();

        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        el.style.position = "absolute";
        el.style.zIndex = 1000;

        document.addEventListener("mousemove", dragMove);
        document.addEventListener("mouseup", stopDrag);
    });
}

function dragMove(e) {

    if (!activeDrag) return;

    const canvasRect = canvas.getBoundingClientRect();

    let x = e.clientX - canvasRect.left - offsetX;
    let y = e.clientY - canvasRect.top - offsetY;

    // clamp inside canvas
    x = Math.max(0, Math.min(x, canvasRect.width - activeDrag.offsetWidth));
    y = Math.max(0, Math.min(y, canvasRect.height - activeDrag.offsetHeight));

    activeDrag.style.left = x + "px";
    activeDrag.style.top = y + "px";
}

function stopDrag() {
    activeDrag = null;
    document.removeEventListener("mousemove", dragMove);
    document.removeEventListener("mouseup", stopDrag);
}

// ============================
// RESIZE
// ============================

function enableResize(el) {

    if (el.querySelector(".resizeHandle")) return;

    const handle = document.createElement("div");
    handle.className = "resizeHandle";

    Object.assign(handle.style, {
        width: "12px",
        height: "12px",
        background: "#2d6bff",
        position: "absolute",
        right: "4px",
        bottom: "4px",
        cursor: "nwse-resize",
        borderRadius: "3px",
        zIndex: 2000
    });

    el.appendChild(handle);

    let resizing = false;

    handle.addEventListener("mousedown", (e) => {

        resizing = true;
        e.stopPropagation();

        document.addEventListener("mousemove", resizeMove);
        document.addEventListener("mouseup", stopResize);
    });

    function resizeMove(e) {

        if (!resizing) return;

        const rect = el.getBoundingClientRect();

        let width = e.clientX - rect.left;
        let height = e.clientY - rect.top;

        width = Math.max(160, width);
        height = Math.max(120, height);

        el.style.width = width + "px";
        el.style.height = height + "px";
    }

    function stopResize() {
        resizing = false;
        document.removeEventListener("mousemove", resizeMove);
        document.removeEventListener("mouseup", stopResize);
    }
}
