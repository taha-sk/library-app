package com.thcode.library;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.thcode.library.controller.CaptchaController;

/**
 * 
 * This is the test for contextLoad
 * 
 * @author taha-sk
 *
 */
@SpringBootTest
class LibraryAppApplicationTests {
	
	@Autowired
	private CaptchaController captchaController;

	@Test
	void contextLoads() {
		assertNotNull(captchaController);
	}

}
