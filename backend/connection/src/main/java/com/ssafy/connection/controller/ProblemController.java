package com.ssafy.connection.controller;

import com.ssafy.connection.dto.ProblemDto;
import com.ssafy.connection.service.ProblemService;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

@RestController
@RequestMapping("/problem")
public class ProblemController {

    private final ProblemService problemService;

    @Autowired
    public ProblemController(ProblemService problemService){
        this.problemService = problemService;
    }

    @GetMapping("/api/load")
    public void loadJsonFromApi(){
        StringBuffer result = new StringBuffer();
        String baseUrl = "https://solved.ac/api/v3/search/problem?query=";
        try{
            int count = 255;
            for(int i = 1000; i <= 25848; i++) {
                if(count == 0) {
                    // 16분 대기
                    Thread.sleep(1000 * 60 * 16);
                } else {
                    count--;
                }
                result.delete(0, result.length());
                URL url = new URL(baseUrl + i);
                HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
                urlConnection.setRequestMethod("GET");
                urlConnection.setRequestProperty("Content-type", "application/json");

                BufferedReader reader = new BufferedReader(new InputStreamReader(url.openStream(), "UTF-8"));
                result.append(reader.readLine());
                JSONParser jsonParser = new JSONParser();
                JSONObject jsonObject = (JSONObject) jsonParser.parse(result.toString());

                if((long) jsonObject.get("count") == 0){
                    continue;
                }

                JSONArray jsonArray = (JSONArray) jsonObject.get("items");
                jsonObject = (JSONObject) jsonArray.get(0);
                long problemId = (long) jsonObject.get("problemId");
                String title = (String) jsonObject.get("titleKo");
                boolean solvable = (boolean) jsonObject.get("isSolvable");
                long level = (long) jsonObject.get("level");
                String tries = String.valueOf(jsonObject.get("averageTries"));
                long accepted = (long) jsonObject.get("acceptedUserCount");

                ProblemDto problemDto = new ProblemDto(problemId, title, solvable, accepted, level, tries);
                problemService.save(problemDto);
            }

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
