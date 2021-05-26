package com.f0rgiv.lethani.models;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.util.Collection;

@Entity
public class AppUser implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    long id;

    @Column(unique = true)
    String username;
    String password;
    String displayName;
    String imageExtension;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "character_id", referencedColumnName = "id")
    Character character;

    //===============Constructors========================

    public AppUser() {
    }

    public AppUser(String username, String password, String displayName) {
        this.username = username;
        this.password = password;
        this.displayName = displayName;
    }

    //===================Overrides=====================

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    //=====================Getters====================

    public long getId() {
        return id;
    }

    public String getImageExtension() {
        return imageExtension;
    }

    public Character getCharacter() {
        return character;
    }

    //=====================Setters====================

    public void setImageExtension(String imageExtension) {
        this.imageExtension = imageExtension;
    }

    public void setCharacter(Character character) { this.character = character; }
}
