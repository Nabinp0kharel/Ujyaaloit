(() => {
  const trigger=document.querySelector('.menu-toggle');
  if(!trigger)return;
  const root=new URL('../',document.currentScript.src);
  const url=path=>new URL(path,root).href;
  const dialog=document.createElement('dialog');
  dialog.className='full-menu';
  dialog.id='full-menu';
  dialog.setAttribute('aria-label','Explore UjyaaloIT');
  const sections={
    services:{title:'Technology for your business.',intro:'Practical support and thoughtful development, built around what you need.',cards:[['Everyday IT, taken care of.','Support for your devices, systems and people.','services/small-business-support.html','assets/photography/device-support.webp'],['Build what comes next.','Websites, applications and connected business systems.','services/software-ecommerce.html','web pics/photo 1(landing).png']]},
    insights:{title:'Clear thinking. Useful insights.',intro:'Explore our thinking and see how we put technology to work.',cards:[['Ideas for your next step.','Perspectives on technology for your business.','insights.html','assets/photography/device-support.webp'],['See our selected work.','Explore the projects we have worked on.','projects.html','web pics/photo 1(landing).png']]},
    about:{title:'Brighter, together.',intro:'Made in London. Practical thinking, connected technology and a clear approach.',cards:[['Meet UjyaaloIT.','Get to know our story and the way we work.','about.html','web pics/photo 1(landing).png'],['Let’s discuss what comes next.','Bring your challenge. We’ll discuss the approach.','contact.html','assets/photography/device-support.webp']]}
  };
  dialog.innerHTML=`<aside class="full-menu-sidebar"><button class="full-menu-close" aria-label="Close menu">×</button><p class="full-menu-brand">Ujyaalo<span>IT</span></p><nav class="full-menu-tabs" aria-label="Explore sections"><button data-section="services">Services</button><button data-section="insights">Insights</button><button data-section="about">About Us</button></nav><nav class="full-menu-secondary" aria-label="More pages"><a href="${url('index.html')}">Home</a><a href="${url('projects.html')}">Our work</a><a href="${url('contact.html')}">Contact us <span>↗</span></a></nav><div class="full-menu-social"><p>STAY CONNECTED</p><nav aria-label="Social media"><a href="https://www.facebook.com/people/Ujyaalo-Information-Technology/61583783383206/" target="_blank" rel="noopener noreferrer"><img src="https://cdn.simpleicons.org/facebook/0866FF" width="24" height="24" alt="" aria-hidden="true" referrerpolicy="no-referrer"><span>Facebook</span></a><a href="https://www.instagram.com/ujyaalo_it" target="_blank" rel="noopener noreferrer"><img src="https://cdn.simpleicons.org/instagram/000000" width="24" height="24" alt="" aria-hidden="true" referrerpolicy="no-referrer"><span>Instagram</span></a><a href="https://www.tiktok.com/@ujyaaloit" target="_blank" rel="noopener noreferrer"><img src="https://cdn.simpleicons.org/tiktok/000000" width="24" height="24" alt="" aria-hidden="true" referrerpolicy="no-referrer"><span>TikTok</span></a><a href="https://www.youtube.com/@ujyaaloit" target="_blank" rel="noopener noreferrer"><img src="https://cdn.simpleicons.org/youtube/FF0033" width="24" height="24" alt="" aria-hidden="true" referrerpolicy="no-referrer"><span>YouTube</span></a></nav></div></aside><section class="full-menu-content" aria-labelledby="full-menu-title"></section>`;
  document.body.append(dialog);
  const content=dialog.querySelector('.full-menu-content');
  function select(key){
    const section=sections[key];
    dialog.querySelectorAll('[data-section]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.section===key)));
    content.innerHTML=`<p class="full-menu-eyebrow">EXPLORE UJYAALOIT</p><h2 id="full-menu-title">${section.title}</h2><p class="full-menu-intro">${section.intro}</p><div class="full-menu-cards">${section.cards.map(([title,copy,path,photo])=>`<a class="full-menu-card" href="${url(path)}"><img src="${url(photo)}" alt=""><div><h3>${title}</h3><p>${copy}</p><span>Explore <span aria-hidden="true">↗</span></span></div></a>`).join('')}</div><a class="full-menu-all" href="${url(key==='about'?'about.html':key+'.html')}">Explore ${key==='about'?'About Us':key} <span aria-hidden="true">↗</span></a>`;
  }
  function closed(){document.body.classList.remove('full-menu-open');trigger.setAttribute('aria-expanded','false');trigger.focus();}
  trigger.setAttribute('aria-controls',dialog.id);
  trigger.setAttribute('aria-haspopup','dialog');
  // Capture the click before the older compact-menu handler runs.
  trigger.addEventListener('click',event=>{
    event.preventDefault();event.stopImmediatePropagation();
    document.querySelector('.navigation').classList.remove('open');
    const services=document.querySelector('.services-menu');if(services)services.hidden=true;
    document.querySelector('.services-trigger')?.setAttribute('aria-expanded','false');
    const panel=document.querySelector('.panel');if(panel)panel.hidden=true;
    select('services');dialog.showModal();document.body.classList.add('full-menu-open');trigger.setAttribute('aria-expanded','true');
  },true);
  dialog.querySelector('.full-menu-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',closed);
  dialog.querySelectorAll('[data-section]').forEach(button=>button.addEventListener('click',()=>select(button.dataset.section)));
})();
