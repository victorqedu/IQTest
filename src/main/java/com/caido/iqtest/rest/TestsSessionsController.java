package com.caido.iqtest.rest;

import com.caido.iqtest.entity.TestsSessions;
import com.caido.iqtest.repositories.TestsSessionsRepository;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;
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
public class TestsSessionsController {
    private final TestsSessionsRepository repository;
    private final TestSessionModelAssembler assembler;

    public TestsSessionsController(TestsSessionsRepository repository, TestSessionModelAssembler assembler) {
        this.repository = repository;
        this.assembler = assembler;
    }

    @GetMapping("/testssessions")
    CollectionModel<EntityModel<TestsSessions>> getAll() {
        List<EntityModel<TestsSessions>> c = repository.findAll().stream() 
            .map(assembler::toModel) 
            .collect(Collectors.toList());
        return CollectionModel.of(c, linkTo(methodOn(TestsSessionsController.class).getAll()).withSelfRel());
    }
    
    @PostMapping("/testssessions")
    EntityModel<TestsSessions> create(@RequestBody TestsSessions o, HttpServletRequest request) {
        o.setIpAddress(request.getRemoteAddr());
        o.setDate(new Date());
        return assembler.toModel(repository.save(o));
    }

    @GetMapping("/testssessions/{id}")
    EntityModel<TestsSessions> getOne(@PathVariable Long id) {
        System.out.println("Start getOne ");
        TestsSessions c = repository.findById(id).orElseThrow(() -> new TestNotFoundException(id));
        return assembler.toModel(c);
    }

    @GetMapping("/testssessionpoints/{id}")
    Integer getPoints(@PathVariable Long id) {
        System.out.println("Start getPoints for id "+id);
        return repository.getPoints(id);
    }

    @PutMapping("/testssessions/{id}")
    EntityModel<TestsSessions> replace(@RequestBody TestsSessions c, @PathVariable Long id) {
        return assembler.toModel(repository.save(c));
    }

    @DeleteMapping("/testssessions/{id}")
    void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}

class TestSessionNotFoundException extends RuntimeException {
    TestSessionNotFoundException(Long id) {
        super("Could not find test  with id " + id);
    }
}

@ControllerAdvice
class TestSessionNotFoundAdvice {
    @ResponseBody
    @ExceptionHandler(TestSessionNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String testNotFoundHandler(TestSessionNotFoundException ex) {
        return ex.getMessage();
    }
}

@Component
class TestSessionModelAssembler implements RepresentationModelAssembler<TestsSessions, EntityModel<TestsSessions>> {
  @Override
  public EntityModel<TestsSessions> toModel(TestsSessions c) {
    return EntityModel.of(c, 
        linkTo(methodOn(TestsSessionsController.class).getOne(c.getId())).withSelfRel(),
        linkTo(methodOn(TestsSessionsController.class).getAll()).withRel("tests"));
  }
}

