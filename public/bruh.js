app.use(express.static("public"));

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

async function addPlayer(){

    const nickname = document.getElementById("nickname").value
    const role = document.getElementById("role").value
    const avatar = document.getElementById("avatar").value

    await fetch("/players",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            nickname,
            role,
            avatar
        })
    })

    loadPlayers()

}

async function loadPlayers(){

    const res = await fetch("/players")
    const players = await res.json()

    const playersDiv = document.getElementById("players")

    playersDiv.innerHTML = ""

    players.forEach(p => {

        const div = document.createElement("div")
        div.className = "player"

        div.innerHTML = `
            <img class="avatar" src="${p.avatar || 'https://via.placeholder.com/40'}">
            <div>
                <div>${p.nickname}</div>
                <small>${p.role}</small>
            </div>
        `

        playersDiv.appendChild(div)

    })

}

loadPlayers()