package com.thcode.library.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.thcode.library.exception.CaptchaNotFoundException;
import com.thcode.library.model.CaptchaRequest;
import com.thcode.library.model.CaptchaResponse;
import com.thcode.library.model.ValidationError;

/**
 * 
 * This is the Captcha Controller for validating reCaptcha with Google
 * 
 * @author taha-sk
 *
 */
@RestController
public class CaptchaController {
	
	@Value("${google.recaptcha.secret}")
    private String secret;
	
    @Autowired
    private MessageSource messageSource;
	
	@PostMapping("/api/validateCaptcha")
	public ResponseEntity<CaptchaResponse> validateCaptcha(@RequestBody CaptchaRequest captchaRequest) throws CaptchaNotFoundException {
		
		RestTemplate restTemplate = new RestTemplate();
		
		if(captchaRequest.getResponse() == null || captchaRequest.getResponse().trim().isBlank()) {
			throw new CaptchaNotFoundException(new ValidationError("CaptchaRequest", "response",  messageSource.getMessage("notfound.CaptchaRequest.response", null, null)));
		}
		
		MultiValueMap<String, String> map = new LinkedMultiValueMap<String, String>();
		map.add("secret", secret);
		map.add("response", captchaRequest.getResponse());
		map.add("remoteip", captchaRequest.getRemoteip());
		
		CaptchaResponse result = restTemplate.postForObject("https://www.google.com/recaptcha/api/siteverify", map, CaptchaResponse.class);
		
		return ResponseEntity.ok(result);
		
	}

}
