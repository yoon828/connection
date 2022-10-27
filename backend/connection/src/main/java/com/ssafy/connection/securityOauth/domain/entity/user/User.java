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
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long userId;

    @Column(nullable = false)
    private String name;

    @Column(name = "github_id", nullable = false)
    private String githubId;

    @Column(name = "backjoon_id")
    private String backjoonId;
    @Email
    @Column
    private String email;

    private String imageUrl;

    private int tier;

    //@Column(nullable = false)
    //private Boolean emailVerified = false;

    @JsonIgnore
    private String password;

    @NotNull
    @Enumerated(EnumType.STRING)
    private Provider provider;

    @Enumerated(EnumType.STRING)
    private Role role;

    //private String providerId;

    @Builder
    public User(String name, String email, String password, Role role, Provider provider, String providerId, String imageUrl, String githubId){
        this.email = email;
        this.password = password;
        this.name = name;
        this.provider = provider;
        this.role = role;
        this.githubId = githubId;
    }

    public void updateName(String name){
        this.name = name;
    }

    public void updateImageUrl(String imageUrl){
        this.imageUrl = imageUrl;
    }

    /* 연관관계 매핑 */
    @OneToOne(mappedBy = "user")
    private ConnStudy connStudy;

    @OneToMany(mappedBy = "user")
    List<Solve> solve = new ArrayList<>();
    ////////////////////////////////////////

    public static User of(UserDto userDto) {
        User userEntity = ModelMapperUtils.getModelMapper().map(userDto, User.class);

        return userEntity;
    }

}
