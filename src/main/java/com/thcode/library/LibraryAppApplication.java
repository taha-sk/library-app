package com.thcode.library;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.client.RestTemplate;

import com.thcode.library.model.Book;
import com.thcode.library.repository.BookRepository;


/**
 * 
 * Application Main Class
 * 
 * 
 * @author taha-sk
 *
 */
@SpringBootApplication
public class LibraryAppApplication implements CommandLineRunner {
	
	@Autowired
	private BookRepository repository;

	public static void main(String[] args) {
		SpringApplication.run(LibraryAppApplication.class, args);
	}
	
	@Override
	public void run(String... arg0) throws Exception {
		
		RestTemplate restTemplate = new RestTemplate();
		String ipAddress = restTemplate.getForObject("https://api.ipify.org", String.class);
		System.out.println("IP Address of the instance: " + ipAddress);
		
		//clean up previous records
		repository.deleteAll();

		// adding some books
		repository.save(new Book("End of Watch", "Stephen King"));
		repository.save(new Book("The Shining", "Stephen King"));
		repository.save(new Book("A Dance with Dragons", "George R. R. Martin"));
		repository.save(new Book("The Lord of the Rings", "J. R. R. Tolkien"));
		repository.save(new Book("Outliers", "Malcolm Gladwell"));
		
		repository.save(new Book("Oliver Twist", "Charles Dickens"));
		repository.save(new Book("Crime and Punishment", "Fyodor Dostoyevski"));
		repository.save(new Book("1984", "George Orwell"));
		repository.save(new Book("Notre Dame de Paris", "Victor Hugo"));
		repository.save(new Book("Pet Sematary", "Stephen King"));
		
	}

}
