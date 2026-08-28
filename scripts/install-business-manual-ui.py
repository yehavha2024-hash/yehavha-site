from pathlib import Path

p=Path('nexus/local-government-planning/index.html')
s=p.read_text(encoding='utf-8')
marker='<script src="./business-manual-render.js"></script>'
if marker in s:
    print('business manual already installed')
else:
    anchor='<script src="./regional-projects-render.js"></script>'
    if anchor not in s:
        raise SystemExit('regional project renderer anchor not found')
    s=s.replace(anchor, anchor+'\n<script src="./business-manual-render.js"></script>')
    p.write_text(s,encoding='utf-8')
    print('installed business manual renderer')
