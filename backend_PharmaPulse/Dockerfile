FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install -y openjdk-21-jdk openjdk-21-jre maven

COPY . /spring-boot-app

WORKDIR /spring-boot-app

RUN mvn clean install -DskipTests

WORKDIR /spring-boot-app/target

CMD ["java", "-jar", "backend_PharmaPulse-0.0.1-SNAPSHOT.jar"]