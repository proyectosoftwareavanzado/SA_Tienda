FROM node

WORKDIR /opt/tienda
ADD . /opt/tienda
RUN npm install --quiet
RUN npm install nodemon -g --quiet


EXPOSE 8084

CMD npm start