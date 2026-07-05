const canvas = document.getElementById("videoCanvas");

let activeDrag = null;
let offsetX = 0;
let offsetY = 0;

// ============================
// INIT DRAGGABLE ELEMENTS
// ============================

function initDraggableVideos() {
    const videos = document.querySelectorAll(".videoCard");

    videos.forEach(video => {
        enableDrag(video);
        enableResize(video);
    });
}

// run after DOM loads
window.addEventListener("load", initDraggableVideos);

// ============================
// DRAG FUNCTIONALITY
// ============================

function enableDrag(el) {

    const header = el.querySelector(".videoHeader");
    if (!header) return;

    header.style.cursor = "grab";

    header.addEventListener("mousedown", (e) => {

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

    // keep inside bounds
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
// RESIZE FUNCTIONALITY
// ============================

function enableResize(el) {

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
        borderRadius: "3px"
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
