---
mode: "agent"
---

# Instructions

Set up a new project with the following listed requirements.

If there is a starter template that helps accomplish this, use it. If not, create a new project from scratch.

If you encounter language version mismatches you may use asdf to specify and install language versions.

Once everything is installed, run type checking, linting and formatting to ensure everything works.

Make sure that everything that needs to be gitignored is included in the .gitignore file.

Finally prepare a commit with the message "chore: setup project" and allow me to review it before commtting.

# Requirements

- **Version control**: git (with appropriate .gitignore)

- **Language manager**: asdf

- **Language**: Typescript

- **Framework**: React

- **Bundler**: Vite

- **Package manager**: yarn

- **Code quality**

  - **Formatter**: prettier (prefer double quotes)

  - **Linter**: eslint with typescript support (only for code quality, no formatting. Leave that to prettier)

  - **Git hooks**: husky with lint-staged

  - **Git commit messages**: commitlint with conventional commits
