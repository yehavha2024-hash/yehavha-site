from pathlib import Path

p=Path('nexus/local-government-planning/index.html')
s=p.read_text(encoding='utf-8')
marker='<script src="./business-development-render.js"></script>'
if marker not in s:
    anchor='<script src="./business-manual-render.js"></script>'
    if anchor not in s:
        raise SystemExit('business manual renderer anchor not found')
    s=s.replace(anchor, anchor+'\n<script src="./business-development-render.js"></script>')
    p.write_text(s,encoding='utf-8')
    print('installed business development renderer')
else:
    print('business development renderer already installed')
