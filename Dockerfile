FROM node:12-slim
WORKDIR /curvytron

COPY package.json config.json /curvytron/
RUN npm install --production
ADD bin /curvytron/bin/
ADD web /curvytron/web/
EXPOSE 8080

CMD node bin/curvytron.js