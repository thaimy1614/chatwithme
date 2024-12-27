package com.chatroomserver.chatroonbackend.httpclient;

import com.chatroomserver.chatroonbackend.dto.momo.MomoCreationRequest;
import com.chatroomserver.chatroonbackend.dto.momo.MomoCreationResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "momo-client", url = "${momo.base-url}")
public interface MomoClient {
    @PostMapping(value = "/v2/gateway/api/create")
    MomoCreationResponse createUrl(@RequestBody MomoCreationRequest request);
}