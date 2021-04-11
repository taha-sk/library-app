package com.thcode.library;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.thcode.library.model.Book;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.hamcrest.Matchers.greaterThan;

import org.junit.jupiter.api.Test;

/**
 * 
 * These are the tests for Rest Api
 * 
 * 
 * @author taha-sk
 *
 */
@SpringBootTest
@AutoConfigureMockMvc
public class RestApiTests {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private MongoTemplate mongoTemplate;

	@Test
	void getApiShouldReturnRoot() throws Exception {
		this.mockMvc.perform(get("/api")).andExpect(status().isOk())
				// books link
				.andExpect(jsonPath("$._links.books.href").exists())
				.andExpect(jsonPath("$._links.books.templated").value(true))
				// profile link
				.andExpect(jsonPath("$._links.profile.href").exists());
	}

	@Test
	void getBooksShouldReturnResults() throws Exception {
		this.mockMvc.perform(get("/api/books")).andExpect(status().isOk())
				.andExpect(jsonPath("$._embedded.books").isArray()).andExpect(jsonPath("$._embedded.books[0]").exists())
				.andExpect(jsonPath("$.page.number").value(0));
	}

	@Test
	void getBooksWithSizeParamShouldReturnPaginationElements() throws Exception {
		this.mockMvc.perform(get("/api/books").param("size", "5")).andExpect(status().isOk())
				.andExpect(jsonPath("$.page.size").value(5)).andExpect(jsonPath("$._links.first.href").exists())
				.andExpect(jsonPath("$._links.next.href").exists()).andExpect(jsonPath("$._links.last.href").exists());
	}

	@Test
	void getBooksWithSizeAndPageParamsShouldReturnCorrectPage() throws Exception {

		MultiValueMap<String, String> params = new LinkedMultiValueMap<String, String>();
		params.add("size", "5");
		params.add("page", "1");

		this.mockMvc.perform(get("/api/books").params(params)).andExpect(status().isOk())
				.andExpect(jsonPath("$.page.size").value(5)).andExpect(jsonPath("$.page.number").value(1));
	}

	@Test
	void getBooksWithSizePageAndSortParamsShouldReturnCorrectOrder() throws Exception {

		MultiValueMap<String, String> params = new LinkedMultiValueMap<String, String>();
		params.add("size", "10");
		params.add("page", "0");
		params.add("sort", "author,asc");

		this.mockMvc.perform(get("/api/books").params(params)).andExpect(status().isOk())
				// second should be greater than the first - because it's ascending sort order
				.andExpect(jsonPath("$._embedded.books[1].author", greaterThan("$._embedded.books[0].author")))
				.andExpect(jsonPath("$.page.size").value(10)).andExpect(jsonPath("$.page.number").value(0));
	}

	@Test
	void createBookWithInvalidTitleShouldReturnTitleErrorMessage() throws Exception {
		this.mockMvc
				.perform(post("/api/books").contentType(MediaType.APPLICATION_JSON)
						.content(new ObjectMapper().writeValueAsString(new Book(null, "author"))))
				.andExpect(status().isBadRequest()).andExpect(jsonPath("$.errors").isArray())
				.andExpect(jsonPath("$.errors[0].message").value("Book title is required."));
	}

	@Test
	void createBookWithInvalidAuthorShouldReturnAuthorErrorMessage() throws Exception {
		this.mockMvc
				.perform(post("/api/books").contentType(MediaType.APPLICATION_JSON)
						.content(new ObjectMapper().writeValueAsString(new Book("title", null))))
				.andExpect(status().isBadRequest()).andExpect(jsonPath("$.errors").isArray())
				.andExpect(jsonPath("$.errors[0].message").value("Author is required."));
	}

	@Test
	void createValidBookShouldBeSuccessful() throws Exception {
		this.mockMvc
				.perform(post("/api/books").contentType(MediaType.APPLICATION_JSON)
						.content(new ObjectMapper().writeValueAsString(new Book("title", "author"))))
				.andExpect(status().isCreated());
	}

	@Test
	void updateBookWithInvalidTitleShouldReturnTitleErrorMessage() throws Exception {

		// Insert object for test
		Book created = this.mongoTemplate.insert(new Book("title", "author"));

		// Then test for update
		this.mockMvc
				.perform(put("/api/books/" + created.getId()).contentType(MediaType.APPLICATION_JSON)
						.content(new ObjectMapper().writeValueAsString(new Book(null, "author"))))
				.andExpect(status().isBadRequest()).andExpect(jsonPath("$.errors").isArray())
				.andExpect(jsonPath("$.errors[0].message").value("Book title is required."));
	}

	@Test
	void updateBookWithInvalidAuthoShouldReturnAuthorErrorMessager() throws Exception {

		// Insert object for test
		Book created = this.mongoTemplate.insert(new Book("title", "author"));

		// Then test for update
		this.mockMvc
				.perform(put("/api/books/" + created.getId()).contentType(MediaType.APPLICATION_JSON)
						.content(new ObjectMapper().writeValueAsString(new Book("title", null))))
				.andExpect(status().isBadRequest()).andExpect(jsonPath("$.errors").isArray())
				.andExpect(jsonPath("$.errors[0].message").value("Author is required."));
	}

	@Test
	void updateValidBookShouldBeSuccessful() throws Exception {

		// Insert object for test
		Book created = this.mongoTemplate.insert(new Book("title", "author"));

		this.mockMvc
				.perform(put("/api/books/" + created.getId()).contentType(MediaType.APPLICATION_JSON)
						.content(new ObjectMapper().writeValueAsString(new Book("updated title", "updated author"))))
				.andExpect(status().isNoContent());
	}

	@Test
	void deleteBookWithoutIdShouldReturnNotFound() throws Exception {
		this.mockMvc.perform(delete("/api/books/")).andExpect(status().isNotFound());
	}

	@Test
	void deleteBookWithInvalidIdShouldReturnNotFound() throws Exception {
		this.mockMvc.perform(delete("/api/books/1")).andExpect(status().isNotFound());
	}

	@Test
	void deleteValidBookShouldBeSuccessful() throws Exception {

		// Insert object for test
		Book created = this.mongoTemplate.insert(new Book("title", "author"));

		this.mockMvc.perform(delete("/api/books/" + created.getId())).andExpect(status().isNoContent());
	}

}
