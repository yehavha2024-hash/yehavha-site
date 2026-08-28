#!/usr/bin/env python3
from pathlib import Path

INDEX = Path('nexus/local-government-planning/index.html')
MARKER = '<!-- council-members-2026 -->'
SCRIPTS = '''\n<!-- council-members-2026 -->\n<script src="./council-members-2026.js?v=20260828"></script>\n<script src="./council-render.js?v=20260828"></script>\n'''

text = INDEX.read_text(encoding='utf-8')
if MARKER not in text:
    if '</body>' not in text:
        raise SystemExit('index.html has no </body> marker')
    text = text.replace('</body>', SCRIPTS + '</body>', 1)
    INDEX.write_text(text, encoding='utf-8')
    print('installed council-member UI hooks')
else:
    print('council-member UI hooks already installed')
