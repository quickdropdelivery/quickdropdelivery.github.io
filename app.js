let orders = JSON.parse(localStorage.getItem("qd_orders") || "null") || [
 {id:1001,restaurant:"Spice Kitchen",customer:"Aman",pickup:"Spice Kitchen, Main Market",drop:"12 Green Park",fee:100,commission:10,status:"Available",partner:"—",reason:""}
];

function save(){localStorage.setItem("qd_orders",JSON.stringify(orders)); render();}
function money(n){return "₹"+Number(n).toFixed(0)}
function toast(msg){let t=document.getElementById("toast");t.textContent=msg;t.style.display="block";setTimeout(()=>t.style.display="none",2200)}
function badge(s){let cls=s==="Delivered"?"done":s==="Failed"?"fail":"";return `<span class="badge ${cls}">${s}</span>`}
function card(o,role){
 let buttons="";
 if(role==="partner" && o.status==="Available") buttons=`<button class="ok" onclick="act(${o.id},'accept')">Accept</button>`;
 if(role==="partner" && ["Accepted","Picked up","On the way"].includes(o.status)){
   buttons+=`<button class="ok" onclick="act(${o.id},'next')">${o.status==="Accepted"?"Picked up":o.status==="Picked up"?"On the way":"Delivered"}</button>`;
   buttons+=`<button class="danger" onclick="fail(${o.id})">Delivery failed</button>`;
 }
 if(role==="admin") buttons=`<button onclick="act(${o.id},'assign')">Assign partner</button>`;
 return `<div class="order">
   <div class="orderTop"><b>#${o.id} · ${o.restaurant}</b>${badge(o.status)}</div>
   <div class="muted">👤 ${o.customer} · 📍 ${o.drop}</div>
   <div class="muted">Pickup: ${o.pickup}</div>
   <div class="muted">Fee ${money(o.fee)} · Platform commission ${money(o.commission)} · Partner ${o.partner}</div>
   ${o.reason?`<div class="muted">⚠️ Failed reason: ${o.reason} — restaurant should contact the customer.</div>`:""}
   <div class="actions">${buttons}</div>
 </div>`
}
function render(){
 document.getElementById("totalOrders").textContent=orders.length;
 document.getElementById("completedOrders").textContent=orders.filter(o=>o.status==="Delivered").length;
 document.getElementById("failedOrders").textContent=orders.filter(o=>o.status==="Failed").length;
 document.getElementById("commission").textContent=money(orders.filter(o=>o.status==="Delivered").reduce((a,o)=>a+o.commission,0));
 document.getElementById("adminOrders").innerHTML=orders.map(o=>card(o,"admin")).join("")||"<p class='muted'>No orders.</p>";
 document.getElementById("restaurantOrders").innerHTML=orders.map(o=>card(o,"restaurant")).join("")||"<p class='muted'>No orders.</p>";
 document.getElementById("partnerOrders").innerHTML=orders.map(o=>card(o,"partner")).join("")||"<p class='muted'>No deliveries.</p>";
 document.getElementById("customerOrders").innerHTML=orders.map(o=>card(o,"customer")).join("")||"<p class='muted'>No deliveries.</p>";
}
function createOrder(){
 let fee=Number(document.getElementById("fee").value)||100;
 let o={id:Date.now().toString().slice(-6),restaurant:document.getElementById("rName").value||"Restaurant",customer:document.getElementById("cName").value||"Customer",pickup:document.getElementById("pickup").value||"Pickup",drop:document.getElementById("drop").value||"Drop",fee,commission:Math.max(1,Math.round(fee*.10)),status:"Available",partner:"—",reason:""};
 orders.unshift(o);save();toast("Delivery request created");
}
function act(id,type){
 let o=orders.find(x=>x.id==id);if(!o)return;
 if(type==="accept"){o.status="Accepted";o.partner="Demo Partner";}
 else if(type==="next"){o.status=o.status==="Accepted"?"Picked up":o.status==="Picked up"?"On the way":"Delivered";if(o.status==="Delivered")toast("Delivery completed — commission confirmed");}
 else if(type==="assign"){o.status="Accepted";o.partner="Demo Partner";toast("Demo partner assigned");}
 save();
}
function fail(id){
 let o=orders.find(x=>x.id==id);if(!o)return;
 o.status="Failed";o.reason=prompt("Why did delivery fail?","Customer unavailable")||"Unspecified";
 toast("Restaurant alerted: please contact customer");
 save();
}
function resetDemo(){localStorage.removeItem("qd_orders");location.reload()}
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".view").forEach(x=>x.classList.remove("active"));b.classList.add("active");document.getElementById(b.dataset.view).classList.add("active");render()});
render();
