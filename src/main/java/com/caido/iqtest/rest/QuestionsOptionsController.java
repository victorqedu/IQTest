package com.caido.iqtest.rest;

import com.caido.iqtest.entity.Questions;
import com.caido.iqtest.entity.QuestionsOptions;
import com.caido.iqtest.repositories.QuestionsOptionsRepository;
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
@RequestMapping("/api/administrator")
public class QuestionsOptionsController {
    private final QuestionsOptionsRepository repository;
    private final QuestionOptionModelAssembler assembler;

    public QuestionsOptionsController(QuestionsOptionsRepository repository, QuestionOptionModelAssembler assembler) {
        this.repository = repository;
        this.assembler = assembler;
    }

    @GetMapping("/questionsoptions")
    CollectionModel<EntityModel<QuestionsOptions>> getAll() {
        List<EntityModel<QuestionsOptions>> c = repository.findAll().stream() 
            .map(assembler::toModel) 
            .collect(Collectors.toList());
        return CollectionModel.of(c, linkTo(methodOn(QuestionsOptionsController.class).getAll()).withSelfRel());
    }
    
    @PostMapping("/questionsoptions")
    EntityModel<QuestionsOptions> create(@RequestBody QuestionsOptions o) {
        System.out.println("Start QuestionsOptions create for object "+o.getIdQuestions().toString());
        return assembler.toModel(repository.save(o));
    }

    @GetMapping("/questionsoptions/{id}")
    EntityModel<QuestionsOptions> getOne(@PathVariable Long id) {
        System.out.println("Start getOne");
        QuestionsOptions c = repository.findById(id).orElseThrow(() -> new TestNotFoundException(id));
        return assembler.toModel(c);
    }

    @GetMapping("/questionsoptions_findByQuestionId/{idQuestions}")
    CollectionModel<EntityModel<QuestionsOptions>>  findByQuestionId(@PathVariable Long idQuestions) {
        System.out.println("Start findByQuestionId");
        Questions q = new Questions();
        q.setId(idQuestions);
        List<EntityModel<QuestionsOptions>> c = repository.findByQuestionId(q).stream() 
            .map(assembler::toModel) 
            .collect(Collectors.toList());
        return CollectionModel.of(c, linkTo(methodOn(QuestionsOptionsController.class).getAll()).withSelfRel());
    }

    @PutMapping("/questionsoptions/{id}")
    EntityModel<QuestionsOptions> replace(@RequestBody QuestionsOptions c, @PathVariable Long id) {
        return assembler.toModel(repository.save(c));
    }

    @DeleteMapping("/questionsoptions/{id}")
    void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}

class QuestionOptionNotFoundException extends RuntimeException {
    QuestionOptionNotFoundException(Long id) {
        super("Could not find test  with id " + id);
    }
}

@ControllerAdvice
class QuestionOptionNotFoundAdvice {
    @ResponseBody
    @ExceptionHandler(QuestionOptionNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String testNotFoundHandler(QuestionOptionNotFoundException ex) {
        return ex.getMessage();
    }
}

@Component
class QuestionOptionModelAssembler implements RepresentationModelAssembler<QuestionsOptions, EntityModel<QuestionsOptions>> {
  @Override
  public EntityModel<QuestionsOptions> toModel(QuestionsOptions c) {
    return EntityModel.of(c, 
        linkTo(methodOn(QuestionsOptionsController.class).getOne(c.getId())).withSelfRel(),
        linkTo(methodOn(QuestionsOptionsController.class).getAll()).withRel("tests"));
  }
}

