package com.caido.iqtest.rest;

import com.caido.iqtest.entity.Countries;
import com.caido.iqtest.repositories.CountriesRepository;
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
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api")
public class CountriesController {
    private final CountriesRepository repository;
    private final CountryModelAssembler assembler;

    public CountriesController(CountriesRepository repository, CountryModelAssembler assembler) {
        this.repository = repository;
        this.assembler = assembler;
    }

    @GetMapping("/countries")
    CollectionModel<EntityModel<Countries>> getAll() {
        List<EntityModel<Countries>> c = repository.findAll().stream() 
            .map(assembler::toModel) 
            .collect(Collectors.toList());
        return CollectionModel.of(c, linkTo(methodOn(CountriesController.class).getAll()).withSelfRel());
    }
    
    @PostMapping("/countries")
    EntityModel<Countries> create(@RequestBody Countries o) {
        return assembler.toModel(repository.save(o));
    }

    @GetMapping("/countries/{id}")
    EntityModel<Countries> getOne(@PathVariable Long id) {
        System.out.println("Start getOne");
        //return repository.findById(id).orElseThrow(() -> new CountryNotFoundException(id));
        Countries c = repository.findById(id).orElseThrow(() -> new CountryNotFoundException(id));
        return assembler.toModel(c);
    }

    @PutMapping("/countries/{id}")
    EntityModel<Countries> replace(@RequestBody Countries c, @PathVariable Long id) {
        return assembler.toModel(repository.save(c));
    }

    @DeleteMapping("/countries/{id}")
    void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}

class CountryNotFoundException extends RuntimeException {
    CountryNotFoundException(Long id) {
        super("Could not find country with id " + id);
    }
}

@ControllerAdvice
class CountryNotFoundAdvice {
    @ResponseBody
    @ExceptionHandler(CountryNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String countryNotFoundHandler(CountryNotFoundException ex) {
        return ex.getMessage();
    }
}

@Component
class CountryModelAssembler implements RepresentationModelAssembler<Countries, EntityModel<Countries>> {
  @Override
  public EntityModel<Countries> toModel(Countries c) {
    return EntityModel.of(c, 
        linkTo(methodOn(CountriesController.class).getOne(c.getId())).withSelfRel(),
        linkTo(methodOn(CountriesController.class).getAll()).withRel("countries"));
  }
}

