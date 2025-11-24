package com.shoppyBag.DTO;

import lombok.Data;

@Data
public class AddressResponse {
    private Long id;
    private String line1;
    private String line2;
    private String state;
    private String country;
    private String pincode;
}
