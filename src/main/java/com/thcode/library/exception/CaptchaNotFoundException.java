package com.thcode.library.exception;

import com.thcode.library.model.ValidationError;

/**
 * 
 * This is the CaptchaNotFoundException, used for Validation of Captcha Input
 * 
 * 
 * @author taha-sk
 *
 */
public class CaptchaNotFoundException extends Exception {
	
	private static final long serialVersionUID = 8569805804174079963L;
	
	private final ValidationError error;
	
	public CaptchaNotFoundException(ValidationError error) {
		this.error = error;
	}

	public ValidationError getError() {
		return error;
	}
	
}
