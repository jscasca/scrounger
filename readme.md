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
cd /etc/nginx/sites-enabled
sudo ln -s default /etc/nginx/sites-available/default
```

Verify that the Nginx configuration file is correct and restart the service

```
$ nginx -t
```


### Prerequisites

What things you need to install the software and how to install them

```
Give examples
```

### Installing

A step by step series of examples that tell you have to get a development env running

Say what the step will be

```
Give the example
```

And repeat

```
until finished
```

End with an example of getting some data out of the system or using it for a little demo

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Billie Thompson** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone who's code was used
* Inspiration
* etc
