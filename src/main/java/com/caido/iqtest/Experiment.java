package com.caido.iqtest;

import com.caido.iqtest.entity.Countries;
import com.caido.iqtest.repositories.CountriesRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Experiment {
  private static final Logger log = LoggerFactory.getLogger(Experiment.class);

  //@Bean
  CommandLineRunner initDatabase(CountriesRepository repository) {
    return args -> {
      log.info("Preloading " + repository.save(new Countries(null, "Romania", "RO")));
      log.info("Preloading " + repository.save(new Countries(null, "Bulgaria", "BG")));
    };
  }
}    
