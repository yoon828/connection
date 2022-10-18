package com.ssafy.connection.securityOauth.domain.entity.user;

import com.ssafy.connection.util.ModelMapperUtils;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private long userIdx;

    private String name;

    private String email;

    private String imageUrl;

    private Boolean emailVerified = false;

    private String wallet;

    private long mira;

    private String password;

    private Provider provider;

    private Role role;

    private String providerId;

    public static UserDto of(User userEntity) {
        UserDto userDto = ModelMapperUtils.getModelMapper().map(userEntity, UserDto.class);

        return userDto;
    }

}
