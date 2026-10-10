import json,urllib.request,concurrent.futures
companies=json.load(open('dist/companies.json'))['companies']
def get(c):
 url='https://www.google.com/s2/favicons?domain='+c['domain']+'&sz=128'
 req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
 try:
  with urllib.request.urlopen(req,timeout=25) as r:
   content=r.read();ctype=r.headers.get('Content-Type','')
  if 'image' not in ctype:raise ValueError('not an image')
  open('dist/'+c['logo'],'wb').write(content)
  return c['name']+': '+str(len(content))+' bytes'
 except Exception as e:return c['name']+': FAILED '+str(e)
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
 for result in pool.map(get,companies):print(result)
