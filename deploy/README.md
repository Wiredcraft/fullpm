## Build & Deployment Documentation

- Enable SSH Agent and access to server

```
eval `ssh-agent -s`
ssh-add
ssh -A root@192.168.1.45
```

- Copy SSL keys to correct location

* Copy key and certificate to remote machine
`scp keys root@192.168.1.45:~/`

* Make sure `/etc/nginx/ssl` exists
`mkdir /etc/nginx/ssl`

* Copy kye and certificate to correct location in remote server
`cp keys /etc/nginx/ssl/`

- Checkout latest master branch

```
git checkout master
git pull
```

- Install roles dependencies

```
ansible-galaxy install -r requirements.yml -p roles
```

- Build the machine

```
ansible-playbook -i inventory.xxx main.yml
```

* if it is `dev`, then use `inventory.dev`
* if it is `staging`, then use `inventory.staging`

- Deploy code

This step is part of the build process. If you only want to redeploy code, then use this command.

```
ansible-playbook -i inventory.xxx deploy-fullpm.yml --ask-vault-pass
```

For staging & production, it will deploy master by default. If you want to deploy a specific version, run this command:

```
ansible-playbook -i inventory.xxx -e version_fullpm=master deploy-fullpm.yml --ask-vault-pass
```

## Server Specification

- Dev Server
  * hostname: dev-fullpm.wiredcraft.net
  * user: root
  * physical location: dev box in office
- Staging Server
  * hostname: staging-fullpm.wiredcraft.net
  * user: root
  * physical location: singapore
- Production Server (it is the same machine with staging)
  * hostname: app.fullpm.com
  * user: root
  * physical location: singapore
