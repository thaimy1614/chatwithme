package com.chatroomserver.chatroonbackend.dto.momo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MomoCreationRequest {
    private String partnerCode;
    private String requestType;
    private String ipnUrl;
    private String redirectUrl;
    private String orderId;
    private String amount;
    private String orderInfo;
    private String requestId;
    private String extraData;
    private String signature;
    private String lang;
}
