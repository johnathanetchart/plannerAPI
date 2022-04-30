FROM node:14.16.1

RUN mkdir plannerAPI
COPY . /plannerAPI/ 

WORKDIR /plannerAPI/
RUN npm install

CMD ["npm", "start"]
