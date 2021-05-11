FROM node:latest

# Create the directory
RUN mkdir -p /usr/src/comfybot
WORKDIR /usr/src/comfybot

# Copy and Install
COPY package.json /usr/src/comfybot
RUN npm install
COPY . /usr/src/comfybot

# Start
CMD ["node", "index.js"]