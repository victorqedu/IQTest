package com.caido.iqtest.Services;

import com.caido.iqtest.entity.DTOs.TestsSessionsDTO;
import com.caido.iqtest.repositories.TestsSessionsRepository;
import com.caido.iqtest.util.JWT;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class TestsSessionsService {
    private final TestsSessionsRepository testsSessionsRepo;

    public TestsSessionsService(TestsSessionsRepository testsSessionsRepo) {
        this.testsSessionsRepo = testsSessionsRepo;
    }

    public List<TestsSessionsDTO> getUserTestsSessions(String jwtToken) throws Exception   {
        Long userId = Long.valueOf(JWT.getClaimByNameFromToken(jwtToken, "id"));
        return testsSessionsRepo.getUserTestsSessions(userId);
    }
}
