package com.ssafy.connection.service;

import com.ssafy.connection.dto.*;
import com.ssafy.connection.entity.Problem;
import com.ssafy.connection.entity.Solve;
import com.ssafy.connection.entity.Tag;
import com.ssafy.connection.repository.*;
import com.ssafy.connection.securityOauth.config.security.token.UserPrincipal;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;
import java.util.Map.Entry;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ProblemServiceImpl implements ProblemService{

    private final ProblemRepository problemRepository;
    private final TagRepository tagRepository;
    private final ConnWorkbookRepository connWorkbookRepository;
    private final ConnStudyRepository connStudyRepository;
    private final StudyService studyService;
    private final ReviewService reviewService;
    private final SolveRepository solveRepository;

    public ProblemServiceImpl(ProblemRepository problemRepository, TagRepository tagRepository, ConnWorkbookRepository connWorkbookRepository,
                              ConnStudyRepository connStudyRepository, StudyService studyService, ReviewService reviewService, SolveRepository solveRepository){
        this.problemRepository = problemRepository;
        this.tagRepository = tagRepository;
        this.connWorkbookRepository = connWorkbookRepository;
        this.connStudyRepository = connStudyRepository;
        this.studyService = studyService;
        this.reviewService = reviewService;
        this.solveRepository = solveRepository;
    }

    private static int recommendSize = 4;   // 문제 추천에서 반환할 문제 수
    private static int recommendWorkbookCount = 1;  // 문제 추천에서 스터디 문제집에 많이 담긴 기준 값
    private static String[] recommendTagList = {"구현", "다이나믹 프로그래밍", "그래프 이론", "문자열", "그리디 알고리즘", "브루트포스 알고리즘", "그래프 탐색",
                                                    "트리", "이분 탐색", "너비 우선 탐색", "시뮬레이션", "깊이 우선 탐색", "데이크스트라",
                                                        "백트래킹", "분할 정복", "재귀" };

    @Override
    public List<ProblemReturnDto> getPopularProblemList(String tag) {
        List<Problem> problemList = problemRepository.findPopularProblemListByTag(tag);
        List<ProblemReturnDto> returnList = new ArrayList<>();

        Collections.shuffle(problemList);

        for(Problem problem : problemList){
            ProblemDto problemDto = ProblemDto.of(problem);
            int difficulty = reviewService.getAvgDifficulty(problemDto);
            ArrayList<TagDto> tagList = tagRepository.findAllByProblem(problem);
            returnList.add(new ProblemReturnDto(problemDto, tagList, difficulty));
            if(returnList.size() == recommendSize){
                break;
            }
        }

        return returnList;
    }

    @Override
    public List<ProblemReturnDto> getPopularProblemList(long level, String tag) {
        List<ProblemDto> problemDtoList = problemRepository.findPopularProblemList().stream().map(entity -> ProblemDto.of(entity)).collect(Collectors.toList());
        List<ProblemReturnDto> returnList = new ArrayList<>();

        Collections.shuffle(problemDtoList);
        for(ProblemDto problemDto : problemDtoList){
            if(problemDto.getLevel() == level){
                ArrayList<TagDto> tagList = tagRepository.findAllByProblem(Problem.of(problemDto));
                for(TagDto tagDto : tagList){
                    if(tagDto.getKo().equals(tag)){
                        int difficulty = reviewService.getAvgDifficulty(problemDto);
                        returnList.add(new ProblemReturnDto(problemDto, tagList, difficulty));
                        break;
                    }
                }
            }
            if(returnList.size() == recommendSize){
                break;
            }
        }
        return returnList;
    }

    @Override
    public List<ProblemReturnDto> getPopularProblemList(Long level) {
        List<ProblemDto> problemDtoList = problemRepository.findPopularProblemList().stream().map(entity -> ProblemDto.of(entity)).collect(Collectors.toList());
        List<ProblemReturnDto> returnList = new ArrayList<>();

        Collections.shuffle(problemDtoList);
        for(ProblemDto problemDto : problemDtoList){
            if(problemDto.getLevel() == level){
                int difficulty = reviewService.getAvgDifficulty(problemDto);
                returnList.add(new ProblemReturnDto(problemDto, tagRepository.findAllByProblem(Problem.of(problemDto)), difficulty));
            }
            if(returnList.size() == recommendSize){
                break;
            }
        }
        return returnList;
    }

    @Override
    public List<ProblemReturnDto> getPopularProblemList() {
        List<ProblemDto> problemDtoList = problemRepository.findPopularProblemList().stream().map(entity -> ProblemDto.of(entity)).collect(Collectors.toList());
        List<ProblemReturnDto> returnList = new ArrayList<>();

        Collections.shuffle(problemDtoList);
        for(ProblemDto problemDto : problemDtoList){
            int difficulty = reviewService.getAvgDifficulty(problemDto);
            returnList.add(new ProblemReturnDto(problemDto, tagRepository.findAllByProblem(Problem.of(problemDto)), difficulty));
            if(returnList.size() == recommendSize){
                break;
            }
        }
        return returnList;
    }

    @Override
    @Transactional
    public List<ProblemReturnDto> getProblem(long problemId) {
        List<ProblemReturnDto> returnList = new ArrayList<>();
        Optional<Problem> problem = problemRepository.findById(problemId);
        ProblemDto problemDto = new ProblemDto();
        if(problem.isPresent()){
            problemDto = ProblemDto.of(problem.get());
        }
        int difficulty = reviewService.getAvgDifficulty(problemDto);
        returnList.add(new ProblemReturnDto(problemDto, tagRepository.findAllByProblem(Problem.of(problemDto)), difficulty));
        return returnList;
    }

    @Override
    @Transactional
    public List<ProblemReturnDto> getProblem(String title) {
        List<ProblemReturnDto> returnList = new ArrayList<>();
        List<ProblemDto> problemDtoList = problemRepository.findAllByTitle(title).stream().map(entity -> ProblemDto.of(entity)).collect(Collectors.toList());

        for(ProblemDto problemDto : problemDtoList){
            int difficulty = reviewService.getAvgDifficulty(problemDto);
            returnList.add(new ProblemReturnDto(problemDto, tagRepository.findAllByProblem(Problem.of(problemDto)), difficulty));
        }
        return returnList;
    }

    @Override
    @Transactional
    public List<ProblemReturnDto> getProblemByTag(String ko) {
        List<ProblemReturnDto> returnList = new ArrayList<>();
        List<ProblemDto> problemDtoList = problemRepository.findAllByTag(ko).stream().map(entity -> ProblemDto.of(entity)).collect(Collectors.toList());

        for(ProblemDto problemDto : problemDtoList){
            int difficulty = reviewService.getAvgDifficulty(problemDto);
            returnList.add(new ProblemReturnDto(problemDto, tagRepository.findAllByProblem(Problem.of(problemDto)), difficulty));
        }
        return returnList;
    }

    @Override
    public List<ProblemReturnDto> searchProblem(String keyword, UserPrincipal userPrincipal) {
        if(keyword == null || keyword.isEmpty()){
            return new ArrayList<>();
        }
        // 우선 제목으로 검색
        List<ProblemReturnDto> returnList = this.getProblem(keyword);

        // 검색어에 숫자만 있는지 검증
        final String REGEX = "[0-9]+";
        if(keyword.matches(REGEX)) {
            // 숫자만 있으면 문제 ID로 검색
            List<ProblemReturnDto> temp = this.getProblem(Long.parseLong(keyword));
            for(ProblemReturnDto dto : temp){
                if(dto.getProblemInfo().getProblemId() != 0){
                    returnList.add(dto);
                }
            }
        }
        return returnList;
    }

    @Override
    @Transactional
    public List<ProblemReturnDto> getProblemList() {
        List<ProblemDto> problemDtoList = problemRepository.findAll().stream().map(entity -> ProblemDto.of(entity)).collect(Collectors.toList());
        List<ProblemReturnDto> returnList = new ArrayList<>();

        for(int i = 0; i < recommendSize; i++){
            int difficulty = reviewService.getAvgDifficulty(problemDtoList.get(i));
            returnList.add(new ProblemReturnDto(problemDtoList.get(i), tagRepository.findAllByProblem(Problem.of(problemDtoList.get(i))), difficulty));
        }

        return returnList;
    }

    @Override
    public List<ProblemReturnDto> getWorkBookProblemList() {
        List<ProblemReturnDto> returnList = new ArrayList<>();
        List<WorkbookCountInterface> countList = connWorkbookRepository.findGroupByProblem();
        Collections.shuffle(countList);

        for(WorkbookCountInterface object : countList){
            if(object.getCount() >= recommendWorkbookCount){
                returnList.add(this.getProblem(object.getProblemId()).get(0));
            }
            if(returnList.size() == recommendSize){
                break;
            }
        }
        return returnList;
    }

    @Override
    public List<Entry<String, Integer>> getUserStat(Long userId){
        Map<String, Integer> tagCountMap = new HashMap<>();
        for(String tagName : recommendTagList){
            tagCountMap.put(tagName, 0);
        }

        List<Solve> solveEntityList = solveRepository.findAllByUser_UserId(userId);
        for(Solve solveEntity : solveEntityList){
            Problem problemEntity = solveEntity.getProblem();

            ArrayList<TagDto> tagList = tagRepository.findAllByProblem(problemEntity);
            for(TagDto tagDto : tagList){
                if(tagCountMap.containsKey(tagDto.getKo())){
                    tagCountMap.put(tagDto.getKo(), tagCountMap.get(tagDto.getKo()) + 1);
                }
            }
        }

        List<Entry<String, Integer>> entryList = new ArrayList<Entry<String, Integer>>(tagCountMap.entrySet());
        Collections.sort(entryList, new Comparator<Entry<String, Integer>>() {
            @Override
            public int compare(Entry<String, Integer> o1, Entry<String, Integer> o2) {
                return o1.getValue().compareTo(o2.getValue());
            }
        });

        return entryList;
    }

    @Override
    public List<UserStatDto> getUserStatList(List<Entry<String, Integer>> userStat) {
        List<UserStatDto> returnList = new ArrayList<>();
        for(Entry<String, Integer> entry : userStat){
            returnList.add(new UserStatDto(entry.getKey(), entry.getValue()));
        }
        return returnList;
    }

    @Override
    public Map<Long, Long> getTime(List<Long> problemIdList) {
        Map<Long, Long> returnMap = new HashMap<>();
        int baseTime = 20;

        for(Long problemId : problemIdList){
            Optional<Problem> problem = problemRepository.findById(problemId);
            if(problem.isPresent()){
                long difficulty = problem.get().getLevel();
                returnMap.put(problemId, baseTime + ((difficulty / 5 ) * 20));
            }
        }
        return returnMap;
    }

    @Override
    public List<ProblemReturnDto> getWeakProblemList(List<Entry<String, Integer>> entryList) {
        List<ProblemReturnDto> returnList = new ArrayList<>();
            for(int i = 0; i < 4; i++){
                returnList.add(this.getPopularProblemList(entryList.get(i).getKey()).get(0));
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
                Matcher rexMatcher = Pattern.compile("[\\x{10000}-\\x{10ffff}\ud800-\udfff]")
                                                .matcher((String) jsonObject.get("titleKo"));
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
