package com.caido.iqtest.rest;

import com.caido.iqtest.entity.Images;
import com.caido.iqtest.repositories.ImagesRepository;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;
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
public class ImagesController {
    private final ImagesRepository repository;
    private final ImageModelAssembler assembler;

    public ImagesController(ImagesRepository repository, ImageModelAssembler assembler) {
        this.repository = repository;
        this.assembler = assembler;
    }

    @GetMapping("/images")
    CollectionModel<EntityModel<Images>> getAll() {
        List<EntityModel<Images>> c = repository.findAll().stream() 
            .map(assembler::toModel) 
            .collect(Collectors.toList());
        return CollectionModel.of(c, linkTo(methodOn(ImagesController.class).getAll()).withSelfRel());
    }
    
    @PostMapping("/images")
    EntityModel<Images> create(@RequestBody Images i) {
        System.err.println("Image "+i.getImage());
        return assembler.toModel(repository.save(i));
    }

    @GetMapping("/getRandomImage")
    EntityModel<Images> getRandomImage() {
        System.out.println("Start getRandomImage");
        int totalCount = repository.countImages(); // Replace with your actual method to count images
        int randomOffset = ThreadLocalRandom.current().nextInt(totalCount);
        Images randomImage = repository.getRandomImage(randomOffset);
        return assembler.toModel(randomImage);
    }

    @GetMapping("/images/{id}")
    EntityModel<Images> getOne(@PathVariable Long id) {
        System.out.println("Start getOne");
        Images c = repository.findById(id).orElseThrow(() -> new ImageNotFoundException(id));
        return assembler.toModel(c);
    }

    @PutMapping("/images/{id}")
    EntityModel<Images> replace(@RequestBody Images c, @PathVariable Long id) {
        return assembler.toModel(repository.save(c));
    }

    @DeleteMapping("/images/{id}")
    void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}

class ImageNotFoundException extends RuntimeException {
    ImageNotFoundException(Long id) {
        super("Could not find image with id " + id);
    }
}

@ControllerAdvice
class ImageNotFoundAdvice {
    @ResponseBody
    @ExceptionHandler(ImageNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String imageNotFoundHandler(ImageNotFoundException ex) {
        return ex.getMessage();
    }
}

@Component
class ImageModelAssembler implements RepresentationModelAssembler<Images, EntityModel<Images>> {
  @Override
  public EntityModel<Images> toModel(Images c) {
    return EntityModel.of(c, 
        linkTo(methodOn(ImagesController.class).getOne(c.getId())).withSelfRel(),
        linkTo(methodOn(ImagesController.class).getAll()).withRel("images"));
  }
}

