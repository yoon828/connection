package com.ssafy.connection.securityOauth.domain.entity.user;

import com.ssafy.connection.util.ModelMapperUtils;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private long userId;

    private String name;

    private String githubId;

    private String backjoonId;

    private String email;

    private String imageUrl;

    private int tier;

    //private Boolean emailVerified = false;

//    private String password;

//    private Provider provider;

    private Role role;

    //추가정보 ===============
    private long studyId;

    private String studyRole;

    private String studyName;

    private String studyRepository;

    private String studyCode;

    private boolean ismember;

    //private String providerId;

    public static UserDto of(User userEntity) {
        UserDto userDto = ModelMapperUtils.getModelMapper().map(userEntity, UserDto.class);

        return userDto;
    }

}
