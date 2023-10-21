FROM node:14

WORKDIR /usr/src/app

COPY . .

RUN npm install --force
RUN npm install -g expo-cli 

EXPOSE 3000-19000

CMD [ "npm", "run", "web" ]
