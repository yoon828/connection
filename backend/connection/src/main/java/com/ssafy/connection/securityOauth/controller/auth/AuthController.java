package com.ssafy.connection.securityOauth.controller.auth;


import com.ssafy.connection.dto.BaekjoonAuthDto;
import com.ssafy.connection.dto.ResponseDto;
import com.ssafy.connection.dto.StudyDto;
import com.ssafy.connection.dto.StudyReadmeDto;
import com.ssafy.connection.securityOauth.advice.payload.ErrorResponse;
import com.ssafy.connection.securityOauth.config.security.token.CurrentUser;
import com.ssafy.connection.securityOauth.config.security.token.UserPrincipal;
import com.ssafy.connection.securityOauth.domain.entity.user.User;
import com.ssafy.connection.securityOauth.domain.entity.user.UserDto;
import com.ssafy.connection.securityOauth.payload.request.auth.ChangePasswordRequest;
import com.ssafy.connection.securityOauth.payload.request.auth.RefreshTokenRequest;
import com.ssafy.connection.securityOauth.payload.request.auth.SignInRequest;
import com.ssafy.connection.securityOauth.payload.request.auth.SignUpRequest;
import com.ssafy.connection.securityOauth.payload.response.AuthResponse;
import com.ssafy.connection.securityOauth.payload.response.Message;
import com.ssafy.connection.securityOauth.service.auth.AuthService;
import com.ssafy.connection.service.StudyService;
import io.swagger.annotations.ApiOperation;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Map;

@Tag(name = "Authorization", description = "Authorization API")
@RequiredArgsConstructor
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final StudyService studyService;

    @Operation(summary = "유저 정보 확인", description = "현제 접속된 유저정보를 확인합니다.<br>" +
            "{<br>" +
            "  \"userId\": 1,<br>" +
            "  \"name\": \"Connection-code\",<br>" +
            "  \"githubId\": \"Connection-code\",<br>" +
            "  \"backjoonId\": null,<br>" +
            "  \"email\": null,<br>" +
            "  \"imageUrl\": null(프로필사진),<br>" +
            "  \"tier\": 0(백준티어),<br>" +
            "  \"role\": \"USER\"(운영자인지 일반유저인지 여부 \"USER\" | \"ADMIN\"),<br>" +
            "  \"studyRole\": \"USER\"(스터디장인지 여부 \"LEADER\" | \"MEMBER\"),<br>" +
            "  \"studyName\": 1(가입한 스터디 PK값, 미가입시 0 반환)<br>" +
            "  \"studyRepository\": \"github주소\",<br>" +
            "  \"studyCode\": null(스터디코드),<br>" +
            "  \"ismember\": \"false(organization 멤버 여부)\",<br>" +
            "}")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "유저 확인 성공", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = UserDto.class) ) } ),
        @ApiResponse(responseCode = "409", description = "잘못된 요청", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class) ) } ),
        @ApiResponse(responseCode = "401", description = "토큰 없거나 잘못됨, 토큰 만료(추가 핸들링 예정)"),
    })
    @GetMapping
    public ResponseEntity<UserDto> whoAmI(
        @Parameter(description = "Accesstoken을 입력해주세요.", required = true) @CurrentUser UserPrincipal userPrincipal
    ) {
        if(userPrincipal == null) {
            return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        }
        ResponseEntity result = authService.whoAmI(userPrincipal);
        return result;
    }

    @Operation(summary = "백준연동확인", description = "백준 아이디와 프론트에서 생성한 난수를 보내주세요")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "유저 연동 성공"),
            @ApiResponse(responseCode = "409", description = "fail : 상태 메세지가 다름<br>" +
                                                            "empty : 해당 유저가 없음"),
            @ApiResponse(responseCode = "401", description = "토큰 없음")
    })
    @PostMapping("/baekjoon")
    public ResponseEntity<ResponseDto> getAuthBoj(
            @RequestBody BaekjoonAuthDto baekjoonAuthDto
            , @Parameter(description = "Accesstoken", required = true) @CurrentUser UserPrincipal userPrincipal){
        if(userPrincipal == null) return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        ResponseEntity responseEntity = authService.getAuthBoj(baekjoonAuthDto.getCode(), baekjoonAuthDto.getBaekjoonId(), userPrincipal.getId());
        return responseEntity;
    }


    @Operation(summary = "유저 정보 삭제", description = "현제 접속된 유저정보를 삭제합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "유저 삭제 성공", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Message.class) ) } ),
        @ApiResponse(responseCode = "409", description = "유저 삭제 실패", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class) ) } ),
    })
    @DeleteMapping(value = "/")
    public ResponseEntity<?> delete(
        @Parameter(description = "Accesstoken을 입력해주세요.", required = true) @CurrentUser UserPrincipal userPrincipal
    ){
        return authService.delete(userPrincipal);
    }

    @Operation(summary = "webhook api", description = "webhook.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "웹훅 성공", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Message.class) ) } ),
            @ApiResponse(responseCode = "409", description = "실패", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class) ) } ),
    })
    @PostMapping(value = "/webhook")
    public ResponseEntity<?> webhook(@RequestBody Map<String, Object> map){
        System.out.println(map);
        System.out.println(map.get("action"));

        if(map.get("action").equals("member_added")){
            Map<String, Object> membership = (Map<String, Object>)(map.get("membership"));
            Map<String, Object> user = (Map<String, Object>)membership.get("user");
            String login = user.get("login").toString();
            authService.joinOrQuitOrganization(login, true);
        }
        else if(map.get("action").equals("member_removed")){
            Map<String, Object> membership = (Map<String, Object>)(map.get("membership"));
            Map<String, Object> user = (Map<String, Object>)membership.get("user");
            String login = user.get("login").toString();
            authService.joinOrQuitOrganization(login, false);
        }

        return new ResponseEntity(new ResponseDto("webhook ok"), HttpStatus.OK);
    }

