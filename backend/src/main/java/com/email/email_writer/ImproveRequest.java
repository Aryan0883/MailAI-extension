package com.email.email_writer;

import lombok.Data;

@Data
public class ImproveRequest {
    private String originalReply;
    private String improvementType; // grammar, professional, concise, friendly, clarity
}