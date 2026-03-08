const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

function loadData(){
 const data = fs.readFileSync("data.json","utf8");
 return JSON.parse(data);
}

function saveData(data){
 fs.writeFileSync("data.json",JSON.stringify(data,null,2));
}

app.get("/players",(req,res)=>{

 const players = loadData();
 const role = req.query.role;

 if(role){
  const filtered = players.filter(p=>p.role === role);
  return res.json(filtered);
 }

 res.json(players);
});

app.get("/player/:id",(req,res)=>{

 const players = loadData();
 const player = players.find(p=>p.id == req.params.id);

 if(!player){
  return res.status(404).json({message:"Player not found"});
 }

 res.json(player);
});

app.post("/players",(req,res)=>{

 const players = loadData();

 if(players.length >= 6){
  return res.status(400).json({message:"Max players is 6"});
 }

 const newPlayer = {
  id: Date.now(),
  nickname: req.body.nickname,
  role: req.body.role,
  type: req.body.type,
  position:{x:0,y:0}
 };

 players.push(newPlayer);
 saveData(players);

 res.json(newPlayer);
});

app.post("/edit/:id",(req,res)=>{

 const players = loadData();
 const index = players.findIndex(p=>p.id == req.params.id);

 if(index === -1){
  return res.status(404).json({message:"Player not found"});
 }

 players[index] = {
  ...players[index],
  nickname: req.body.nickname || players[index].nickname,
  role: req.body.role || players[index].role,
  position: req.body.position || players[index].position
 };

 saveData(players);

 res.json(players[index]);
});

app.delete("/delete/:id",(req,res)=>{

 let players = loadData();

 players = players.filter(p=>p.id != req.params.id);

 saveData(players);

 res.json({message:"Player deleted"});
});

app.listen(PORT,()=>{
 console.log(`Server running on http://localhost:${PORT}`);
});