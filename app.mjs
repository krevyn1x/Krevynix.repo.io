import {validateSource,managerLinks,packageRows} from './repo-model.mjs';
const byID=id=>document.getElementById(id);
try {
  const [config, records] = await Promise.all(['config.json','packages.json'].map(async path=>{
    const response=await fetch(path,{cache:'no-cache'}); if(!response.ok) throw new Error('Inventory unavailable'); return response.json();
  }));
  const source=validateSource(config.sourceURL);
  if(source){
    byID('source-url').textContent=source;
    byID('copy-source').disabled=false;
    byID('copy-status').textContent='Tap to copy';
    byID('copy-source').addEventListener('click',async()=>{
      try{await navigator.clipboard.writeText(source);byID('copy-status').textContent='Copied to clipboard';}
      catch{byID('copy-status').textContent='Copy the source address shown above.';}
    });
    for(const [id,link] of Object.entries(managerLinks(source))){byID(id).href=link;byID(id).removeAttribute('aria-disabled');}
    byID('availability').textContent='The source opens in your chosen package manager.';
    if(config.qrPath && /^assets\/[a-zA-Z0-9_.-]+\.png$/.test(config.qrPath)){byID('qr').src=config.qrPath;byID('qr').hidden=false;}
  }
  const rows=packageRows(records);
  byID('package-count').textContent=rows.length+' packages · '+records.length+' bootstrap variants';
  if(!rows.length){const empty=document.createElement('div');empty.className='empty';empty.textContent='Packages are being built and verified. Downloads appear here once release archives are available.';byID('package-list').append(empty);}
  for(const row of rows){
    const link=document.createElement('a');link.className='package-row';link.href='depictions/'+encodeURIComponent(row.id)+'.html';
    const icon=document.createElement('span');icon.className='package-icon';icon.textContent=row.name.replace(/^Krevynix /,'')[0];icon.setAttribute('aria-hidden','true');
    const body=document.createElement('span');body.className='package-body';
    const name=document.createElement('span');name.className='package-name';name.textContent=row.name;
    const meta=document.createElement('span');meta.className='package-meta';meta.textContent=row.variants.map(v=>v.Architecture).join(' · ');
    const version=document.createElement('span');version.className='package-version';version.textContent=row.version;
    body.append(name,meta);link.append(icon,body,version);byID('package-list').append(link);
  }
} catch {
  byID('package-count').textContent='Inventory unavailable';
  byID('package-list').textContent='Reload this page to retry loading package information.';
}
