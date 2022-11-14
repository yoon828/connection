package com.ssafy.connection.service;

import com.ssafy.connection.entity.ConnStudy;
import com.ssafy.connection.entity.Study;
import com.ssafy.connection.repository.*;
import com.ssafy.connection.securityOauth.repository.auth.TokenRepository;
import com.ssafy.connection.securityOauth.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class SvgServiceImpl implements SvgService{
    private final StudyRepository studyRepository;
    private final SubjectRepository subjectRepository;
    private final ConnStudyRepository connStudyRepository;
    @Autowired
    private SubjectService subjectService;

    public SvgServiceImpl(StudyRepository studyRepository, SubjectRepository subjectRepository, ConnStudyRepository connStudyRepository){
        this.studyRepository = studyRepository;
        this.subjectRepository = subjectRepository;
        this.connStudyRepository =  connStudyRepository;
    }


    private String[] color_chart = {"#54B0F6","#F6C666", "#54E6B6", "#7C54F5", "#F55458", "#F4F455"};
    @Transactional
    @Override
    public ResponseEntity getSubjectSvg(String studyName){
        ResponseEntity teamStatus = subjectService.getTeamStatus(studyName);
        if(teamStatus.equals(null)) return new ResponseEntity("empty",HttpStatus.CONFLICT);

        Map<String,Object> subjectMap = (Map<String,Object>)subjectService.getTeamStatus(studyName).getBody();
        List<Map<String,Object> > sublist = (List<Map<String,Object> >)subjectMap.get("subjects");
        if(sublist.size() == 0){   //등록한과제가 없어요
//            System.out.println("널");
            String nosub = "<svg  width=\"780\" height=\"320\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
                    "  <!-- filter -->\n" +
                    "  <defs>\n" +
                    "    <filter id=\"shadow\" height=\"130%\">\n" +
                    "      <feGaussianBlur in=\"SourceAlpha\" stdDeviation=\"3\"/> <!-- stdDeviation is how much to blur -->\n" +
                    "      <feOffset in=\"blur\" dx=\"3\" dy=\"3\" result=\"offsetBlur\"/>\n" +
                    "      <feFlood flood-color=\"rgba(0,0,0,0.3)\" flood-opacity=\"0.5\" result=\"offsetColor\"/>\n" +
                    "      <feComposite in=\"offsetColor\" in2=\"offsetBlur\" operator=\"in\" result=\"offsetBlur\"/>\n" +
                    "      <feMerge> \n" +
                    "        <feMergeNode /> this contains the offset blurred image\n" +
                    "        <feMergeNode in=\"SourceGraphic\"/> this contains the element that the filter is applied to\n" +
                    "      </feMerge>\n" +
                    "    </filter>\n" +
                    "  </defs>\n" +
                    " <style type=\"text/css\">\n" +
                    "    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700');\n" +
                    "    @keyframes delayFadeIn {\n" +
                    "        0%{\n" +
                    "            opacity:0\n" +
                    "        }\n" +
                    "        60%{\n" +
                    "            opacity:0\n" +
                    "        }\n" +
                    "        100%{\n" +
                    "            opacity:1\n" +
                    "        }\n" +
                    "    }\n" +
                    "    @keyframes fadeIn {\n" +
                    "        from {\n" +
                    "            opacity: 0;\n" +
                    "        }\n" +
                    "        to {\n" +
                    "            opacity: 1;\n" +
                    "        }\n" +
                    "    }\n" +
                    "    @keyframes rateBarAnimation {\n" +
                    "        0% {\n" +
                    "            stroke-dashoffset: 190.54999999999998;\n" +
                    "        }\n" +
                    "        70% {\n" +
                    "            stroke-dashoffset: 190.54999999999998;\n" +
                    "        }\n" +
                    "        100%{\n" +
                    "            stroke-dashoffset: 35;\n" +
                    "        }\n" +
                    "    }\n" +
                    "    text {\n" +
                    "      font-family: 'Noto Sans KR', sans-serif;\n" +
                    "      animation: delayFadeIn 0.8s ease-in-out forwards;\n" +
                    "      opacity: 0;\n" +
                    "    }\n" +
                    "    .f1 {\n" +
                    "      font-family: 'Noto Sans KR', sans-serif;\n" +
                    "      font: 14px;\n" +
                    "      font-weight: 700;\n" +
                    "      fill: #1A202C;\n" +
                    "    }\n" +
                    "    .f2 {\n" +
                    "      font-family: 'Noto Sans KR', sans-serif;\n" +
                    "      font: 14px;\n" +
                    "      fill: #1A202C;\n" +
                    "    }\n" +
                    "    .f3 {\n" +
                    "      font-family: 'Noto Sans KR', sans-serif;\n" +
                    "      font: 12px;\n" +
                    "      font-weight: 700;\n" +
                    "      fill: #1A202C;\n" +
                    "    }\n" +
                    "    circle {\n" +
                    "      animation: delayFadeIn 0.6s ease-in-out forwards;\n" +
                    "      opacity: 0;\n" +
                    "    }\n" +
                    "    line {\n" +
                    "      animation: delayFadeIn 1.4s ease-in-out forwards;\n" +
                    "      opacity: 0;\n" +
                    "    }\n" +
                    "  </style>  \n" +
                    "  <rect width=\"760\" height=\"300\" x=\"10\" y=\"10\" rx=\"10\" ry=\"10\" fill=\"#f0f7ff\" filter=\"url(#shadow)\" />\n" +
                    "\n" +
                    "\n" +
                    "  <text x='380' y='150' class=\"f2\" text-anchor=\"middle\">등록된 과제가 아직 없어요\uD83D\uDE25</text>\n" +
                    "</svg>";
            byte[] nosubBytes = nosub.getBytes();
            return ResponseEntity.ok()
                    .contentType(MediaType.valueOf("image/svg+xml"))
                    .body(nosubBytes);
        }

        Map<String,Object> map = sublist.get(sublist.size()-1);
        List<String> deadline = (List<String>)map.get("deadline");  //deadline.get(0)
        List<Map<String,String>> users = (List<Map<String,String>>)map.get("users");
        List<Map<String,Object>> problems = (List<Map<String,Object>>)map.get("problems");

        String str = "<svg  width=\"780\" height=\"320\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
                "  <!-- filter -->\n" +
                "  <defs>\n" +
                "    <filter id=\"shadow\" height=\"130%\">\n" +
                "      <feGaussianBlur in=\"SourceAlpha\" stdDeviation=\"3\"/> <!-- stdDeviation is how much to blur -->\n" +
                "      <feOffset in=\"blur\" dx=\"3\" dy=\"3\" result=\"offsetBlur\"/>\n" +
                "      <feFlood flood-color=\"rgba(0,0,0,0.3)\" flood-opacity=\"0.5\" result=\"offsetColor\"/>\n" +
                "      <feComposite in=\"offsetColor\" in2=\"offsetBlur\" operator=\"in\" result=\"offsetBlur\"/>\n" +
                "      <feMerge> \n" +
                "        <feMergeNode /> this contains the offset blurred image\n" +
                "        <feMergeNode in=\"SourceGraphic\"/> this contains the element that the filter is applied to\n" +
                "      </feMerge>\n" +
                "    </filter>\n" +
                "  </defs>\n" +
                " <style type=\"text/css\">\n" +
                "    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700');\n" +
                "    @keyframes delayFadeIn {\n" +
                "        0%{\n" +
                "            opacity:0\n" +
                "        }\n" +
                "        60%{\n" +
                "            opacity:0\n" +
                "        }\n" +
                "        100%{\n" +
                "            opacity:1\n" +
                "        }\n" +
                "    }\n" +
                "    @keyframes fadeIn {\n" +
                "        from {\n" +
                "            opacity: 0;\n" +
                "        }\n" +
                "        to {\n" +
                "            opacity: 1;\n" +
                "        }\n" +
                "    }\n" +
                "    @keyframes rateBarAnimation {\n" +
                "        0% {\n" +
                "            stroke-dashoffset: 190.54999999999998;\n" +
                "        }\n" +
                "        70% {\n" +
                "            stroke-dashoffset: 190.54999999999998;\n" +
                "        }\n" +
                "        100%{\n" +
                "            stroke-dashoffset: 35;\n" +
                "        }\n" +
                "    }\n" +
                "    text {\n" +
                "      font-family: 'Noto Sans KR', sans-serif;\n" +
                "      animation: delayFadeIn 0.8s ease-in-out forwards;\n" +
                "      opacity: 0;\n" +
                "    }\n" +
                "    .f1 {\n" +
                "      font-family: 'Noto Sans KR', sans-serif;\n" +
                "      font: 14px;\n" +
                "      font-weight: 700;\n" +
                "      fill: #1A202C;\n" +
                "    }\n" +
                "    .f2 {\n" +
                "      font-family: 'Noto Sans KR', sans-serif;\n" +
                "      font: 14px;\n" +
                "      fill: #1A202C;\n" +
                "    }\n" +
                "    .f3 {\n" +
                "      font-family: 'Noto Sans KR', sans-serif;\n" +
                "      font: 12px;\n" +
                "      font-weight: 700;\n" +
                "      fill: #1A202C;\n" +
                "    }\n" +
                "    circle {\n" +
                "      animation: delayFadeIn 0.6s ease-in-out forwards;\n" +
                "      opacity: 0;\n" +
                "    }\n" +
                "    line {\n" +
                "      animation: delayFadeIn 1.4s ease-in-out forwards;\n" +
                "      opacity: 0;\n" +
                "    }\n" +
                "  </style>" +
                "  \n" +
                "  <rect width=\"760\" height=\"300\" x=\"10\" y=\"10\" rx=\"10\" ry=\"10\" fill=\"#f0f7ff\" filter=\"url(#shadow)\" />\n" +
                "\n" +
                "  <!-- 가로선 -->\n" +
                "  <line x1=\"41\" y1=\"110\" x2=\"520\" y2=\"110\" stroke=\"#D1D1D1\" stroke-width=\"1.5\" />\n" +
                "  <!-- 세로선 -->\n" +
                "  <line x1=\"105\" y1=\"80\" x2=\"105\" y2=\"290\" stroke=\"#D1D1D1\" stroke-width=\"1.5\" /> <!-- 첫선 -->\n" +
                "  <line x1=\"540\" y1=\"80\" x2=\"540\" y2=\"290\" stroke=\"#D1D1D1\" stroke-width=\"1.5\" /> <!-- 마지막선 -->\n" +
                "\n" +
                "  <text x='45' y='40' class=\"f1\">총 문제수 : " + problems.size() + "문제</text>\n" +
                "  <text x='45' y='65' class=\"f2\" style=\"animation-delay: 200ms\">과제 기간 : " + deadline.get(0) + " ~ " + deadline.get(1) + "</text>\n" +
                "  <text x='72' y='100' text-anchor=\"middle\" class=\"f3\" style=\"animation-delay: 400ms\">번호</text>\n";

        for(int i = 0; i<users.size(); i++){
            Map<String,String> usermap = users.get(i);

            long vline_x = 105 + 415 / (users.size()) * (i+1);
            long username_x = vline_x - 415 / (users.size()) / 2;

            if(i<users.size()-1)
                str += "  <line x1=\"" + vline_x
                        +"\" y1=\"80\" " +
                        "x2=\"" + vline_x + "\" y2=\"290\" stroke=\"#D1D1D1\" stroke-width=\"1.5\" /> \n";
            str += "  <text x='" +
                    username_x +"' y='100' text-anchor=\"middle\" class=\"f3\" style=\"animation-delay: 400ms\">"
                    + usermap.get("user_name") + "</text>\n";

        }

        int solved_cnt = 0;
        int[] solve = new int[6];
        for(int i = 0; i<problems.size(); i++){
            Map<String,Object> problemmap = problems.get(i);
            long y = (135 + 30 * i);
            str += "  <text x='72' " +
                    "y='" + y + "' text-anchor=\"middle\" class=\"f2\" style=\"animation-delay: 400ms\">"
                    + problemmap.get("problem_id").toString() + "</text>\n";
            List<Boolean> solved = (List<Boolean>)problemmap.get("problem_solved");
            for (int j = 0; j < solved.size(); j++) {
                long circle_x = 105 + 415 / (users.size()) * (j+1)
                                    - 415 / (users.size()) / 2;
                String color = solved.get(j) ? color_chart[j] : "#c5c8cd";
//                String color = solved.get(j) ? "#6fb2ff" : "#c5c8cd";

                if(solved.get(j)) {
                    solved_cnt++;
                    solve[j] ++;
                }
                str += "<circle cx=\"" + circle_x  + "\" " +
                        "cy=\"" + y + "\" r=\"10\" " +
                        "style=\"fill:" + color + ";animation-delay: 600ms;\" />";
            }
        }

        if(solved_cnt <= 0){
            str +=  "  <!-- 아무도 제출하지 않으면 -->\n" +
                    "  <rect width=\"157\" height=\"66\" x=\"573\" y=\"122\" fill=\"#bee3f8\" />\n" +
                    "  <text x='582' y='152' class=\"f2\">과제를 제출한 사람이</text>\n" +
                    "  <text x='599' y='173' class=\"f2\">아무도없어요\uD83D\uDE25</text>\n";
        }
        else{
            String chart = "";
            double percent = 0;
            for(int i = 0; i<users.size(); i++){
                percent += (double)100 * (double)solve[i] / (double)solved_cnt;

                chart = "<circle\n" +
                        "    r=\"40\"\n" +
                        "    cx=\"-115\"\n" +
                        "    cy=\"650\"\n" +
                        "    fill=\"transparent\"\n" +
                        "    stroke=\"" + color_chart[i] + "\"\n" +
                        "    stroke-width=\"80\"\n" +
                        "    stroke-dasharray=\"calc(" + percent + " * calc(2*3.14*40) / 100) calc(2*3.14*40)\"\n" +
                        "    transform=\"rotate(-90)  translate(-40)\"\n" +
                        "    style=\"animation-delay: 800ms\"" +
                        "  />" + chart;
            }
            str += chart;
            str += "\n" +
                    "  <rect width=\"81\" height=\"25\" x=\"610\" y=\"254\" fill=\"#C8E9FB\" />\n" +
                    "  <text x='650' y='272' text-anchor=\"middle\" class=\"f3\">과제 현황</text>";
        }
        str +="</svg>";

        byte[] byts = str.getBytes();
        return ResponseEntity.ok()
                .contentType(MediaType.valueOf("image/svg+xml"))
                .body(byts);
    }
}
