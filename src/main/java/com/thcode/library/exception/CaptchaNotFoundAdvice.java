package com.thcode.library.exception;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.thcode.library.model.ValidationError;

/**
 * 
 * This is the CaptchaNotFound ControllerAdvice for Handling CaptchaNotFoundException
 * 
 * 
 * @author taha-sk
 *
 */
@ControllerAdvice
public class CaptchaNotFoundAdvice {

	@ResponseBody
	@ExceptionHandler(CaptchaNotFoundException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	protected Map<String, Object> captchaNotFoundHandler(CaptchaNotFoundException ex) {
		Map<String, Object> body = new LinkedHashMap<>();		
		body.put("errors", new ValidationError[] { ex.getError() });
		return body;
	}
	
}
