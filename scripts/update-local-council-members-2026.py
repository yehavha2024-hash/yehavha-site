#!/usr/bin/env python3
"""Build the 2026 local-council member database used by Nexus.

Source: 시민정치마당 2026 지방선거 당선인 명부 (NEC-derived public election facts).
The output contains only factual election data needed by the UI: region, council,
electoral district, elected member name, and party.
"""
from __future__ import annotations

import json
import math
import re
import sys
import time
from collections import OrderedDict
from datetime import datetime, timezone
from pathlib import Path

import requests
from bs4 import BeautifulSoup

BASE = "https://cpmadang.org/people/list_of_candidates_2026"
OUT = Path("nexus/local-government-planning/council-members-2026.js")

ELECTION_TYPES = {
    "시·도의회의원선거": "metro",
    "광역의원비례대표후보": "metro_pr",
    "구·시·군의회의원선거": "local",
    "기초의원비례대표선거": "local_pr",
}

PARTIES = {
    "더불어민주당", "국민의힘", "조국혁신당", "개혁신당", "진보당",
    "정의당", "기본소득당", "사회민주당", "공화당", "국민대통합당",
    "국민연합", "국민주권당", "대한국민당", "기독당", "노동당",
    "녹색당", "미래연대", "새미래민주당", "여성의당", "자유민주당",
    "자유와혁신", "자유통일당", "친미연합", "한국독립당", "한나라당",
    "국민당", "거지당", "무소속",
}

REGION_ORDER = [
    "서울특별시", "전남광주통합특별시", "부산광역시", "대구광역시",
    "인천광역시", "대전광역시", "울산광역시", "세종특별자치시",
    "경기도", "강원특별자치도", "충청북도", "충청남도",
    "전북특별자치도", "경상북도", "경상남도", "제주특별자치도",
]

REGION_ALIASES = {
    "서울특별시": "서울특별시",
    "부산광역시": "부산광역시",
    "대구광역시": "대구광역시",
    "인천광역시": "인천광역시",
    "광주광역시": "전남광주통합특별시",
    "전라남도": "전남광주통합특별시",
    "전남광주통합특별시": "전남광주통합특별시",
    "대전광역시": "대전광역시",
    "울산광역시": "울산광역시",
    "세종특별자치시": "세종특별자치시",
    "경기도": "경기도",
    "강원특별자치도": "강원특별자치도",
    "충청북도": "충청북도",
    "충청남도": "충청남도",
    "전북특별자치도": "전북특별자치도",
    "전라북도": "전북특별자치도",
    "경상북도": "경상북도",
    "경상남도": "경상남도",
    "제주특별자치도": "제주특별자치도",
}

REGION_PREFIXES = sorted(REGION_ALIASES, key=len, reverse=True)

COUNCIL_NAMES = {
    "서울특별시": "서울특별시의회",
    "전남광주통합특별시": "전남광주통합특별시의회",
    "부산광역시": "부산광역시의회",
    "대구광역시": "대구광역시의회",
    "인천광역시": "인천광역시의회",
    "대전광역시": "대전광역시의회",
    "울산광역시": "울산광역시의회",
    "세종특별자치시": "세종특별자치시의회",
    "경기도": "경기도의회",
    "강원특별자치도": "강원특별자치도의회",
    "충청북도": "충청북도의회",
    "충청남도": "충청남도의회",
    "전북특별자치도": "전북특별자치도의회",
    "경상북도": "경상북도의회",
    "경상남도": "경상남도의회",
    "제주특별자치도": "제주특별자치도의회",
}

session = requests.Session()
session.headers.update({
    "User-Agent": "YEHAVHA-NEXUS/1.0 (+https://yehavha-nexus.pages.dev/)"
})


def fetch(url: str, params=None, retries: int = 4) -> str:
    err = None
    for attempt in range(retries):
        try:
            r = session.get(url, params=params, timeout=35)
            r.raise_for_status()
            return r.text
        except requests.RequestException as exc:
            err = exc
            time.sleep(1.2 * (attempt + 1))
    raise RuntimeError(f"fetch failed: {url}: {err}")


def normalize_name(raw: str) -> str:
    raw = re.sub(r"\s*✔️.*$", "", raw).strip()
    raw = re.sub(r"\([^)]*\)$", "", raw).strip()
    return raw


def find_record(h2):
    for parent in h2.parents:
        if parent.name not in {"div", "article", "li"}:
            continue
        text = parent.get_text(" ", strip=True)
        if "당선인" not in text:
            continue
        if not any(t in text for t in ELECTION_TYPES):
            continue
        if len(parent.find_all("h2")) == 1:
            return parent
    return h2.parent


def split_region_district(full: str):
    full = re.sub(r"\s+", " ", full).strip()
    for prefix in REGION_PREFIXES:
        if full.startswith(prefix):
            region = REGION_ALIASES[prefix]
            rest = full[len(prefix):].strip()
            return region, rest
    return None, full


def split_local(rest: str, vote_kind: str):
    rest = rest.strip()
    if vote_kind in {"metro_pr"}:
        return None, "비례대표"
    if vote_kind in {"local_pr"}:
        return rest or None, "비례대표"
    # Sejong and similar single-tier district labels may have no city/county/ward prefix.
    m = re.match(r"^(.+?(?:시|군|구))((?:제\d+|[가-힣]+)선거구)$", rest)
    if m:
        local, district = m.group(1), m.group(2)
        if vote_kind == "metro":
            return local, f"{local} {district}"
        return local, district
    if vote_kind == "metro":
        return None, rest or "지역구"
    return None, rest or "지역구"


