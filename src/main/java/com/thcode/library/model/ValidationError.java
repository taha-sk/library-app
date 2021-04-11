package com.thcode.library.model;

/**
 * 
 * This is the ValidationError Model for Validation of Captcha Input
 * It's used to match with the output of Spring validation errors
 * 
 * @author taha-sk
 *
 */
public class ValidationError {
	
	private String entity;
	
	private String property;
	
	private String message;
	
	protected ValidationError() {}
	
	public ValidationError(String entity, String property, String message) {
		this.entity = entity;
		this.property = property;
		this.message = message;
	}

	public String getEntity() {
		return entity;
	}

	public void setEntity(String entity) {
		this.entity = entity;
	}

	public String getProperty() {
		return property;
	}

	public void setProperty(String property) {
		this.property = property;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

}
