package com.caido.iqtest.rest;

import com.caido.iqtest.entity.Questions;
import com.caido.iqtest.entity.QuestionsOptions;
import com.caido.iqtest.entity.Tests;
import com.caido.iqtest.repositories.QuestionsRepository;
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
public class QuestionsController {
    private final QuestionsRepository repository;
    private final QuestionModelAssembler assembler;

    public QuestionsController(QuestionsRepository repository, QuestionModelAssembler assembler) {
        this.repository = repository;
        this.assembler = assembler;
    }

    @GetMapping("/questions")
    CollectionModel<EntityModel<Questions>> getAll() {
        List<EntityModel<Questions>> c = repository.findAll().stream() 
            .map(assembler::toModel) 
            .collect(Collectors.toList());
        return CollectionModel.of(c, linkTo(methodOn(QuestionsController.class).getAll()).withSelfRel());
    }
    
    @PostMapping("/questions")
    EntityModel<Questions> create(@RequestBody Questions o) {
        return assembler.toModel(repository.save(o));
    }

    @GetMapping("/questions/{id}")
    EntityModel<Questions> getOne(@PathVariable Long id) {
        System.out.println("Start getOne");
        Questions c = repository.findById(id).orElseThrow(() -> new TestNotFoundException(id));
        return assembler.toModel(c);
    }

    @GetMapping("/questions_findByTestId/{idTests}")
    CollectionModel<EntityModel<Questions>>  findByTestId(@PathVariable Long idTests) {
        System.out.println("Start findByTestId");
        Tests t = new Tests();
        t.setId(idTests);
        List<EntityModel<Questions>> c = repository.findByTestId(t).stream() 
            .map(assembler::toModel) 
            .collect(Collectors.toList());
        return CollectionModel.of(c, linkTo(methodOn(QuestionsController.class).getAll()).withSelfRel());
    }

    @PutMapping("/questions/{id}")
    EntityModel<Questions> replace(@RequestBody Questions c, @PathVariable Long id) {
        return assembler.toModel(repository.save(c));
    }

    @DeleteMapping("/questions/{id}")
    void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}

class QuestionNotFoundException extends RuntimeException {
    QuestionNotFoundException(Long id) {
        super("Could not find question with id " + id);
    }
}

@ControllerAdvice
class QuestionNotFoundAdvice {
    @ResponseBody
    @ExceptionHandler(QuestionNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String testNotFoundHandler(QuestionNotFoundException ex) {
        return ex.getMessage();
    }
}

@Component
class QuestionModelAssembler implements RepresentationModelAssembler<Questions, EntityModel<Questions>> {
  @Override
  public EntityModel<Questions> toModel(Questions c) {
    return EntityModel.of(c, 
        linkTo(methodOn(QuestionsController.class).getOne(c.getId())).withSelfRel(),
        linkTo(methodOn(QuestionsController.class).getAll()).withRel("tests"));
  }
}

