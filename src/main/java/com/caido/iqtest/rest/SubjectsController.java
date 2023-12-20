package com.caido.iqtest.rest;

import com.caido.iqtest.entity.Subjects;
import com.caido.iqtest.repositories.SubjectsRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
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

@RestController
@RequestMapping("/api")
public class SubjectsController {
    private final SubjectsRepository repository;
    private final SubjectModelAssembler assembler;

    public SubjectsController(SubjectsRepository repository, SubjectModelAssembler assembler) {
        this.repository = repository;
        this.assembler = assembler;
    }

    @GetMapping("/subjects")
    CollectionModel<EntityModel<Subjects>> getAll() {
        List<EntityModel<Subjects>> c = repository.findAll().stream() 
            .map(assembler::toModel) 
            .collect(Collectors.toList());
        return CollectionModel.of(c, linkTo(methodOn(SubjectsController.class).getAll()).withSelfRel());
    }
    
    @PostMapping("/subjects")
    EntityModel<Subjects> create(@RequestBody Subjects o) {
        return assembler.toModel(repository.save(o));
    }

    @GetMapping("/subjects/{id}")
    EntityModel<Subjects> getOne(@PathVariable Long id) {
        System.out.println("Start getOne");
        Subjects c = repository.findById(id).orElseThrow(() -> new SubjectNotFoundException(id));
        return assembler.toModel(c);
    }

    @PutMapping("/subjects/{id}")
    EntityModel<Subjects> replace(@RequestBody Subjects c, @PathVariable Long id) {
        return assembler.toModel(repository.save(c));
    }

    @DeleteMapping("/subjects/{id}")
    void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}

class SubjectNotFoundException extends RuntimeException {
    SubjectNotFoundException(Long id) {
        super("Could not find subject with id " + id);
    }
}

@ControllerAdvice
class SubjectNotFoundAdvice {
    @ResponseBody
    @ExceptionHandler(SubjectNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String subjectNotFoundHandler(SubjectNotFoundException ex) {
        return ex.getMessage();
    }
}

@Component
class SubjectModelAssembler implements RepresentationModelAssembler<Subjects, EntityModel<Subjects>> {
  @Override
  public EntityModel<Subjects> toModel(Subjects c) {
    return EntityModel.of(c, 
        linkTo(methodOn(SubjectsController.class).getOne(c.getId())).withSelfRel(),
        linkTo(methodOn(SubjectsController.class).getAll()).withRel("subjects"));
  }
}
