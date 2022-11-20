package com.ssafy.connection;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

import javax.annotation.PostConstruct;
import java.util.TimeZone;

@EnableAsync
@EnableJpaAuditing
@SpringBootApplication
@PropertySource(value = { "classpath:database/database.properties" })
@PropertySource(value = { "classpath:oauth2/oauth2.properties" })
@PropertySource(value = { "classpath:swagger/springdoc.properties" })
public class ConnectionApplication {
	@PostConstruct
	public void before() {
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"));
	}

	public static void main(String[] args) {
		SpringApplication.run(ConnectionApplication.class, args);
	}

}
