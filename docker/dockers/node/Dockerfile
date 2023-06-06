FROM node:18.13
WORKDIR /opt
RUN apt-get update
RUN apt-get install git mc apt-utils psmisc -y
RUN /usr/bin/git clone https://github.com/victorqedu/IQTest.git
COPY ./certs /opt/IQTest/certs
WORKDIR /opt/IQTest/nodejs

#RUN npm install
#CMD ["npm", "start"]

RUN npm install
RUN npm install -g serve
RUN npm run build
CMD ["npm", "install", "-g", "serve"]
CMD ["serve", "-s", "build", "-l", "443", "--ssl-cert", "../certs/romarg/iqtest_caido_ro.crt", "--ssl-key", "../certs/romarg/iqtest.caido.ro.nopass.key"]
