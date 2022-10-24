package com.ssafy.connection.service;

import com.ssafy.connection.dto.ProblemDto;
import com.ssafy.connection.dto.ProblemReturnDto;
import com.ssafy.connection.entity.Problem;
import com.ssafy.connection.entity.Tag;
import com.ssafy.connection.repository.ProblemRepository;
import com.ssafy.connection.repository.TagRepository;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ProblemServiceImpl implements ProblemService{

    private final ProblemRepository problemRepository;
    private final TagRepository tagRepository;

    public ProblemServiceImpl(ProblemRepository problemRepository, TagRepository tagRepository){
        this.problemRepository = problemRepository;
        this.tagRepository = tagRepository;
    }

    @Transactional
    public ProblemDto getProblem(long problemId) {
        return ProblemDto.of(problemRepository.getById(problemId));
    }

    @Override
    public void save(Problem problem) {
        problemRepository.save(problem);
    }

    @Override
    @Transactional
    public List<ProblemReturnDto> getProblemList() {
        List<Problem> problemEntityList = problemRepository.findAll();
        List<ProblemDto> problemDtoList = problemEntityList.stream().map(entity -> ProblemDto.of(entity)).collect(Collectors.toList());
        List<ProblemReturnDto> returnList = new ArrayList<>();

        for(ProblemDto problemDto : problemDtoList){
            returnList.add(new ProblemReturnDto(problemDto, tagRepository.findAllByProblem(Problem.of(problemDto))));
        }

        return returnList;
    }

    @Override
    public void loadAllProblemFromApi() {
        StringBuffer result = new StringBuffer();
        String baseUrl = "https://solved.ac/api/v3/search/problem?query=";
        try{
            int count = 255;
            for(int i = 1; i <= 25848; i++) {
                // 문제 데이터 255개 받아올때마다 16분 대기
                if(count == 0) {
                    Thread.sleep(1000 * 60 * 16);
                    count = 255;
                } else {
                    count--;
                }
                result.delete(0, result.length());  // StringBuffer 초기화
                URL url = new URL(baseUrl + i); // URL 설정
                HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
                urlConnection.setRequestMethod("GET");
                urlConnection.setRequestProperty("Content-type", "application/json");

                BufferedReader reader = new BufferedReader(new InputStreamReader(url.openStream(), "UTF-8"));
                result.append(reader.readLine());
                JSONParser jsonParser = new JSONParser();
                JSONObject jsonObject = (JSONObject) jsonParser.parse(result.toString());

                // 읽어온 문제 데이터에서 count 값이 0일 경우, 해당 번호의 문제가 없음
                if((long) jsonObject.get("count") == 0){
                    continue;
                }

                // items에 들어있는 문제 데이터 중 첫번째 데이터만 문제 번호에 맞는 데이터
                JSONArray jsonArray = (JSONArray) jsonObject.get("items");
                jsonObject = (JSONObject) jsonArray.get(0);

                // 이모티콘 검사
                Pattern rex = Pattern.compile("[\\x{10000}-\\x{10ffff}\ud800-\udfff]");
                Matcher rexMatcher = rex.matcher((String) jsonObject.get("titleKo"));
                if(rexMatcher.find()){
                    continue;
                }

                // 문제 엔티티 DB에 저장
                Problem problem = new Problem();
                problem.setProblemId((long) jsonObject.get("problemId"));
                problem.setTitle((String) jsonObject.get("titleKo"));
                problem.setSolvable((boolean) jsonObject.get("isSolvable"));
                problem.setLevel((long) jsonObject.get("level"));
                problem.setTries(String.valueOf(jsonObject.get("averageTries")));
                problem.setAccepted((long) jsonObject.get("acceptedUserCount"));
                problemRepository.save(problem);

                // tags에 들어있는 여러 개의 태그 데이터 저장
                jsonArray = (JSONArray) jsonObject.get("tags");
                JSONArray languageJsonArray;
                int tagSize = jsonArray.size();
                for(int j = 0; j < tagSize; j++){
                    Tag tag = new Tag();
                    jsonObject = (JSONObject) jsonArray.get(j);
                    // displayNames에 태그 이름 데이터 저장되어있음
                    languageJsonArray = (JSONArray) jsonObject.get("displayNames");
                    // 한국어, 영어 태그 이름 모두 저장
                    for(int k = 0; k < languageJsonArray.size(); k++) {
                        jsonObject = (JSONObject) languageJsonArray.get(k);
                        String language = (String) jsonObject.get("language");
                        switch(language){
                            case "ko":
                                tag.setKo((String) jsonObject.get("short"));
                                break;
                            case "en":
                                tag.setEn((String) jsonObject.get("short"));
                                break;
                        }
                    }
                    tag.setProblem(problem);
                    tagRepository.save(tag);   // 태그 엔티티 DB에 저장
                }
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
