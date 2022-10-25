FROM openjdk:11-jdk
VOLUME /tmp
ADD target/miraclebird-0.0.1-SNAPSHOT.jar app.jar
ENV TZ=Asia/Seoul
EXPOSE 8080
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]
