package com.caido.iqtest.Services;

import com.caido.iqtest.RootExceptionHandler;
import com.caido.iqtest.entity.Questions;
import com.caido.iqtest.entity.QuestionsOptions;
import com.caido.iqtest.entity.Subjects;
import com.caido.iqtest.entity.Tests;
import com.caido.iqtest.entity.TestsImports;
import com.caido.iqtest.repositories.QuestionsOptionsRepository;
import com.caido.iqtest.repositories.QuestionsRepository;
import com.caido.iqtest.repositories.TestsRepository;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class TestsService {
    private final TestsRepository testsR;
    private final QuestionsRepository questionsR;
    private final QuestionsOptionsRepository questionsOptionsR;

    public TestsService(TestsRepository testsR, QuestionsRepository questionsR, QuestionsOptionsRepository questionsOptionsR) {
        this.testsR = testsR;
        this.questionsR = questionsR;
        this.questionsOptionsR = questionsOptionsR;
    }
    
    @Transactional
    public Tests importTestFromString(TestsImports ti) throws Exception {
        String[] linesTest = ti.getTestData().split("\\r?\\n|\\r");
        String[] linesAnswers = ti.getResultsData().split("\\r?\\n|\\r");
        Tests t = new Tests();
        Subjects s = new Subjects();
        try { 
            Long idSubject = Long.valueOf(linesTest[1]);
            s.setId(idSubject);
        } catch(NumberFormatException | NullPointerException e) { 
            throw new RootExceptionHandler("A doua linie din fisierul de intrebari trebuie sa fie numerica si sa contina ID-ul subiectului ce va fi utilizat pentru crearea testului.");
        }
        
        t.setIdSubjects(s);
        t.setDescription(linesTest[0]);
        t.setDisabled(0);
        t.setOptions(1);
        t.setRandomImages(1);
        t.setDetailedResults(1);
        t.setDetailsPerQuestion(0);
        t.setRandomImages(1);
        t = testsR.save(t);

        for(int i=2;i<linesTest.length;i+=2) {
            System.out.println("At question "+linesTest[i]);
            Questions q = new Questions();
            q.setIdTests(t);
            Pattern pattern = Pattern.compile("^(\\d{1,2})\\.{0,1}\\s{0,}(.{1,})$", Pattern.CASE_INSENSITIVE);
            Matcher matcher = pattern.matcher(linesTest[i]);
            if(matcher.find()) {
                System.out.println("Question matches ");
                q.setOrderq(Integer.valueOf(matcher.group(1)));
                q.setDescription(matcher.group(2));
            } else {
                q.setDescription(linesTest[i]);
            }
            q = questionsR.save(q);

            pattern = Pattern.compile("^[a-d]{1}\\.\\s{0,1}(.{1,});{0,1}\\s{0,1}[a-d]{1}\\.\\s{0,1}(.{1,});{0,1}\\s{0,1}[a-d]{1}\\.\\s{0,1}(.{1,});{0,1}\\s{0,1}[a-d]{1}\\.\\s{0,1}(.{1,})\\.{0,1}$", Pattern.CASE_INSENSITIVE);
            matcher = pattern.matcher(linesTest[i+1]);
            System.out.println("options are "+linesTest[i+1]);
            if(matcher.find()) {
                System.out.println("options match");
                QuestionsOptions qo1 = new QuestionsOptions();
                qo1.setIdQuestions(q);
                qo1.setDescription(matcher.group(1));
                questionsOptionsR.save(qo1);

                QuestionsOptions qo2 = new QuestionsOptions();
                qo2.setIdQuestions(q);
                qo2.setDescription(matcher.group(2));
                questionsOptionsR.save(qo2);

                QuestionsOptions qo3 = new QuestionsOptions();
                qo3.setIdQuestions(q);
                qo3.setDescription(matcher.group(3));
                questionsOptionsR.save(qo3);

                QuestionsOptions qo4 = new QuestionsOptions();
                qo4.setIdQuestions(q);
                qo4.setDescription(matcher.group(4));
                questionsOptionsR.save(qo4);
                String[] result = linesAnswers[i/2-1].split(" ");
                String correctAnswerLetter = result[1];
                String points = result[2];
                q.setPoints(Integer.valueOf(points));
                switch (correctAnswerLetter) {
                    case "a" -> {q.setIdQuestionsOptionsCorrect(qo1);}
                    case "b" -> {q.setIdQuestionsOptionsCorrect(qo2);}
                    case "c" -> {q.setIdQuestionsOptionsCorrect(qo3);}
                    case "d" -> {q.setIdQuestionsOptionsCorrect(qo4);}
                    default  -> {}
                }
                questionsR.save(q);
            } else {
                System.out.println("options don't match ");
            }
        }
        return t;

    }

}