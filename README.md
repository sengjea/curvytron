Curvytron
=========

A web multiplayer Tron game like with curves

## Building for Development

From a fresh clone

    nvm install 10.13.0
    nvm use
    npm install
    ./node_modules/.bin/gulp

Run the game with:

    node bin/curvytron.js

## Installation

* [Get your local Curvytron server in 1 minute!](doc/installation.md)

---

## Wanna help?

* [See how you can make the game better](doc/contribution.md)
* [Setup you development environment](doc/dev.md)

---

## We need to go deeper

* [Configuration reference](doc/configuration.md)
* [Setup Nginx proxy](doc/nginx-proxy.md)

## Deploying

Create all the necessary infrastructure in terraform by doing:

```bash
cd terraform
    terraform init \
        -backend-config="bucket=<tf backend bucket>" \ 
        -backend-config="dynamodb_table=<tf dynamodb table>"
    terraform apply [-var acm_certificate_arn="<acm arn>"]
cd -
```
Note that the variable acm_certificate_arn is optional.


Whenever you want to deploy a new version:
```bash

aws ecr get-login-password --region eu-west-2 | docker login --username AWS --password-stdin <ecr repo>

docker build . -t <ecr repo>
docker push <ecr repo>

cd terraform
    terraform taint aws_ecs_task_definition.curvytron
    terraform apply [-var acm_certificate_arn="<acm arn>"]
cd -
```