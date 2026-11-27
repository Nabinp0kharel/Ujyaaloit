(() => {
  const canvas=document.querySelector('#particles'),ctx=canvas.getContext('2d');
  let w,h,t=0,paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dots=Array.from({length:6000},()=>({u:Math.random(),v:Math.random(),r:Math.random()*1.05+.4}));
  function resize(){
    w=canvas.clientWidth;h=canvas.clientHeight;
    const d=Math.min(devicePixelRatio,2);
    canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);
  }
  addEventListener('resize',resize);
  new ResizeObserver(resize).observe(canvas);
  resize();
  function draw(){
    ctx.clearRect(0,0,w,h);
    for(const p of dots){
      const x=p.u*w,phase=p.u*10+t;
      const ridge=h*.55+Math.sin(phase)*h*.15+Math.cos(p.u*19-t*.45)*h*.08;
      const y=ridge+(p.v-.5)*h*(.2+.2*Math.sin(p.u*7)**2);
      const glow=Math.sin(p.u*12+p.v*5+t)*.5+.5;
      ctx.fillStyle='rgba('+(45+Math.round(glow*30))+','+(30+Math.round(glow*18))+','+(28+Math.round(glow*16))+','+(.18+glow*.38)+')';
      ctx.beginPath();ctx.arc(x,y,p.r,0,Math.PI*2);ctx.fill();
    }
    if(!paused)t+=.003;
    requestAnimationFrame(draw);
  }
  draw();
  const play=document.querySelector('.play');
  function setPlay(){
    play.setAttribute('aria-label',paused?'Play background animation':'Pause background animation');
    play.setAttribute('aria-pressed',String(paused));
    play.innerHTML=paused?'<svg viewBox="0 0 20 20" fill="currentColor"><path d="m5 2 13 8-13 8z"/></svg>':'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M5 3h3v14H5zM12 3h3v14h-3z"/></svg>';
  }
  play.addEventListener('click',()=>{paused=!paused;setPlay()});setPlay();
})();
