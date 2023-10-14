package com.thcode.library;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.thcode.library.model.CaptchaRequest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

/**
 * 
 * This is the test for CaptchaController
 * 
 * First case checking response input validation Second case checking output for
 * valid input
 * 
 * @author taha-sk
 *
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = "spring.mongodb.embedded.version=6.0.1")
public class CaptchaControllerTests {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void validateCaptchaWithoutInputShouldReturnResponseIsNotFound() throws Exception {
		this.mockMvc
				.perform(post("/api/validateCaptcha").contentType(MediaType.APPLICATION_JSON)
						.content(new ObjectMapper().writeValueAsString(new CaptchaRequest(null, "127.0.0.1"))))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.errors[0].message").value("Captcha response is not found."));
	}

	@Test
	void validateCaptchaWithInvalidInputShouldReturnSuccessFalse() throws Exception {

		//IP is not mandatory
		String response = "InvalidInput";

		this.mockMvc
				.perform(post("/api/validateCaptcha").contentType(MediaType.APPLICATION_JSON)
						.content(new ObjectMapper().writeValueAsString(new CaptchaRequest(response, null))))
				.andExpect(status().isOk()).andExpect(jsonPath("$.success").value("false"));
	}

}
