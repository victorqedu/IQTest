package com.caido.iqtest.rest;

import com.caido.iqtest.entity.Groups;
import com.caido.iqtest.repositories.GroupsRepository;
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
public class GroupsController {
    private final GroupsRepository repository;
    private final GroupModelAssembler assembler;

    public GroupsController(GroupsRepository repository, GroupModelAssembler assembler) {
        this.repository = repository;
        this.assembler = assembler;
    }

    @GetMapping("/groups")
    CollectionModel<EntityModel<Groups>> getAll() {
        List<EntityModel<Groups>> c = repository.findAll().stream() 
            .map(assembler::toModel) 
            .collect(Collectors.toList());
        return CollectionModel.of(c, linkTo(methodOn(GroupsController.class).getAll()).withSelfRel());
    }
    
    @GetMapping("/findGroupsWithSubjectId/{idSubject}")
    CollectionModel<EntityModel<Groups>> findGroupsWithSubjectId(@PathVariable Long idSubject) {
        List<EntityModel<Groups>> c = repository.findGroupsWithSubjectId(idSubject).stream() 
            .map(assembler::toModel) 
            .collect(Collectors.toList());
        return CollectionModel.of(c, linkTo(methodOn(GroupsController.class).findGroupsWithSubjectId(idSubject)).withSelfRel());
    }
    @PostMapping("/groups")
    EntityModel<Groups> create(@RequestBody Groups o) {
        return assembler.toModel(repository.save(o));
    }

    @GetMapping("/groups/{id}")
    EntityModel<Groups> getOne(@PathVariable Long id) {
        System.out.println("Start getOne");
        Groups c = repository.findById(id).orElseThrow(() -> new GroupNotFoundException(id));
        return assembler.toModel(c);
    }

    @PutMapping("/groups/{id}")
    EntityModel<Groups> replace(@RequestBody Groups c, @PathVariable Long id) {
        return assembler.toModel(repository.save(c));
    }

    @DeleteMapping("/groups/{id}")
    void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}

class GroupNotFoundException extends RuntimeException {
    GroupNotFoundException(Long id) {
        super("Could not find grou with id " + id);
    }
}

@ControllerAdvice
class GroupNotFoundAdvice {
    @ResponseBody
    @ExceptionHandler(GroupNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String sroupNotFoundHandler(GroupNotFoundException ex) {
        return ex.getMessage();
    }
}

@Component
class GroupModelAssembler implements RepresentationModelAssembler<Groups, EntityModel<Groups>> {
  @Override
  public EntityModel<Groups> toModel(Groups c) {
    return EntityModel.of(c, 
        linkTo(methodOn(GroupsController.class).getOne(c.getId())).withSelfRel(),
        linkTo(methodOn(GroupsController.class).getAll()).withRel("groups"));
  }
}
