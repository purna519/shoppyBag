package com.shoppyBag.DTO;

import lombok.Data;

@Data
public class UpdateRequestDTO {
    
    private String fullname;
    
    private String email;

    private String passwordHash;

    private String role;
}
