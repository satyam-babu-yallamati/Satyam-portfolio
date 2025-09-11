// Animated background: gently moving nodes/edges
const c = document.getElementById('bg-canvas');
const ctx = c.getContext('2d');
let w, h, nodes;
function resize(){
  w = c.width = window.innerWidth;
  h = c.height = window.innerHeight;
  nodes = Array.from({length: Math.min(120, Math.floor(w*h/14000))}, ()=> ({
    x: Math.random()*w, y: Math.random()*h,
    vx: (Math.random()*2-1)*0.3, vy: (Math.random()*2-1)*0.3
  }));
}
function step(){
  ctx.clearRect(0,0,w,h);
  // draw links
  for(let i=0;i<nodes.length;i++){
    for(let j=i+1;j<nodes.length;j++){
      const a=nodes[i], b=nodes[j];
      const dx=a.x-b.x, dy=a.y-b.y;
      const dist = Math.hypot(dx,dy);
      if(dist<140){
        const alpha = (1 - dist/140) * 0.25;
        ctx.strokeStyle = `rgba(138,180,255,${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
      }
    }
  }
  // draw nodes
  nodes.forEach(n => {
    n.x+=n.vx; n.y+=n.vy;
    if(n.x<0||n.x>w) n.vx*=-1;
    if(n.y<0||n.y>h) n.vy*=-1;
    ctx.fillStyle='rgba(179,136,255,.6)';
    ctx.beginPath(); ctx.arc(n.x,n.y,1.5,0,Math.PI*2); ctx.fill();
  });
  requestAnimationFrame(step);
}
window.addEventListener('resize', resize);
resize();
requestAnimationFrame(step);

// Smooth in-page scroll for nav
document.querySelectorAll('header nav a, .cta, .btn.primary[href^="#"]').forEach(a => {
  a.addEventListener('click', (e)=>{
    const href = a.getAttribute('href');
    if(href && href.startsWith('#')){
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({behavior:'smooth'});
    }
  });
});

// ✅ Contact form handler (Google Sheets integration)
function sendMessage(e){
  e.preventDefault();
  const form = e.target;

  const scriptURL = "https://script.google.com/macros/s/AKfycbwiK9isj1UdyPu8GctQM-s64gdg_m1ydZM_ygQhw0fuJeflo1jQ2iQ9SWediHsxsLtl/exec";

  fetch(scriptURL, {
    method: "POST",
    body: new FormData(form)   // ✅ send as FormData (not JSON)
  })
  .then(response => {
    if (response.ok) {
      alert(`✅ Thanks ${form.name.value}! Your message was submitted.`);
      form.reset();
    } else {
      alert("⚠️ Something went wrong. Please try again.");
    }
  })
  .catch(error => {
    console.error("❌ Error!", error);
    alert("⚠️ Error submitting form.");
  });
}
