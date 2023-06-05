FROM postgres:15.3
WORKDIR /opt
RUN /usr/bin/apt-get update
RUN /usr/bin/apt-get install git mc apt-utils psmisc -y
RUN /usr/bin/git clone https://github.com/victorqedu/IQTest.git
RUN cp /opt/IQTest/db/*.sql /docker-entrypoint-initdb.d/
RUN chmod a+r /docker-entrypoint-initdb.d/*
#RUN sed -i 's/192.168.88.103/localhost/g' IQTest/src/main/resources/application.properties
#RUN if [ `su postgres -c "psql -U postgres -d iqtest -c \"select count(*) from pg_tables where tablename  = 'questions';\" | sed -n 3p | sed \"s/ //g\""` = "0" ] ; then rm -r IQTest; `git clone https://github.com/victorqedu/IQTest.git`; `pg_restore -C -d iqtest IQTest/db/iqtest.sql` ; fi
