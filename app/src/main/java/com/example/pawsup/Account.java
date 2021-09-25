package com.example.pawsup;

public abstract class Account {
    String username;
    String password;
    String firstName;
    String lastName;
    String dateOfBirth;
    String phoneNumber;

    public Account() {
    }

    public Account(String username, String password, String firstName, String lastName, String dateOfBirth, String phoneNumber) {
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.phoneNumber = phoneNumber;
    }

}