FROM node:12.18.2

WORKDIR /usr/src/chat-app
COPY package*.json ./  
RUN npm install 
COPY . .
# WORKDIR /usr/src/chat-app/frontend
# RUN npm install
# RUN npm run build
# WORKDIR /usr/src/chat-app
RUN npm run build
CMD [ "npm", "start" ]