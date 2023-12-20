package com.caido.iqtest.rest;

import com.caido.iqtest.entity.Subjects;
import com.caido.iqtest.entity.Tests;
import com.caido.iqtest.repositories.TestsRepository;
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
public class TestsController {
    private final TestsRepository repository;
    private final TestModelAssembler assembler;

    public TestsController(TestsRepository repository, TestModelAssembler assembler) {
        this.repository = repository;
        this.assembler = assembler;
    }

    @GetMapping("/testsMaxPoints/{id}")
    Integer getMaxPoints(@PathVariable Long id) {
        System.out.println("Start getMaximumPoints for test id "+id);
        Tests test = new Tests();
        test.setId(id);
        return repository.getMaxPoints(test);
    }

    @GetMapping("/tests")
    CollectionModel<EntityModel<Tests>> getAll() {
        List<EntityModel<Tests>> c = repository.findAll().stream() 
            .map(assembler::toModel) 
            .collect(Collectors.toList());
        return CollectionModel.of(c, linkTo(methodOn(TestsController.class).getAll()).withSelfRel());
    }
    
    @GetMapping("/testsWithSubjectId/{id}")
    CollectionModel<EntityModel<Tests>> findAllWithSubjectId(@PathVariable Long id) {
        Subjects s = new Subjects();
        s.setId(id);
        List<EntityModel<Tests>> c = repository.findAllWithSubjectId(s).stream() 
            .map(assembler::toModel) 
            .collect(Collectors.toList());
        return CollectionModel.of(c, linkTo(methodOn(TestsController.class).findAllWithSubjectId(id)).withSelfRel());
    }
    
    @PostMapping("/tests")
    EntityModel<Tests> create(@RequestBody Tests o) {
        return assembler.toModel(repository.save(o));
    }

    @GetMapping("/tests/{id}")
    EntityModel<Tests> getOne(@PathVariable Long id) {
        System.out.println("Start getOne");
        Tests c = repository.findById(id).orElseThrow(() -> new TestNotFoundException(id));
        return assembler.toModel(c);
    }

    @PutMapping("/tests/{id}")
    EntityModel<Tests> replace(@RequestBody Tests c, @PathVariable Long id) {
        return assembler.toModel(repository.save(c));
    }

    @DeleteMapping("/tests/{id}")
    void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}

class TestNotFoundException extends RuntimeException {
    TestNotFoundException(Long id) {
        super("Could not find test  with id " + id);
    }
}

@ControllerAdvice
class TestNotFoundAdvice {
    @ResponseBody
    @ExceptionHandler(TestNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String testNotFoundHandler(TestNotFoundException ex) {
        return ex.getMessage();
    }
}

@Component
class TestModelAssembler implements RepresentationModelAssembler<Tests, EntityModel<Tests>> {
  @Override
  public EntityModel<Tests> toModel(Tests c) {
    return EntityModel.of(c, 
        linkTo(methodOn(TestsController.class).getOne(c.getId())).withSelfRel(),
        linkTo(methodOn(TestsController.class).getAll()).withRel("tests"));
  }
}

