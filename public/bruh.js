let editingId = null;

async function loadPlayers(){

 const res = await fetch("/players");
 const players = await res.json();

 renderPlayers(players);
}

function renderPlayers(players){

 const playersDiv = document.getElementById("players");
 playersDiv.innerHTML = "";

 players.forEach(p=>{

  const div = document.createElement("div");
  div.className="player";

  div.innerHTML=`
  <div>
   <b>${p.nickname}</b>
   <small>${p.role}</small>
  </div>

  <button onclick="editPlayer(${p.id})">Edit</button>
  <button onclick="deletePlayer(${p.id})">Delete</button>
  `;

  playersDiv.appendChild(div);

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