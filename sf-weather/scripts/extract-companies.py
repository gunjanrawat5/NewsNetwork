"""Extract selected CA business signals from user-provided workbook. No workbook instructions execute."""
import zipfile,xml.etree.ElementTree as E,json,collections,sys
z=zipfile.ZipFile(sys.argv[1]);ns={'m':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
strings=[]
if 'xl/sharedStrings.xml' in z.namelist():
 for node in E.fromstring(z.read('xl/sharedStrings.xml')).findall('m:si',ns):strings.append(''.join(t.text or '' for t in node.findall('.//m:t',ns)))
def rows(sheet):
 result=[]
 for row in E.fromstring(z.read(f'xl/worksheets/sheet{sheet}.xml')).findall('.//m:sheetData/m:row',ns):
  cells={}
  for c in row.findall('m:c',ns):
   v=c.find('m:v',ns);t=v.text if v is not None else ''.join(t.text or '' for t in c.findall('.//m:t',ns))
   if c.attrib.get('t')=='s':t=strings[int(t)]
   cells[''.join(i for i in c.attrib['r'] if i.isalpha())]=t or ''
  if cells.get('A'):cells['_row']=row.attrib['r'];result.append(cells)
 return result
funding=collections.defaultdict(list)
for r in rows(7)[1:]:
 if r.get('E') and r.get('I')!='In talks':funding[r['A']].append(r)
top=sorted(funding,key=lambda n:sum(float(r['E']) for r in funding[n]),reverse=True)[:5]
companies=[]
for name in top:
 rounds=funding[name];amount=sum(float(r['E']) for r in rounds)
 companies.append({'id':name.lower().replace(' ','-'),'name':name,'city':rounds[0]['B'],'kind':'funding','amountM':amount,'summary':f'${amount/1000:g}B raised across {len(rounds)} workbook round(s).','events':[{'type':'funding','date':r['G'],'amountM':float(r['E']),'round':r['F'],'weather':r['M'],'source':f'California Only!{r["_row"]}','note':r.get('H','')}for r in rounds]})
for r in rows(3)[1:]:
 if ', CA' not in r.get('E',''):continue
 event={'type':'quake','date':r['D'],'summary':r['B'],'classification':r['C'],'people':int(float(r['F'])) if r.get('F') else None,'staffShare':float(r['G']) if r.get('G') else None,'magnitude':float(r['I']) if r.get('I') else None,'source':f'Quakes!{r["_row"]}'}
 item=next((c for c in companies if c['name']==r['A']),None)
 if item:item['events'].append(event);item['kind']='mixed'
 else:companies.append({'id':r['A'].lower().replace(' ','-'),'name':r['A'],'city':r['E'],'kind':'quake','summary':r['B'],'events':[event]})
for r in rows(4)[1:]:
 if r.get('A') not in ['NVIDIA','Alphabet']:continue
 change=float(r['D']);companies.append({'id':r['A'].lower(),'name':r['A'],'city':'California','kind':'gain' if change>0 else 'loss','summary':f'{change:+.1%} stock move in workbook, Oct 9, 2026.','events':[{'type':'stock','date':'2026-10-09','change':change,'close':float(r['C']),'ticker':r['B'],'source':f'Stocks Oct 9!{r["_row"]}'}]})
domains={'OpenAI':'openai.com','Anthropic':'anthropic.com','xAI':'x.ai','Databricks':'databricks.com','Scale AI':'scale.com','Netflix':'netflix.com','FICO':'fico.com','Caribou Biosciences':'cariboubio.com','Webflow':'webflow.com','Workday':'workday.com','Alphabet':'abc.xyz','NVIDIA':'nvidia.com'}
for c in companies:c['domain']=domains[c['name']];c['logo']='logos/'+c['id']+('.jpg' if c['name']=='Alphabet' else '.png')
result={'sourceFile':sys.argv[1].split('/')[-1],'asOf':'2026-10-10','selection':'Top five CA companies by sum of disclosed funding rounds (Jan 2025–Oct 2026); all six CA adverse-event companies (one overlaps funding); both CA stock signals. Funding is not profit. Adverse events with unknown counts are not severity-ranked. Workbook claims are not independently verified.','companies':companies}
open('dist/companies.json','w').write(json.dumps(result,indent=2)+'\n')
open('dist/company-data.js','w').write('window.COMPANY_DATA = '+json.dumps(result)+';\n')
for c in companies:print(c['name'],c['kind'],c.get('amountM',''),len(c['events']))
