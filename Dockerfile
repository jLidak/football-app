# Użycie obrazu Amazon Corretto 17 (zgodnego z Twoim projektem)
FROM amazoncorretto:17
# Ustawienie katalogu roboczego w kontenerze
WORKDIR /app
# Skopiowanie wszystkich plików projektu do obrazu Dockera
COPY . .

RUN yum update -y && yum install -y findutils

# Nadanie uprawnień do uruchomienia skryptu gradlew
RUN chmod +x gradlew

RUN sed -i 's/\r$//' gradlew

# Budowanie aplikacji za pomocą Gradle
RUN ./gradlew bootJar
# Uruchomienie aplikacji Spring Boot
CMD ["java", "-jar", "build/libs/footballapp-0.0.1-SNAPSHOT.jar"]
