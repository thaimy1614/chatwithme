package com.chatroomserver.chatroonbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class ChatroonBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChatroonBackendApplication.class, args);
	}

}
