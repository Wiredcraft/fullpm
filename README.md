# FullPM

**If you only care about starting to use FullPM (rather than self-hosting it), you should just install the Google Chrome extension: https://github.com/Wiredcraft/fullpm-chrome**.

FullPM extends GitHub with project management tools, starting with kanban boards for your issues.

It is divided between:

- A Node.js API (`api/`), which authenticates users against GitHub's API and expose it to FullPM users.
- A React front-end (`client/`) which mostly displays the kanban board.
- A Google Chrome extension (in the [Wiredcraft/fullpm-chrome](https://github.com/Wiredcraft/fullpm-chrome) repo) which injects the board in a "Board" tab on GitHub.

The `deploy/` folder contains our Ansible scripts for deployment.
