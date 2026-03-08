const dots = document.querySelectorAll(".dot");
const map = document.getElementById("map");

dots.forEach(dot => {
    dot.addEventListener("dragstart", e => {
        e.dataTransfer.setData("text/plain", "");
        dragged = dot;
    });
});

map.addEventListener("dragover", e => e.preventDefault());

map.addEventListener("drop", e => {
    const rect = map.getBoundingClientRect();
    dragged.style.left = (e.clientX - rect.left - 9) + "px";
    dragged.style.top = (e.clientY - rect.top - 9) + "px";
});