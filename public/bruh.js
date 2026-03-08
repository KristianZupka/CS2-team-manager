const playerColors = [
"#ff0000",
"#00ff00",
"#0099ff",
"#ffff00",
"#ff00ff",
"#00ffff"
]
let editingId = null;
async function loadPlayers(){

 const res = await fetch("/players");
 const players = await res.json();

 renderPlayers(players);
}

function renderPlayers(players){

 const playersDiv = document.getElementById("players");
 const map = document.getElementById("map");

 playersDiv.innerHTML = "";

 map.querySelectorAll(".dot").forEach(dot => dot.remove());

 players.forEach((p,index)=>{

  const div = document.createElement("div");
  div.className = "player";

  div.innerHTML = `
  <div>
   <b>${p.nickname}</b>
   <small>${p.role}</small>
  </div>

  <button onclick="editPlayer(${p.id})">Edit</button>
  <button onclick="deletePlayer(${p.id})">Delete</button>
  `;

  playersDiv.appendChild(div);


  // vytvoření tečky na mapě
  const dot = document.createElement("div");

  dot.className = "dot";

  dot.style.left = p.position.x + "px";
  dot.style.top = p.position.y + "px";

  dot.style.background = playerColors[index % playerColors.length];

  dot.draggable = true;

  map.appendChild(dot);

 });

}

async function addPlayer(){

 const nickname = document.getElementById("nickname").value;
 const role = document.getElementById("role").value;
 const type = document.getElementById("type").value;

 await fetch("/players",{
  method:"POST",
  headers:{
   "Content-Type":"application/json"
  },
  body:JSON.stringify({nickname,role,type})
 });

 loadPlayers();
}

async function deletePlayer(id){

 if(!confirm("Delete player?")) return;

 await fetch(`/delete/${id}`,{
  method:"DELETE"
 });

 loadPlayers();
}

async function editPlayer(id){

 editingId = id;

 const res = await fetch(`/player/${id}`);
 const player = await res.json();

 document.getElementById("editNickname").value = player.nickname;
 document.getElementById("editRole").value = player.role;

 document.getElementById("editForm").style.display="block";
}

async function saveEdit(){

 const nickname = document.getElementById("editNickname").value;
 const role = document.getElementById("editRole").value;

 await fetch(`/edit/${editingId}`,{

  method:"POST",

  headers:{
   "Content-Type":"application/json"
  },

  body:JSON.stringify({nickname,role})

 });

 closeEdit();
 loadPlayers();
}

function closeEdit(){

 document.getElementById("editForm").style.display="none";

}

async function filterPlayers(){

 const role = document.getElementById("filterRole").value;

 let url="/players";

 if(role){
  url=`/players?role=${role}`;
 }

 const res = await fetch(url);
 const players = await res.json();

 renderPlayers(players);
}

loadPlayers();

function changeMap(){

 const map = document.getElementById("mapSelect").value

 const img = document.getElementById("mapImage")

 img.src = `map_${map}.png`

}