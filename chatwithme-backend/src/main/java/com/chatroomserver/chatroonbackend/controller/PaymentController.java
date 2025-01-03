package com.chatroomserver.chatroonbackend.controller;

import com.chatroomserver.chatroonbackend.config.MomoConfig;
import com.chatroomserver.chatroonbackend.dto.ApiResponse;
import com.chatroomserver.chatroonbackend.dto.momo.MomoCreationRequest;
import com.chatroomserver.chatroonbackend.dto.momo.MomoCreationResponse;
import com.chatroomserver.chatroonbackend.httpclient.MomoClient;
import com.chatroomserver.chatroonbackend.util.MomoUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("${application.api.prefix}/payment")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {
    private final MomoConfig momoConfig;
    private final MomoClient momoClient;

    @GetMapping("/get-url")
    public ApiResponse<MomoCreationResponse> getUrl() throws UnsupportedEncodingException, NoSuchAlgorithmException, InvalidKeyException {
        String orderId = UUID.randomUUID().toString();
        Long amount = 100000L;
        String orderInfo = "Your order id is " + orderId + ", total price is " + amount;
        Map<String, String> momoParamsMap = momoConfig.getMomoConfig();
        momoParamsMap.put("orderId", orderId);
        momoParamsMap.put("amount", String.valueOf(amount));
        String requestId = UUID.randomUUID().toString();
        momoParamsMap.put("requestId", requestId);
        momoParamsMap.put("orderInfo", orderInfo);
        String hashData = MomoUtil.getPaymentURL(momoParamsMap, false);
        log.info(hashData);
        String momoSecureHash = MomoUtil.encode(momoConfig.getSecretKey(), hashData);
        MomoCreationRequest request = MomoCreationRequest.builder()
                .lang("vi")
                .amount(String.valueOf(amount))
                .requestId(requestId)
                .extraData("e")
                .ipnUrl(momoConfig.getIpnUrl())
                .orderId(orderId)
                .orderInfo(orderInfo)
                .partnerCode(momoConfig.getPartnerCode())
                .redirectUrl(momoConfig.getRedirectUrl())
                .requestType(momoConfig.getRequestType())
                .signature(momoSecureHash)
                .build();
        log.info(request.toString());
        return ApiResponse.<MomoCreationResponse>builder()
                .result(momoClient.createUrl(request))
                .build();

    }

    @PostMapping("/notify")
    @ResponseStatus(HttpStatus.NO_CONTENT) // Trả về HTTP 204
    public void handleNotification(@RequestBody Map<String, Object> notifyData) {
        System.out.println("Payment successful");
        try {
//            // Lấy thông tin từ notifyData
//            String partnerCode = (String) notifyData.get("partnerCode");
            String orderId = (String) notifyData.get("orderId");
//            String requestId = (String) notifyData.get("requestId");
//            String amount = (String) notifyData.get("amount");
            String resultCode = String.valueOf(notifyData.get("resultCode"));
            String message = (String) notifyData.get("message");
//            String signature = (String) notifyData.get("signature");
//
//            // Xác minh chữ ký
//            String rawData = String.format(
//                    "amount=%s&message=%s&orderId=%s&partnerCode=%s&requestId=%s&resultCode=%s",
//                    amount, message, orderId, partnerCode, requestId, resultCode
//            );
//            String secretKey = "YOUR_SECRET_KEY"; // Lấy từ cấu hình
//            String calculatedSignature = HmacSHA256(rawData, secretKey);

//            if (!calculatedSignature.equals(signature)) {
//                // Nếu chữ ký không hợp lệ
//                throw new IllegalArgumentException("Invalid signature");
//            }

            // Xử lý logic giao dịch
            if ("0".equals(resultCode)) {
                // Giao dịch thành công
                System.out.println("Payment successful for orderId: " + orderId);
            } else {
                // Giao dịch thất bại
                System.out.println("Payment failed for orderId: " + orderId + " with message: " + message);
            }

        } catch (Exception e) {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error processing notification");
        }
    }
}
