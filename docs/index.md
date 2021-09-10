---
title: Setup Subdomain For ghostletters.xyz
editLink: true
---


# Add Subdomain

Notes after adding `docs.` subdomain to ghostletters.xyz.

## Update DNS Entry

- log in to [namecheap.com](https://www.namecheap.com)
- in domain list press __Manage__ -> select tab __Advanced DNS__
- press __Add New Record__
  - Type `A Record`
  - Host `<subdomain>`, like `docs`
  - IP `<Server IP>`, like `173.212.244.12`


## Create Github Repository

So far my content is always backed by a git repository. Pushing to the repo should update my site.

- create new repository at [github.com/ghostletters](https://github.com/ghostletters)
  - add README.md, LICENSE and .gitignore file
- add webbhook via __Settings__ -> __Webhooks__
- press __Add webhook__
  - Payload URL `https://ghostletters.xyz/<long string>`
  - Content type `application/json` (not sure if it matters here)
- locally `git clone <repo ssh link>`
- modify `.git/config` as described in this [blog post](https://blog.ghostletters.xyz/notes/2020/3/22/1800/) so git uses the correct SSH key

## Configure Server

::: info
Replace `<subdomain>` in following snippets.
:::

Log into server `ssh <username>@ghostletters.xyz`


Clone the github repo:
```bash
cd ~/github
git clone <repo https link>
```

Create a script that runs the refresh logic of the webhook / git push. `touch ~/refresh_<subdomain>.sh`. Content:

```bash
#!/bin/sh
set -xe

touch ~/<subdomain>_refresh_calling.txt
cd ~/github/<subdomain>
git pull
npm run docs:build # specific vitepress build cmd
touch ~/<subdomain>_refresh_success.txt
```

Create a soft link to the build result. Example:

```bash
ln -s ~/github/docs/docs/.vitepress/dist/ ~/docs
```

Test the script manually.

## Configure Caddy Webserver

Log into server `ssh <username>@ghostletters.xyz`

Configure file_server to location of files.
- `sudo nano /etc/caddy/Caddyfile`

```js
<subdomain>.ghostletters.xyz {
  root * /home/caddy/<subdomain>
  try_files {path}.html {path} {path}index.html {path}/index.html index.html
  encode gzip
  file_server
  log { }
}
```

- add path for webhook (see also [this blog post](https://blog.ghostletters.xyz/notes/2020/4/4/))

```js
ghostletters.xyz {
  route {
    # update subdomain
    exec /<long string> sh /home/caddy/refresh_<subdomain>.sh
}

```
- `sudo systemctl reload caddy`

Test the webhook URL manually and with a git push. Done.
