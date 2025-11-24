package com.email.email_writer;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class EmailGeneratorController {

    private final EmailGeneratorService emailGeneratorService;

    //Generate Email
    @PostMapping("/generate")
    public ResponseEntity<String> generateEmail(@RequestBody EmailRequest emailRequest) {
        String response = emailGeneratorService.generateEmailReply(emailRequest);
        return ResponseEntity.ok(response);
    }

    //Improve Email Reply
    @PostMapping("/improve")
    public ResponseEntity<String> improveEmail(@RequestBody ImproveRequest improveRequest) {
        String improvedResponse = emailGeneratorService.improveEmailReply(improveRequest);
        return ResponseEntity.ok(improvedResponse);
    }
}
