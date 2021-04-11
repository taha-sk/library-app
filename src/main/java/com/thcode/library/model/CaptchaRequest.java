package com.thcode.library.model;

/**
 * 
 * This is the Captcha Request Model for reCaptcha api
 * 
 * @author taha-sk
 *
 */
public class CaptchaRequest {
	
	private String response;
	
	private String remoteip;
	
	protected CaptchaRequest() {}
	
	public CaptchaRequest(String response, String remoteip) {
		this.response = response;
		this.remoteip = remoteip;
	}

	public String getResponse() {
		return response;
	}

	public void setResponse(String response) {
		this.response = response;
	}

	public String getRemoteip() {
		return remoteip;
	}

	public void setRemoteip(String remoteip) {
		this.remoteip = remoteip;
	}

}
