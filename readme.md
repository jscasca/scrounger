# Scrounger

The scrounger takes resources from other sources and repurposes that information into json objects

## Preparing the environment

These instructions will install nodejs and nginx in a compute engine vm to mount the project.

### Install Node

First install node.

#### Install Distro-stable

Use the apt package manager

```
$ sudo apt-get update
$ sudo apt-get install nodejs
```

Additionally install npm

```
$ sudo apt-get install npm
```

And check the installed version

```
$ nodejs -v
```

#### Install using NVM


Start by installing the packages needed to build the source packges


```
$ sudo apt-get update
$ sudo apt-get install build-essential libssl-dev

```

Pull down the nvm installation script


```
$ curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh -o install_nvm.sh

```

Run the script

```
$ bash install_nvm.sh
$ source ~/.profile
```

Find out the available versions

```
$ nvm ls-remote
```

Select the desired version

```
$ nvm install x.x.x
$ nvm use x.x.x
```

When you install Node.js using nvm, the executable is called `Node`. Verify the installed version. 

```
node -v
```

### Install Nginx

Install from distro

```
$ sudo apt-get install nginx
```

Configure the site (Using default for this project).

```
$ sudo vim /etc/nginx/sites-available/default
```

The following config will setup a base proxy and a secure proxy

```
server {
    listen 80;
    listen 443 ssl;

    #SSL Certs
    ssl_certificate /etc/nginx/ssl/domain/bundle.crt;
    ssl_certificate_key /etc/nginx/ssl/domain/server.key;

    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;

    location / {
        proxy_pass http:127.0.0.1:3000;
    }
}
```

Create a link for sites-enabled

```
$ cd /etc/nginx/sites-enabled
$ sudo ln -s default /etc/nginx/sites-available/default
```

Verify that the Nginx configuration file is correct and restart the service

```
$ nginx -t
$ sudo /etc/init.d/nginx/restart
```

### Install additional tools

Git to clone the project and forever to run the node environment

```
$ sudo apt-get install git
$ npm install -g forever
```

Use forever to start you environment as well as to list running processes and terminate them. E.G.
```
$ forever start <path to your node project>
$ forver list
$ forever stop <id>
```

## License

Pending license