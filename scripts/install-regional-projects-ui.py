from pathlib import Path

p = Path('nexus/local-government-planning/index.html')
s = p.read_text(encoding='utf-8')
marker = '<script src="./regional-projects-2027.js"></script>'
if marker not in s:
    inject = '\n<script src="./regional-projects-2027.js"></script>\n<script src="./regional-projects-render.js"></script>\n'
    s = s.replace('</body>', inject + '</body>')
    p.write_text(s, encoding='utf-8')
    print('installed regional project DB scripts')
else:
    print('regional project DB scripts already installed')
