package com.springboot.MyTodoList.service;

import java.security.SecureRandom;

import org.apache.commons.codec.binary.Base32;
import org.apache.commons.codec.binary.Hex;
import org.springframework.stereotype.Service;

import de.taimos.totp.TOTP;

@Service
public class TwoFactorService {

    public String generateSecret() {
        SecureRandom random = new SecureRandom();
        byte[] buffer = new byte[20];
        random.nextBytes(buffer);
        return new Base32().encodeToString(buffer);
    }

    public boolean verifyCode(String secret, String code) {
        Base32 base32 = new Base32();
        byte[] bytes = base32.decode(secret);
        String hexKey = Hex.encodeHexString(bytes);
        String expectedCode = TOTP.getOTP(hexKey);
        return expectedCode.equals(code);
    }

    public String getOtpAuthURL(String userEmail, String secret) {
        return "otpauth://totp/MyApp:" + userEmail + "?secret=" + secret + "&issuer=MyApp";
    }
}
