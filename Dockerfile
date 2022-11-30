FROM node:12.18.4

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
RUN echo 'foo' > /tmp/foo.txt

COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN echo 'bar' >> /tmp/foo.txt

EXPOSE 6677

CMD [ "npm", "start" ]