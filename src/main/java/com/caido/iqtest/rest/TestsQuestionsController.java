package com.caido.iqtest.rest;

import com.caido.iqtest.entity.Tests;
import com.caido.iqtest.entity.TestsQuestions;
import com.caido.iqtest.repositories.TestsQuestionsRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;
import org.springframework.stereotype.Component;

@RestController
@RequestMapping("/api")
public class TestsQuestionsController {
    private final TestsQuestionsRepository repository;
    private final TestQuestionModelAssembler assembler;

    public TestsQuestionsController(TestsQuestionsRepository repository, TestQuestionModelAssembler assembler) {
        this.repository = repository;
        this.assembler = assembler;
    }

    @GetMapping("/testsquestions")
    CollectionModel<EntityModel<TestsQuestions>> getAll() {
        List<EntityModel<TestsQuestions>> c = repository.findAll().stream() 
            .map(assembler::toModel) 
            .collect(Collectors.toList());
        return CollectionModel.of(c, linkTo(methodOn(TestsQuestionsController.class).getAll()).withSelfRel());
    }

    @GetMapping("/testsquestions_findByTestId/{idTests}")
    CollectionModel<EntityModel<TestsQuestions>>  findByTestId(@PathVariable Long idTests) {
        System.out.println("Start findByQuestionId");
        Tests t = new Tests();
        t.setId(idTests);
        List<EntityModel<TestsQuestions>> c = repository.findByTestId(t).stream() 
            .map(assembler::toModel) 
            .collect(Collectors.toList());
        return CollectionModel.of(c, linkTo(methodOn(TestsQuestionsController.class).getAll()).withSelfRel());
    }

    @PostMapping("/testsquestions")
    EntityModel<TestsQuestions> create(@RequestBody TestsQuestions o) {
        return assembler.toModel(repository.save(o));
    }

    @GetMapping("/testsquestions/{id}")
    EntityModel<TestsQuestions> getOne(@PathVariable Long id) {
        System.out.println("Start getOne");
        TestsQuestions c = repository.findById(id).orElseThrow(() -> new TestNotFoundException(id));
        return assembler.toModel(c);
    }

    @PutMapping("/testsquestions/{id}")
    EntityModel<TestsQuestions> replace(@RequestBody TestsQuestions c, @PathVariable Long id) {
        return assembler.toModel(repository.save(c));
    }

    @DeleteMapping("/testsquestions/{id}")
    void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}

class TestQuestionNotFoundException extends RuntimeException {
    TestQuestionNotFoundException(Long id) {
        super("Could not find test  with id " + id);
    }
}

@ControllerAdvice
class TestQuestionNotFoundAdvice {
    @ResponseBody
    @ExceptionHandler(TestQuestionNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String testNotFoundHandler(TestQuestionNotFoundException ex) {
        return ex.getMessage();
    }
}

@Component
class TestQuestionModelAssembler implements RepresentationModelAssembler<TestsQuestions, EntityModel<TestsQuestions>> {
  @Override
  public EntityModel<TestsQuestions> toModel(TestsQuestions c) {
    return EntityModel.of(c, 
        linkTo(methodOn(TestsQuestionsController.class).getOne(c.getId())).withSelfRel(),
        linkTo(methodOn(TestsQuestionsController.class).getAll()).withRel("tests"));
  }
}

