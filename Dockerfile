FROM node:14-alpine
# ToDo ver si cambiando la imagen de node a una de ubuntu e instalando el build essentials funciona

WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --loglevel verbose

# Bundle app source
COPY . /usr/src/app

# Bare in mind, expose is not supported by heroku. This is only for local testing.
EXPOSE $PORT
CMD ["npm", "start"]
