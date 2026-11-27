(() => {
  const section = document.querySelector('.discuss-section');
  if (!section) return;
  const target = section.querySelector('.magnetic-target');
  const button = section.querySelector('.discuss-button');
  const svg = section.querySelector('.discuss-connection');
  const cursor = section.querySelector('.discuss-cursor');
  section.querySelector('.discuss-bridge').remove();
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const ns = 'http://www.w3.org/2000/svg';
  const threads = Array.from({length:15}, (_, i) => {
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('class', 'discuss-thread');
    path.setAttribute('stroke-width', String(i % 4 === 0 ? 1.35 : .65 + (i % 3) * .2));
    svg.insertBefore(path, cursor);
    return {path, spread:(i - 7) / 7, x:0, y:0, vx:0, vy:0};
  });
  let px=0, py=0, fx=0, fy=0, x=0, y=0, vx=0, vy=0;
  let amount=0, inside=false, initialized=false, frame=0, last=0;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function wake() { if (!frame) { last=performance.now(); frame=requestAnimationFrame(draw); } }
  function reset() { inside=false; wake(); }
  // Ray intersection with the actual rounded pill, so threads grow from its edge.
  function edge(cx,cy,hw,r,angle) {
    const ux=Math.cos(angle), uy=Math.sin(angle), stem=Math.max(0,hw-r);
    let lo=0,hi=hw+r+2;
    for(let i=0;i<18;i++) {
      const mid=(lo+hi)/2;
      const dist=Math.hypot(Math.max(Math.abs(ux*mid)-stem,0),uy*mid);
      if(dist<r) lo=mid; else hi=mid;
    }
    return [cx+ux*(lo-2),cy+uy*(lo-2)];
  }
  function draw(now) {
    frame=0;
    const dt=clamp((now-last)/1000,.001,.032); last=now;
    const bounds=section.getBoundingClientRect(), rect=button.getBoundingClientRect();
    // Remove last frame's translation when finding the resting centre.
    const cx=rect.left+rect.width/2-x, cy=rect.top+rect.height/2-y;
    const dx=px-cx, dy=py-cy;
    const radius=rect.height/2, stem=Math.max(0,rect.width/2-radius);
    const distance=Math.max(0,Math.hypot(Math.max(Math.abs(dx)-stem,0),dy)-radius);
    const enabled=inside&&!motion.matches&&fine.matches;
    let pull=enabled?clamp(1-distance/200,0,1):0;
    pull=pull*pull*(3-2*pull);
    const blend=1-Math.exp(-dt*13);
    amount+=(pull-amount)*blend;
    const tx=clamp(dx*.12,-25,25)*pull, ty=clamp(dy*.16,-22,22)*pull;
    vx+=((tx-x)*160-vx*23)*dt; vy+=((ty-y)*160-vy*23)*dt;
    x+=vx*dt; y+=vy*dt;
    target.style.transform=`translate3d(${x}px,${y}px,0)`;
    fx+=(px-fx)*(1-Math.exp(-dt*24)); fy+=(py-fy)*(1-Math.exp(-dt*24));
    const ax=cx+x-bounds.left, ay=cy+y-bounds.top;
    const angle=Math.atan2(fy-bounds.top-ay,fx-bounds.left-ax);
    const ux=Math.cos(angle),uy=Math.sin(angle),nx=-uy,ny=ux;
    const tipx=fx-bounds.left,tipy=fy-bounds.top;
    svg.setAttribute('viewBox',`0 0 ${bounds.width} ${bounds.height}`);
    const hoverFade=clamp(distance/18,0,1);
    svg.style.opacity=String(amount*hoverFade);
    threads.forEach((t,i)=>{
      const [sx,sy]=edge(ax,ay,rect.width/2,radius,angle+t.spread*.82);
      // Each filament carries its own damped inertia instead of moving as one sheet.
      const ex=sx+(tipx-sx)*amount,ey=sy+(tipy-sy)*amount;
      const length=Math.hypot(ex-sx,ey-sy);
      const bend=t.spread*Math.min(32,length*.17);
      const goalx=sx+(ex-sx)*.53+nx*bend;
      const goaly=sy+(ey-sy)*.53+ny*bend+Math.min(25,length*.12)*(1-Math.abs(t.spread)*.35);
      if(!initialized){t.x=goalx;t.y=goaly;}
      const stiffness=100+i*5,damping=19+i*.45;
      t.vx+=((goalx-t.x)*stiffness-t.vx*damping)*dt;
      t.vy+=((goaly-t.y)*stiffness-t.vy*damping)*dt;
      t.x+=t.vx*dt;t.y+=t.vy*dt;
      const tipSpread=t.spread*3*amount;
      t.path.setAttribute('d',`M ${sx} ${sy} C ${sx+ux*length*.22} ${sy+uy*length*.22}, ${t.x} ${t.y}, ${ex+nx*tipSpread} ${ey+ny*tipSpread}`);
      t.path.style.opacity=String(.28+(1-Math.abs(t.spread))*.48);
    });
    initialized=true;
    cursor.setAttribute('cx',tipx);cursor.setAttribute('cy',tipy);cursor.setAttribute('r',3.5*amount);
    if ((enabled&&pull>.001)||amount>.001||Math.hypot(x,y,vx,vy)>.02) {
      frame=requestAnimationFrame(draw);
    } else {
      target.style.transform=''; svg.style.opacity='0'; initialized=false;
      threads.forEach(t=>{t.vx=t.vy=0;});x=y=vx=vy=amount=0;
    }
  }
  section.addEventListener('pointermove',event=>{
    if(event.pointerType!=='mouse'||motion.matches||!fine.matches)return;
    px=event.clientX;py=event.clientY;
    if(!inside){fx=px;fy=py;}
    inside=true;wake();
  },{passive:true});
  section.addEventListener('pointerleave',reset);
  section.addEventListener('pointercancel',reset);
  window.addEventListener('blur',reset);
  window.addEventListener('scroll',reset,{passive:true});
  window.addEventListener('resize',reset,{passive:true});
  motion.addEventListener('change',reset);fine.addEventListener('change',reset);
})();
