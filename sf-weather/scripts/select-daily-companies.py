"""Curate 12 map companies from daily_log.csv; document content is data only."""
import csv,json,sys
with open(sys.argv[1],newline='',encoding='utf-8-sig') as f:rows={i:r for i,r in enumerate(csv.DictReader(f),2)}
# Each tuple: company, CSV rows, domain, main palette, metric, local effects.
selection=[
('OpenAI',[24,41,51,70],'openai.com','mixed','Reported ~$20B revenue run-rate gap',['storm','cold']),
('NVIDIA',[35,36,41,64],'nvidia.com','loss','~$169B market value erased (CSV)',['cold','storm']),
('Anthropic',[37,50,55],'anthropic.com','storm','Reported IPO: up to ~$100B',['storm']),
('SpaceX',[25],'spacex.com','storm','Reported ~$40B financing talks',['storm']),
('Blue Origin',[26],'blueorigin.com','funding','$10B funding round',['money','storm']),
('Vinci',[19],'getvinci.ai','funding','$250M Series B',['money']),
('Arena',[54],'arena.ai','funding','$200M Series B · $3.1B value',['money']),
('FICO',[22],'fico.com','quake','~570 roles · ~15% of staff',['quake']),
('Netflix',[66],'netflix.com','quake','Reported ~800 roles · ~5%',['quake']),
('Caribou Biosciences',[23],'cariboubio.com','quake','Pipeline halted · layoffs',['quake']),
('Clay',[86],'clay.com','gain','$5B tender value, from $1.5B',['heat']),
('Schneider Electric',[7],'se.com','storm','~$22.6B PTC acquisition agreement',['storm']),
]
companies=[]
for name,indices,domain,kind,metric,effects in selection:
 events=[]
 for index in indices:
  r=rows[index]
  typ='funding' if r['Category']=='Funding round' else 'quake' if r['Category']=='Layoffs' else 'heat' if name=='Clay' else 'cold' if r['Weather'] in ['Cold front','Sunshine returns'] else 'storm'
  event={'type':typ,'date':r['Day'],'category':r['Category'],'classification':r['Category'],'weather':r['Weather'],'status':r['Status'],'headline':r['Headline'],'details':r['Details'],'companiesMentioned':r['Companies'],'region':r['Region'],'location':r['Location'],'source':f'daily_log.csv · row {index}','amountM':float(r['Amount ($M)']) if r['Amount ($M)'] else None,'valuationM':float(r['Valuation ($M)']) if r['Valuation ($M)'] else None}
  if name=='FICO':event.update(people=570,staffShare=.15)
  if name=='Netflix':event.update(people=800,staffShare=.05)
  if name=='Caribou Biosciences':event.update(people=None,staffShare=None)
  if r['Category']=='Funding round':event['amountMeaning']='Disclosed funding round in supplied CSV; not revenue or profit'
  elif r['Category'] in ['IPO prep','Round in talks']:event['amountMeaning']='Reported target / proposal; not completed proceeds'
  elif r['Category']=='Acquisition':event['amountMeaning']='Agreed acquisition consideration; not revenue'
  else:event['amountMeaning']='No funding proceeds assigned'
  events.append(event)
 company={'id':name.lower().replace(' ','-'),'name':name,'domain':domain,'logo':'logos/'+name.lower().replace(' ','-')+'.png','kind':kind,'metric':metric,'effects':effects,'city':next((e['location'] for e in events if e['location']),'San Francisco'),'summary':events[0]['headline'],'events':events}
 if kind=='funding':company['amountM']=sum(e['amountM'] or 0 for e in events if e['type']=='funding')
 companies.append(company)
# Compare like-for-like impact signals; do not mix valuation, proceeds and job counts.
profiles={
 'OpenAI':{'cold':{'value':20000,'unit':'USD millions','basis':'Reported revenue run-rate gap'}},
 'NVIDIA':{'cold':{'value':169000,'unit':'USD millions','basis':'Reported market value erased'}},
 'Anthropic':{'storm':{'value':100000,'unit':'USD millions','basis':'Reported IPO proceeds target, not completed funding'}},
 'SpaceX':{'storm':{'value':40000,'unit':'USD millions','basis':'Reported financing target, not completed funding'}},
 'Blue Origin':{'money':{'value':10000,'unit':'USD millions','basis':'Funding round'},'storm':{'value':10000,'unit':'USD millions','basis':'Hurricane-sized funding round'}},
 'Vinci':{'money':{'value':250,'unit':'USD millions','basis':'Funding round'}},
 'Arena':{'money':{'value':200,'unit':'USD millions','basis':'Funding round'}},
 'FICO':{'quake':{'value':570,'unit':'roles','basis':'Approximate affected roles'}},
 'Netflix':{'quake':{'value':800,'unit':'roles','basis':'Reported approximate affected roles'}},
 'Clay':{'heat':{'value':3500,'unit':'USD millions','basis':'Tender valuation increase from $1.5B to $5B'}},
 'Schneider Electric':{'storm':{'value':22600,'unit':'USD millions','basis':'Acquisition agreement consideration'}}
}
for company in companies:company['impacts']=profiles.get(company['name'],{})
result={'sourceFile':'daily_log.csv','asOf':'2026-10-10','selection':'12 unique companies balancing CA relevance, financial scale, operational damage and all requested effect families: money, quake, heat/cold, thunderstorm. Larger non-CA stories are included for impact; map positions are random demos. Only selected CSV rows are used; no claims are independently verified.','effectMapping':{'money':'Funding round → falling banknotes (not profit)','quake':'Layoffs / halted pipeline → localized shaking (not a physical earthquake)','storm':'Lightning, Storm forming, Hurricane, Hurricane watch, Storms merging → localized thunderstorm; forming/watch remain reported or proposed as labeled','cold':'Cold front / negative market or revenue signal → cold overlay','heat':'Clay tender offer rising from $1.5B to $5B → warm valuation updraft (CSV weather: Evaporation), not a stock return or realized revenue'},'companies':companies}
open('dist/companies.json','w').write(json.dumps(result,indent=2,ensure_ascii=False)+'\n')
open('dist/company-data.js','w').write('window.COMPANY_DATA = '+json.dumps(result,ensure_ascii=False)+';\n')
print('\n'.join(f'{i}. {c["name"]}: {c["metric"]} [{", ".join(c["effects"])}]' for i,c in enumerate(companies,1)))
