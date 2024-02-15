#!/bin/bash

# Usage: ./bump_version.sh <major|minor|patch|new_version>
# Example: ./bump_version.sh minor

# Check if argument is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <major|minor|patch|new_version>"
  exit 1
fi

# Validate the provided argument
if [ "$1" != "major" ] && [ "$1" != "minor" ] && [ "$1" != "patch" ]; then
  # Bump to a specific version
  new_version="$1"
  # Bump the version without creating a Git tag and update package.json
  npm version $new_version --no-git-tag-version
else
  # Bump to a major, minor, or patch version without creating a Git tag
  # This will automatically increment the corresponding version number
  npm version $1 --no-git-tag-version
fi

# Commit the updated package.json
# git add package.json
# git commit -m "Bump version to $(npm -v)"
# git push origin development