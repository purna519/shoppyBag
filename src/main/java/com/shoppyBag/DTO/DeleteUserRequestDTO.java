package com.shoppyBag.DTO;

public class DeleteUserRequestDTO {
    private String email;

    public DeleteUserRequestDTO() {
    }

    public DeleteUserRequestDTO(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
