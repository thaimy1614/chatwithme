package com.chatroomserver.chatroonbackend.dto.momo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MomoCreationResponse {
    private String resultCode;
    private String payUrl;
    private String deepLink;
    private String qrCodeUrl;
}
