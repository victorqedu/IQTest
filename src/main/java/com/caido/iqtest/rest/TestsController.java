package com.caido.iqtest.rest;

import com.caido.iqtest.Services.TestsService;
import com.caido.iqtest.config.SecurityConstants;
import com.caido.iqtest.entity.DTOs.TestsDTO;
import com.caido.iqtest.entity.Subjects;
import com.caido.iqtest.entity.Tests;
import com.caido.iqtest.entity.TestsImports;
import com.caido.iqtest.repositories.TestsRepository;
import com.caido.iqtest.util.JWT;
import jakarta.servlet.http.HttpServletRequest;
import java.util.ArrayList;
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
    private final TestsService service;
    private final TestModelAssembler assembler;

    public TestsController(TestsRepository repository, TestModelAssembler assembler, TestsService service) {
        this.repository = repository;
        this.assembler = assembler;
        this.service = service;
    }

    @GetMapping("/testsMaxPoints/{id}")
    Integer getMaxPoints(@PathVariable Long id) {
        System.out.println("Start getMaximumPoints for test id "+id);
        Tests test = new Tests();
        test.setId(id);
        return repository.getMaxPoints(test);
    }

    @PostMapping("/importTestFromString")
    Tests importTestFromString(@RequestBody TestsImports ti) throws Exception  {
        return service.importTestFromString(ti);
    }

    @GetMapping("/tests")
    CollectionModel<EntityModel<Tests>> getAll() {
        List<EntityModel<Tests>> c = repository.findAll().stream() 
            .map(assembler::toModel) 
            .collect(Collectors.toList());
        return CollectionModel.of(c, linkTo(methodOn(TestsController.class).getAll()).withSelfRel());
    }
    
    @GetMapping("/testsWithSubjectId/{id}")
    CollectionModel<EntityModel<Tests>> testsWithSubjectId(@PathVariable Long id) {
        Subjects s = new Subjects();
        s.setId(id);
        List<EntityModel<Tests>> c = repository.testsWithSubjectId(s).stream() 
            .map(assembler::toModel) 
            .collect(Collectors.toList());
        return CollectionModel.of(c, linkTo(methodOn(TestsController.class).testsWithSubjectId(id)).withSelfRel());
    }
    
    private Tests mapTestsDTOToTests(TestsDTO td) {
        System.out.println("td.getHasBeenFinalized "+td.getFinalizedPercent());
        return new Tests(td.getId(), td.getDetailedResults(), td.getResultsText(), td.getDescription(), td.getOptions(), td.getDisabled(), td.getRandomImages(), td.getIdSubjects(), td.getIdGroups(), 
                td.getMaxTime(), td.getDetailsPerQuestion(), td.getText(), td.getFinalizedPercent());
    }
    
    @GetMapping("/testsWithSubjectIdWithoutGroup/{idSubject}")
    CollectionModel<EntityModel<Tests>> testsWithSubjectIdWithoutGroup(@PathVariable Long idSubject, HttpServletRequest hsr) throws Exception {
        String jwtToken = hsr.getHeader(SecurityConstants.JWT_HEADER);
        if(jwtToken!=null && !jwtToken.equals("")) {
            System.out.println("testsWithSubjectIdWithoutGroup jwt token is defined");
            Long userId = Long.valueOf(JWT.getClaimByNameFromToken(jwtToken, "id"));
            List<Tests> testsList = repository.testsDTOWithSubjectIdWithoutGroup(idSubject, userId).stream()
                .map(this::mapTestsDTOToTests) 
                .collect(Collectors.toList());
            
            List<EntityModel<Tests>> c = testsList.stream() 
                .map(assembler::toModel) 
                .collect(Collectors.toList());
            return CollectionModel.of(c, linkTo(methodOn(TestsController.class).testsWithSubjectIdWithoutGroup(idSubject, null)).withSelfRel());            
        } else {
            System.out.println("testsWithSubjectIdWithoutGroup jwt token is not defined");
            List<EntityModel<Tests>> c = repository.testsWithSubjectIdWithoutGroup(idSubject).stream() 
                .map(assembler::toModel) 
                .collect(Collectors.toList());
            return CollectionModel.of(c, linkTo(methodOn(TestsController.class).testsWithSubjectIdWithoutGroup(idSubject, null)).withSelfRel());            
        }
        
    }

    @GetMapping("/testsWithSubjectIdAndGroupId/{idSubject}/{idGroup}")
    CollectionModel<EntityModel<Tests>> testsWithSubjectIdAndGroupId(@PathVariable("idSubject") Long idSubject, @PathVariable("idGroup") Long idGroup, HttpServletRequest hsr) throws Exception {
        String jwtToken = hsr.getHeader(SecurityConstants.JWT_HEADER);
        if(jwtToken!=null && !jwtToken.equals("")) {
            System.out.println("testsWithSubjectIdAndGroupId jwt token is defined");
            Long userId = Long.valueOf(JWT.getClaimByNameFromToken(jwtToken, "id"));
            List<Tests> testsList = repository.testsDTOWithSubjectIdAndGroupId(idSubject, idGroup, userId).stream()
                .map(this::mapTestsDTOToTests) 
                .collect(Collectors.toList());
            
            List<EntityModel<Tests>> c = testsList.stream() 
                .map(assembler::toModel) 
                .collect(Collectors.toList());
            return CollectionModel.of(c, linkTo(methodOn(TestsController.class).testsWithSubjectIdWithoutGroup(idSubject, null)).withSelfRel());            
        } else {
            List<EntityModel<Tests>> c = repository.testsWithSubjectIdAndGroupId(idSubject, idGroup).stream() 
                .map(assembler::toModel) 
                .collect(Collectors.toList());
            return CollectionModel.of(
                    c, 
                    linkTo(methodOn(TestsController.class).testsWithSubjectIdAndGroupId(idSubject, idGroup, null)).withSelfRel());
        }
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

    Class<?> findGroupsWithSubjectId(Long idSubject) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
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

