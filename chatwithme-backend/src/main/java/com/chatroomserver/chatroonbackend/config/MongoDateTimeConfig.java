package com.chatroomserver.chatroonbackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.Date;

@Configuration
public class MongoDateTimeConfig {

    @Bean
    public MongoCustomConversions customConversions() {
        return new MongoCustomConversions(Arrays.asList(
                new org.springframework.core.convert.converter.Converter<Date, LocalDateTime>() {
                    @Override
                    public LocalDateTime convert(Date source) {
                        return source.toInstant().atZone(ZoneOffset.of("+07:00")).toLocalDateTime();
                    }
                },
                new org.springframework.core.convert.converter.Converter<LocalDateTime, Date>() {
                    @Override
                    public Date convert(LocalDateTime source) {
                        return Date.from(source.atZone(ZoneOffset.of("+07:00")).toInstant());
                    }
                }
        ));
    }
}
