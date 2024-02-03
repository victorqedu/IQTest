Inainte de actualizare trebuie sa fac proiectul in github public pt ca altfel imaginile docker nu-l vor putea descarca pt ca nu am pus user si pass
Ca sa actualizez productia dupa ce am modificat codul sursa trebuie sa refac imaginile docker
Opresc serviciile:
docker ps
docker-compose -f docker-compose.yml down

Recreez imaginile care stiu ca trebuie actualizate
Listez imaginile existent, acum vreau sa actualizez nodeJS-ul, am sa sterg iqtest_nodejs versiunea 2.0 si am sa fac o versiune noua 2.1
root@docker:~# docker images
REPOSITORY        TAG            IMAGE ID       CREATED         SIZE
iqtest_nodejs     2.0            c86078d6ec0e   2 weeks ago     1.74GB
iqtest_spring     2.0            3797432e0d88   2 weeks ago     1.5GB
iqtest_postgres   2.0            3698422c1a6e   2 weeks ago     846MB
postgres          15.3           0c88fbae765e   8 months ago    379MB
node              18.16          78b037dbb659   8 months ago    996MB
ubuntu            latest         1f6ddc1b2547   8 months ago    77.8MB
caidospring       1.0            3b958c495270   12 months ago   559MB
caidoweb          1.0            f8d38a592362   12 months ago   1.58GB
node              18.13          b68a472583ef   12 months ago   995MB
postgres          15.1           a26eb6069868   13 months ago   379MB
postgres          latest         a26eb6069868   13 months ago   379MB
openjdk           18.0.2.1-jdk   be9017b1d8c5   13 months ago   467MB
openjdk           19             2e6f6690e479   16 months ago   479MB
postgres          9.6            027ccf656dc1   23 months ago   200MB

Sterg imaginea
root@docker:/opt/docker# docker rmi c86078d6ec0e
Untagged: iqtest_nodejs:2.0
Deleted: sha256:c86078d6ec0e0516daeecef0345096f1748382bef0a8c801cf8e53fab8ef69ef

Construiesc noua imagine(trebuie s afiu deca in directorul in care se gaseste Dockerfile-ul aferent imaginii):
root@docker:/opt/docker/dockers/node# docker build --no-cache -t iqtest_nodejs:2.4 .
In acest pas se descarca si codul sursa de pe github. Pun --no-cache pt ca ocazional nu mia descarca codul actualizat si zice ca-l ia din cache

actualizez docker-compose.yaml cu noua vesriune si dau start
docker-compose -f docker-compose.yml up -d

Ca sa vad ca ruleaza
root@docker:/opt/docker# docker ps

Ca sa ma conectez la un container:
root@docker:/opt/docker# docker exec -it d2272e3e68f9 /bin/bash
