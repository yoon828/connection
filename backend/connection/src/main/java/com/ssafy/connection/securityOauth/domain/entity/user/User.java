package com.ssafy.connection.securityOauth.domain.entity.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ssafy.connection.entity.*;
import com.ssafy.connection.securityOauth.domain.entity.time.DefaultTime;
import com.ssafy.connection.util.ModelMapperUtils;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

@DynamicUpdate
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "User")
public class User extends DefaultTime {
    @Id
    @Column(name = "user_idx")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long userIdx;

    @Column(nullable = false)
    private String name;

    @Email
    @Column(nullable = false)
    private String email;

    private String imageUrl;

    @Column(nullable = false)
    private Boolean emailVerified = false;

    @Column(nullable = true)
    private String wallet;

    @Column(nullable = true)
    private long mira;

    @JsonIgnore
    private String password;

    @NotNull
    @Enumerated(EnumType.STRING)
    private Provider provider;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String providerId;

    @Builder
    public User(String name, String email, String password, Role role, Provider provider, String providerId, String imageUrl){
        this.email = email;
        this.password = password;
        this.name = name;
        this.provider = provider;
        this.role = role;
    }

    public void updateName(String name){
        this.name = name;
    }

    public void updateImageUrl(String imageUrl){
        this.imageUrl = imageUrl;
    }

    /* 연관관계 매핑 */

    //////////////////////////////////////////////////

    public static User of(UserDto userDto) {
        User userEntity = ModelMapperUtils.getModelMapper().map(userDto, User.class);

        return userEntity;
    }
}
