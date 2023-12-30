package com.caido.iqtest.rest;

import com.caido.iqtest.RootExceptionHandler;
import com.caido.iqtest.Services.UsersService;
import com.caido.iqtest.config.SecurityConstants;
import com.caido.iqtest.entity.Users;
import com.caido.iqtest.util.JWT;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api")
public class UsersController {
    private final UsersService usersService;
    private final UserModelAssembler assembler;

    public UsersController(UsersService usersService, UserModelAssembler assembler) {
        this.usersService = usersService;
        this.assembler = assembler;
    }

    @GetMapping(value = "/login", consumes = "*/*", produces = "application/json")
    public EntityModel<Users> login(Users u, HttpServletRequest request, HttpServletResponse response) throws Exception {
        System.out.println("Start authentication for user "+u.toString());
        String jwt = response.getHeader("Authorization");
        if (null != jwt && !jwt.startsWith("Basic")) {
            Long userId = Long.valueOf(JWT.getClaimByNameFromToken(jwt, "id"));
            Users p = usersService.findById(userId, jwt).orElseThrow(() -> new RootExceptionHandler("Utilizatorul cu id-ul "+userId+" nu a fost gasit in baza de date"));
            p.setPassword(null);
            return assembler.toModel(p);
        } else {
          throw new RootExceptionHandler("Nu puteti accesa aceasta resursa, autentificare invalida");
        }
    }

//    @GetMapping("/users")
//    CollectionModel<EntityModel<Users>> getAll() {
//        List<EntityModel<Users>> c = usersService.findAll().stream() 
//            .map(assembler::toModel) 
//            .collect(Collectors.toList());
//        return CollectionModel.of(c, linkTo(methodOn(UsersController.class).getAll()).withSelfRel());
//    }

//    @PostMapping("/users")
//    EntityModel<Users> create(@RequestBody Users o) {
//        return assembler.toModel(usersService.save(o));
//    }

    @GetMapping("/users/{id}")
    EntityModel<Users> getOne(@PathVariable Long id, HttpServletRequest hsr) throws Exception {
        System.out.println("Start getOne");
        Users u = usersService.findById(id, hsr.getHeader(SecurityConstants.JWT_HEADER)).orElseThrow(() -> new RootExceptionHandler("Persoana cu id-ul "+id+" nu a fost gasită in baza de date"));;
        u.setPassword(null);
        return assembler.toModel(u);
    }

//    @PutMapping("/users/{id}")
//    EntityModel<Users> replace(@RequestBody Users c, @PathVariable Long id) {
//        return assembler.toModel(usersService.save(c));
//    }
//
//    @DeleteMapping("/users/{id}")
//    void delete(@PathVariable Long id) {
//        usersService.deleteById(id);
//    }
}

class UserNotFoundException extends RuntimeException {
    UserNotFoundException(Long id) {
        super("Could not find user with id " + id);
    }
}

@ControllerAdvice
class UserNotFoundAdvice {
    @ResponseBody
    @ExceptionHandler(UserNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String userNotFoundHandler(UserNotFoundException ex) {
        return ex.getMessage();
    }
}

@Component
class UserModelAssembler implements RepresentationModelAssembler<Users, EntityModel<Users>> {
  @Override
  public EntityModel<Users> toModel(Users c) {
    return EntityModel.of(c);
  }
}

