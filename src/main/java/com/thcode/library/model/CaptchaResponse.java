package com.thcode.library.model;

import java.time.OffsetDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * 
 * This is the Captcha Response Model for reCaptcha api
 * 
 * @author taha-sk
 *
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class CaptchaResponse {
	
	private boolean success;
	private OffsetDateTime challenge_ts;
	private String hostname;
	
	@JsonProperty("error-codes")
	private String[] error_codes;
	
	protected CaptchaResponse() {}

	public boolean isSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

	public OffsetDateTime getChallenge_ts() {
		return challenge_ts;
	}

	public void setChallenge_ts(OffsetDateTime challenge_ts) {
		this.challenge_ts = challenge_ts;
	}

	public String getHostname() {
		return hostname;
	}

	public void setHostname(String hostname) {
		this.hostname = hostname;
	}
	
	public String[] getError_codes() {
		return error_codes;
	}
	
	public void setError_codes(String[] error_codes) {
		this.error_codes = error_codes;
	}
	
}
