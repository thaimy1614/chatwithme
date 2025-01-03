package com.chatroomserver.chatroonbackend.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Getter
@Configuration
public class MomoConfig {
    @Value("${momo.secret-key}")
    private String secretKey;
    @Value("${momo.id-momo}")
    private String partnerCode;
    @Value("${momo.redirect-url}")
    private String redirectUrl;
    @Value("${momo.ipn-url}")
    private String ipnUrl;
    @Value("${momo.request-type}")
    private String requestType;
    @Value("${momo.access-key}")
    private String accessKey;

    public Map<String, String> getMomoConfig() {
        Map<String, String> momoParamsMap = new HashMap<>();
        momoParamsMap.put("partnerCode", this.partnerCode);
        momoParamsMap.put("redirectUrl", this.redirectUrl);
        momoParamsMap.put("ipnUrl", this.ipnUrl);
        momoParamsMap.put("requestType", this.requestType);
        momoParamsMap.put("accessKey", this.accessKey);
        momoParamsMap.put("extraData", "e");
        return momoParamsMap;
    }


}