def parse_page(html: str):
    soup = BeautifulSoup(html, "html.parser")
    rows = []
    seen_h2 = set()
    for h2 in soup.find_all("h2"):
        hid = id(h2)
        if hid in seen_h2:
            continue
        seen_h2.add(hid)
        name = normalize_name(h2.get_text(" ", strip=True))
        if not name:
            continue
        rec = find_record(h2)
        if rec is None:
            continue
        text = rec.get_text(" ", strip=True)
        if "당선인" not in text:
            continue
        links = [a.get_text(" ", strip=True) for a in rec.find_all("a")]
        vote_type = next((x for x in links if x in ELECTION_TYPES), None)
        if not vote_type:
            vote_type = next((x for x in ELECTION_TYPES if x in text), None)
        if not vote_type:
            continue
        kind = ELECTION_TYPES[vote_type]
        party = next((x for x in links if x in PARTIES), None)
        if not party:
            party = next((x for x in PARTIES if x in text), "정당 미확인")
        try:
            idx = links.index(vote_type)
            district_full = links[idx - 1] if idx > 0 else ""
        except ValueError:
            district_full = ""
        if not district_full:
            # Fallback: capture the phrase immediately before the election type.
            m = re.search(r"([가-힣·\s]+?(?:선거구|특별시|광역시|특별자치시|특별자치도|도|시|군|구))\s*" + re.escape(vote_type), text)
            district_full = m.group(1).strip() if m else ""
        region, rest = split_region_district(district_full)
        if not region:
            continue
        local, district = split_local(rest, kind)
        rows.append({
            "region": region,
            "kind": kind,
            "local": local,
            "district": district,
            "name": name,
            "party": party,
            "sourceDistrict": district_full,
        })
    return rows


def discover_pages(vote_type: str) -> int:
    params = [("f[0]", "status:당선인"), ("f[1]", f"vote_level:{vote_type}"), ("page", 0)]
    html = fetch(BASE, params=params)
    text = BeautifulSoup(html, "html.parser").get_text(" ", strip=True)
    m = re.search(r"\d+\s*-\s*\d+\s*/\s*(\d+)\s*표시", text)
    total = int(m.group(1)) if m else 0
    if total <= 0:
        # The source occasionally reports an unfiltered pager; cap safely and stop on empty pages later.
        return 180
    return min(180, max(1, math.ceil(total / 50)))


def collect():
    all_rows = []
    for vote_type in ELECTION_TYPES:
        pages = discover_pages(vote_type)
        empty_streak = 0
        print(f"{vote_type}: scanning up to {pages} pages", flush=True)
        for page in range(pages):
            params = [("f[0]", "status:당선인"), ("f[1]", f"vote_level:{vote_type}"), ("page", page)]
            html = fetch(BASE, params=params)
            rows = [r for r in parse_page(html) if r["kind"] == ELECTION_TYPES[vote_type]]
            if rows:
                all_rows.extend(rows)
                empty_streak = 0
            else:
                empty_streak += 1
            # With a correctly filtered source there should be no middle empty pages.
            if empty_streak >= 3 and page > 2:
                break
            time.sleep(0.08)
    unique = OrderedDict()
    for r in all_rows:
        key = (r["region"], r["kind"], r["local"], r["district"], r["name"], r["party"])
        unique[key] = r
    return list(unique.values())


def build(rows):
    result = OrderedDict()
    for region in REGION_ORDER:
        result[region] = {
            "metro": {"council": COUNCIL_NAMES[region], "districts": OrderedDict()},
            "local": OrderedDict(),
        }
    for r in rows:
        region = r["region"]
        if region not in result:
            continue
        person = {"name": r["name"], "party": r["party"]}
        if r["kind"].startswith("metro"):
            districts = result[region]["metro"]["districts"]
            districts.setdefault(r["district"], [])
            if person not in districts[r["district"]]:
                districts[r["district"]].append(person)
        else:
            local = r["local"] or "기초단체 미분류"
            council = f"{local}의회" if local.endswith(("시", "군", "구")) else local
            entry = result[region]["local"].setdefault(local, {"council": council, "districts": OrderedDict()})
            entry["districts"].setdefault(r["district"], [])
            if person not in entry["districts"][r["district"]]:
                entry["districts"][r["district"]].append(person)
    # Drop empty region branches only if no data exists at all; keep normal regions for stable UI.
    metro_count = sum(len(members) for reg in result.values() for members in reg["metro"]["districts"].values())
    local_count = sum(len(members) for reg in result.values() for loc in reg["local"].values() for members in loc["districts"].values())
    return result, metro_count, local_count


def main():
    rows = collect()
    data, metro_count, local_count = build(rows)
    total = metro_count + local_count
    print(f"parsed councillors: metro={metro_count}, local={local_count}, total={total}")
    if total < 3500:
        print("ERROR: parsed councillor count is unexpectedly low; refusing to overwrite data file", file=sys.stderr)
        sys.exit(2)
    payload = {
        "version": "2026-local-election-v1",
        "generatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "source": {
            "name": "시민정치마당 2026 지방선거 당선인 명부",
            "url": "https://cpmadang.org/people/list_of_candidates_2026/winner",
            "primaryReference": "중앙선거관리위원회 제9회 전국동시지방선거 당선인 명부",
        },
        "counts": {"metro": metro_count, "local": local_count, "total": total},
        "regions": data,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    content = "window.COUNCIL_MEMBERS_2026=" + json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + ";\n"
    OUT.write_text(content, encoding="utf-8")
    print(f"wrote {OUT} ({len(content):,} chars)")


if __name__ == "__main__":
    main()
