FROM ubuntu:latest
WORKDIR /opt
RUN apt-get update
RUN apt-get install git mc apt-utils maven openjdk-19-jdk psmisc -y
RUN /usr/bin/git clone https://github.com/victorqedu/IQTest.git
RUN sed -i 's/192.168.88.103/192.168.88.112/g' /opt/IQTest/src/main/resources/application.properties
COPY ./certs /opt/IQTest/certs
WORKDIR /opt/IQTest/
#CMD ["mvn", "compile"]
CMD ["mvn", "spring-boot:run"]
