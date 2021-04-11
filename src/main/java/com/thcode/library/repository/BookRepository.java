package com.thcode.library.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.thcode.library.model.Book;

/**
 * 
 * This is the Book model data access interface
 * 
 * 
 * @author taha-sk
 *
 */
public interface BookRepository extends MongoRepository<Book, String> {

}