//    @Operation(summary = "유저 정보 갱신", description = "현제 접속된 유저의 비밀번호를 새로 지정합니다.")
//    @ApiResponses(value = {
//        @ApiResponse(responseCode = "200", description = "유저 정보 갱신 성공", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Message.class) ) } ),
//        @ApiResponse(responseCode = "400", description = "유저 정보 갱신 실패", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class) ) } ),
//    })
//    @PutMapping(value = "/")
//    public ResponseEntity<?> modify(
//        @Parameter(description = "Accesstoken을 입력해주세요.", required = true) @CurrentUser UserPrincipal userPrincipal,
//        @Parameter(description = "Schemas의 ChangePasswordRequest를 참고해주세요.", required = true) @Valid @RequestBody ChangePasswordRequest passwordChangeRequest
//    ){
//        return authService.modify(userPrincipal, passwordChangeRequest);
//    }

//    @Operation(summary = "유저 로그인", description = "유저 로그인을 수행합니다.")
//    @ApiResponses(value = {
//        @ApiResponse(responseCode = "200", description = "유저 로그인 성공", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = AuthResponse.class) ) } ),
//        @ApiResponse(responseCode = "400", description = "유저 로그인 실패", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class) ) } ),
//    })
//    @PostMapping(value = "/signin/")
//    public ResponseEntity<?> signin(
//        @Parameter(description = "Schemas의 SignInRequest를 참고해주세요.", required = true) @Valid @RequestBody SignInRequest signInRequest
//    ) {
//        return authService.signin(signInRequest);
//    }

//    @Operation(summary = "유저 회원가입", description = "유저 회원가입을 수행합니다.")
//    @ApiResponses(value = {
//        @ApiResponse(responseCode = "200", description = "회원가입 성공", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Message.class) ) } ),
//        @ApiResponse(responseCode = "400", description = "회원가입 실패", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class) ) } ),
//    })
//    @PostMapping(value = "/signup/")
//    public ResponseEntity<?> signup(
//        @Parameter(description = "Schemas의 SignUpRequest를 참고해주세요.", required = true) @Valid @RequestBody SignUpRequest signUpRequest
//    ) {
//        return authService.signup(signUpRequest);
//    }

    @Operation(summary = "토큰 갱신", description = "신규 토큰 갱신을 수행합니다. (바디, 파라미터 일절 필요없음)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "토큰 갱신 성공", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = AuthResponse.class) ) } ),
        @ApiResponse(responseCode = "400", description = "토큰 갱신 실패", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class) ) } ),
    })
    @PostMapping(value = "/refresh")
    public ResponseEntity<?> refresh(
        @CookieValue("refreshToken") String refreshToken
    ) {
        return authService.refresh(refreshToken);
    }

    @Operation(summary = "토큰 갱신", description = "신규 토큰 갱신을 수행합니다. (바디, 파라미터 일절 필요없음)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "토큰 갱신 성공", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = AuthResponse.class) ) } ),
            @ApiResponse(responseCode = "400", description = "토큰 갱신 실패", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class) ) } ),
    })
    @PostMapping(value = "/refresh2")
    public ResponseEntity<?> refresh2(
            String refreshToken
    ) {
        return authService.refresh(refreshToken);
    }


//    @Operation(summary = "유저 로그아웃", description = "유저 로그아웃을 수행합니다.")
//    @ApiResponses(value = {
//        @ApiResponse(responseCode = "200", description = "로그아웃 성공", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Message.class) ) } ),
//        @ApiResponse(responseCode = "400", description = "로그아웃 실패", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class) ) } ),
//    })
//    @PostMapping(value="/signout/")
//    public ResponseEntity<?> signout(
//        @Parameter(description = "Accesstoken을 입력해주세요.", required = true) @CurrentUser UserPrincipal userPrincipal,
//        @Parameter(description = "Schemas의 RefreshTokenRequest를 참고해주세요.", required = true) @Valid @RequestBody RefreshTokenRequest tokenRefreshRequest
//    ) {
//        return authService.signout(tokenRefreshRequest);
//    }

    @Operation(summary = "test", description = "스터디 리드미 생성 테스트.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "로그아웃 성공", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Message.class) ) } )
    })
    @PostMapping(value="/testtest/")
    public ResponseEntity<?> testtest(
        @Parameter(description = "Schemas의 RefreshTokenRequest를 참고해주세요.", required = true) @RequestParam Long studyId
    ) {
        StudyReadmeDto studyReadmeDto = new StudyReadmeDto();
        studyReadmeDto.setMsg("test");
        studyReadmeDto.setStudyId(studyId);
        return studyService.updateStudyReadme(studyReadmeDto);
    }

}
