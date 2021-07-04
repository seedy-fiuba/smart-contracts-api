FROM node:14-alpine

WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
#RUN npm install --loglevel verbose

# Bundle app source
#COPY . /usr/src/app

# Bare in mind, expose is not supported by heroku. This is only for local testing.
#EXPOSE $PORT
#CMD ["npm", "start"]
