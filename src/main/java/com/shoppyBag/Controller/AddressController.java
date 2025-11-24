package com.shoppyBag.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.shoppyBag.DTO.AddressDTO;
import com.shoppyBag.DTO.AddressRequest;
import com.shoppyBag.DTO.AddressResponse;
import com.shoppyBag.DTO.ApiResponse;
import com.shoppyBag.Entity.Address;
import com.shoppyBag.Entity.Users;
import com.shoppyBag.Service.AddressService;

@RestController
@RequestMapping("/api/address")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    // Add new address
    @PostMapping("/add")
public ResponseEntity<?> addAddress(
        @RequestBody AddressRequest request,
        @AuthenticationPrincipal Users user) {

    Address saved = addressService.addAddress(request, user);

    AddressResponse response = new AddressResponse();
    response.setId(saved.getId());
    response.setLine1(saved.getLine1());
    response.setLine2(saved.getLine2());
    response.setState(saved.getState());
    response.setCountry(saved.getCountry());
    response.setPincode(saved.getPincode());

    return ResponseEntity.ok(new ApiResponse<>("Success", "Address Added Succesfully", response));
}

    // Get all user addresses
    @GetMapping("/my")
    public ResponseEntity<?> myAddresses(@AuthenticationPrincipal Users user) {

        List<Address> list = addressService.getUserAddresses(user);

        List<AddressDTO> dtoList = list.stream().map(a -> {
            AddressDTO dto = new AddressDTO();
            dto.setId(a.getId());
            dto.setLine1(a.getLine1());
            dto.setLine2(a.getLine2());
            dto.setState(a.getState());
            dto.setCountry(a.getCountry());
            dto.setPincode(a.getPincode());
            return dto;
        }).toList();

        return ResponseEntity.ok(new ApiResponse<>("Success", "All Your Address Retrived Successfully", dtoList));
    }

    // Update address
    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestBody AddressRequest address,
            @AuthenticationPrincipal Users user) {

        Address updated = addressService.updateAddress(id, address, user);

        AddressDTO dto = new AddressDTO();
        dto.setId(updated.getId());
        dto.setLine1(updated.getLine1());
        dto.setLine2(updated.getLine2());
        dto.setState(updated.getState());
        dto.setCountry(updated.getCountry());
        dto.setPincode(updated.getPincode());

        return ResponseEntity.ok(
                new ApiResponse<>("Success", "Address updated successfully", dto)
        );
    }


    // Delete address
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal Users user) {

        addressService.deleteAddress(id, user);
        return ResponseEntity.ok(
            new ApiResponse<>("Success", "Address deleted successfully", null)
        );

    }
}
