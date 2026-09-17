#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "Usage: safe-content-commit.sh <commit-message> <owned-path> [owned-path ...]" >&2
  exit 2
fi

message="$1"
shift
owned_paths=("$@")
target_branch="${NEXUS_TARGET_BRANCH:-${GITHUB_REF_NAME:-main}}"

if git diff --quiet -- "${owned_paths[@]}" && git diff --cached --quiet -- "${owned_paths[@]}"; then
  echo "No owned output changes detected."
  exit 0
fi

git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

git add -- "${owned_paths[@]}"
if git diff --cached --quiet; then
  echo "No owned output changes remain after staging."
  exit 0
fi

git commit -m "$message"

for attempt in 1 2 3 4; do
  git fetch origin "$target_branch"

  if ! git rebase "origin/$target_branch"; then
    echo "Owned output conflicts with a newer ${target_branch} update; refusing to overwrite it." >&2
    git rebase --abort || true
    exit 1
  fi

  if git push origin "HEAD:$target_branch"; then
    echo "Published owned output on attempt ${attempt}."
    exit 0
  fi

  echo "${target_branch} moved during publish; retrying safely (${attempt}/4)."
  sleep $((attempt * 2))
done

echo "Unable to publish owned output after 4 attempts; no force-push was attempted." >&2
exit 1
