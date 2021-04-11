package com.thcode.library.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.event.ValidatingRepositoryEventListener;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;

import com.thcode.library.validator.BookValidator;

/**
 * 
 * This is the AppRepoRestConfigurer for registering Validators manually
 * 
 * @author taha-sk
 *
 */
@Configuration
public class AppRepoRestConfigurer implements RepositoryRestConfigurer {
	
    @Override
    public void configureValidatingRepositoryEventListener(ValidatingRepositoryEventListener v) {
        v.addValidator("beforeCreate", new BookValidator());
        v.addValidator("beforeSave", new BookValidator());
    }

}
