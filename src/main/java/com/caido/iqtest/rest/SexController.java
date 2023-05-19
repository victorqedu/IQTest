package com.caido.iqtest.rest;

import com.caido.iqtest.entity.Sex;
import com.caido.iqtest.repositories.SexRepository;
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
public class SexController {
    private final SexRepository repository;
    private final SexModelAssembler assembler;

    public SexController(SexRepository repository, SexModelAssembler assembler) {
        this.repository = repository;
        this.assembler = assembler;
    }

    @GetMapping("/sex")
    //@CrossOrigin(origins = "http://caido.ro:3000", allowCredentials = "true")
    //@CrossOrigin
    CollectionModel<EntityModel<Sex>> getAll() {
        List<EntityModel<Sex>> c = repository.findAll().stream() 
            .map(assembler::toModel) 
            .collect(Collectors.toList());
        return CollectionModel.of(c, linkTo(methodOn(SexController.class).getAll()).withSelfRel());
    }
//    List<Sex> getAll() {
//        return repository.findAll();
//    }
    
    @PostMapping("/sex")
    //@CrossOrigin(origins = "http://caido.ro:3000", allowCredentials = "true")
    //@CrossOrigin
    EntityModel<Sex> create(@RequestBody Sex o) {
        return assembler.toModel(repository.save(o));
    }

    @GetMapping("/sex/{id}")
    //@CrossOrigin(origins = "http://caido.ro:3000", allowCredentials = "true")
    EntityModel<Sex> getOne(@PathVariable Long id) {
        System.out.println("Start getOne");
        //return repository.findById(id).orElseThrow(() -> new SexNotFoundException(id));
        Sex c = repository.findById(id).orElseThrow(() -> new SexNotFoundException(id));
        return assembler.toModel(c);
//        return EntityModel.of(c, 
//            linkTo(methodOn(SexController.class).getOne(id)).withSelfRel(),
//            linkTo(methodOn(SexController.class).getAll()).withRel("sex"));
    }

    @PutMapping("/sex/{id}")
    //@CrossOrigin(origins = "http://caido.ro:3000", allowCredentials = "true")
    EntityModel<Sex> replace(@RequestBody Sex c, @PathVariable Long id) {
        return assembler.toModel(repository.save(c));
    }

    @DeleteMapping("/sex/{id}")
    //@CrossOrigin(origins = "http://caido.ro:3000", allowCredentials = "true")
    void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}

class SexNotFoundException extends RuntimeException {
    SexNotFoundException(Long id) {
        super("Could not find sex with id " + id);
    }
}

@ControllerAdvice
class SexNotFoundAdvice {
    @ResponseBody
    @ExceptionHandler(SexNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String sexNotFoundHandler(SexNotFoundException ex) {
        return ex.getMessage();
    }
}

@Component
class SexModelAssembler implements RepresentationModelAssembler<Sex, EntityModel<Sex>> {
  @Override
  public EntityModel<Sex> toModel(Sex c) {
    return EntityModel.of(c, 
        linkTo(methodOn(SexController.class).getOne(c.getId())).withSelfRel(),
        linkTo(methodOn(SexController.class).getAll()).withRel("sex"));
  }
}

