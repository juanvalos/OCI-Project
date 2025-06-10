package com.springboot.MyTodoList.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.*;
import org.apache.commons.codec.binary.Hex;
import org.springframework.stereotype.Service;

@Service
public class BackupCodeService {

    /** Generate raw (plaintext) codes. */
    public List<String> generateRawCodes(int count) {
        SecureRandom rnd = new SecureRandom();
        List<String> codes = new ArrayList<>(count);
        for (int i = 0; i < count; i++) {
            byte[] bytes = new byte[6];
            rnd.nextBytes(bytes);
            // hex-encode: 12 chars
            codes.add(Hex.encodeHexString(bytes).toUpperCase());
        }
        return codes;
    }

    /** SHA-256 hash of a code, hex-encoded. */
    public String hashCode(String raw) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(raw.getBytes(StandardCharsets.UTF_8));
            return Hex.encodeHexString(digest);
        } catch (Exception e) {
            throw new RuntimeException("Hashing error", e);
        }
    }
}
