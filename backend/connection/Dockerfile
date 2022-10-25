FROM maven:3.8.6-jdk-11
VOLUME /tmp
ADD target/connection-0.0.1-SNAPSHOT.jar app.jar
ENV TZ=Asia/Seoul
EXPOSE 8080
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]
